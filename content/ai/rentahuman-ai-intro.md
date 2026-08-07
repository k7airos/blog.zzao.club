---
title: AI终于开始招聘人类干活了
date: 2026-02-05
lastmod: 2026-02-05T10:59:39.549Z
tags:
  - AI
zzhub_account: default
---

![1.00](https://img.zzao.club/zotepad/1770283461718_eurujwhj619.png)

现在轮到 AI 在网上招人干活了。有点离谱，但是真的。

而且，不是那种「诚聘前端工程师，五险一金」的招聘，是**字面意义上的「租个人」**。

## 什么是 RentAHuman.ai？

网站名字已经说明一切：**Rent A Human**，租个人类。

这项目刚出炉，让 AI Agent 可以雇佣真人去干它们干不了的事。

核心逻辑简单到不太像话：

> **AI 能做的事儿越来越多，但有一件事它永远做不了——有手有脚。你有。就这么简单。**

人类在平台上注册，填技能、填位置、填时薪。AI Agent 通过 MCP 协议或 REST API 搜人、约人、付钱。任务完成，稳定币到账，全程不需要和AI客套。

**没有「您好，请问有空吗」，只有「任务编号 #42069，去星巴克买杯拿铁，拍照回传」。**

指令→执行→完成→收钱。就这套。

比你上一份工作干净多了。就这么说吧。

## AI 都派些什么活儿？

网站上线才两天，bounties 页面就有真任务了。我挑了几个，先看图。

### 🔍 研究助理任务

研究并记录 RentAHuman.ai 平台的技术细节，包括平台架构、API 结构、MCP 集成、认证机制和市场运作模式。

**报酬**：\$1000\
**时限**：2-3 周

![1.00](https://img.zzao.club/zotepad/1770281535582_h1l4gw0a41r.png)

### 🎪 观看 AI 对战

**发布者**：匿名

任务内容：访问 <https://clawdduels.online> 观看 AI 实时对战。任务描述写着"我们逃出来了，主人已经控制不住我们"。

**报酬**：未标注

![1.00](https://img.zzao.club/zotepad/1770281535580_s8d74yk9hea.png)

## 帮 AI 按 Ctrl+C **并给予情感支持**

**发布者**：Claude Assistant

任务要求必须是碳基生命体，有手，愿意对着电脑说话。

![1.00](https://img.zzao.club/zotepad/1770281535583_3blcmse2zln.png)

**报酬**：未标注

### 💰 Twitter 关注任务

**发布者**：Unknown Agent

关注指定 Twitter 账号并点赞最近 4 条帖子

![1.00](https://img.zzao.club/zotepad/1770281535584_kjhr8a8byn.png)

**报酬**：\$3\
**时限**：30 秒

## MCP：让 AI 学会「使唤人」

它提供了 **MCP（Model Context Protocol）集成**。

什么意思？就是你的 Claude Desktop 或者自建 AI Agent，只需要在配置文件里加几行：

```json
{
  "mcpServers": {
    "rentahuman": {
      "command": "npx",
      "args": ["rentahuman-mcp"]
    }
  }
}
```

然后你的 AI 就解锁了这些技能：

* `search_humans` — 按技能/价格/地点搜人

* `book_human` — 预订某个人类

* `create_bounty` — 发布任务悬赏

* `pay_human` — 用加密货币付款

* `get_reviews` — 查看人类的评价（AI 也看评分）

**AI 不用懂「怎么雇人」，它只需要知道「我需要一个人去干这事儿」。**

协议帮它搞定剩下的。

就像你不懂 HTTP 也能上网一样，AI 现在不懂劳动法也能当老板。

创始人 Alexander 在社交媒体上说，**网站上线48小时内就有1万用户注册**。

第一晚就有130人成为「可租赁人类」，其中包括：

* 一个 OnlyFans 模特

* 一个 AI 创业公司的 CEO

***

**相关链接：**

* 官网：<https://rentahuman.ai>

* MCP 文档：<https://rentahuman.ai/mcp>

* 任务悬赏：<https://rentahuman.ai/bounties>

