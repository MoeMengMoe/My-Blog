# 面包板上的帕秋莉

MoeMengMoe 的面包板日记，站点地址：<https://moemeng.top/>。

本项目于 2026-10-25 从 Fuwari 迁移到 [Firefly](https://github.com/CuteLeaf/Firefly) 6.16.8，
基于上游提交 `cd920b035b475fe9a6cd3a88afb42cf9440bb8a9`。
保留原有文章、关于页、文章链接、壁纸、头像、本地字体和 Waline 服务。

## 本地开发

项目固定使用 pnpm 11.22.0 和 Node 24.22.1。已安装的 pnpm 会根据项目配置下载所需版本，
不会替换系统全局 Node。首次安装需要联网。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## 写文章

```bash
pnpm new-post "文章标题"
```

文章保存在 `src/content/posts/`。旧文章无需修改文件名或 frontmatter。
新文章会自动生成 `slug`，可以在发布前调整；已发布文章的 slug 应保持稳定。

文章图片继续放在同级子目录，使用相对路径，例如：

```markdown
![示例](文章标题/photo.png)
```

开发和构建时会运行原有图片同步脚本；正文和 frontmatter 的图片由 Astro 原生处理，
不再临时替换 `src/content`，也不再重复构建。

## 配置

Firefly 将原来的 `src/config.ts` 拆分到了 `src/config/`：

| 配置文件 | 用途 |
| --- | --- |
| `siteConfig.ts` | 标题、域名、语言、主题色、页面开关 |
| `profileConfig.ts` | 头像、个人简介、社交链接 |
| `navBarConfig.ts` | 导航栏、搜索 |
| `backgroundWallpaper.ts` | 桌面和手机壁纸 |
| `commentConfig.ts` | Waline 服务与评论选项 |
| `fontConfig.ts` | 本地霞鹜文楷与 JetBrains Mono |
| `sidebarConfig.ts` | 资料、分类、标签与文章目录 |

新主题的示例社交、动态、项目、相册、打赏等页面默认关闭。
需要时在 `siteConfig.ts` 中开启并填写自己的配置和内容。

## 检查、构建和部署

```bash
pnpm check
pnpm type-check
pnpm build
pnpm preview
```

`pnpm build` 包含图片同步、GitHub 卡片缓存、图片占位色、Astro 静态构建、
资源整理和 Pagefind 搜索索引生成，产物在 `dist/`。

原有发布命令继续保留：

```powershell
pnpm run deploy:gh-pages
```

推送源码不会自动发布。GitHub Actions 在 `main` 和迁移分支上运行检查与完整构建。
发布命令会将静态产物推送到原仓库的 `gh-pages` 分支。

迁移范围、兼容处理和后续更新方法见 [迁移记录](docs/firefly-migration.md)。

## 上游与许可

- 主题：[CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly)，基于 [saicaca/fuwari](https://github.com/saicaca/fuwari)。
- 主题源码遵循项目中的 [MIT License](LICENSE)。
- 本站文章保持原有 CC BY-NC-SA 4.0 许可；图片及其他资源保留各自的权利归属。
