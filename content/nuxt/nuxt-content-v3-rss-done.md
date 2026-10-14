---
title: Nuxt Content v3 实现 RSS 订阅功能
date: 2025-01-15
lastmod: 2025-08-19
tags: ["Nuxt"]
versions: ["@nuxt/content@3.0.0-alpha.8", "@nuxtjs/mdc@0.12.1"]
description: Nuxt Content v3 实现 RSS 订阅功能
---
这可能是对现在而言唯一一篇关于Content v3 版本的 RSS 订阅的文章了。我找遍了能搜出来的每篇文章，没有一个能用的。

因为 `Nuxt Content` v3 还没发布正式版，其相关生态的 `module` 都没支持最新的 `Content` , 感觉不是很复杂的功能，但是就不跟  `content v3` 一起出个 `alpha` 版，很无语。

本文来带大家在 `Nuxt Content v3` 里实现 RSS 订阅功能。

## 添加原始内容

在 `content.config.ts` 中 `rawbody` 是一个特殊的 `schema` ，配置后，将会把md原始内容存起来，在使用 `queryCollection` 时，就可以查到 `rawbody` 了

```typescript
content: defineCollection({
    type: 'page',
    source: {
      include: '**/*.md',
      exclude: ['**/-*.md', 'book/**/*.md'],
      prefix: '/post',
      repository: 'https://github.com/k7airos/xxxx',
      authToken: process.env.CONTENT_REPO_TOKEN
    },
    schema: z.object({
      date: z.date(),
      lastmod: z.date(),
      tags: z.array(z.string()),
      versions: z.array(z.string()),
      rawbody: z.string()
    })
  }),
```

在 `server` 中查询时：

```typescript
// @ts-ignore
  const posts = await queryCollection(event, 'content').order('date', "DESC").all();
```

`queryCollection` 是可以在直接在 `server` 中使用的，不需要像 content v2中一样导入一个 `serverQueryContent` 。

而且 `#content/server` 这个导入方式在 v3 也不能用了

使用时，会产生错误的类型提示，目前只能忽略它（不影响使用）。 可以查看 [issue#2968](https://github.com/nuxt/content/issues/2968#issuecomment-2589359589) 
## 添加 feed.xml

找一个博客，点击他的订阅按钮，可以看到就是跳到一个 xml 页面上。

所以我们也只需要实现一个 `feed.xml` 即可，当然，一个网站也可以有多个 `rss` 订阅源

新建 **server/routes/feed.xml.ts** ，因为是基于文件路径的路由，所以此路由就对应 `$baseUrl/feed.xml`

在RSS阅读器上，也是通过输入这个地址来实现订阅。

## 添加相关依赖

- rss
- unified
- remark-parse
- remark-gfm
- remark-breaks
- remark-frontmatter
- remark-directive
- remark-directive-rehype
- remark-rehype
- rehype-sanitize
- rehype-autolink-headings
- rehype-stringify
- hast-util-to-html

```shell
npm i rss unified remark-parse remark-gfm remark-breaks remark-frontmatter remark-directive remark-directive-rehype remark-rehype rehype-sanitize rehype-autolink-headings rehype-stringify hast-util-to-html
```

这些插件是围绕 markdown 和 html 的解析/转换相关的插件。

如果你想了解他们之间是如何运作的，可以去看 [DIYgod](https://diygod.cc/unified-markdown) 的这篇文章。 以及这些插件在 [xLog](https://github.com/Crossbell-Box/xLog/blob/dev/src/markdown/index.ts) 中的具体用法。

我再挨个罗列出来介绍一遍，画个图，感觉没什么必要了，都是非常稳定且已经是事实上的标准的插件。

实际上 `nuxt/mdc` 就是使用了一系列 `mdast`、`hast`、`remark`、`rehype` 的插件 ，但是可惜的是它没有开放出对应的接口。 

不然就不需要下载这么多插件了。

## 实现逻辑

直接放代码（忽略引入了，太长）：

**/server/routes/feed.xml.ts**

```typescript
export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  // @ts-ignore
  const posts: any = await queryCollection(event, 'content').order('date', "DESC").all();
  const feed = new RSS({
    title: '早早集市',
    site_url: config.baseURL,
    feed_url: config.baseURL + '/feed.xml',
  })

  for ( const post of posts) {
    const content = post.rawbody
    if (content) {
      const markdownContent = cleanInvalidChars(content);
      feed.item({
        title: post.title,
        url: `${config.baseURL}/${post.path}`,
        date: post.date,
        description: post.description,
        custom_elements: [
          {
            'content:encoded': renderPageContent(markdownContent)
          }
        ]
      })
    }
  }

  const feedString = feed.xml();

  setResponseHeader(event, 'Content-Type', 'text/xml')

  return feedString

})
```

先来说明一下每一段主要逻辑

`const config = useRuntimeConfig()` 需要你在 `nuxt.config.ts` 中配置如下信息：

```typescript
runtimeConfig: {
	baseURL: 'your url' // 或者使用环境变量覆盖
}
```

使用 `queryCollection` 获取到所有原始的 md 内容

我们的目的就是把每一篇文章都生成一个 `feed item`， 所以循环所有文章，调用 `feed.item()`

此时出现了第一个问题： md原内容并不是等同于直接读取md文件，存在数据库中的原内容已经使`\n` 变为了 `\\n` 

所以为了使md能被正常解析，需要先清除一下没用的字符

同文件下：

```typescript
function cleanInvalidChars(content:string) {
  return content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').replace(/\\n/g, '\n').trim();
}
```

处理好后，如果不写 `custom_elements` ，这个 feed 也已经有效了，但缺点就是无法在 RSS 阅读器中直接阅读文章内容。

所以刚才一堆插件，就是为了解析 `custom_elements` 里要塞入的 `html` 字符串

同文件下：

```typescript
function renderPageContent(content: string) {
  const pipeline = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkFrontmatter, ["yaml"])
  .use(remarkGfm, {  singleTilde: false })
  .use(remarkDirective)
  .use(remarkDirectiveRehype)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeAutolinkHeadings)
  .use(rehypeStringify)

  const mdastTree = pipeline.parse(content)
  const hastTree = pipeline.runSync(mdastTree, content)
  return toHtml(hastTree)
}
```

此时，你可以在你的 `RSS` 阅读器中订阅自己的博客，然后看看是否能展示正常的文章内容了，或者在发布之前，先在浏览器打开 `feed.xml` ，观察 `xml` 内的文章内容渲染是否正确。

_使用插件算是比较简单的实现方式了，搭配 AI 来手动写函数处理的话也是浪费了我不少时间，最后还有很多兼容问题，头铁的朋友可以试试_
## 最后

欢迎订阅我的博客：[RSS](https://blog.zzao.club/feed.xml) ，为你带来最新的 Nuxt 实战内容

链接: https://blog.zzao.club/feed.xml

---

插件库会随着时间逐步完善，所以本文同样具有时效性。但无论如何，文章开头的版本号代表本文的生效范围。

欢迎在评论区留下你的疑问和高见~
