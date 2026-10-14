---
title: 使用 Layers 扩展你的 Nuxt4 应用
date: 2025-02-10
lastmod: 2025-08-19
tags: ["Nuxt"]
versions: ["nuxt@3.15.2"]
showTitle: 使用 Layers 扩展你的 Nuxt4 应用
---
## 面对一个臃肿的页面或项目，你会如何简化重构、扩展它？

当单个 Vue 文件中界面/业务足够多时，通常我们会把它拆分成多个 `components` 或 `composables` 来引入，以此来减少此文件复杂度和增加可维护性。

当一个项目的界面/业务逻辑足够多时，我们会在全局抽离一部分组件和逻辑，在不同的业务逻辑中复用。或者把和业务解耦的组件或工具函数甚至固定业务逻辑发布为 `npm` 包来使用，进一步减少项目中的代码复杂度。

当存在多个项目，而项目之间又存在相同业务时，我们可能会把具有完整功能的一部分逻辑抽离成独立的项目。同时多个项目的 UI组件库和通用逻辑层也发布为 npm 包，供所有项目下载使用以保持统一的视觉效果和减少重复代码的编写。这样当一个新的项目出现，需要利用其他已有的业务逻辑或者是完全复用其他项目的页面和功能时，我们可以使用 iframe 或沙箱来加载这个独立的项目。这样多团队可以维护自己的业务项目，同时又能避免开发重复的功能。

那么在 Nuxt 里的如何优雅的解决这些问题呢？ 

除了上述的任何框架的项目都能操作的方式，Nuxt 还有自己独特的扩展方式：`Layer`

## Layer 可以解决什么问题


[Layer](https://nuxt.com/docs/getting-started/layers) 几乎就是一个完整的 Nuxt 项目。

开发了一个 Layer，意味着 Layer 中的组件、函数、接口、依赖包等都会继承了此 Layer 的项目应用。

它不是一个最新版本才有的功能，但官方的文档的介绍十分简单，**可能是因为它还在不断的完善中，官方也不希望你用于生产环境中。**

一个 Nuxt4 应用的最简目录结构是这样的：

```shell

├── README.md

├── **app**

│   ├── app.config.ts

│   ├── app.vue

│   └── **pages**

│       └── index.vue

├── nuxt.config.ts

├── package.json

├── pnpm-lock.yaml

├── **public**

│   ├── favicon.ico

│   └── robots.txt

├── **server**

│   └── tsconfig.json

└── tsconfig.json
```

而一个 Layer 模板的目录结构是这样的：

```shell
├── .editorconfig

├── .gitignore

├── .npmrc

├── .nuxtrc

├── .playground

│   ├── app.config.ts

│   └── nuxt.config.ts

├── README.md

├── app.config.ts

├── app.vue

├── components

│   └── HelloWorld.vue

├── eslint.config.js

├── nuxt.config.ts

├── package.json

├── pnpm-lock.yaml

└── tsconfig.json
```

可以看到，**会用 Nuxt 就会写 Layer，无需引入其他负担即可扩展**。

开发一个 `Nuxt4` 应用时，我们会在 app 目录下开发各种 `pages`、`components`、`composables`、`utils`，会在 `app.config.ts` 里设置一些全局配置项。

需要接口支持时，可以在 `server` 目录下借助 `Nitro` 的生态来完成后端服务。

但是当项目开始变得臃肿时，Layer 可以发挥什么作用呢。

场景1：我的网站有一个登录注册权限校验相关的逻辑，这肯定会涉及到一些页面、组件、结构，比如登录页、注册页、登录按钮、登录注册接口等等。

一开始我没打算把它们抽离出去，因为网站还很小，并且只有一个。但是我很清楚这一部分功能和组件是可以被复用的。只要我再创建一个 nuxt 应用，我可以肯定我会来这个项目里复制一遍代码而不是重新敲一遍。

由于既涉及到前端组件又涉及到后端接口，以及一部分公共函数。我难道要把 Vue 的组件发布成一个 npm 包，把公共函数发布一个 npm 包，再把这部分后端接口重新起一个服务吗？

在一个全栈框架里这样做显然是有点繁琐。

假设 2：有一个付费网站，但它有一部分是免费的，付费内容也是分 vip、svip，如果全都写在一个项目里的话当然可以实现，毕竟用户也不关心你代码是怎么写的，只要能提供稳定的服务就可以了。

如果两个、三个网站呢？ 

如果是卖给客户源码呢？

如果是把免费内容开源，付费内容闭源，或是后续再把 vip 的逻辑开源呢？

假设 3：有一个基于 Nuxt 的开源博客站，如何设计一套机制，可以让其他用户用上自己喜欢的主题呢，毕竟博客最重要的就是换皮。


## 针对不同场景的解决方案

如果场景 1，前期 `Layer` 可以直接在 `Nuxt4` 应用里使用，像是这样：

```shell
app
	auth
		pages
		conmponents
		composables
		utils
		server
		nuxt.config.ts
	components
	composables
	utils
	app.config.ts
nuxt.config.ts
```

> 在 `Nuxt3` 中，这个 `auth` 可以放在 `～/layers` 中
> `Nuxt3.12.0` 以后的版本都会自动注册`Layers`

在 `app` 目录下，可以新建一个 `{layer_name}` 目录，目录内的结构和 Nuxt3 是一致的。

`nuxt.config.ts` 中只需要 extend 即可。

```typescript
extend: [ 'app/auth' ]
```

这样，我们把权限校验相关的组件、接口、utils 都挪到了一个 `auth layer` 下管理。**如果业务没能继续发展，一个仓库非常好管理，同时按文件夹划分后，结构十分清晰。**

这样可能感受还不是很强烈。

因为只是目录结构上的分层。这一层相关的依赖 `nuxt/auth` 还是安装在了主项目内，但 `nuxt-auth` 已经是在 `app/auth/nuxt.config.ts` 里了，要知道，如果你用了一些 `nuxt modules` 之后，`nuxt.config.ts` 很容易变成一大坨！因为他们都是在这一个文件内配置。

但 Layer 可以随时分离出去，因为它就是一个完整的 Nuxt 应用，所以**迁移几乎没有额外成本**。

当决定把这一部分代码迁移出去时

可以直接使用官方的 `layer` 模板再新建一个项目 `zc-auth-layer`，这个模板有一个好处，内置了 `.playground` ，顾名思义，**是一个用来模拟你的主项目的 Nuxt 应用**。

`Layer` 的实际内容（红框）都写在根目录 的123下，`playground` （绿框）里用**来做调试和开发**。

起初我没有用这个模板，而是单纯的新建一个 Nuxt 应用，但很快就发现了问题。`Pages` 会直接把主项目的 `Pages` 直接给覆盖掉，而且（暂时）还没发现如何忽略某个目录的覆盖，但这是一个显而易见的问题，应该会很快完善或者被我发现。

而有了 `playground` 之后，可以放心的里面写页面或是发展成一个独立的项目，又不影响外层供给其他项目继承。

![](https://img.zzao.club/article/202502051431526.png)

这就是一个普普通通的 Nuxt4  应用！

而其他项目如果想使用它的仓库，只需要配置：

```typescript
extends: [ ['github:k7airos/zc-auth-layer', { install: true }] ]
```

也可以它发布后的 npm 包

```typescript
// 直接使用npm 包
extends: [ 'zc-auth-layer' ]
// 某个组织下的包
extends: [ '@zzaoclub/zc-auth-layer']
```

就像是在项目中使用其他 `components` 、`server api` 一样！

**甚至还拥有完整的自动导入和 TS 类型提示，这你能受得了吗？**

依赖关系是这样的，**A extend B ， B extend C ，C 拥有最高的优先级，向下覆盖。**

所以哪怕是 `B Layer` 中只包含了一部分你需要的接口、组件，你也可以很轻松的再 extend 一个 `D Layer`，用来重写你不需要的逻辑。

比如 B C 都是支付层，B 是支付宝支付，C 是微信支付。

在主项目中使用 `/api/order/pay` 接口。继承了 B 层时，调用此接口就是支付宝支付，继承 C 后就是微信支付。

亦或是 B 的接口是 `/api/order/pay/zfb` ，C 的接口是 `/api/order/pay/wx`，主项目中的接口就可以用来自由控制使用哪种支付方式时调起对应的接口。

对于自己的项目来说，这种分层方式，可以让你更加自由的控制代码开源程度以及自己多项目复用逻辑。

**对于出售源码时，也只需要出售对应层的代码，组合起来即可。**

对解决博客换主题的功能，更是不能再适合了，只要按开发的博客时使用的 Components，**组件名一一对应就可以了**。

当然，如果实际应用到项目上，还有类似数据库、多环境等问题**需要仔细斟酌**。

但 Layer 的分层结构已经显而易见的更简单、更直接，开发体验也更好了。

## 潜在的问题

对于简单的前端项目，或是不涉及复杂的数据库架构，Layer 的方式无疑是更优雅的。

既在文件结构上解耦了，同时继承（覆盖）时也很直接。

但如果涉及到多个接口服务，或是多个数据库服务，甚至前端业务也比较复杂。还要是仔细测试其兼容性。

毕竟虽然使用 `Layer` 在文件结构上分开的，但实际打包后是在同一个 `Nuxt` 服务里的，并不是类似微服务的那种形式。

话说回来，大部分使用者应该只是看中了 SSR 能力，可能不会使用 Nitro 构建大型的应用，尤其是对于公司来说，也不太信任 Node 的服务能力。

所以对于个人开发者来说，我觉得 `Layer` 是个锦上添花的利器。因为大部分业务不会太复杂，而且偏前端更多一些。自己封装好的各种功能的 `Layer` 信手拈来，开发效率大大提高，还不耽误二次开发。

于是我在给自己的[博客](https://blog.zzao.club)尝试增加了一个权限层 [auth layer](https://github.com/k7airos/zc-auth-layer) 后，才写下了这篇文章。

期待后续 Layer 的大放异彩。

