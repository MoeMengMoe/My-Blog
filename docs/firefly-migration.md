# Firefly 迁移记录

迁移日期：2026-10-25。

- 原博客提交：`0206b11`。
- 新主题：Firefly 6.16.8。
- 上游提交：`cd920b035b475fe9a6cd3a88afb42cf9440bb8a9`（2026-10-22）。
- 迁移分支：`codex/migrate-firefly`。
- 原版备份分支：`backup/pre-upstream-20261025`。
- 新主题远端：`firefly`；博客远端 `origin` 与原 Fuwari 远端 `upstream` 均保留。

## 保留内容

原有三篇 Markdown 文章、两张文章源图片、关于页和 `public/` 下的原资源保留。
包括迁移前尚未提交的 `近况概要.md`。文章标题、发布日期、正文及现有 frontmatter 不改写。

原博客的两条已发布文章路径继续使用：

- `/posts/second/`
- `/posts/初见各位这里是moemeng/`

新增的未提交文章会按其文件名生成 `/posts/近况概要/`。
原 `/rss.xml`、`/archive/`、`/about/` 及域名 `https://moemeng.top/` 保持不变。

## 配置及兼容处理

- 个人配置迁入 `src/config/`，旧 `src/config.ts` 移除，避免遮蔽配置目录入口。
- 启用中文、原主题色 250、原壁纸、头像和站点图标。
- 字体通过 Astro Font API 引用原本地字体文件，不依赖在线字体服务。
- 保留完整中文字体，保证评论中的新字符也能正确显示。
- 保留 GitHub 导航头像、个人资料头像链接和标签页离开/返回问候。
- Waline 使用原服务地址、retro 头像、表情、必填字段、分页及反应选项。
- Waline 路径使用 `Astro.url.pathname`，沿用旧客户端默认的页面路径，包括尾部斜杠，
  而不是 Firefly 默认的无尾斜杠标识。未修改服务端评论数据。
- 沿用原图片同步脚本，但不再调用替换内容目录并递归触发构建的旧 wrapper。
- Pagefind 统一使用中文索引；旧文章中已有 `lang: en-us` 标记，不改写源文件，
  同时避免这些中文文章被分到独立索引而无法在中文站内搜索中找到。
- 新主题示例文章、示例动态与示例项目没有导入；示例页面、音乐、看板娘默认关闭。
- GitHub Actions 使用 Node 24，并运行完整 `pnpm build` 以包含搜索和构建后处理。

## 运行环境

项目的 `devEngines.runtime` 固定 Node 24.22.1，`packageManager` 固定 pnpm 11.22.0。
pnpm 安装项目时会下载本项目运行时；系统 Node 不变。
使用 `pnpm dev`、`pnpm check`、`pnpm build` 等命令会自动使用此运行时。
直接调用系统 `node` 或 `npx astro` 不会经过项目运行时选择，应优先使用 pnpm 脚本。

## 验证结果

- 原有文章、关于页和静态资源共 95 个文件的 SHA-256 与迁移前完全相同。
- 两条旧文章路径、三篇文章的 canonical 与 Waline 页面路径核对通过。
- RSS 包含三篇文章，RSS、Atom、归档和 Pagefind 产物生成正常。
- 桌面与 390px 手机视口检查通过，无横向溢出。
- 本地文章图片可用，Waline 评论表单成功初始化；未提交测试评论。
- 搜索“建站”同时返回《浅谈建站经历》和《初见各位，这里是Moemeng》。
- `pnpm check`、`pnpm type-check`、`biome ci ./src` 和 `pnpm build` 通过。

未推送源码，未执行发布命令。上线后的域名、缓存及服务端跨域策略应在正式发布后复查。

## 后续主题更新

迁移合并连接了 Firefly 的 Git 历史，后续无需再次做无共同历史的迁移。
先保存自己的改动，再更新：

```bash
git fetch firefly
git merge firefly/master
pnpm install --frozen-lockfile
pnpm check
pnpm type-check
pnpm build
```

合并时保留个人的 `src/config/`、文章、静态资源及上述评论路径兼容处理。
如果新版本改变依赖或运行时版本，应使用其新的锁文件并检查项目运行时配置。
冲突处理后再构建预览，不要直接用上游默认配置覆盖个人配置。

## 备份与回退

提交前的全部项目源文件和未提交文件另存于本机临时目录：
`%TEMP%\WebFuwari-migration-20261025\original-project`。
文章与原资源的 SHA-256 清单位于同级的 `protected-files.json`。

已提交的旧版可通过 `backup/pre-upstream-20261025` 分支访问。
该备份分支不包含当时未提交的文章和文档；回退时应同时保护当前工作区中的这些文件，
或从上述完整源文件备份中恢复。不要用强制重置或清理命令删除未提交内容。
