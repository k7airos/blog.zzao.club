import contentTags from '../data/content-tags.json'

export default defineAppConfig({
  // 网站基本信息
  author: '早早集市',
  // 组织
  organization: '',
  // 组织地址
  organizationUrl: 'https://zzao.club',
  // 描述
  desciption: '人生游戏 DLC',
  // 头像
  avatar: '/avatar.jpg',
  // Jinx 信息
  jinx: {
    name: 'Jinx',
    avatar: '/avatar_jinx_cartoon.jpg',
    description: 'power by openclaw',
    skills: 57,
    cron: 3,
  },
  // 社交媒体 icon 从 https://icones.js.org/ 里找
  social: [
    {
      name: 'Github',
      icon: 'icon-park-outline:github',
      // 这是一个 hover 弹出框，目前用来放一个图片
      popover: '',
      url: 'https://github.com/k7airos/blog.zzao.club',
    },
    {
      name: '微信公众号',
      icon: 'icon-park-outline:weixin-top-stories',
      popover: '/wx_gzh.jpg',
    },
    {
      name: '个人微信',
      icon: 'icon-park-outline:wechat',
      popover: '/wx_qrcode.png',
    },
    {
      name: '订阅我的博客',
      icon: 'material-symbols:rss-feed-rounded',
      url: 'https://zzao.club/feed.xml',
    },
  ],
  // 标签：scripts/extract-tags.mjs → data/content-tags.json（dev/build/generate 前刷新）
  /** 高频 top5，首页/文章筛选栏默认展示 */
  tags: (contentTags.topTags ?? contentTags.tags?.slice(0, 5) ?? []) as string[],
  /** 全部 tag 名（按频次） */
  allTags: (contentTags.tags ?? []) as string[],
  /** { name, count }[] 全量，含篇数 */
  tagItems: (contentTags.items ?? []) as Array<{ name: string, count: number }>,
  /** 高频 top5 带篇数 */
  topTagItems: (contentTags.topItems ?? contentTags.items?.slice(0, 5) ?? []) as Array<{ name: string, count: number }>,
  /** 无 tags 字段或为空数组的文章数 */
  untaggedCount: (contentTags.untaggedCount ?? 0) as number,
  authLayer: {
    enabled: false,
  },
  links: [
    {
      name: 'IMGX',
      url: 'https://imgx.zzao.club',
      desc: '便捷地生成精美卡片',
    },
    {
      name: '極客死亡計劃',
      url: 'https://www.geedea.pro',
      desc: '极客死亡计划',
      logo: 'https://www.geedea.pro/favicon.png',
    },
    {
      name: '洛丽糖',
      url: 'http://luolt.cn/',
      desc: '一个宅男的云上次元世界',
      logo: 'https://q.qlogo.cn/g?b=qq&nk=1340326824&s=0',
    },
    {
      name: '封闭脑袋',
      url: 'https://www.joomaen.com/',
      logo: 'https://media.235421.xyz/favicon.png',
      desc: '零落残魂何处断',
    },
    {
      name: 'Memento',
      url: 'https://zhongxuyang.github.io/blog/',
      logo: 'https://avatars.githubusercontent.com/u/20455656?v=4',
      desc: '记忆碎片',
    },
    // {
    //   name: 'MEMOZ',
    //   url: 'https://memo.zzao.club',
    //   desc: 'Nuxt 版 Flomo',
    // }
  ],
  frameworks: [
    {
      name: 'Nuxt',
      icon: 'logos:nuxt',
      version: '3.16.2',
    },
    {
      name: 'vite',
      icon: 'logos:vitejs',
      version: '6.2.5',
    },
  ],
  // GitHub pinned 项目展示
  githubRepos: [
    { name: 'imgx', desc: '基于 Nuxt 和 Nitro 的图片生成/处理器', url: 'https://github.com/k7airos/imgx', lang: 'TypeScript', langColor: '#3178c6', stars: 117 },
    { name: 'blog.zzao.club', desc: 'A personal blog, power by Nuxt & Nuxt/Content.', url: 'https://github.com/k7airos/blog.zzao.club', lang: 'Vue', langColor: '#41b883', stars: 1 },
    { name: 'zotepad', desc: '记事本及其上下游工作流工具', url: 'https://github.com/k7airos/zotepad', lang: 'Vue', langColor: '#41b883', stars: 7 },
    { name: 'PixeledPicPro', desc: '像素风图片编辑器', url: 'https://github.com/k7airos/PixeledPicPro', lang: 'Vue', langColor: '#41b883', stars: 11 },
    { name: 'astro-onwidget-zz', desc: '基于 AstroWind 的本土化改造', url: 'https://github.com/k7airos/astro-onwidget-zz', lang: 'Astro', langColor: '#ff5a03', stars: 5 },
    { name: 'z-cli', desc: 'all-in-one cli工具箱', url: 'https://github.com/k7airos/z-cli', lang: 'TypeScript', langColor: '#3178c6', stars: 5 },
  ],
  products: [
    {
      name: '博客站',
      slug: 'blog',
      description: '基于Nuxt4+Drizzle+MySQL的全栈博客系统，支持SSR渲染、动态内容发布、用户系统等功能。',
      icon: 'lucide:layout-template',
      features: ['SSR 渲染', '全栈开发', '用户系统', '动态内容'],
      link: '/',
    },
    {
      name: 'Zotepad',
      slug: 'zotepad',
      description: '基于Nuxt4和Tauri2构建的多端纯本地笔记推送应用',
      icon: 'lucide:notebook-pen',
      features: ['跨平台', '本地优先', '自定义推送', '隐私安全'],
      link: '/product/zotepad',
    },
  ],
})
