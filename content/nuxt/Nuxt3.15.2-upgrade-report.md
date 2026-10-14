---
title: Nuxt3.15.2升级报告
date: 2025-01-16
lastmod: 2025-08-19
describtion: Nuxt3.15.2、 NuxtContent 升级踩坑报告
tags: ["Nuxt", "issue"]

---
Nuxt3.15.1 升级到 3.15.2 ，同时 nuxt/content@3.0.0-alpha.8 升级到了 3.0.0-alpha.9

## 升级方式

```shell
npx nuxi@latest upgrade --force
```

运行后 nuxt/content 会同步升级，慎重！
## 破坏性

**queryCollectionNavigation** 的查询结果发生了改变

比如，我的这个collection定义如下：

```typescript
book: defineCollection({
    type: 'page',
    source: {
      include: 'book/**/*.md',
      exclude: ['book/**/-*.md'],
      repository: 'https://github.com/k7airos/Blog',
      authToken: process.env.CONTENT_REPO_TOKEN
    },
    schema: z.object({
      date: z.date(),
      lastmod: z.date(),
      tags: z.array(z.string()),
      versions: z.array(z.string()),
    })
  }),

// book/nuxt-book1/install/demo.md
```

alpha.8 时， `queryCollectionNavigation` 是不会包含最外层的目录的。数组直接以 `nuxt-book1` 开始，现在会最顶层的 `book` 也带上，导致我的博客小册相关的查询都要重构一下，这更新多少有点抽象了，不懂为什么改成这样的逻辑。

```typescript
const { data: books } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('book', ['date', 'path', 'id'])
})
```

以前 `books.value`  就是 book 目录下的文件树，现在 `books` 是包含了根节点的整棵树

所以如何**涉及到使用此导航树渲染的菜单都要改**

另外，由于查询默认带上了根节点，所以导致每个文件的 `path` 也附带了完整的路径，从这个角度上看，这样改是合理的。

**如果以前跳转时，自己拼接了前缀，也要去掉**

同时因为 `path` 是完整的路径了，所以查询单个 `book` 时, 直接用 `.path` 就行了

```typescript
const { data: page, error, refresh } = await useAsyncData(hash(route.path + 'page'), () => {
  // 删掉前缀
  return queryCollection('book').path(route.path).first()
}, { watch: [route.query]})
```

上个版本应该是不行的，不然我应该不会用 id 查

总之，查询单个md内容，直接用 `queryCollection().path()` 就行

而涉及到 `queryCollectionNavigation`  的部分，总结就是不管怎么筛选和查询，他会始终附带根节点