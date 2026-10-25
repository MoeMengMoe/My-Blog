# 博客写作、发布与 Git 提交指南

项目已迁移到 Firefly 6.16.8，配置文件位于 `src/config/`。
首次运行先执行 `pnpm install --frozen-lockfile`，项目会自动准备 pnpm 11 和 Node 24。
详细配置与迁移说明见 [迁移记录](firefly-migration.md)。

## 写文章

```bash
pnpm new-post "文章标题"
```

会在 `src/content/posts/` 下创建 `.md` 文件，自动生成 frontmatter：

```yaml
---
title: 文章标题          # 标题
published: 2026-05-24   # 发布日期
description: ''         # 摘要
image: ''               # 封面图（可选）
tags: []                # 标签
category: ''            # 分类
draft: false            # true=草稿（构建时跳过）
lang: ''                # 语言
slug: wen-zhang-biao-ti  # 新文章自动生成；发布后保持稳定
---
```

填好 frontmatter，在 `---` 下方写 Markdown 正文即可。

## 放图片

图片放在文章同级的目录里，例如文章是 `src/content/posts/近况概要.md`，图片就放 `src/content/posts/近况概要/photo.png`。

文中引用：`![描述](近况概要/photo.png)`

开发和构建时会自动把图片复制到 `public/assets/posts/`。
Markdown 正文和封面中的相对图片由 Astro 原生处理，源文件不会被改动。

## 本地预览

```bash
pnpm dev
```

草稿（`draft: true`）在开发模式下可见。

## 构建与发布

```bash
pnpm run deploy:gh-pages
```

这条命令会依次执行：
1. **构建** — `astro build` + Pagefind 搜索索引
2. **部署** — 将 `dist/` 推送到 GitHub `gh-pages` 分支

> 推送到 `gh-pages` 分支后 GitHub Pages 会自动上线。推送到 `main` 分支只会触发 CI 检查（build + lint），不会自动部署。

## Git 提交规范

### 提交

```bash
git add <文件路径>       # 暂存
git commit -m "类型: 简短描述"
```

commit message 格式采用 conventional commits：

| 类型 | 场景 |
|---|---|
| `feat` | 新功能 |
| `fix` | 修 bug |
| `chore` | 杂项（清理、工具、配置） |
| `refactor` | 重构 |
| `style` | 样式/排版改动 |
| `docs` | 文档 |

示例：
- `feat: add spoiler text support`
- `fix: rss missing base path`
- `chore: clean up demo posts`
- `style: increase base font size`

### 推送

```bash
git push origin main
```

推送到 `main` 会触发 GitHub Actions 运行 `astro check` + `astro build`，**不会自动部署到线上**。

```bash
pnpm run deploy:gh-pages
```

构建并部署到线上，**不要用 git push 来部署**。

### 不要提交的文件

- `tmp-katex-fonts.css`（临时文件）
- `node_modules/`
- `dist/`
- `.tmp_content_build/`
