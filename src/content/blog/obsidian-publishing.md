---
title: 从 Obsidian 到博客：让笔记成为可以分享的文章
description: 用 Markdown 管理文章、双向链接和图片，只发布你明确选中的内容。
date: 2026-11-22
category: 写作与工作流
tags: [Markdown, Obsidian]
---

## 文章就是一个 Markdown 文件

网站的文章放在 `src/content/blog/`。你可以在 Obsidian 中打开项目文件夹，或用导入命令将一篇选中的笔记复制进来。每篇文章顶部需要一段属性：

```yaml
---
title: 我的第一篇 STM32 开发笔记
description: 一句话说明这篇笔记解决了什么问题。
date: 2026-11-22
category: STM32
tags: [STM32, C语言]
draft: false
---
```

`draft: true` 的文章不会生成页面，也不会进入首页、博客列表或搜索索引。下划线开头的 Markdown 文件同样不作为文章载入。

> 草稿不会出现在网页中，但提交到公开 GitHub 仓库的源文件仍然是公开的。私人笔记、密码和未公开资料应保留在个人笔记库中。

## 支持的写法

常规 Markdown 的标题、列表、表格、引用、代码块和图片都可以使用。代码块写上语言名称，即可得到语法高亮。

```c
int main(void)
{
    /* 从一个最小、可验证的实验开始。 */
    return 0;
}
```

本站也兼容 Obsidian 中的 `[[文章文件名|显示名称]]`、`[[文章文件名#章节]]`、`![[图片.png]]` 和 `==高亮文本==`。例如：[[timer-basics|阅读定时器计算笔记]]。==只发布已经检查过的内容。==

文章链接使用文件名生成地址。建议采用 `timer-basics.md` 这样的简短名称。链接目标必须也已经导入并发布；文章转引、块引用和 Obsidian 插件专有语法暂不转换。

## 放入图片和视频

图片和视频统一放进 `public/media/`，图片文件名应唯一。Obsidian 图片嵌入会自动指向该目录；导入脚本也会复制选中笔记直接引用的本地附件。

标准 Markdown 图片请使用相对地址，例如从文章详情页访问媒体时：

```md
![开发板实物照片](../../media/my-board.jpg)
```

视频可以在项目的属性中填写 `video: media/my-demo.mp4`，项目详情页会显示带控制栏的播放器。博客正文也可以使用 HTML：

```html
<video controls preload="metadata" src="../../media/my-demo.mp4">
  你的浏览器不支持此视频，请下载后查看。
</video>
```

使用你有权发布的照片和视频。较大的视频更适合放在视频平台，再在文章中提供链接。当前项目没有录入真实实物照片或演示视频。

## 从现有笔记库导入

在项目目录执行以下命令，传入一篇明确选中的笔记；使用引号包住带空格的路径：

```sh
npm run import:note -- "D:/Notes/我的笔记.md" --vault "D:/Notes" --slug my-first-note
```

脚本只复制这一篇笔记及其直接引用的图片或视频，默认设置为草稿。它不会批量导入整个笔记库，也不会自动公开其他关联笔记。如果附件同名或不存在，导入会停止并说明原因。检查内容和属性后，将 `draft` 改为 `false`。

## 更新网站

本地预览运行 `npm run dev`；正式构建运行 `npm run build`。内容提交到 GitHub 的 `main` 分支后，部署流程会重新生成网站。首次使用需要在仓库的 Settings → Pages 中选择 GitHub Actions 作为部署来源。

框架配置可以参考 [Astro 的 GitHub Pages 官方部署文档](https://docs.astro.build/en/guides/deploy/github/)。
