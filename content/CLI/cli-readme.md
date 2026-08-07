---
title: Z-CLI 使用说明
date: 2025-03-21
lastmod: 2025-08-19
tags:
  - Cli
zzhub_run_id: 20260806-110135-72fc01
zzhub_state_path: /Users/aatrox/.oh-my-zzhub/posts/2026-08/test-ob-zzhub-pipeline-v2/workflow-state.json
zzhub_published: true
zzhub_published_at: 2026-08-06T03:18:31Z
zzhub_account: default
zzhub_draft_id: 2XxNH1Uyp_X7Bcd9RGIxcMVKlbg1NgDy2BdfPHdM8r2ItNduk0DhTQmSoDTTSI-H
---
## 安装

### Node

使用 `nvm` 管理多个 `node` 版本

 `node >= 18.18.0` 
 
 推荐版本(我的)：`20.18.1` 

查看 `registry` （非必要步骤）

```shell
npm config get registry
# https://registry.npmjs.org
# 如果不是，则需要先设置
npm config set registry=https://registry.npmjs.org
```

安装最新版

```shell
npm i -g @zzclub/z-cli
```

安装后只能在当前 `node` 版本下使用，切换到其他低版本 `node` 则无效

全局命令为：`zz`  或 `z`

### Bun

macos
```shell
curl -fsSL https://bun.sh/install | bash
```

wind
```shell
powershell -c "irm bun.sh/install.ps1 | iex"
```

安装最新版

```shell
bun i -g @zzclub/z-cli
```

**如果提示缺少某个包**，可以按提示再次运行相关命令

## 命令

- `i18n` 缩写 `i` 从Vue文件提取出**中文国际化文件**
- `translate` 缩写：`trans`  批量翻译**中文国际化文件**
- `set` 设置配置文件
- `tiny` 任意图片压缩体积

## i18n 规则说明

### 文件

只提取 `.vue` 文件

### `$t`解析及生成规则

提取正则： `/\$t\(['"]i18n\.([^'"]+)['"]\)/g`

举例：

```js
$t('i18n.module-name.placeholder.month')
```

- module-name 会被解析为文件名称 => `module-name.js`
- 后面的内容会被解析为对象的属性 => `{ placeholder: { month: "month"}} `
- 保存位置如果没传。就会保存在 `.vue` 同级目录下
- 默认忽略 module-name 为 `common` => `$t('i18n.common.xxx')`

### 中文注释规范及提取规则

```vue
<template>
  <!--i18n addTitle=你好呀 a=不错   b=叭叭叭 c=哈哈哈  -->
  <CommonEditForm :page-type="pageType" :title-config="titleConfig" :custom-components-code="$t('i18n.monthlyForecast.pageTitle.addTitle')" :is-out="2">
    <div>{{ $t('i18n.monthlyForecast.form.a') }}</div>
    <div>{{ $t('i18n.monthlyForecast.form.b') }}</div>
    <!--i18n select=真棒 -->
    <div>{{ $t('i18n.monthlyForecast.placeholder.select') }}</div>
  </CommonEditForm>

</template>

<!-- js 区域 -->
<script>
   import {formatDate} from "@/common/utils"
   import CommonEditForm from "@/pages/ifpf/costForecast/monthlyForecast/views/common-edit-form.vue"

   export default {
       name: 'ifpfExchangeRateMaintainAdd',
       components:{
           CommonEditForm,
       },
       data() {
           return {
               pageType: 'edit',
               titleConfig: {
                   title: this.$t('i18n.monthlyForecast.pageTitle.addTitle'),//测试
                   icon: this.$t('i18n.monthlyForecast.pageTitle.icon'), // 图标
                   date: formatDate.formatDateOnly(new Date()),
                   info: this.$t('i18n.monthlyForecast.pageTitle.addInfo')//你好
               },
           };
       }
   };
</script>

```

解析后：

```js
export default {
  pageTitle: {
    addTitle: "测试",
    icon: "图标",
    addInfo: "你好"
  },
  form: {
    a: "不错",
    b: "叭叭叭"
  },
  placeholder: {
    select: "真棒"
  }
}
```
- template 中的注释，**必须**以 `<!--i18n` 开头
- template 中的中文配置以 `空格` 分割，以 `=`号拼接key=value, 如 `addTitle=你好呀 a=不错`
- template 中支**持多个**注释信息
- template 中的 `key=value` 的 `key` 对应 **$t中最后一个key**
- js 中支持两种注释信息提取
  - `$t()` 后紧跟 `//` , `//`后的**中文内容**都被视为默认值
  - `$t()` 后存在 `,` 、`空格` 这两种符号，然后再跟 `//`, `//`后的中文内容都被视为默认值

**解析完成后，自行把文件挪到到 zh-CN 文件夹下**

**然后使用 `translate` 命令进行中译英**


## 翻译功能配置说明
### 初始化翻译平台appId和key

```shell
zz set translate account.appId xxx
zz set translate account.key xxx
```

### 在哪里可以创建appId和key

> 请使用前仔细阅读百度翻译开发平台相关规则

[百度翻译开放平台](https://fanyi-api.baidu.com/api/trans/product/desktop)

1. 注册
2. 实名认证
   1. 标准版 qbs 1  每月5万字符
   2. 高级版 qbs 10 每月100万字符
3. 开通通用文本翻译功能
4. 生成appId和key
5. 生成后的文件请仔细检查，有可能会有遗漏的翻译，如有，重新执行即可
6. 注意: 百度翻译的api有一定的调用限制, 请自行评估是否需要使用高级版

### 翻译单个文件

```shell
zz translate -f ./yourfile.js
# 会在同级目录下生成 yourfile-en.js
```

如`test.js`

```js
export default {
    isok: '早早下班',
    common: {
        listTitle: '标题',
        addTitle: '测试'
    },
    test: {
        a: {
            b: {
                c: '哈哈哈'
            }
        },
        aaa: {
            value: '输入'
        }
    }
}
```

输出文件为test-en.js, 内容如下

```js
export default {
    isok: "Leave work early",
    common: {
        listTitle: "title",
        addTitle: "test"
    },
    test: {
        a: {
            b: {
                c: "Hahaha"
            }
        },
        aaa: {
            value: "input"
        }
    }
}
```

### 批量翻译

> 检索目标文件夹内所有langs文件夹下的zh-CN 文件夹下的所有文件, 输出至其同级的en-US下, 文件名同名

```shell
zz translate -d ./demo
```

如: demo文件夹是以下结构, zh-CN中所有JS会翻译后输出至en-US

每个文件输出内容同翻译单个文件

```shell
.
├── en-US
│   ├── test.js
│   ├── test2.js
│   └── test3.js
├── test-en.js
├── test.js
└── zh-CN
    ├── test.js
    ├── test2.js
    └── test3.js

```

**翻译时可能存在翻译失败的情况，重新运行  translate 命令即可**

## 压缩图片

使用help命令查看所有支持的功能
```
zz tiny --help

  -t, --type <fileType>         转换后的图片类型 (default: null)
  -f, --file <file>             要压缩的图片文件 (default: null)
  -d, --dir <dir>               压缩文件夹内所有文件 (default: null)
  -co, --condition <condition>  压缩文件夹内所有名称包含[--condition]的图片文件 (default: null)
  -q, --quality <quality>       压缩质量(1-100) (default: 75)
  -c, --colours <colours>       GIF色彩保留(2-256) (default: 128)
  -n, --name <name>             指定文件名输出 (default: "")
  -m, --max <max>               限制要上传的文件大小(kb)(仅当开启 --picgo 时会用到) (default: 60)
  --picgo [type]                调用picgo (无参数) (default: null)
  --no-picgo [type]             不调用picgo (无参数) (default: null)
  -h, --help                    display help for command
```


## 操作流程演示

按照规则写好 Vue 文件后，**`cd` 到对应的文件夹**

使用 `i18n` 命令，生成中文国际化文件

```shell
zz i18n -d ./demo

✔ 开始检索/Users/xxxx/demo
✔ 共找到1个要处理的文件
✔ 从 demo 中提取了 6 个国际化键值
✔ 生成文件: /Users/xxxx/demo/monthlyForecast.js
✔ 国际化文件生成完成
```

生成后检查有没有问题，自行完善生成后的文件

**确认中文国际化文件完整后**

**把文件放到 `zh-CN` 目录下**

使用 `translate`  命令翻译

```shell
zz trans -d ./demo
✔ 开始检索/Users/xxxx/demo
✔ 共找到3个要翻译的文件
✔ /Users/xxxx/demo/en-US/test.js已翻译
✔ /Users/xxxx/demo/en-US/test2.js已翻译
✔ /Users/xxxx/demo/en-US/test3.js已翻译
✔ 翻译完毕
```

**到 `en-US` 目录下检查翻译情况**