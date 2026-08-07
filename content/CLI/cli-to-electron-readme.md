---
title: Cli工具集成到Electron客户端
date: 2025-04-10
lastmod: 2025-08-19
tags:
  - Cli
description: 把基于JS/TS的命令行工具，转换为Electron客户端，无需重写代码，还能大大提升非开发者使用体验
zzhub_run_id: 20260806-110135-72fc01
zzhub_state_path: /Users/aatrox/.oh-my-zzhub/posts/2026-08/test-ob-zzhub-pipeline-v2/workflow-state.json
zzhub_published: true
zzhub_published_at: 2026-08-06T03:18:31Z
zzhub_account: default
zzhub_draft_id: 2XxNH1Uyp_X7Bcd9RGIxcMVKlbg1NgDy2BdfPHdM8r2ItNduk0DhTQmSoDTTSI-H
---
## 背景

给公司开发了一些小脚本，发布为了一个命令行工具

前端小伙伴反馈说，命令行要比客户端好用，因为只敲了很少的命令就完事了

但对于非前端开发者，Node 环境问题比较头疼，而且如果是非技术人员，可能命令行也无法接受

之前把单独一个功能复制粘贴再改改，集成到 `electron` 里去过，但工作量太大

最近又有了新思路之后，尝试了一番，花了大概俩小时，把之前的 cli 的大部分功能搬到了客户端上

核心思路就是：

**原CLI须用Bun进行打包为二进制文件, electron中直接使用 child_process.spawn 执行, 监听输出信息返回到前端进行展示** 

前端中需要有一个配置文件 `src/config.ts`, 来表示自己的 `cli` 有哪些 `command` 可以运行

就是这么一个简易的UI

![](https://img.zzao.club/article/202504101707557.png)

## Cli打包

> 目前仅可打包支持esm的包, 如sharp这种c++包还在研究中

安装`bun`

macos
```shell
curl -fsSL https://bun.sh/install | bash
```

wind
```shell
powershell -c "irm bun.sh/install.ps1 | iex"
```

打包到指定平台

具体请看官方文档: [支持的平台参数](https://bun.sh/docs/bundler/executables)

```shell
RUNTIME_ENV=electron bun build ./src/index.js --compile --target=bun-darwin-arm64 --env inline  --outfile z-cli
RUNTIME_ENV=electron bun build ./src/index.js --compile --target=bun-windows-x64 --env inline  --outfile z-cli
```

`RUNTIME_ENV` 的用途是兼容 `cli` 里的一些和 `electron` 无关的代码

如检测 `package.json` 中信息, 打包后就不存在 `package.json` 了, 所以原项目中使用此环境变量过滤一下

## Electron 配置

### resource/bin

把打包后的二进制文件放在此目录下

`ipc.ts` 以及 `App.vue` 中修改 `z-cli` 相关字符(binaryName/channel) 为 **自己的cli名称**

## Vue 配置

`src/config.ts` 修改为自己 cli 的命令配置

## 打包/调试

最终构建好的客户端, 包含一行命令的下拉栏, 以及一个执行结果

原本 `cli` 的配置文件等都会复用 

相当于只是把 `cli` 的敲命令过程可视化, 把结果照搬到 `electron` 中

## 注意

注意下 `cli` 里的依赖包,是否兼容 `bun`

如:
- `axios` 需要替换成 `fetch`
- `sharp` 可能在构建成客户端后会报错 (待解决)
## 开源地址

[Github](https://github.com/aatrooox/cli-to-electron)