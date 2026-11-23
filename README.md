# MCU / NOTES · 嵌入式个人技术网站

基于 Astro 构建的极简嵌入式个人作品集与技术博客，采用浅色纸感低饱和度界面与响应式布局，面向 STM32、C 语言、外设驱动与硬件项目记录。

包含首页、项目作品集与详情页、Markdown 技术博客（支持标签筛选与代码复制）、Obsidian 常用语法支持、图片与 HTML5 视频展示、以及本地静态全文搜索。

仓库默认配置为 `lxygu10101-cell/mcu-blog`，GitHub Pages 地址为 https://lxygu10101-cell.github.io/mcu-blog/ 。

## 本地使用

需要 Node.js 24 或更新版本。

```sh
npm ci
npm run dev
```

打开终端输出的地址（默认 http://127.0.0.1:4321/mcu-blog/）。

```sh
npm test
npm run build
npm run preview
```

## 发布到 GitHub Pages

1. 将项目根目录的文件提交到 `mcu-blog` 仓库的 `main` 分支，保留 `.github/workflows/deploy.yml`。
2. 进入仓库 Settings → Pages，在 Build and deployment 的 Source 中选择 **GitHub Actions**。
3. 提交更改或在 Actions 中运行 **Build and deploy blog**，等待 build 和 deploy 均成功。
4. 打开部署任务给出的 URL，确认首页、项目、博客、文章详情、关于和搜索页均可正常访问。

工作流根据 `GITHUB_REPOSITORY` 自动计算用户名和仓库子路径。如果改名为 `用户名.github.io`，会改用根路径。自定义域名时，构建前设置 `SITE_URL=https://你的域名` 与 `SITE_BASE=/`。

配置依据：[Astro 官方部署文档](https://docs.astro.build/en/guides/deploy/github/)。无需个人访问令牌，部署使用 GitHub Actions 提供的短期权限。

## 更新个人内容

- 站点名称、导航与 GitHub 链接：`src/lib/site.ts`
- 个人简介与关于页：`src/pages/about/index.astro`
- 技术文章：`src/content/blog/*.md`
- 嵌入式项目：`src/content/projects/*.md`
- 图片与视频：`public/media/`

示例项目和配图均标注为模板或概念示意图，没有虚构作者项目成果。发布真实作品时替换相应 Markdown、封面与 `status` 属性；填写 `repository` 可显示源码链接，填写 `video: media/demo.mp4` 可显示演示视频播放器。

文章属性示例：

```yaml
---
title: 一篇新的开发笔记
description: 说明这篇文章解决的问题。
date: 2026-11-22
category: STM32
tags: [STM32, C语言]
draft: false
---
```

## Obsidian 工作流

可直接编辑项目内的 Markdown；兼容 `[[note|名称]]`、章节链接、`![[image.png]]` 与 `==高亮==`。不转换块引用、笔记转引或第三方插件语法。双链目标使用文章文件名，必须已发布；附件文件名必须唯一。

导入一篇现有笔记：

```sh
npm run import:note -- "D:/Notes/选中的笔记.md" --vault "D:/Notes" --slug my-note
```

仅复制指定笔记及其直接嵌入的图片或视频，生成新草稿属性；原属性不保留。不会递归导入关联笔记，也不会同步整个笔记库。检查内容后将 `draft` 改为 `false` 即可发布。

**注意：** `draft: true` 只阻止生成网页；公开仓库内的源文件仍是公开的。请勿将私人笔记库、`.obsidian`、凭据或私人素材提交到仓库。

## 静态搜索

搜索索引在构建时由已发布文章和项目正文生成，支持中文子串、多关键词、标签与标题检索。无第三方搜索服务，输入不会上传服务器。文章更新后需重新构建。
