---
date: 2024-12-06
lastmod: 2025-08-19
title: nuxt-content v3 使用及迁移记录
tags: ["Nuxt"]
versions: ["@nuxt/content@3.0.0-alpha.8"]
description: nuxt-content v3 使用及迁移记录
---
这是一篇关于 `nuxt/content` v3 版本的使用和迁移指南，分享一下我在使用 `nuxt/content` 时的一些经验和问题。

此前，我基于 v2 版本完成了博客内文章的渲染，在发布了 v3 版本后，我第一时间更新到了最新的版本。

![](https://img.zzao.club/article/202412261015007.png)

在之前的文章[《基于 Nuxt3 + Obsidian 搭建个人博客》](https://zzao.club/post/nuxt/nuxt3-obsidian-build-your-blog) 中，我已经分享了全部配置以及用法。

大概思路是使用 `Obsidian` 在本地来管理的文件，在发布时在本地打包，将打包后的 `.output` 文件部署到服务器上。这样完全没有破坏以前的写文章路径，同时通过一个简单的插件给文章页面加上了一个复制到公众号的选项，做到了在公众号和个人博客站展示一致。

之前存在一个问题，解析非英文路径时，会把非英文的部分直接丢弃掉（或识别不出来），在 v2 中解决办法是在 `server/plugins` 中增加一个 `hook` ： `content:file:beforeParse` ，手动去处理文件的原始内容，插入一个 `_path` 属性，以此保留了原始的中文路径，算是一个十分膈应的解决方式。

但 v3 版本是破坏性升级，核心的部分也已经被重构了，~~所以 v2 使用的 hook 也不存在了。~~ 更正：文档突然冒出来的，真的！还有两个 [hook](https://content3.nuxt.dev/docs/advanced/hooks)  `content:file:beforeParse` 、`content:file:afterParse`

虽然还有，但是 v3 版本已经不需要使用此方式解决！

我在 [issues#2889](https://github.com/nuxt/content/issues/2889) 提出了这个问题后，很快也得到了 [pull#2889](https://github.com/nuxt/content/pull/2898) 解决，所以你如果使用的是 `v3.0.0-alpha.8` 及以后的版本，想必都是可以的。

```typescript
export default defineNuxtConfig({
  content: {
    build: {
      // 虽然官方没有写 markdown: {} ，实际 ts 提示这个配置是必须的
	  markdown: {},
      pathMeta: {
        slugifyOptions: {
          // Keep everything except invalid chars, this will preserve Chinese characters 
          remove: /[$*+~()'"!\-=#?:@]/g,
        }
      }
    }
  }
})
```

另外 `v3.0.0-alpha.7` 连内容搜索时的分页 api 都没支持好，所以最起码也要用 `alpha.8` 及以后的版本了。

配置层面，现在拓展性更强了一些，并且提升到了一个新的 `content.config.ts` 中

```typescript
import { defineCollection, z } from '@nuxt/content'

export const collections = {
  content: defineCollection({
	// 表示文章和目录是一对一的关系，一个文件会生成一个路由
    type: 'page',
    source: {
      include: '**/*.md',
      exclude: ['**/-*.md'],
      // 设置读取content的根目录
      cwd: '/Users/aatrox/notion/blog',
    },
    schema: z.object({
      date: z.date(),
      tags: z.array(z.string()),
      versions: z.array(z.string()),
    })
  })
}

```

包含哪些文件，忽略哪些文件可以自由配置，新增的 `front matter` 属性，如 `versions`，也可以自行添加。

v2 版本时，content 是在运行时把文件存储在 cache 目录下。而 v3 版本彻底抛弃了 file 模式，直接转为了 `sqlite` 存储，所以相对应的，内容相关的查询和渲染 API 也都进行了修改

`queryCollection` 的替换

```typescript
// 分页查询
queryCollection('content').skip(skip).limit(10).all()
// 查数量
count.value = await queryCollection('content').count()
```

`useContent()` 被移除了。

`<ContentDoc>`, `<ContentList>`, `<ContentNavigation>` and `<ContentQuery>` 这个三个组件也被移除

`fetchContentNavigation()` API 被替换成了新的 `queryCollectionNavigation()`

markdown 文本中的 `._path` 被改为了 `.path` 

一些和旧版 content 配套使用的 `sitemap` 逻辑也应该删除 `/server/routes/sitemap.ts`

当在 `pages/xxx/[...slug].vue` 渲染文章时：

```typescript
const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection('content').path(decodeURI(route.path)).first()
  })
```

**需要使用 `decodeURI` 才能在数据库中匹配到对应的文章。因为路径中包含中文**

更详细的迁移说明，可以移步[官方迁移文档](https://content3.nuxt.dev/docs/getting-started/migration)。（或者等我想起来，会更新在博客站中）

现在使用 v3 开发模式时，会在根目录下创建一个`.data` 目录，然后生成一个 `sqlite` 文件用于存储文章内容。

并且这个数据库不需要你来管理，只要配置好内容来源和规则。

修改为最新版的 api 后，我又增加了一项改动，把从本地文件获取文章改为了从 github 仓库获取。

原因是，以前我在公司和家里用的同一个笔记本，没有感知到什么问题。现在家里添置了一个新的 `macmini` ，我在家里配置好了同样的环境后，两边带着个 `output` 文件在 `git` 上太诡异了，而且本地的路径也不一致。

也就是需要修改一下 `content.config.ts`

```typescript
source: {
      include: 'blog/**/*.md',
      exclude: ['blog/**/-*.md'],
      prefix: '/post',
      // cwd: process.env.CONTENT_FS_PATH,
      repository: 'https://github.com/k7airos/xxxxx',
      authToken: process.env.CONTENT_REPO_TOKEN
    },
```

配置上自己的仓库地址，以及对应的 authToken.

**authToken 的配置在 github => 点击我的头像 => settings => 左侧最下方 `developer settings` => Personal access tokens => fine-grained tokens** 

![](https://img.zzao.club/article/202412261015008.png)

为某一个库生成 token，同时不要忘记给他放开 read-only 权限

![](https://img.zzao.club/article/202412261015009.png)

最后生成是可以看到有哪些权限

![](https://img.zzao.club/article/202412261015010.png)

如果你生成了 `token`，但是没给权限，最后使用 `content` 运行时报的错压根不会让你想到是 token 的权限问题。别问我怎么知道的。

如果本地文件比较多的，建议给本地的知识库划分一下仓库。一是 obsidian 自己如果文件太多，也会有性能问题，二是 nuxt/content 要去拉取你的代码，太多了拉的也慢。三是划分好后，哪些文件时对外展示的也比较清晰。

配置 `content` 的 `repo` 时，就配这个需要对外生成文章的仓库就好了。

当运行 `dev` 时，刚才提到的本地数据库目录 `.data`，下会多出一个 `github-k7airos-xxx-main`，里面就是所有原始的文件。当应用执行第一个查询检索内容时，就会读取上一步已经生成的 `Dump` 恢复到目标数据库中，同时有一套检查机制确保数据库中为最新的内容和避免重复导入。在客户端导航时，会在浏览器中初始化本地 SQLite，初始化后所有查询就是在本地进行了，所以 v3 的查询要比 v2 感觉上快很多。

以上就是 v3 的使用指南，基于官方的迁移说明，并且还解决了一些中文互联网才会有问题。

另外现在最新版处于不稳定状态，建议观望一下再升级，并且 nuxt/content 在网络上热度不高，出现奇怪的问题都没地儿找答案。

如果你恰好也是 Nuxt 的使用者，欢迎关注我，一起来讨论。

👋👋

