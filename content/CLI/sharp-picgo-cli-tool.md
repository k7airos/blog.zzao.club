---
title: 🚀提升效率！早早下班！Sharp+Picgo实现压缩后上传并替换外链的命令行工具
published: 2023-01-01
author: zzdaddy
description: sharp压缩图片，picgo自动上传
tags:
  - 技术
  - Cli
category: 技术
lastmod: 2025-08-19
date: 2023-12-13
showTitle: 🚀提升效率！早早下班！Sharp+Picgo实现压缩后上传并替换外链的命令行工具
zzhub_run_id: 20260806-110135-72fc01
zzhub_state_path: /Users/aatrox/.oh-my-zzhub/posts/2026-08/test-ob-zzhub-pipeline-v2/workflow-state.json
zzhub_published: true
zzhub_published_at: 2026-08-06T03:18:38Z
zzhub_account: default
zzhub_draft_id: 2XxNH1Uyp_X7Bcd9RGIxcMVKlbg1NgDy2BdfPHdM8r2ItNduk0DhTQmSoDTTSI-H
---
## 引言

大家好啊， 我是枣把儿！

最近写作比较多，而要发平台又好几个，插入图片的时候就很不方便。一开始我是白嫖掘金的图片地址，但是每个平台都会自动打个水印上去...

于是我又把之前写的命令行工具拿出来翻新了一些，加入了Sharp图片压缩、Picgo上传图床、markdown文件内容替换这三大内容，极大的改善了我的发文体验，并且感觉在日常中也比较实用。和大家分享一下~

## 功能一览

1. 国际化文件翻译 - **translate**
   1. 目前用于公司内部批量翻译国际化文件, 所以需要遵循一定的规则
   2. 基于百度翻译, 需要自定义自己的appId和key
   3. 支持指定单个文件翻译
   4. 支持指定文件夹, 批量翻译所有文件

2. 压缩文件 - **tiny**
   1. 基于[sharp](https://sharp.pixelplumbing.com/install#custom-libvips), sharp支持的文件都可以压缩
   2. 输出目录: 所有参数下, 压缩后文件都会输出到同级目录中
   3. 输出时显示大小及压缩比例
	如: ✔ 190.4 KB => 115.2 KB (↓39.52%)【 demo1-zz-tiny-1702631665830.gif 】
   4. 支持自定义名称输出 --name=xxx.png
   5. 支持自定义压缩质量 --quality=70 (1-100)
   6. 支持单个文件压缩 --file=xxx.png
   7. 支持批量文件压缩
      - 指定文件夹 --dir=./demo (基于当前命令运行的目录)
        - 支持相对路径
        - 支持绝对路径
      - 指定文件名 --condition=abc
         - 模糊匹配 所有包含abc且支持的文件类型都会被压缩
         - 如果没有指定--dir , 则--condition会在当前目录下查找
         - 模糊匹配到的内容, 会标红处理
      - 若批量压缩时, 指定了name(第四条), 则自定义名称后会自动拼接一个序号, 避免覆盖
   8. **支持和picgo联动, 压缩完后直接上传到图床**
      1. 需要先安装picgo, 启动, 并配置好图床配置
      2. 限制文件大小, 超过 max 的文件不会被上传

3. 通过 Picgo 上传到图床 - **picgo**
   1. 支持指定文件 -f 上传
   2. 支持指定文件夹 -d 批量上传全部
   3. 支持限制大小 -m 默认只上传60kb以内的图片
   4. 支持模糊匹配 -co 文件名中含有co的图片, 且满足大小限制, 都会被上传

4. 究极联动： **tiny压缩 -> 自动传给picgo -> 自动把obsidian里的本地图片链接替换为上传后的url**

## 安装

先安装[sharp](https://sharp.pixelplumbing.com/install#custom-libvips)的两个前置依赖包。@img/sharp-darwin-arm64@0.33.0 、 @img/sharp-win32-x64@0.33.0

我的系统是macos M2，所以需要安装@img/sharp-darwin-arm64

```shell
npm i -g @img/sharp-darwin-arm64@0.33.0
```

windows10/11 (win32-x64)用户请安装  @img/sharp-win32-x64@0.33.0

```
 npm i -g @img/sharp-win32-x64@0.33.0
```

然后安装工具本体

```
npm i -g zzoffduty-cli@latest
```

运行 -h 看看是否成功

```
zz -h
```

## tiny命令 实现压缩

使用help命令查看所有支持的功能
```
zz tiny --help

  -f, --file <file>             要压缩的图片文件 (default: null)
  -d, --dir <dir>               压缩文件夹内所有文件 (default: null)
  -co, --condition <condition>  压缩文件夹内所有名称包含[--condition]的图片文件 (default: null)
  -q, --quality <quality>       压缩质量(1-100) (default: 75)
  -c, --colours <colours>       GIF色彩保留(2-256) (default: 128)
  -n, --name <name>             指定文件名输出 (default: "")
  -m, --max <max>               限制要上传的文件大小(kb)(仅当开启 --picgo 时会用到) (default: 50)
  --picgo [type]                调用picgo (无参数) (default: null)
  --no-picgo [type]             不调用picgo (无参数) (default: null)
  -h, --help                    display help for command
```

压缩功能演示：

- 指定目录压缩，并指定名称输出

![](https://img.zzao.club/article/202411191442697.png)


##  picgo命令 实现上传图床

PicGo在`2.2.0`版本开始内置了一个小型的服务器，用于接收来自其他应用的HTTP请求来上传图片。

默认监听地址： `127.0.0.1`，默认监听端口：`36677`

以POST请求去上传
-   method: `POST`
-   url: `http://127.0.0.1:36677/upload` （此处以默认配置为例）
-   request body: `{list: ['xxx.jpg']}` 必须是JSON格式

返回的数据：

```typescript
{
  "success": true, // or false
  "result": ["url"]
}
```


所以**此功能通过Http请求的方式调用Picgo Server, 所以需要本地已经安装并启动Picgo, 并已经配置好了图床**

如果使用picgo-core的话，手动配置json文件我觉得更痛苦一些。所以还是基于已经有了Picgo客户端的情况下，简化一些流程

使用help命令查看所有支持的功能

```
Options:
  -f, --file <file>             要上传的图片文件 (default: null)
  -d, --dir <dir>               上传文件夹内所有图片文件 (default: null)
  -co, --condition <condition>  上传文件夹内所有名称包含[--condition]的图片文件 (default: null)
  -m, --max <max>               大于指定大小(kb)的图片不会被上传 (default: 50)
  -h, --help                    display help for command
```

上传文件夹内所有大小符合限制的图片文件

![](https://img.zzao.club/article/202411191442699.png)

上传所有名称中含有指定文字且大小符合限制的图片文件。没有匹配到会有提示

![](https://img.zzao.club/article/202411191442700.png)


##  tiny 联动 picgo

在tiny命令后使用--picgo 开启压缩后调用picgo

- 压缩单个图片文件 并 通过picgo上传 （这里也校验了max）

```
zz tiny -f ./demo/demo2.png --picgo
```

![](https://img.zzao.club/article/202411191442701.png)

- 压缩文件夹内所有图片文件，并通过picgo上传所有符合大小限制的图片文件

```
zz tiny -d ./demo --picgo
```

![](https://img.zzao.club/article/202411191442702.png)


- 压缩文件夹内名称含有指定文字的，且符合大小限制的图片，并通过picgo上传

```
zz tiny -d ./demo -co mo2 --picgo
```

![](https://img.zzao.club/article/202411191442703.png)

- 压缩文件夹内名称含有指定文字的，且符合大小限制的图片，并指定输出的文件名，并通过picgo上传

`ps: 因为名称含有指定文字这个指令是个批量操作，所以输出文件名必定会带一个后缀防止重复`

```
zz tiny -d ./demo -co mo2 -n 自定义 --picgo
```

![](https://img.zzao.club/article/202411191442704.png)

## 究极联动，一条龙服务

压缩 => 上传 => 自动替换markdown图片链接

```
./src/index.js tiny -d ./demo/md/配图 --picgo --replace -ref ./demo/md/demo4.md
```

![](https://img.zzao.club/article/202411191442705.png)

此命令目前支持替换Obsidian里的Wiki链接， 即 `![[demo2.png]]`
如下图所示：

![](https://img.zzao.club/article/202411191442706.png)

 被压缩的图片里只要有demo2.png 就会替换成demo2.png压缩后的，上传到图床的url。
`![[demo2.png]]`  替换为 `![](http://www.baidu.com/demo2.png)`

**特别注意，有一些Obsidian配置的前置条件：**

1.  需要开启Wiki链接。因为目前版本我**只实现了替换wiki链接对应的文本**
![](https://img.zzao.club/article/202411191442707.png)
2. Obsidian默认情况下，粘贴来的图片会显示成 paste img 2023123123.png 这种格式。所以建议安装 paste image rename 这个插件。原因是：
- 因为它名称自带空格，和命令行工具无法兼容！如果你批量上传过程中，有一个文件不符合大小限制，没有被上传，也没被替换。此时你想使用`zz tiny -f ./paste img 2023123123.png  -m 100 --picgo --repalce -ref ../xxx.md` 继续放大限制，上传+替换时，文件就无法被解析了！
- 而且本身的名字比较长，不好找

以下是我的插件配置
![](https://img.zzao.club/article/202411191442708.png)

当我截图后粘贴到md中时显示如下：

![](https://img.zzao.club/article/202411191442709.png)

在粘贴图片时，文件存放路径配置：

![](https://img.zzao.club/article/202411191442710.png)

在目录中展示为：

![](https://img.zzao.club/article/202411191442711.png)

ok，以上就是我的obsidian配置，及我是如何使用zzoffduty-cli的全部内容！

```shell

zz tiny -d ./ -q 60 -m 100 --picgo --replace -ref ../🚀提升效率  ！早早下班！Sharp+Picgo实现压缩后上传并替换外链的命令行工具.md

✔ 正在压缩:.DS_Store
✖ 不支持此文件类型[.DS_Store]!
✔ 正在压缩:1-img.png
✔ 65.0 KB => 14.0 KB (↓78.42%)【 1-img-zz-tiny-1703041107406.png 】
✔ 正在压缩:2-img.png
✔ 423.4 KB => 95.9 KB (↓77.35%)【 2-img-zz-tiny-1703041107433.png 】
✔ 正在压缩:3-img.png
✔ 62.4 KB => 14.5 KB (↓76.76%)【 3-img-zz-tiny-1703041107602.png 】
✔ 正在压缩:4-img.png
✔ 88.1 KB => 17.9 KB (↓79.65%)【 4-img-zz-tiny-1703041107623.png 】
✔ 正在压缩:5-img.png
✔ 33.1 KB => 7.2 KB (↓78.23%)【 5-img-zz-tiny-1703041107660.png 】
✔ 正在压缩:img1.png
✔ 153.2 KB => 18.2 KB (↓88.14%)【 img1-zz-tiny-1703041107673.png 】
✔ 正在压缩:img10.png
✔ 100.1 KB => 37.9 KB (↓62.12%)【 img10-zz-tiny-1703041107703.png 】
✔ 正在压缩:img11.png
✔ 42.5 KB => 9.1 KB (↓78.61%)【 img11-zz-tiny-1703041107756.png 】
✔ 正在压缩:img2.png
✔ 139.4 KB => 32.2 KB (↓76.9%)【 img2-zz-tiny-1703041107779.png 】
✔ 正在压缩:img3.png
✔ 128.0 KB => 29.8 KB (↓76.75%)【 img3-zz-tiny-1703041107821.png 】
✔ 正在压缩:img4.png
✔ 79.1 KB => 17.5 KB (↓77.88%)【 img4-zz-tiny-1703041107867.png 】
✔ 正在压缩:img5.png
✔ 242.6 KB => 57.5 KB (↓76.31%)【 img5-zz-tiny-1703041107896.png 】
✔ 正在压缩:img6.png
✔ 94.7 KB => 21.3 KB (↓77.53%)【 img6-zz-tiny-1703041107974.png 】
✔ 正在压缩:img7.png
✔ 110.5 KB => 25.1 KB (↓77.31%)【 img7-zz-tiny-1703041108013.png 】
✔ 正在压缩:img8.png
✔ 110.6 KB => 24.4 KB (↓77.91%)【 img8-zz-tiny-1703041108058.png 】
✔ 正在压缩:img9.png
✔ 262.4 KB => 65.7 KB (↓74.98%)【 img9-zz-tiny-1703041108106.png 】
✔ 压缩成功 16 个
✔ 上传成功 16 个!
✔ 上传地址:
http://img.zzstudio.cn/1-img-zz-tiny-1703041107406.png
http://img.zzstudio.cn/2-img-zz-tiny-1703041107433.png
http://img.zzstudio.cn/3-img-zz-tiny-1703041107602.png
http://img.zzstudio.cn/4-img-zz-tiny-1703041107623.png
http://img.zzstudio.cn/5-img-zz-tiny-1703041107660.png
http://img.zzstudio.cn/img1-zz-tiny-1703041107673.png
http://img.zzstudio.cn/img10-zz-tiny-1703041107703.png
http://img.zzstudio.cn/img11-zz-tiny-1703041107756.png
http://img.zzstudio.cn/img2-zz-tiny-1703041107779.png
http://img.zzstudio.cn/img3-zz-tiny-1703041107821.png
http://img.zzstudio.cn/img4-zz-tiny-1703041107867.png
http://img.zzstudio.cn/img5-zz-tiny-1703041107896.png
http://img.zzstudio.cn/img6-zz-tiny-1703041107974.png
http://img.zzstudio.cn/img7-zz-tiny-1703041108013.png
http://img.zzstudio.cn/img8-zz-tiny-1703041108058.png
http://img.zzstudio.cn/img9-zz-tiny-1703041108106.png
✔ [🚀提升效率！早早下班！Sharp+Picgo实现压缩后上传并替换外链的命令行工具.md]图片链接替换完成!请前往检查!

```

然后直接复制，粘贴到各大平台即可！

`使用前请仔细阅读readme.md，及最后的免责声明（害怕）`

`这次上传的图片太多，真的怕七牛云空间不够了。。`

## 下一步计划

**提高兼容性！**

- 准备把**文本替换功能**抽离出来，现在只是满足了自己的需求。
- 可以再加一个掘金文章里用的图片缩放功能，或者自定义replace函数、正则表达式等。
- 收集更多其他人日常使用方式，融合进来


## 小结

这是一个我在为了简化日常工作和生活中一些复杂的、繁琐的、可联动的操作而开发的命令行工具，是一个纯粹为了效率的实用工具。

后续随着我自己的使用或其他人的反馈，我会加入更多的功能把它一步步的完善。同时一些适合可视化操作的功能，也会拆成web、客户端、小程序等形态，都是我的"预备摊位"！！

如果你对这个产品感兴趣或者有好的功能建议要告诉我，代码在[Github](https://github.com/zzdaddy/zzoffduty-cli)，也欢迎关注公众号：[早早集市](https://mp.weixin.qq.com/s/A8wHxE5Q2jl6Su_7QA6f-A)

感谢你的阅读，我是枣把儿\~