---
title: 通用问题
sidebar_position: 0
---

## Q1: 一定要开通真实账户才能调用 Longbridge Developers 吗？

不需要。平台提供**模拟账户**，无需开通真实证券账户即可完成行情与交易接口的开发调试。**模拟账户**支持港股、美股、A 股实时行情查询，以及港美股股票、ETF 等基础交易功能，适合接口联调与功能验证。

不过，模拟账户在交易撮合、资金规则等方面与真实环境存在差异，如需完整体验平台能力，建议同时开通真实账户。

## Q2: 如何开通模拟账户调试？

请访问 [开发者中心](https://open.longbridge.com/account/) 开启**模拟账户**并获得模拟账户对应的 App Key & Secret 以及 Access Token 等信息。

## Q3: 模拟调试的行情交易权限与真实账户相同吗？

行情相同，交易不同。

模拟账户和真实账户共用 App Key & Secret，不同 Access Token。其中，行情权限与 App Key & Secret 关联，交易权限与 Access Token 关联，因此模拟账户和真实账户下，行情权限相同，交易权限与证券账号关联，可能会不同。

## Q4: 模拟调试支持哪些市场和品种的行情和交易

行情：支持港股、美股、A 股通市场实时行情，其中，美股全美行情、港股 Level2 等高级行情也可通过在线行情商店购买对应行情权益后，通过 OpenAPI 获取行情数据。

交易：支持港美股股票、ETF、港股轮证交易，其中美股支持股票做空。美股 OTC、盘前盘后交易、期权交易在模拟账号下暂未支持。

## Q5: 接口调用频次及数量限制

请访问 [频率限制](/docs/#rate-limit) 查看具体描述。

## Q6: 多个账户情况下，接口调用频次如何限制

若客户持有多个证券账户，例如日内融或其他子账户，交易接口调用频次和数量限制按不同的证券账户统计和控制，行情接口则不受多账户影响，统一限制。

## Q7: 通过 Longbridge Developers 进行交易操作有额外收费吗

通过 OpenAPI 接入进行行情查询、交易等，我们不会收取额外的费用。交易手续费、平台费、行情权限等账户相关的费用，请以 App 以及官网提供的信息为准。

## Q8: 如何关闭 SDK 连接到服务器后的控制台下的权限表输出

您可以设置环境变量 `LONGBRIDGE_PRINT_QUOTE_PACKAGES` 为 `false`（或旧版 `LONGPORT_PRINT_QUOTE_PACKAGES`），或在代码中创建 `Config` 对象时设置 `enable_print_quote_packages` 为 `false`，来关闭控制台下的权限表输出。

## Q9: 我不会编程，如何才能访问 Longbridge Developers 平台的个股数据？

平台提供两种无需编程即可访问个股数据的方式：

**CLI（命令行工具）**

安装 [Longbridge CLI](/docs/cli)，通过简单命令即可查询行情数据，无需编写任何代码：

```bash
longbridge quote AAPL.US TSLA.US
longbridge static NVDA.US
```

**MCP（AI 工具集成）**

如果你日常使用 Claude、Cursor、ChatGPT 等 AI 工具，可以接入 [Longbridge MCP 服务](/zh-CN/docs/mcp)，配置完成后直接用自然语言向 AI 提问，由 AI 代你调用行情接口获取数据。

两种方式均需拥有 Longbridge 账户。
