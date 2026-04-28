---
sidebar_position: 2.3
slug: /llm
sidebar_label: LLMs
sidebarCollapsed: true
id: llm
sidebar_icon: sparkles
---

# LLMs 组件

我们提供了一些用于 LLM（大型语言模型）的组件，您可以轻松访问和分析金融数据、实时市场数据，甚至可以让 AI 提交订单。

<video src="https://pub.lbkrs.com/files/202503/SGozJNWBfYpta73i/longport-mcp.mp4" width="100%" autoplay loop controls  />

是的，您可以通过 Longbridge Developers 使用我们的 LLM 组件，今天就开始吧！

## LLMs 文本

OpenAPI 文档遵循 [LLMs 文本](https://llmstxt.org/) 提供 [llms.txt](https://open.longbridge.com/llms.txt) 以及每个文档的 Markdown 文件，基于这个 LLMs 文本，你可以为 AI 提供 Longbridge Developers 完整的文档字典作为 AI 辅助生成开发的参考信息，这样 AI 能生成出来的代码可以更准确。

- [https://open.longbridge.com/llms.txt](https://open.longbridge.com/llms.txt) - 大约 2104 个 token。

我们的每个文档也都提供 Markdown 格式，当您访问它们时，只需在 URL 后添加 `.md` 后缀。

例如：

- <https://open.longbridge.com/docs/getting-started.md>
- <https://open.longbridge.com/docs/quote/pull/static.md>

## longbridge.com 页面 Markdown 获取（AI 友好）

除了 OpenAPI 文档， [https://longbridge.com](https://longbridge.com) 的页面也支持面向 AI 的 Markdown 获取。

你可以通过两种方式获取页面 Markdown：

1. 在页面 URL 后追加 `.md`
2. 请求时带上 Header：`Accept: text/markdown`

示例：

- [https://longbridge.com/en/topics.md](https://longbridge.com/en/topics.md)
- `curl -H "Accept: text/markdown" https://longbridge.com/quote/TSLA.US`

这个能力适合 LLM 抓取、RAG 建索引、以及工具化读取页面内容，并且能保持页面结构清晰。

### 演示

<video src="https://assets.lbkrs.com/uploads/030b2d42-c693-4290-aff1-9cfa6d819644/92fcb37035f4cc6fea390f63d18da7b5.mp4" width="100%" autoplay loop controls  />

### Cursor 内使用

打开 Cursor，打开命令面板（`Command + Shift + P`）搜索并选择 **Add New Custom Docs**，并在出来的对话框中输入 Longbridge Developers 的 LLMs Text 地址：

```
https://open.longbridge.com/llms.txt
```

添加成功后，Cursor Settings 里面会是这样：

<img src="https://assets.lbkrs.com/uploads/5d5d037f-d8fb-42ed-aa5e-6c59bd65d066/scr-20250423-qrgl.png" />

接下来你可以在 AI 的会话中，**@Add Context** 的 `docs` 菜单下选择刚才添加的 Docs，这样接下来与 AI 的会话中，AI 将会使用这些文档作为上下文。

<img src="https://assets.lbkrs.com/uploads/4c3c37d5-ead7-4854-8c8d-e8e77cdcd967/scr-20250423-qoxl.png" />
