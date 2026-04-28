---
title: 'Longbridge CLI'
sidebar_label: '概述'
sidebar_position: 1
sidebar_icon: book_open
---

# Longbridge CLI

Longbridge CLI（`longbridge`）是面向 Longbridge OpenAPI 全端点的 AI 原生命令行工具，提供 120+ 条命令，覆盖实时行情、基本面数据、账户管理与交易。适用于脚本自动化、AI Agent 工具调用及日常终端工作流。

**GitHub：** [longbridge/longbridge-terminal](https://github.com/longbridge/longbridge-terminal)

<a href="https://asciinema.org/a/912409" target="_blank">
  <img src="https://asciinema.org/a/912409.svg" alt="Longbridge CLI showcase" />
</a>

## 快速开始

参见[安装说明](/zh-CN/docs/cli/install)了解平台安装方式与鉴权配置。安装后可直接运行任意命令：

```bash
# 查询实时行情
longbridge quote TSLA.US NVDA.US

# 查看持仓
longbridge portfolio

# JSON 输出（适用于脚本或 AI Agent）
longbridge quote AAPL.US --format json
```

## JSON 输出

所有命令均支持 `--format json`，输出机器可读格式，方便管道传递、`jq` 处理或 AI Agent 调用：

```bash
longbridge positions --format json
longbridge quote TSLA.US NVDA.US --format json
```

## 标的代码格式

标的代码采用 `代码.市场` 格式：

| 示例         | 市场                        |
| ------------ | --------------------------- |
| `TSLA.US`    | 美股                        |
| `700.HK`     | 港股                        |
| `600519.SH`  | A 股（上交所）              |
| `000568.SZ`  | A 股（深交所）              |
| `D05.SG`     | 新加坡                      |
| `BTCUSD.HAS` | 加密货币（Longbridge 专属） |
