---
title: "doubao-seed-evolving和Grok同时开发Obsidian插件，Grok竟然惜败"
date: 2026-08-07
author: Kairos
---


AI 时代，最大的好处就是可以无限简化自己的工作流，并且是以最适合自己的方式。（毕竟花的是自己的 token

所以在**公众号发文**这一方面，我早就把所有环节打通，并封装成了 Agent 友好的 CLI ，使用者只需要写好文章，就可以通知自己的 codex、claude code、Hermes Agent 等等让它调用 CLI 并且追踪整个发布流程。

但 CLI 对于普通用户来说，门槛还是较高，所以我也在尝试多种 GUI 去包装和简化背后的逻辑。

这次我就**结合很多人都在用的 Obsidian 来开发一个插件，直接支持在 OB 里发布文章到草稿箱**。使用的模型是[火山 Agent Plan](https://ark.volcengine.com/region:cn-beijing/subscription/agent-plan)里的「doubao-seed-evolving」。

这是一个不会更改模型名称，但能力一直在进化的模型。比如你用 deepseek-v4-pro ，当他发布 v5 时，你就需要把模型名改为 deepseek-v5-pro ，但豆包这个模型会一直用这个名字不需要你去替换，而且它的迭代速度很快，按周更新，**支持 1M 超长上下文，具备复杂任务编排、长程规划、代码生成与工具调用能力。**

我平时是基本不用 doubao 的模型的，但是其他能买到的模型使用强度很高，这次我就拿 Grok 和它做对比，感受一下它是个什么强度。

## 项目情况

| 维度                | 数量           | 说明               |
| :---------------- | :----------- | :--------------- |
| **TypeScript 总计** | **约 2.5 万行** | `src/` 下全部 `.ts` |
| **业务代码（不含测试）**    | **约 1.9 万行** | 91 个源文件          |
| **测试代码**          | **约 0.6 万行** | 30 个测试文件         |
| **HTML 模板**       | **约 0.2 万行** | 封面、长图、海报等渲染模板    |
| **CLI 命令数**       | **30 个**     | 工作流 17 + 运维工具 13 |

核心功能点

| 模块                              | 行数      | 含义                |
| :------------------------------ | :------ | :---------------- |
| 命令层 `commands/`                 | \~5,000 | 用户/Agent 能调用的每个动作 |
| 核心编排（状态机、任务、路由等）                | \~5,200 | 「下一步该干什么」的大脑      |
| 图片渲染 `imgx/`                    | \~3,000 | 封面、海报、长图生成        |
| 微信 HTML 预览/导出 `wechat-preview/` | \~2,800 | Markdown → 公众号排版  |
| 发布通道 `providers/`               | \~1,700 | 真正推到微信/博客/CDN     |
| Schema + 适配器                    | \~1,000 | 配置校验、插件接口         |

这个 CLI 最大的特点是：会输出下一步建议， Agent 每次都读取并且按建议去继续调用，不需要过多的业务字段描述就能知道自己要做什么。

并且，一个发布任务运行时，会产生一个关联的 json 文件，用字段来完整的记录所有状态，不需要靠人和 Agent 反复对话，因为反复对话会产生很多幻觉，且依赖 Agent 的记忆能力去把控。

基于此设计，就可以实现人工中途接续，多 Agent 协作等能力。

**doubao-seed-evolving** 分析时也要理解它要实现的插件功能的业务范围，其实只是对接一部分，并且需要搜索如何开发一个 Obsidian 插件。

我会**一次性给它全部需求**，看它的完成效果如何

## 编写计划

简单描述一下我需要的功能，希望它开发能直接给我应用到 OB 仓库上，我重启就能用

```Markdown
/plan 这是一个我日常在使用的 CLI 工具，主要核心功能是把本地 MD 直接发布到公众号草稿箱里。现在需要你分析它的主要功能，然后帮我写一个 Obsidian 插件能让我在 OB 里使用它。

  1. ob 插件不需要发布到官方自己本地创建一个新的目录，然后软连接到 ob 里就行， ob 仓库使用「content」
  2. 插件需要在右侧出现，一个新的 tab 栏，要显示出当前打开的文件，发布状态，当前设置的平台、账号、一键发布按钮
  3. 插件设置页面需要 1 环境检测，安装 bun、zzhub-pipeline cli 的命令 2. 账号选择 可以设置当前默认的账号 3 其他的你看看还有什么有价值的显示信息
  4. 发布一篇文章后，需要记录并关联，能在面板看到关联的 run_id ，并把按钮显示为「重新发布」
  5. 发布时，状态需要及时回显。
  6. 面板中显示文章名称时，优先使用 title 字段，其次使用文件名
```

发出指令后自动走了`superpower`，我的心一凉，**token 估计吃不住**

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/067c4b58-d88a-4eec-bada-aeea549f02e6/2026086_fe8c00c0155d_image.png)

它派发了三个 sub-agent 去分析，但有两个都因为「hit rate limits」失败了，最后只有一个去干活

分析完成后，问了几个关键问题，最后输出了一个计划，计划极其详细。我强忍不适看了一圈，没发现明显的问题

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/067c4b58-d88a-4eec-bada-aeea549f02e6/2026086_9c0426205ea3_image.png)

## 成果展示

完成后可以直接重启 OB 就能看到了

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/067c4b58-d88a-4eec-bada-aeea549f02e6/2026086_4ac69c69a125_image.png)

设置界面信息是全的，也支持切换账号

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/067c4b58-d88a-4eec-bada-aeea549f02e6/2026086_6db1975a3aca_image.png)

在笔记界面可以看到面板已经就绪

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/067c4b58-d88a-4eec-bada-aeea549f02e6/2026086_baad993cb265_image.png)

点击发布，有完整的状态回显

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/067c4b58-d88a-4eec-bada-aeea549f02e6/2026086_0941a63c99be_iShot_2026-08-06_15.43.32.gif)

发布成功后，在公众号草稿箱可以看到草稿

![0.73](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/067c4b58-d88a-4eec-bada-aeea549f02e6/2026086_49d9a8d3c719_44161cf3e97bba053e0abfe1a2b8d9f1.jpg)

发布本身是 CLI 的能力，我日常一直在用的，所以不会有问题。

封面图也是 CLI 直接用标题生成了， Markdown 渲染 HTML 也是基于 milkdown 这个插件来自定义的样式，我就只管码字。

对了， CLI 也是[开源](https://github.com/k7airos/zzhub-pipeline)的，还在持续优化和升级中。这次本来是想用 **doubao-seed-evolving** 做一些更底层的编码任务，但是 Agent Plan 套餐的**Token 不够**🤡，下次再搞吧。

**本次消耗 Token 14M ，产出 1500 行代码左右，不算多。**

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/067c4b58-d88a-4eec-bada-aeea549f02e6/2026086_8586b141e143_image.png)

代码已在[Github 开源](https://github.com/k7airos/zzhub-ob-wxpublish)，欢迎试用～

## 评价

这个开发任务，我用 Grok 4.5 high 也跑了一遍， Gork 在这个任务里要比 **doubao-seed-evolving** 要逊色一些。

不过二者有个变量没对齐， Claude Code 里的**doubao-seed-evolving**自己用上了 superpower ， Grok Build 是用的自带的 plan ，无任何系统提示词。

从整体来看，**doubao-seed-evolving** 要强一些， Gork 直出的 UI 效果挺差，修改了一次才好点，并且状态回显上做的不好，应该和 plan 就不完善有关。**两者都不确定有没有降智。**

Grok 的计划更条理，更可读，**速度至少是 evolving 的三倍**，体感上好太多。

**evolving** 的计划非常详细，会具体到修改哪个文件哪一行，对于处理公司项目是个好事，处理 AI 项目就有点头疼 🥲

不过 **evolving** 更新速度很快，期待它变的更好用，然后把价格打下来😜

感兴趣的朋友可以去火山订阅，尝试和对比一下～