---
sidebar_position: 2.3
slug: /llm
sidebar_label: LLMs
sidebarCollapsed: true
id: llm
sidebar_icon: sparkles
---

# LLMs 組件

我們提供了一些用於 LLM（大型語言模型）的組件，您可以輕鬆訪問和分析金融數據、實時市場數據，甚至可以讓 AI 提交訂單。

<video src="https://pub.lbkrs.com/files/202503/SGozJNWBfYpta73i/longport-mcp.mp4" width="100%" autoplay loop controls  />

是的，您可以通過 Longbridge Developers 使用我們的 LLM 組件，今天就開始吧！

## LLMs 文本

OpenAPI 文件遵循 [LLMs 文本](https://llmstxt.org/) 提供 [llms.txt](https://open.longbridge.com/llms.txt) 以及每個文件的 Markdown 文件，基於這個 LLMs 文本，你可以為 AI 提供 Longbridge Developers 完整的文件字典作為 AI 輔助生成開發的參考信息，這樣 AI 能生成出來的代碼可以更準確。

- [https://open.longbridge.com/llms.txt](https://open.longbridge.com/llms.txt) - 大約 2104 個 token。

我們的每個文件也都提供 Markdown 格式，當您訪問它們時，只需在 URL 後添加 `.md` 後綴。

例如：

- <https://open.longbridge.com/docs/getting-started.md>
- <https://open.longbridge.com/docs/quote/pull/static.md>

## longbridge.com 頁面 Markdown 取得（AI 友好）

除了 OpenAPI 文件，[https://longbridge.com](https://longbridge.com) 的頁面也支援面向 AI 的 Markdown 取得。

你可以透過兩種方式取得頁面 Markdown：

1. 在頁面 URL 後加上 `.md`
2. 請求時帶上 Header：`Accept: text/markdown`

範例：

- [https://longbridge.com/en/topics.md](https://longbridge.com/en/topics.md)
- `curl -H "Accept: text/markdown" https://longbridge.com/quote/TSLA.US`

這個能力適合 LLM 抓取、RAG 建索引，以及工具化讀取頁面內容，同時保持頁面結構清晰。

### 演示

<video src="https://assets.lbkrs.com/uploads/030b2d42-c693-4290-aff1-9cfa6d819644/92fcb37035f4cc6fea390f63d18da7b5.mp4" width="100%" autoplay loop controls  />

### Cursor 內使用

打開 Cursor，打開命令面板（`Command + Shift + P`）搜索並選擇 **Add New Custom Docs**，並在出來的對話框中輸入 Longbridge Developers 的 LLMs Text 地址：

```
https://open.longbridge.com/llms.txt
```

添加成功後，Cursor Settings 裡面會是這樣：

<img src="https://assets.lbkrs.com/uploads/5d5d037f-d8fb-42ed-aa5e-6c59bd65d066/scr-20250423-qrgl.png" />

接下來你可以在 AI 的會話中，**@Add Context** 的 `docs` 菜單下選擇剛才添加的 Docs，這樣接下來與 AI 的會話中，AI 將會使用這些文件作為上下文。

<img src="https://assets.lbkrs.com/uploads/4c3c37d5-ead7-4854-8c8d-e8e77cdcd967/scr-20250423-qoxl.png" />
