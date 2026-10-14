<script setup lang="ts">
const config = useRuntimeConfig()
const version = config.public.Z_BLOG_VERSION
</script>

<template>
  <footer class="w-full border-t border-zinc-100 bg-zinc-50 py-6 mt-auto">
    <div class="max-w-3xl mx-auto px-4 flex flex-col items-center gap-2 text-xs text-zinc-400">
      <div class="flex items-center gap-1.5 flex-wrap justify-center">
        <span>Powered by</span>
        <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-600 transition-colors underline underline-offset-2">Nuxt</a>
        <span>&</span>
        <a href="https://content.nuxt.com" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-600 transition-colors underline underline-offset-2">Nuxt Content</a>
      </div>
      <div class="flex items-center gap-1.5">
        <span>v{{ version }}</span>
        <span class="text-zinc-300">|</span>
        <span>&copy; {{ new Date().getFullYear() }}</span>
        <a href="https://github.com/k7airos" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-600 transition-colors underline underline-offset-2">Aatrox</a>
      </div>
    </div>
  </footer>
</template>
