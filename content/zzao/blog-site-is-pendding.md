---
title: 博客站还有很多功能可以完善，但不得不进入优化期
date: 2025-01-13
lastmod: 2025-08-19
tags: ["博客"]
showTitle: 博客站还有很多功能可以完善，但不得不进入优化期
---
目前博客站对于 `Obsidian` 的文章有了一个基本的渲染功能。

可以拉取指定Github仓库的文章，生成站点，也能配置某个目录下的文章为小册的展示方式。

我知道还有很多功能不足，比如 `sitemap`、`静态化`、`robots.txt`、`rss` 等。

但 `@nuxtjs/seo` 这个 `module` 还未支持最新版的 `Nuxt Content`

所以博客的内容只能先做减法，优化一些 UI 方面的细节

```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/mdc']
})
```

同时，因为我是先做了一个大的项目，然后又从中抽离出博客这个站点。

所以，本项目上也存在不少冗余代码，最近有时间我就会清理一下。

还有包括具体的使用教程，也会优先完善（如果有人用的话）。

同时，也从 `Gitea` 设置了 `Github` 的镜像仓库，**如果侥幸有人使用的话，能够反馈一些不足之处是最好的。**

[Github](https://github.com/k7airos/blog.zzao.club)

## 2025年01月14日11:34:17 更新

就在13号在 `sitemap` 的 `github` 提了 `issue` 之后， 14号就发布了 v7.0.2 版本

![](https://img.zzao.club/article/202501141149021.png)

![](https://img.zzao.club/article/202501141149022.png)

不过倒不是支持了 `nuxt/content`  而是检测如果使用了v3版本的content，则不会去自动引入content了

所以，可以自己手动去生成 `sitemap` 了
