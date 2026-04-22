---
title: 'Longbridge CLI'
sidebar_label: '概述'
sidebar_position: 1
sidebar_icon: book_open
---

# Longbridge CLI

Longbridge CLI（`longbridge`）是面向 Longbridge OpenAPI 全端點的 AI 原生命令列工具，提供 120+ 條命令，覆蓋即時行情、基本面數據、帳戶管理與交易。適用於腳本自動化、AI Agent 工具呼叫及日常終端工作流。

**GitHub：** [longbridge/longbridge-terminal](https://github.com/longbridge/longbridge-terminal)

<a href="https://asciinema.org/a/912409" target="_blank">
  <img src="https://asciinema.org/a/912409.svg" alt="Longbridge CLI showcase" />
</a>

## 快速開始

參見[安裝說明](/zh-HK/docs/cli/install)了解平台安裝方式與鑑權配置。安裝後可直接執行任意命令：

```bash
# 查詢即時行情
longbridge quote TSLA.US NVDA.US

# 查看持倉
longbridge portfolio

# JSON 輸出（適用於腳本或 AI Agent）
longbridge quote AAPL.US --format json
```

## JSON 輸出

所有命令均支援 `--format json`，輸出機器可讀格式，方便管道傳遞、`jq` 處理或 AI Agent 呼叫：

```bash
longbridge positions --format json
longbridge quote TSLA.US NVDA.US --format json
```

## 標的代碼格式

標的代碼採用 `代碼.市場` 格式：

| 示例         | 市場                        |
| ------------ | --------------------------- |
| `TSLA.US`    | 美股                        |
| `700.HK`     | 港股                        |
| `600519.SH`  | A 股（上交所）              |
| `000568.SZ`  | A 股（深交所）              |
| `D05.SG`     | 新加坡                      |
| `BTCUSD.HAS` | 加密貨幣（Longbridge 專屬） |
