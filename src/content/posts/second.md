---
title: 浅谈建站经历
published: 2025-12-04
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: 'en-us' 
---

# 前言

这篇文章主要是介绍我是如何建站的

本站源代码托管在`GitHub`，生成的静态内容放在了另一个仓库。域名是在`NameSilo`购入并续费的，托管在`Cloudflare`。使用的评论系统是`Waline`，数据库部署在`leancloud国际版`，云函数部署在`Netlify`。

为什么这样部署呢？因为省钱！

算一笔账：

| Cloudflare Zero Trust Free Plan | 0           |
| ------------------------------- | ----------- |
| Github                          | 0           |
| Leancloud developing plan       | 0           |
| Netlify Personal                | 0           |
| Namesilo Domain                 | 8$ per year |

> 如果使用类似is-a-dev的二级域名或者直接使用GitHub Pages的二级域名，直接免费
>
> 考虑到这些域名在国内的解析成功率不高，建议自购域名续费
>
> 注意，国内平台这些功能多数要备案，想避免麻烦请使用国际平台
>
> 域名注册坑比较多，尤其是续费，请务必关注

# 技术栈

- Node.js
- Javascript
- Html
- Cloud Computing
- Git
- AI Coding

# 操作思路

> 并非喂饭教程
>
> 如果你对以上云平台了解不多，不建议尝试**使用静态页面部署博客**。你可以尝试租用云服务器使用WordPress建站，相对简单

## 初始化

目前有多种静态博客平台，比如`Hexo`、`Hugo`、`Astro`等，本站是通过`Astro`建立的，故以此为例

**注意，我在建站过程中使用了AI工具，如果你在复现时遇到问题，可以尝试使用AI解答你的困惑**

### Git

我使用的模板是`Fuwari`（[saicaca/fuwari: ✨A static blog template built with Astro.](https://github.com/saicaca/fuwari)）

然而，这个模板暂时没有接入`Waline`评论系统，但是在Pull request区有开发者提供了接入，故我拉取了这个暂时还未并入主分支的仓库[cimorn/WebFuwari: ✨A static blog template built with Astro.](https://github.com/cimorn/WebFuwari/tree/main)

找一个合适的空文件夹

```
git clone https://github.com/cimorn/WebFuwari.git
```

具体其他部署可参考项目主页[saicaca/fuwari: ✨A static blog template built with Astro.](https://github.com/saicaca/fuwari)

提示：需要安装npm包管理工具和pnpm工具

## 个性化

个性化参考文档或者问AI

#### 踩坑补充

- 字体和图片要么自托管要么图床，做好路径规划，不然容易丢图
- 标签栏的动态变化通常需要js脚本

## 部署

这是本篇博客重点所在

### GitHub Pages 部署

在开始之前，需要先确保你有一个 GitHub 账户，并且能够创建仓库。你可以通过以下步骤将博客部署到 GitHub Pages：

1. **创建仓库**
    在 GitHub 上创建一个新的仓库，命名为你想要的网站名称。比如，如果你的域名是 `example.com`，那么可以创建一个名为 `example.github.io` 的仓库。

2. **上传代码**
    将 `Astro` 项目的代码推送到 GitHub 仓库中。可以使用以下命令将代码推送到 GitHub：

   ```bash
   git init
   git remote add origin https://github.com/yourusername/example.github.io.git
   git add .
   git commit -m "Initial commit"
   git push -u origin master
   ```

3. **启用 GitHub Pages**
    在 GitHub 仓库页面，进入 "Settings"（设置）> "Pages" 部分，选择 `main` 分支并点击 "Save" 来启用 GitHub Pages。之后，GitHub 会自动为你生成一个静态网站。

### Cloudflare 配置

1. **添加 DNS 记录**
    在 `NameSilo` 购买域名后，将其添加到 `Cloudflare` 中进行 DNS 管理。进入 Cloudflare 仪表盘，选择 "Add site" 并添加你的域名。

   需要先在`NameSilo`解开域名锁，需要填写个人信息（使用地址生成器，避免信息泄露），将解析记录转到Cloudflare

2. **配置 Pages**
    在Workers和Pages选项卡下新建项目，注意要选择下方小字建设Pages

   注意填写的仓库地址必须是生成的静态界面，通常文件较源代码少，通常是`pnpm run build`的产物

   在自定义域名

3. **HTTPS 配置**
    Cloudflare 会自动为你的域名启用 SSL/TLS 加密服务，确保你的站点支持 HTTPS。

### Waline 评论系统接入

由于选择了 `Waline` 作为评论系统，可以按照以下步骤进行配置：

参考官方文档[快速上手 | Waline](https://waline.js.org/guide/get-started/)（Vercel也可，但在国内速度不如Netlify）

使用CDN加载评论组件[通过 CDN 导入 Waline | Waline](https://waline.js.org/cookbook/import/cdn.html)

### 接入评论到界面

使用AI提示，在ts主配置文档填写serverURL即可

# 总结

总之就是这么个流程，遇到问题可以给我留言。

可以直接在下面留言，务必留邮箱，但我不常看

或者通过GitHub找到我发邮件。





