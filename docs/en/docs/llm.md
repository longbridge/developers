---
sidebar_position: 2.3
slug: /llm
sidebar_label: LLMs
sidebarCollapsed: true
sidebar_icon: sparkles
id: llm
---

# LLMs Components

We provide several components for LLMs (Large Language Models) that allow you to easily access and analyze financial data, real-time market data, and even enable AI to place orders.

<video src="https://pub.lbkrs.com/files/202503/SGozJNWBfYpta73i/longport-mcp.mp4" width="100%" autoplay loop controls  />

Yes, you can use our LLM components through the Longbridge Developers. Start today!

## LLMs Text

The OpenAPI documentation follows the [LLMs Text](https://llmstxt.org/) standard, providing [llms.txt](https://open.longbridge.com/llms.txt) and Markdown files for each document. Based on this LLMs Text, you can provide AI with a complete dictionary of Longbridge Developers documentation as a reference for AI-assisted development, enabling AI to generate more accurate code.

- [https://open.longbridge.com/llms.txt](https://open.longbridge.com/llms.txt) - Approximately 2104 tokens.

Each of our documents is also available in Markdown format. When accessing them, simply add the `.md` suffix to the URL.

For example:

- <https://open.longbridge.com/docs/getting-started.md>
- <https://open.longbridge.com/docs/quote/pull/static.md>

## Longbridge.com Markdown Access (AI-friendly)

In addition to OpenAPI docs, pages on [https://longbridge.com](https://longbridge.com) are also AI-friendly for markdown retrieval.

You can get markdown content in either way:

1. Add `.md` suffix to page URL
2. Send request header: `Accept: text/markdown`

Examples:

- [https://longbridge.com/en/topics.md](https://longbridge.com/en/topics.md)
- `curl -H "Accept: text/markdown" https://longbridge.com/quote/TSLA.US`

This is useful for LLM crawlers, RAG indexing, and tool-based content ingestion while keeping page structure clean.

### Demo

<video src="https://assets.lbkrs.com/uploads/030b2d42-c693-4290-aff1-9cfa6d819644/92fcb37035f4cc6fea390f63d18da7b5.mp4" width="100%" autoplay loop controls  />

### Using in Cursor

Open Cursor, open the command palette (`Command + Shift + P`), search for and select **Add New Custom Docs** and enter the Longbridge Developers LLMs Text address in the dialog box:

```
https://open.longbridge.com/llms.txt
```

Once added successfully, the Cursor Settings will look like this:

<img src="https://assets.lbkrs.com/uploads/5d5d037f-d8fb-42ed-aa5e-6c59bd65d066/scr-20250423-qrgl.png" />

Next, in an AI conversation, you can select the Docs you just added under the `docs` menu of **@Add Context**. This allows the AI to use these documents as context in subsequent conversations.

<img src="https://assets.lbkrs.com/uploads/4c3c37d5-ead7-4854-8c8d-e8e77cdcd967/scr-20250423-qoxl.png" />
