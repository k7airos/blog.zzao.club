# 博客站

一个基于 [Nuxt@4.0.3](https://nuxt.com/)、[NuxtContent@3.4.0](https://content.nuxt.com/)、[shadcn/vue](https://www.shadcn-vue.com/)、[inspira-ui](https://inspira-ui.com/components)、Dizzle、MySQL、Redis的全栈站点

**娱乐性质的个人空间! **

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

# 从 GitHub 仓库拉取文章内容所需（如不使用，可留空或注释 content.config.ts 的 source）
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
- 无法拉取 GitHub 文章：确认 `CONTENT_REPO_TOKEN` 有权限，或临时注释 `content.config.ts` 的 `source` 配置。

## 运行前配置

`content.config.ts`

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

部署链路：GitHub Actions 构建 -> 打包 `.output` + `pm2.config.json` + `pm2.preload.cjs` -> SSH 上传 -> 服务器 `/root/web/blog` 原地解压 -> Drizzle 迁移 -> 服务端重建 `better-sqlite3` -> PM2 启动 `Blog`（端口 4571）。

1) 服务器准备
- 安装 Node.js 20+ 与 PM2（全局）
  - `npm i -g pm2`
- 创建目录与生产环境变量文件：
  - 应用目录：`/root/web/blog`
  - 环境文件：`/root/envs/blog/.env`
- 必需变量（示例）：
  - `DATABASE_URL=mysql://user:pass@host:3306/blog`
  - `NUXT_SESSION_PASSWORD=<32位随机字符串>`
  - `NUXT_JWT_SECRET=<随机字符串>`
  - 可选：`REDIS_HOST`、`REDIS_PORT`、`CONTENT_REPO_TOKEN`、`NUXT_*`（Nodemailer、OAuth GitHub、COS、Feishu等）

2) 配置 GitHub Secrets（仓库 Settings -> Secrets and variables -> Actions）
- SSH 访问：`SSH_PRIVATE_KEY`、`SSH_HOST`、`SSH_USER`、`SSH_PORT`
- 应用密钥与依赖：`DATABASE_URL`、`NUXT_SESSION_PASSWORD`、`NUXT_JWT_SECRET`
- 内容拉取：`CONTENT_REPO_TOKEN`（若启用 content 仓库）
- 可选通知与第三方：`NUXT_FEISHU_WEBHOOK`、`NUXT_FEISHU_USER_ID`、`NUXT_NODEMAILER_*`、`NUXT_OAUTH_GITHUB_CLIENT_ID/SECRET`、`NUXT_COS_*`

3) 触发部署
- Push 到 `main` 且提交信息包含 `chore(release)` 会自动触发（可使用 `pnpm release:patch|minor|major` 脚本生成）

4) 运行方式与端口
- PM2 使用 `pm2.config.json` 启动进程名 `Blog`，监听 `4571`
- 运行时通过 `node_args: -r ./pm2.preload.cjs` 读取 `/root/envs/blog/.env`，无需安装 `dotenv`
- 反向代理（示例 Nginx）：
  ```nginx
  server {
    listen 80;
    server_name your.domain.com;
    location / {
      proxy_pass http://127.0.0.1:4571;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
  ```

5) 数据库迁移
- 工作流会在服务器上自动执行 Drizzle 迁移（优先 `dotenv-cli`，无则回退为 `source ENVFILE` + `npx drizzle-kit migrate`）
- 如服务器无公网 npm，可自行预先装好 `dotenv-cli`，或手动执行迁移

6) 原生模块重建
- 工作流会在服务器解压产物后、PM2 启动前执行 `npm rebuild --prefix /root/web/blog/server better-sqlite3`
- 这一步用于按服务器当前 Node ABI 重建 `better-sqlite3`，避免 `/admin` 等 SSR 页面出现 `Module did not self-register`
- 如果服务器缺少编译环境，请预先安装 `build-essential`/`make`/`g++`/`python3`

7) 回滚与灰度（可选）
- 回滚：直接 `git revert` 上次 release 提交并 push（同样会触发部署）
- 灰度：仓库包含 `pm2.canary.json`（4572 端口），如需金丝雀可另行添加对应 Workflows 与目录（例如 `/root/web/blog-canary`）

8) 常见排查
- 启动异常：`pm2 logs Blog` 查看日志
- 环境变量未生效：确认 `/root/envs/blog/.env` 存在且键名正确；`pm2 env 0`/`pm2 describe Blog` 检查进程环境
- 无法连接数据库/Redis：验证 `DATABASE_URL`、`REDIS_HOST/PORT` 与网络策略
- `better-sqlite3` 仍报错：在服务器执行 `npm rebuild --prefix /root/web/blog/server better-sqlite3` 后再重启 PM2

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
