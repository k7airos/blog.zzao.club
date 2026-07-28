---
title: "推荐 7 个靠谱的 PPT Skill（2026）"
date: 2026-07-28
author: Kairos
---


用 AI Agent 做演示稿，已经从「能出几页字」进化到「能交真·PPTX / 能上讲台的网页 Deck」。生态里 Skill 很多，质量参差。本文按**社区采用度、维护活跃度、交付形态是否清晰**筛出 **7 个相对靠谱**的 PPT Skill ，并统一写明：

* 开源链接与 GitHub Star （数据抓取时间： 2026-07-28 ）

* 典型使用场景

* 是否额外依赖第三方 API Key

> 说明： Star 会随时间变化；「靠谱」不等于万能。选 Skill 时，先看你要的交付物是 **可编辑 PPTX**、**HTML 网页幻灯片**，还是 **整页图片式 PPT**。


## 怎么选：先定交付形态

| 你要的结果                      | 更合适的路线                    |
| -------------------------- | ------------------------- |
| 同事能在 PowerPoint / WPS 里继续改 | 原生 / 可编辑 PPTX Skill       |
| 分享会、内部分享、网页演示              | HTML Deck Skill           |
| 视觉冲击强、改文案不重要               | 整页生图 / 图片式 PPT Skill      |
| 官方基线、读写现有 `.pptx`          | Anthropic 官方 `pptx` Skill |

下面 7 个覆盖了这几条主线。


## ppt-master — 原生可编辑 PPTX 工作流

* **开源**：[github.com/hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) · **★ 41.4k**

* **官网 / Demo**：[hugohe3.github.io/ppt-master](https://hugohe3.github.io/ppt-master/)

### 使用场景

把文档、主题或大纲，在 Claude Code / Codex 等 Agent 里跑成**真正的 PowerPoint**：母版、原生形状、图表表格、讲稿备注等，适合正式汇报、融资 BP、方案 deck ，以及还需要在 PowerPoint 里二次精修的场景。

<br />

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/f4ea47fd-c4a5-443b-9b85-d31f43fbe083/20260728_1cd588c8c099_image.png)

### API Key 依赖

* **Skill 本身不强制额外 Key**：依赖你已有的 Agent 模型通道（ Claude / GPT / Kimi 等）。

* **可选**： AI 配图需要配置 `OPENAI_API_KEY` / `GEMINI_API_KEY` 等（如 `gpt-image-2`）；图片搜索可配置 Pexels / Pixabay （免费申请）。

* 本地 Python 依赖（`pip install -r requirements.txt`），数据生成主要在本机完成。

**要「能交出去、能继续改」的 PPTX ，优先看它。**


## frontend-slides — 用前端能力做网页幻灯片

* **开源**：[github.com/zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) · **★ 26.4k**

### 使用场景

不走传统 PPT ，而是让 Agent 写出**高质量 HTML 幻灯片**（交互、动效、激光笔光标等网页能力）。适合技术分享、产品发布网页版、需要嵌入媒体/交互的演示；也支持把已有 PPT 转成 Web。

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/f4ea47fd-c4a5-443b-9b85-d31f43fbe083/20260728_a33a21ed3fe4_iShot_2026-07-28_14.14.53.gif)

### API Key 依赖

* **无额外第三方生图 / 云 PPT API Key**。

* 依赖本机 Agent + 前端技术栈；导出 PDF 时需要 Node.js / Playwright （可自动安装）。

**演示形态可以更「网页」，而不是「PowerPoint 文件」。**


## guizang-ppt-skill — 杂志风 / 瑞士网格 HTML Deck

* **开源**：[github.com/op7418/guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) · **★ 22.5k**

### 使用场景

生成**单文件 HTML 横向翻页 PPT**，强调版式系统（如杂志风、Swiss 网格）、社媒封面、可选 WebGL 演示 runtime。适合设计感强的分享会、活动介绍、视觉统一的系列 deck。

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/f4ea47fd-c4a5-443b-9b85-d31f43fbe083/20260728_656869fcdf31_image.png "旧主题 · Style A 电子杂志风")

<br />

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/f4ea47fd-c4a5-443b-9b85-d31f43fbe083/20260728_79d2aa46b488_image.png "新主题 · Style B 瑞士国际主义")

### API Key 依赖

* **核心 HTML 生成：不强制额外 Key**。

* **可选配图**：在 Codex 等环境可用 GPT-Image 2.0 / GPT-M 2.0 生成配图（走你环境里的生图能力 / 对应 Key ）。

**HTML PPT 里版式与视觉规范做得比较完整的一支。**


## Anthropic 官方 pptx Skill — 读写与生成 `.pptx` 的基线

* **开源（合集仓库）**：[github.com/anthropics/skills](https://github.com/anthropics/skills) · **★ 164.6k**（整个 skills 仓库；`pptx` 是其中一项）

* **Skill 路径**：`skills/pptx/SKILL.md`

### 使用场景

任何涉及 `.pptx` / `.potx` 的任务：新建 deck、解析已有 PPT、改模板、合并拆分、备注与布局处理。偏「工程向」——用 `pptxgenjs` 创建、用解压改 XML 的方式编辑，适合需要可控、可脚本化的办公文档流水线。

### API Key 依赖

* **无云端 PPT / 生图 API 强制依赖**。

* 依赖本机 Node （ pptxgenjs ）/ Python 脚本与 Agent 本身；属于官方 Office 技能包的一部分（许可证为 Anthropic skills 仓库条款）。


## html-ppt-skill — 主题 / 版式齐全的 HTML PPT Studio

* **开源**：[github.com/lewislulu/html-ppt-skill](https://github.com/lewislulu/html-ppt-skill) · **★ 7.4k**

### 使用场景

需要**大量主题与版式模板**快速搭专业感 HTML 演示：多主题 token、多布局、动效、Presenter 模式等。适合内训课件、产品介绍、反复换肤的系列演示。

![1.00](https://github.com/lewislulu/html-ppt-skill/blob/main/docs/readme/themes.png?raw=true "themes.png")

![1.00](https://github.com/lewislulu/html-ppt-skill/blob/main/docs/readme/animations.png?raw=true "animations.png")

### API Key 依赖

* **无额外第三方 API Key**。

* 安装为 Agent Skill 后，由本地 Agent 按模板系统生成 HTML deck。

**想要「主题库 + 布局库」开箱即用的 HTML 路线，可以重点看。**


## dashi-ppt-skill — 浏览器可编辑，导出 HTML / PDF / PPTX

* **开源**：[github.com/chuspeeism/dashi-ppt-skill](https://github.com/chuspeeism/dashi-ppt-skill) · **★ 4.3k**

### 使用场景

生成后能在浏览器里**点文字编辑、插图、拖拽调整**，再导出 HTML / PDF / PPTX。适合：先让 Agent 出草稿，人再快速改字改图；内容希望尽量留在本机的团队。

<br />

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/f4ea47fd-c4a5-443b-9b85-d31f43fbe083/20260728_5b52c53c8496_image.png)

### API Key 依赖

* **无额外云 PPT / 生图 API Key 要求**。

* 需要本机 **Node.js 20+**；导出 PPTX/PDF 需要本机 Chrome / Chromium / Edge （可用 `CHROME_PATH` 指定）。

* 文档强调内容生成与编辑在本机完成，不上传内容到第三方 PPT 服务。


## codex-ppt-skill — 整页生图、视觉优先的图片式 PPT

* **开源**：[github.com/ningzimu/codex-ppt-skill](https://github.com/ningzimu/codex-ppt-skill) · **★ 4.2k**

### 使用场景

每页由图像模型生成完整 16:9 幻灯片图，再组装成 PPTX ；内置多种风格（科研答辩、麦肯锡、手绘技术解释等）。适合技术分享、论文答辩风、强视觉统一、文字事后改动不多的场合。

<br />

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/f4ea47fd-c4a5-443b-9b85-d31f43fbe083/20260728_b07fd85add28_image.png)

### API Key 依赖

* **有**：核心依赖 **图像生成能力**（推荐 `gpt-image-2`）。

  * Codex 可走内置生图；

  * 也可配置 OpenAI 兼容接口 / 第三方供应商的 `base URL` + API Key。

* 本地脚本负责组装 PPTX ；大纲与样张确认后再批量出图，成本主要在生图 token。

**一句话**：要「看起来像设计过的整页视觉」，而不是「可精细改每个文本框」。


## 对照表（速查）

| Skill                                                              |     Star | 主交付                    | 额外 API Key      |
| ------------------------------------------------------------------ | -------: | ---------------------- | --------------- |
| [ppt-master](https://github.com/hugohe3/ppt-master)                |    41.4k | 原生可编辑 PPTX             | 可选生图 / 图搜 Key   |
| [frontend-slides](https://github.com/zarazhangrui/frontend-slides) |    26.4k | HTML 网页幻灯片             | 无（本地前端）         |
| [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)   |    22.5k | 单文件 HTML Deck          | 可选 GPT-Image 配图 |
| [anthropics/skills · pptx](https://github.com/anthropics/skills)   | 164.6k\* | 读写/生成 `.pptx`          | 无强制云 API        |
| [html-ppt-skill](https://github.com/lewislulu/html-ppt-skill)      |     7.4k | 多主题 HTML PPT           | 无               |
| [dashi-ppt-skill](https://github.com/chuspeeism/dashi-ppt-skill)   |     4.3k | 可编辑 HTML → 导出 PPTX/PDF | 无（需本机 Chrome ）   |
| [codex-ppt-skill](https://github.com/ningzimu/codex-ppt-skill)     |     4.2k | 图片式 PPTX               | **需要生图 API**    |

\* `pptx` 为 monorepo 内 Skill ， Star 为整仓统计。


## 选型建议（实操）

1. **公司汇报 / 客户方案，必须 PPTX 可改** → `ppt-master`；要官方稳妥读写能力可叠加 Anthropic `pptx`。
2. **技术分享、想炫一点、可网页打开** → `frontend-slides` 或 `guizang-ppt-skill`；要主题库多选 `html-ppt-skill`。
3. **出稿后还要人快速改字** → `dashi-ppt-skill`。
4. **视觉第一、改字不重要、能接受图片页** → `codex-ppt-skill`（准备好生图额度）。
5. **预算与隐私**：无额外 Key 的 HTML / 本地 PPTX 路线更省、更可控；整页生图路线效果强，但按页计费。


## 安装提示（通用）

多数 Skill 支持对 Agent 说：

```text
请帮我安装这个 skill ： https://github.com/<owner>/<repo>
```

或使用 skills CLI （若你的环境已支持）：

```bash
npx skills add <owner>/<repo>
```

装完后，用「明确交付物」提问，例如：

* 「根据这篇 Markdown 生成 12 页可编辑 PPTX ，麦肯锡风格」

* 「做成单文件 HTML 横向翻页，瑞士网格，带封面和结尾页」

比只说「帮我做个 PPT」更容易稳定出结果。


## 结语

数据与链接以各仓库当前页面为准；安装前建议再扫一眼 README 的依赖与**许可证**。

有其他好用的 PPT skills 也欢迎在评论区交流👏