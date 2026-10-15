# 博客站

一个基于 [Nuxt](https://nuxt.com/)、[Nuxt Content](https://content.nuxt.com/)、[shadcn/vue](https://www.shadcn-vue.com/)、[inspira-ui](https://inspira-ui.com/components)、Drizzle、MySQL 和 Redis 的博客源码项目，具体版本以 `package.json` 与锁文件为准。

**娱乐性质的个人空间! **

## 生态与依赖

| 项目 | 与博客的关系 |
| --- | --- |
| [zzhub-pipeline](https://github.com/k7airos/zzhub-pipeline) | 博客发布路由的上游调用方，将文章写入本项目 `content/nezus/YYYY/MM/slug.md` 并执行配置的发布命令；本博客不是 Pipeline npm 包的依赖 |
| [Bun 微信中转服务](https://github.com/k7airos/bun-wx-server) | 从本项目抽出的认证、PAT、COS 与基础微信代理实现，可独立自托管；不等同于完整 Pipeline 后端 |
| [myno](https://github.com/k7airos/myno) | 需要公众号正文编辑、调样式和复制富文本时可单独使用；不属于博客运行时依赖 |
| [Kairos Skills](https://github.com/k7airos/kairos-skills) | 供 Agent 准备文章、遵守写作语法并调度 Pipeline 的配套说明 |

本项目面向独立博客用户，也作为 Pipeline 博客消费方示例。Markdown 和内容站点可单独运行；源码保留的登录、评论和 API 能力需要动态服务及对应数据库。当前部署脚本输出静态站点，不能据此宣称它同时部署了这些 API。

在 Pipeline 配置中设置 `paths.blogRoot` 指向本仓库、`commands.blogPublish` 为自己的发布命令后，`blog` 路由才会同步和部署。目录、frontmatter 与图片上传规则见 [Pipeline 博客 provider](https://github.com/k7airos/zzhub-pipeline/blob/main/src/providers/blog.ts)。本仓库 `pnpm publish:post` 包含 Git 暂存、提交、推送及部署，使用前应确认工作区内容。

![](/githubAssets/page-home.png)
![](/githubAssets/page-memo.png)
![](/githubAssets/page-articles.png)

## 功能

- 登录注册(用户名+密码)
- Github登录
- 点赞
- 评论
- mysql
- redis
- 一键复制HTML到公众号(保留所有样式)
- `$fetch/useFetch`最佳实践
- Sitemap
- Rss
- robots.txt
- PAT认证

## 安装依赖

`git clone` 克隆或下载本仓库到本地

`.nvmrc` 和 `.node-version` 中标识了node版本

安装

```bash
npm i

pnpm i

```

视报错信息而定:

涉及从 npm 切换到 pnpm 时，可能需要重新 `pnpm add better-sqlite3` 和 `pnpm rebuild better-sqlite3`

生产环境说明：
- `@nuxt/content` 在 Node SSR 运行时会依赖 `better-sqlite3`，因此它必须作为 `dependencies` 安装，不能只放在 `devDependencies`。
- 如果服务器升级过 Node 版本，或复用了旧的 `node_modules`，出现 `Module did not self-register` 时需要重新安装依赖并执行 `pnpm rebuild better-sqlite3`。

## 零环境快速开始（本地开发）

先决条件：
- Node.js 20+（建议用 nvm 管理），PNPM 10+
- Docker 与 Docker Compose（用于本地 MySQL/Redis）
- macOS/Linux 或 Windows WSL2 环境

步骤：
1) 启动数据库与缓存（使用内置 compose）

```bash
docker compose -f docker-compose.local.yml up -d
```

默认账号与端口：
- MySQL: root / 123456，数据库 blog，端口 3306
- Redis: 无密码，端口 6379

2) 创建 .env（项目根目录）

```bash
# 数据库连接（与 compose 保持一致）
DATABASE_URL=mysql://root:123456@127.0.0.1:3306/blog

# Redis（不配置则默认 127.0.0.1:6379）
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# 可选：自定义 GitHub 内容源时使用，当前默认本地 content/
CONTENT_REPO_TOKEN=

# 应用密钥（本地可任意随机值，生产需妥善保管）
NUXT_SESSION_PASSWORD=please_set_a_32_chars_random_string
NUXT_JWT_SECRET=please_set_a_random_string

# 可选：邮件/COS 等第三方配置（本地可留空）
NUXT_NODEMAILER_HOST=
NUXT_NODEMAILER_PORT=
NUXT_NODEMAILER_AUTH_USER=
NUXT_NODEMAILER_AUTH_PASS=
NUXT_COS_SECRET_ID=
NUXT_COS_SECRET_KEY=
NUXT_COS_BUCKET=
NUXT_COS_REGION=
```

3) 初始化数据库（二选一）

优先使用迁移（如果仓库已包含 `lib/drizzle/migrations`）：

```bash
pnpm db:migrate
```

如果没有历史迁移或希望按 `schema.ts` 直接同步结构：

```bash
pnpm db:push
```

4) 启动开发服务器

```bash
pnpm dev
```

访问：http://localhost:4775

排错小贴士：
- 3306/6379 端口被占用：修改 `docker-compose.local.yml` 的端口映射，或停止占用进程。
- better-sqlite3 报错：执行 `pnpm rebuild better-sqlite3`。
- 自定义远程内容源不可用：检查 `content.config.ts` 与对应 Token；默认本地 `content/` 不需要 GitHub 内容权限。

## 运行前配置

`content.config.ts` 当前从本地 `content/` 读取 Markdown。下面是改用 GitHub 内容源的可选示例，不是默认配置：

```ts
// content 可以随意更改, 对应的是 queryCollection 的第一个参数
content: defineCollection({
    //  page 表示 会一对一生成路由
    type: 'page',
    source: {
      // 过滤 md 文件, 因为一个ob库里可能什么文件都有
      include: '**/*.md',
      // 过滤掉某些文件, 如没写完的 或者不想给人看的
      // book 是我的ob根目录下的一个文件夹名称 , 视情况修改
      exclude: ['**/-*.md', 'book/**/*.md'],
      // 路由前缀 /post ,因为渲染文章的vue文件位于 app/pages/post/[...slug].vue
      // 所以为了匹配这个路径要加这个路由前缀
      prefix: '/post',
      // cwd: process.env.CONTENT_FS_PATH,
      // TODO 替换为你的仓库地址  不能使用组织仓库
      repository: 'https://github.com/k7airos/Blog',
      // TODO 替换为你的token 在 github > settings > developers settings > personal access tokens
      authToken: process.env.CONTENT_REPO_TOKEN
    },
    // md文件的元信息, 根据自己的实际情况来, 这些字段会用作数据库中的表头
    schema: z.object({
      date: z.date(),
      lastmod: z.date(),
      tags: z.array(z.string()),
      versions: z.array(z.string()),
    })
  }),
```

`env`

mysql 、redis 环境，具体操作可以参考[这篇文章](https://zzao.club/post/nuxt/local-init-mysql-by-docker)

redis 没有配置，默认链接 localhost 6379端口，本地同生产 （单体数据库服务，不对外开放端口）

```
DATABASE_URL=mysql://root:root@127.0.0.1:3306/blog
NUXT_FEISHU_WEBHOOK=
NUXT_FEISHU_USER_ID=
```

先启动 mysql、redis

## 使用 Dizzle 初始化数据库和表结构

```bash
# 方式一：使用迁移（推荐）
pnpm db:migrate

# 方式二：按 schema 直接推送
pnpm db:push

```

## 启动项目

```bash
pnpm dev
```

## 生产部署

当前 `scripts/deploy-prod.sh` 使用本机静态构建：安装依赖、lint、提取标签、`pnpm generate`，打包 `.output/public`，经 SSH/SCP 上传并切换远端静态目录。它不再走 GitHub Actions + PM2 的 SSR 部署流程，也不会部署本仓库 `server/` API。

```bash
cp .deploy.prod.env.example .deploy.prod.env
# 填写自己的远端主机、用户、端口和静态目录后执行
bash scripts/deploy-prod.sh
```

配置中的 `REMOTE_WWW_DIR` 是静态站点目录，Web 服务器应指向它；Node、MySQL 和 Redis 是否在生产运行取决于另行部署的动态服务。源码开发所需的数据库配置不等同于静态部署要求。

发布文章时使用：

```bash
pnpm publish:post
```

它依次提取 `data/content-tags.json`、执行 Git 暂存/提交/推送，再调用部署脚本。脚本还会核对标签与 Git 是否一致，拒绝部署未提交的标签结果。不要在含有无关改动的工作区直接运行该命令。

仅更新包版本的 `release:*` 命令不会自动完成站点部署；需要单独执行部署脚本。真实主机、部署配置和凭据保存在仓库外，不随 README 提供。

## 发布

> 注意 0.x 版本会有不同

```bash
# 1.0.0 => 1.0.1  0.1.0 => 0.1.1
pnpm release:patch
# 1.0.0 => 1.1.0  0.1.0 => 0.1.1
pnpm release:minor
# 1.0.0 => 2.0.0  0.1.0 => 0.2.0
pnpm release:major
```

## 自定义字体

使用自定义字体，要注意 format 的值

```
.woff 文件：使用 format('woff')
.woff2 文件：使用 format('woff2')
.ttf 文件：使用 format('truetype')
.otf 文件：使用 format('opentype')
.eot 文件：使用 format('embedded-opentype')
.svg 文件：使用 format('svg')
```

## 关于环境变量

`.env` 文件用于开发、构建、生成期间。

生产环境如何设置环境变量，取决于你的生产环境是什么。

因为有些 `serverless` / `cf worker` 环境下没有传统的文件系统，所以 `nuxt` 选择不维护环境变量的生产环境配置。

### Nuxt 交流群

- 小群 （少于 50 人）
- 分享 Nuxt 相关高质量资料
- 探讨 Nuxt 的各种问题
- 分享自己在做的项目

![](githubAssets/wxgroup.png)
