<script lang="ts" setup>
definePageMeta({ layout: 'content' })
useHead({
  title: '早早集市｜博客站',
  meta: [
    {
      name: 'description',
      content: '最新最全的Nuxt4全栈开发实战内容，提供免费的Nuxt4权威课程，高质量Nuxt中文交流群',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://zzao.club/',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': '早早集市',
        'alternateName': 'zzao.club',
        'url': 'https://zzao.club/',
        'description': '最新最全的Nuxt4全栈开发实战内容，提供免费的Nuxt4权威课程，高质量Nuxt中文交流群',
        'inLanguage': 'zh-CN',
        'publisher': {
          '@type': 'Person',
          'name': 'Kairos',
          'url': 'https://zzao.club/about',
        },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Kairos',
        'url': 'https://zzao.club/about',
        'sameAs': [
          'https://github.com/k7airos',
        ],
      }),
    },
  ],
})

const appConfig = useAppConfig()
const { data: allArticles } = await usePages()

const catalog = computed(() => allArticles.value ?? [])
/** 合集整组占一条，非合集单篇；最多 25 条 feed 位 */
const feedItems = computed(() => buildHomeFeedItems(catalog.value, 25))

/** 高频 top5（来自 extract-tags 持久化结果） */
const hotTags = computed(() =>
  ((appConfig as any).topTagItems as Array<{ name: string, count: number }> | undefined)?.slice(0, 5) ?? [],
)
</script>

<template>
  <div class="site-content">
    <SiteHeader
      variant="home"
      :hot-tags="hotTags"
    />
    <HomeArticleFeed :items="feedItems" featured />
  </div>
</template>
