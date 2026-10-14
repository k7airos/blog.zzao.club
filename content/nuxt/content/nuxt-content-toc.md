---
title: Nuxt Content 实现 TOC 组件
date: 2025-05-13
lastmod: 2025-08-21
versions: ["@nuxt/content@3.4.0", "nuxt@3.17.2"]
tags: ["Nuxt"]
description: Nuxt Content 中配置和使用 toc
---
`TOC` 全称 `table of contents` ，指的是一篇文章内的 `h1`、`h2`、`h3` 等标题的导航，用于快速跳转到对应的标题处。

`Nuxt Content` 会为 `markdown` 内容生成 `toc` 数据。

通过 `queryCollection` 获取的 `page` 数据中，通过 `page?.body?.toc?.links` 拿到当前文章的 `toc` 数据

以[《Nuxt 3.17 发布，对比3.16有一个重大改变》](https://zzao.club/post/nuxt/nuxt-3.17-release)这篇文章为例，数据是这样的

```typescript
[
    {
        "id": "更新日志",
        "depth": 2,
        "text": "更新日志",
        "children": [
            {
                "id": "数据获取改进",
                "depth": 3,
                "text": "数据获取改进"
            },
            {
                "id": "新增内置组件",
                "depth": 3,
                "text": "新增内置组件"
            },
            {
                "id": "路由改进",
                "depth": 3,
                "text": "路由改进"
            },
            {
                "id": "加载指示器自定义",
                "depth": 3,
                "text": "加载指示器自定义"
            },
            {
                "id": "文档作为包",
                "depth": 3,
                "text": "文档作为包"
            },
            {
                "id": "开发体验改进",
                "depth": 3,
                "text": "开发体验改进"
            },
            {
                "id": "模块开发增强",
                "depth": 3,
                "text": "模块开发增强"
            },
            {
                "id": "性能改进",
                "depth": 3,
                "text": "性能改进"
            },
            {
                "id": "其他改进",
                "depth": 3,
                "text": "其他改进"
            }
        ]
    },
    {
        "id": "主要影响点",
        "depth": 2,
        "text": "主要影响点",
        "children": [
            {
                "id": "useasyncdatausefetch",
                "depth": 3,
                "text": "useAsyncData、useFetch"
            },
            {
                "id": "_2025年05月06日093334-更新",
                "depth": 3,
                "text": "2025年05月06日09:33:34 更新"
            }
        ]
    }
]
```

一般一篇文章里，`h1` 表示的是文章标题，在一个页面中通常只会存在一个 `h1` 标题，所以在写文章时，要注意不要乱用 `# 标题`这个语法。 `h2`、`h3`、 就是文章里常用的二级和三级标题，在数据中就是 `depth` 为 `2` 或 `3` 

组件本身使用 `ul` 、`li` 来渲染即可，再配合 `fixed` 或 `sticky`，使其国定在文章的一侧。

对于 `Nuxt` 来说，`TOC` 组件可以完全是一个**客户端组件**，因为不需要被爬虫抓取，也不是初次渲染需要的重要信息。而且如果要做一些简单的交互，也需要等前端环境加载出来之后才能做到。

所以只需要使用一个 `computed` 拿到 `toc` 数据，然后把数据传递给组件即可。

我观察了一圈，感觉[少数派](https://sspai.com/)的 TOC 组件是比较美观的，于是我仿照他们的思路封装了自己的 [TOC 组件](https://github.com/k7airos/blog.zzao.club/blob/main/app/components/common/AppToc.vue)

toc 的配置位于 `nuxt.config.ts` ：

```typescript
content: {
	build: {
		markdown: {
			toc: {
			  depth: 2,
			  searchDepth: 2
			}
		}
	}
}
```

默认深度是 `2`，我一般会用到 `3`。

同时，如果要想自己定义 h1、h2、h3 标题的样式，需要在 `app/components/content` 目录下新建 `ProseH1.vue`、`ProseH2.vue`、`ProseH3.vue` 组件。

写样式时，不管如何封装，**记得不要丢掉 id 属性**

**ProseH3.vue 为例**

```vue
<template>
  <div :id="props.id" class="heading my-4 cursor-pointer scroll-mt-14">
    <span class="px-2 py-1 text-xl font-bold bg-zinc-800 text-white dark:bg-zinc-200 ">
      <a v-if="props.id && generate" :href="`#${props.id}`" class="!text-zinc-200 dark:!text-zinc-800">
        <slot />
      </a>
      <slot v-else />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1)))
</script>
```

对应 TOC 组件中：

```vue
# template v-for child in link.children
<li>
    <span>#</span>
    <NuxtLink :href="`#${child.id}`"> {{ child.text }} </NuxtLink>
</li>
```

也可以像我的组件一样，配合 `IntersectionObserver` ，做到 TOC 组件的导航根据滚动的区域使其高亮或是显示其他标识

![](https://img.zzao.club/article/202505131613386.png)

```typescript
 const headings = document.querySelectorAll('.heading')
	observer.value = new IntersectionObserver((entries) => {
	  entries.forEach(entry => {
		if (entry.isIntersecting) {
		  activeId.value = entry.target.id
		}
	  })
	})
	headings.forEach(heading => observer.value.observe(heading))
```

