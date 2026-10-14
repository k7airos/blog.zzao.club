<script lang="ts" setup>
import { gsap } from 'gsap'

definePageMeta({
  layout: 'clean',
})

useHead({
  title: 'Zotepad - 记录灵感，随心推送｜早早集市',
  meta: [
    {
      name: 'description',
      content: 'Zotepad 是一个多端笔记推送应用，支持将笔记推送到博客、个人服务器、Notion等平台，本地优先，开源免费',
    },
  ],
  link: [
    { rel: 'canonical', href: 'https://zzao.club/product/zotepad' },
  ],
})

const product = {
  name: 'Zotepad',
  tagline: '记录灵感，随心推送',
  description: 'Zotepad 是一个为了解决博客WEB站打开率过低导致记录次数减少而开发的多端笔记推送应用。只要你的博客支持PAT或提供HTTP接口，就可以将Zotepad中的笔记内容推送到你的博客、个人服务器，甚至Notion等平台，实现信息的高效管理与发布。',
  features: [
    { title: '本地优先', desc: '数据完全存储在本地，无需担心隐私泄露。', icon: 'lucide:hard-drive' },
    { title: '自定义推送', desc: '支持配置任意 HTTP 接口，自定义请求头、请求体，将笔记推送到您的个人服务器、博客或 Notion。', icon: 'lucide:send' },
    { title: '跨平台支持', desc: '支持 Windows、macOS、Linux、Android App', icon: 'lucide:monitor' },
    { title: '开源免费', desc: '完全开源，免费使用，欢迎贡献代码、提供需求。', icon: 'lucide:file-text' },
  ],
  images: [
    'https://img.zzao.club/20251128140542363.png',
    'https://img.zzao.club/20251128140736542.png',
    'https://img.zzao.club/20251128140850102.png',
    'https://img.zzao.club/20251128145953202.png',
  ],
  appImages: [
    'https://img.zzao.club/zotepad/1764766210414_lmbq88mw18.jpg',
    'https://img.zzao.club/zotepad/1764766216556_xdxhxddqyb.jpg',
    'https://img.zzao.club/zotepad/1764766243399_fza8b2i6u6.jpg',
    'https://img.zzao.club/zotepad/1764766237781_v7df6ejgft.jpg',
    'https://img.zzao.club/zotepad/1764766223966_tgv8tciu66.jpg',
  ],
  downloadLink: '#',
  docLink: '#',
}

const containerRef = ref(null)

onMounted(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })

    tl.from('.hero-content > *', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
    })
  }, containerRef.value)

  return () => ctx.revert()
})
</script>

<template>
  <div ref="containerRef" class="min-h-screen bg-background relative">
    <!-- 全局背景光效 -->
    <div class="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

    <div class="relative">
      <!-- Hero Section -->
      <div class="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <!-- 动态网格背景 -->
        <div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

        <div class="relative max-w-7xl mx-auto hero-content text-center z-10">
          <NuxtLink to="/product" class="inline-flex items-center text-muted-foreground/80 hover:text-primary mb-10 transition-colors px-4 py-2 rounded-full bg-secondary/30 hover:bg-secondary/50 backdrop-blur-sm border border-transparent hover:border-border/50">
            <Icon name="lucide:arrow-left" class="mr-2 w-4 h-4" /> 返回产品列表
          </NuxtLink>

          <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 drop-shadow-sm">
            {{ product.name }}
          </h1>
          <p class="text-2xl md:text-3xl text-muted-foreground mb-8 font-light tracking-wide">
            {{ product.tagline }}
          </p>
          <p class="text-lg text-muted-foreground/80 max-w-3xl mx-auto mb-12 leading-relaxed">
            {{ product.description }}
          </p>

          <div class="flex flex-wrap justify-center gap-6">
            <Button size="lg" class="h-12 px-8 text-base gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5" @click="navigateTo('https://github.com/k7airos/zotepad/releases', { external: true, open: { target: '_blank' } })">
              <Icon name="lucide:download" class="w-5 h-5" /> 立即下载
            </Button>
            <Button variant="outline" size="lg" class="h-12 px-8 text-base gap-2 bg-background/50 backdrop-blur-sm hover:bg-secondary/50 border-border/50" @click="navigateTo('https://github.com/k7airos/zotepad', { external: true, open: { target: '_blank' } })">
              <Icon name="lucide:book-open" class="w-5 h-5" /> 查看源码
            </Button>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <!-- 斜切背景装饰 -->
        <div class="absolute inset-0 bg-secondary/5 -skew-y-3 scale-110 origin-top-left pointer-events-none" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div class="max-w-7xl mx-auto relative z-10">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight mb-4">
              核心特性
            </h2>
            <p class="text-muted-foreground max-w-2xl mx-auto text-lg">
              不仅仅是记录，更是连接您思维与数字世界的桥梁。
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <Card v-for="(feature, index) in product.features" :key="index" class="feature-card border-border/40 bg-background/60 backdrop-blur-md hover:bg-background/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden">
              <!-- 装饰性大图标 -->
              <div class="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 rotate-12 pointer-events-none">
                <Icon :name="feature.icon" class="w-40 h-40" />
              </div>

              <div class="p-6 flex gap-5">
                <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300 shadow-sm">
                  <Icon :name="feature.icon" class="w-7 h-7" />
                </div>
                <div class="flex-1 relative z-10">
                  <h3 class="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {{ feature.title }}
                  </h3>
                  <p class="text-muted-foreground leading-relaxed">
                    {{ feature.desc }}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div v-if="product.appImages.length" class="py-24 px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto flex justify-center">
          <AppCarousel :images="product.appImages" />
        </div>
      </div>
      <!-- Preview Section (Optional) -->
      <div v-if="product.images.length" class="py-24 px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto flex justify-center">
          <AppCarousel :images="product.images" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
