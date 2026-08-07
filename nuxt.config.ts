import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'),
)

const appVersion = packageJson.version

const isDev = process.env.NODE_ENV === 'development'
console.log(` 当前环境为：${isDev ? '开发' : '生产'}`)
export default defineNuxtConfig({
  experimental: {
    watcher: isDev ? 'parcel' : undefined,
  },
  // Dual-write: keep nuxt-umami until Pulse numbers are validated (do not remove yet).
  // nuxt-pulse is vendored under modules/ (blog Nuxt 4.0 cannot load sibling ../pulse module deps).
  modules: ['@nuxt/ui', '@nuxtjs/robots', '@nuxt/content', '@nuxt/image', '@nuxt/icon',
    '@nuxtjs/mdc',
    '@nuxtjs/color-mode', '@pinia/nuxt', '@vueuse/nuxt', 'shadcn-nuxt', '@nuxt/eslint', 'nuxt-umami',
    './modules/nuxt-pulse/module'],

  umami: {
    autoTrack: true,
    id: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID || '73dfbd1a-1df4-4c73-88d3-899bebe63672',
    host: process.env.NUXT_PUBLIC_UMAMI_HOST || 'https://umami.nezus.cn',
    domains: 'blog.nezus.cn',
  },
  pulse: {
    host: process.env.NUXT_PUBLIC_PULSE_HOST || '',
    websiteId: process.env.NUXT_PUBLIC_PULSE_WEBSITE_ID || '',
    autoTrack: true,
    // enabled only when host + websiteId are set
    enabled: !!(process.env.NUXT_PUBLIC_PULSE_HOST && process.env.NUXT_PUBLIC_PULSE_WEBSITE_ID),
  },
  components: [
    {
      path: '~/components/common',
      prefix: '',
    },
    {
      path: '~/components/ui',
      prefix: '',
      extensions: ['.vue'],
    },
    {
      path: '~/components/animate',
      prefix: 'Animate',
    },
    {
      path: '~/components/memo',
      prefix: 'Memo',
    },
    {
      path: '~/components/vue-bits',
      pathPrefix: false,
      prefix: 'VB',
    },
    {
      path: '~/components/content',
      global: true,
    },
  ],
  image: {
    domains: ['zzao.club', 'img.zzao.club'],
    provider: isDev ? 'none' : 'ipx',
    dir: path.resolve(__dirname, 'public'),
    quality: 80,
    format: ['webp'],
  },
  imports: {
    presets: [
      {
        from: 'vue-sonner',
        imports: ['toast'],
      },
      {
        from: 'animejs',
        imports: ['animate'],
      },
    ],
  },
  devtools: { enabled: true },
  app: {
    pageTransition: false,
    layoutTransition: true,
    head: {
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-6WVZHT91DH',
          async: true,
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6WVZHT91DH');
          `,
          type: 'text/javascript',
        },
      ],
      meta: [
        {
          name: 'baidu-site-verification',
          content: 'codeva-wbD6D2XuzG',
        },
        {
          name: 'msvalidate.01',
          content: 'A7FB0FAB6DCCC738B8B3D60179F1496C',
        },
        {
          name: 'keywords',
          content: 'Nuxt4,Nuxt3,Nitro,NuxtContent,Vue,Vue3,前端,前端工程化,前端架构,Node,Hono,博客站,爬虫,副业',
        },
        {
          property: 'og:site_name',
          content: '早早集市',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:locale',
          content: 'zh_CN',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192.png' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://img.zzao.club' },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
      ],
    },
  },
  css: ['@/assets/css/tailwind.css', 'viewerjs/dist/viewer.css'],
  colorMode: {
    preference: 'light',
    fallback: 'light',
    dataValue: 'theme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode',
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-light',
          langs: ['ts', 'js', 'vue', 'json', 'yml', 'yaml', 'typescript', 'javascript', 'sql', 'shell'],
        },
      },
      pathMeta: {
        slugifyOptions: {
          remove: /[$*+~()'"!\-=#?:@]/g,
        },
      },
    },
  },
  mdc: {
    components: {
      prose: false,
      map: {
        a: 'ProseA',
        p: 'ProseP',
        h1: 'ProseH1',
        h2: 'ProseH2',
        h3: 'ProseH3',
        img: 'ProseImg',
        pre: 'ProsePre',
        code: 'ProseCode',
        strong: 'ProseStrong',
        hr: 'ProseHr',
        table: 'ProseTable',
        thead: 'ProseThead',
        tbody: 'ProseTbody',
        tr: 'ProseTr',
        th: 'ProseTh',
        td: 'ProseTd',
        ul: 'ProseUl',
        ol: 'ProseOl',
        li: 'ProseLi',
        del: 'ProseDel',
        blockquote: 'ProseBlockquote',
      },
    },
    headings: {
      anchorLinks: {
        h1: true,
        h2: true,
        h3: true,
      },
    },
  },
  runtimeConfig: {
    baseURL: 'https://blog.nezus.cn',
    imgHost: 'https://img.zzao.club',
    public: {
      ContentVersion: '3.0.0',
      Z_BLOG_VERSION: appVersion,
      imgHost: 'https://img.zzao.club',
      apiBase: 'https://blog.nezus.cn',
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/article': { prerender: true },
    '/post/**': { prerender: true },
  },
  sourcemap: {
    server: isDev,
    client: isDev,
  },
  compatibilityDate: '2024-10-29',
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    prerender: {
      crawlLinks: true,
      failOnError: false,
      ignore: [],
      routes: ['/feed.xml', '/sitemap.xml'],
    },
    imports: {
      presets: [
        {
          from: 'zod',
          imports: ['z'],
        },
      ],
      dirs: [],
    },
    watchOptions: {
      ignored: [
        '**/node_modules/**',
        '**/node_modules/.pnpm/**',
        '**/dist/**',
        '**/.git/**',
        '**/.nuxt/**',
        '**/.data/**',
        '**/.output/**',
      ],
    },
  },
  watchers: {
    chokidar: {
      ignored: [
        '**/node_modules/**',
        '**/node_modules/.pnpm/**',
        '**/.git/**',
        '**/dist/**',
        '**/.nuxt/**',
        '**/.data/**',
        '**/.output/**',
        '**/githubAssets/**',
      ],
    },
  },
  vite: {
    esbuild: {
      drop: isDev ? [] : ['console', 'debugger'],
    },
    server: {
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/node_modules/.pnpm/**',
          '**/.git/**',
          '**/dist/**',
          '**/.data/**',
          '**/.output/**',
          '**/githubAssets/**',
        ],
      },
    },
    plugins: [],
    optimizeDeps: {
      include: ['debug'],
    },
  },
  debug: isDev,
  hooks: {
    'content:file:afterParse': (ctx) => {
      const { file, content } = ctx
      const wordsPerMinute = 180
      const text = typeof file.body === 'string' ? file.body : ''
      const wordCount = text.split(/\s+/).length

      content.readingTime = Math.ceil(wordCount / wordsPerMinute)
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  icon: {
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
      sizeLimitKb: 256,
    },
  },
  robots: {
    sitemap: 'https://blog.nezus.cn/sitemap.xml',
  },
  shadcn: {
    prefix: '',
    componentDir: 'app/components/ui',
  },
  ui: {
    prefix: 'U',
  },
  fonts: {
    providers: {
      google: false,
      bunny: false,
      googleicons: false,
    },
  },
})
