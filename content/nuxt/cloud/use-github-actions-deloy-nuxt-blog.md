---
title: 白嫖一下 Github Actions 打包部署博客
date: 2025-08-26
lastmod: 2025-08-26
tags: ["博客", "Nuxt"]

---
之前我的博客一直使用 `Gitea` 来管理代码，然后顺势也配好了 `Gitea` 的 `actions`，推送了指定 `commit msg` 时就会自动打包部署代码。

但代价就是服务器内存从 `4G` 升到了 `8G`，因为打包时峰值内存占用要到 `6G`

![](https://img.zzao.club/article/202508261410524.png)

最近想把博客相关的环境容器化

但是和 `GTP5` 一番讨论后，问题还是出在 `Nuxt/Content` 上，`Content` 主动拉取 `Github repo` 的行为依赖于 `nuxt build`，所以如果要单独发布一篇文章，不得不重新上传一个镜像。

所以最后还是决定博客不用 `docker` 了， **mysql + redis** 使用 `docker compose` 管理，博客还是用 `pm2`  + `envfile`

如果迁移服务器的话，就需要自己全局安装 `node` 、`pm2`，然后使用现有的 `docker-compose.yml` 启动数据库环境，以及迁移现有的生产环境的 `envfile`

然后继续走 Github Actions 构建、打包、ssh 传输到目标服务器，运行 `pm2` 命令，加载 `envfile`

等 `NuxtContent` 支持主动拉取新的仓库文件或者定时拉取后，再进行调整

然后分享一下，[博客开源地址](https://github.com/k7airos/blog.zzao.club)

以及 `action` 脚本

```yaml [.github/workflows/deploy-ssh.yml]

name: Deploy via GitHub Actions (SSH + PM2 Prod)

on:
  push:
    branches:
      - main

concurrency:
  group: deploy-main
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: zzaoclub
    if: contains(github.event.head_commit.message, 'chore(release)')
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup PNPM
        uses: pnpm/action-setup@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install deps
        run: pnpm install --no-frozen-lockfile

      - name: Build
        env:
          CONTENT_REPO_TOKEN: ${{ secrets.CONTENT_REPO_TOKEN }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NUXT_FEISHU_WEBHOOK: ${{ secrets.NUXT_FEISHU_WEBHOOK }}
          NUXT_FEISHU_USER_ID: ${{ secrets.NUXT_FEISHU_USER_ID }}
          NUXT_JWT_SECRET: ${{ secrets.NUXT_JWT_SECRET }}
          NUXT_NODEMAILER_HOST: ${{ secrets.NUXT_NODEMAILER_HOST }}
          NUXT_NODEMAILER_PORT: ${{ secrets.NUXT_NODEMAILER_PORT }}
          NUXT_NODEMAILER_AUTH_USER: ${{ secrets.NUXT_NODEMAILER_AUTH_USER }}
          NUXT_NODEMAILER_AUTH_PASS: ${{ secrets.NUXT_NODEMAILER_AUTH_PASS }}
          NUXT_UMAMI_HOST: ${{ secrets.NUXT_UMAMI_HOST }}
          NUXT_UMAMI_USER: ${{ secrets.NUXT_UMAMI_USER }}
          NUXT_UMAMI_PASS: ${{ secrets.NUXT_UMAMI_PASS }}
          NUXT_SESSION_PASSWORD: ${{ secrets.NUXT_SESSION_PASSWORD }}
          NUXT_OAUTH_GITHUB_CLIENT_ID: ${{ secrets.NUXT_OAUTH_GITHUB_CLIENT_ID }}
          NUXT_OAUTH_GITHUB_CLIENT_SECRET: ${{ secrets.NUXT_OAUTH_GITHUB_CLIENT_SECRET }}
          NUXT_COS_SECRET_ID: ${{ secrets.NUXT_COS_SECRET_ID }}
          NUXT_COS_SECRET_KEY: ${{ secrets.NUXT_COS_SECRET_KEY }}
          NUXT_COS_BUCKET: ${{ secrets.NUXT_COS_BUCKET }}
          NUXT_COS_REGION: ${{ secrets.NUXT_COS_REGION }}
        run: |
          NODE_OPTIONS="--max-old-space-size=4080" pnpm build

      - name: Pack artifact (flatten .output)
        run: |
          rm -rf distpkg && mkdir -p distpkg
          cp -R .output/* distpkg/
          cp -f pm2.config.json distpkg/
          cp -f pm2.preload.cjs distpkg/
          # Include Drizzle migrations & config for server-side migrate
          mkdir -p distpkg/lib/drizzle
          if [ -d lib/drizzle/migrations ]; then cp -R lib/drizzle/migrations distpkg/lib/drizzle/; fi
          if [ -f drizzle.config.ts ]; then cp -f drizzle.config.ts distpkg/; fi
          tar -C distpkg -czf artifact.tgz .
          du -h artifact.tgz

      - name: Prepare SSH key
        run: |
          mkdir -p ~/.ssh
          chmod 700 ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" | tr -d '\r' > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa

      - name: Upload artifact via scp
        env:
          SSH_HOST: ${{ secrets.SSH_HOST }}
          SSH_USER: ${{ secrets.SSH_USER }}
          SSH_PORT: ${{ secrets.SSH_PORT }}
        run: |
          ssh -o StrictHostKeyChecking=no -p "${SSH_PORT}" "${SSH_USER}@${SSH_HOST}" "mkdir -p /root/web/blog"
          scp -P "${SSH_PORT}" artifact.tgz "${SSH_USER}@${SSH_HOST}:/root/web/blog/artifact.tgz"

      - name: Deploy prod & start with PM2
        env:
          SSH_HOST: ${{ secrets.SSH_HOST }}
          SSH_USER: ${{ secrets.SSH_USER }}
          SSH_PORT: ${{ secrets.SSH_PORT }}
        run: |
          ssh -o StrictHostKeyChecking=no -p "${SSH_PORT}" "${SSH_USER}@${SSH_HOST}" << 'EOSSH'
          set -e
          APP_DIR=/root/web/blog
          ENVFILE=/root/envs/blog/.env
          mkdir -p "$APP_DIR"
          cd "$APP_DIR"
          # Clean app dir but keep artifact
          find "$APP_DIR" -mindepth 1 -maxdepth 1 ! -name artifact.tgz -exec rm -rf {} +
          tar -xzf artifact.tgz -C "$APP_DIR"
          rm -f artifact.tgz
          # Prefer globally installed dotenv-cli; fallback to npx dotenv-cli; else source fallback
          if command -v dotenv >/dev/null 2>&1; then
            DOTENV="dotenv -e \"$ENVFILE\" --"
          elif command -v npx >/dev/null 2>&1; then
            DOTENV="npx -y dotenv-cli -e \"$ENVFILE\" --"
          else
            DOTENV=""
          fi

          # Apply Drizzle migrations on server
          if [ -n "$DOTENV" ]; then
            eval "$DOTENV" npx -y drizzle-kit@0.31.4 migrate || true
          else
            echo "dotenv-cli not available; using source fallback for migrations"
            if [ -f "$ENVFILE" ]; then set -a; . "$ENVFILE"; set +a; fi
            if command -v npx >/dev/null 2>&1; then
              npx -y drizzle-kit@0.31.4 migrate || true
            else
              echo "npx not found; skipping migrations"
            fi
          fi

          # Start cleanly: use prod pm2.config.json
          pm2 delete Blog >/dev/null 2>&1 || true
          pm2 start pm2.config.json --update-env
          pm2 save
          EOSSH

      - name: Notify (Feishu)
        if: always()
        run: |
          curl -X POST -H "Content-Type: application/json" \
            -d '{"msg_type":"text","content":{"text":"'"${{ github.repository }}"' - GH canary deploy ['"'"${{ job.status }}"'"']"}}' \
            "${{ secrets.NUXT_FEISHU_WEBHOOK }}"

```

代码中的 `env`，全部要在 `github` 配置一遍

先建一个 `Environment` ，然后在其下配 `secrets` 即可

![](https://img.zzao.club/article/202508261410526.png)

**迁移时，先用一个临时目录进行迁移。测试没问题后再覆盖原来的目录**

使用 `github` 的服务器，打包速度也快了，总流程 **3m20s** 。 用自己的服务器，`5m30s`，快了不少。

主要是在没有大量 IO 的情况下，服务器内存占用就很稳定，下一年也不用再续费 8G 的服务器了

不过趁着内存够用，多上一些应用试试水。
