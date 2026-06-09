---
sidebar_position: -999
title: 平台介绍
id: getting_started_introduce
sidebar_icon: book_open
---

Longbridge Developers 为有研发能力的投资者提供程序化接口，助力投资者根据自身投资策略搭建交易或行情策略分析工具。平台覆盖以下类别：

- **行情**（Quote）— 实时与历史行情、盘口、K 线、期权/轮证数据、订阅推送
- **基本面**（Fundamental）— 公司概况、财务数据、估值、分析师评级、市场数据、日历
- **资讯与社区**（News & Contents）— 市场资讯、社区话题、自选股管理
- **交易**（Trade）— 创建/修改/撤销订单，查询订单、成交、资产等
- **账户**（Account）— 盈亏分析、股价提醒、定投计划、自选股
- **CLI** — 命令行工具，覆盖以上所有功能，并额外支持量化回测与研究
- **MCP** — Model Context Protocol，用于 AI 助手工作流集成

## 接口类型

Longbridge 提供接入底层服务的 HTTP / WebSockets 接口以及封装在上层的 SDK（Python / C++ ...）等多种接入方式，灵活选择。

## 如何开通

1. 登录 [Longbridge App](https://longbridge.com/download) 完成开户；
2. 登录 [longbridge.com](https://longbridge.com) 进入开发者平台，完成开发者认证即 OpenAPI 权限申请，获取令牌。

## 行情覆盖

<table>
    <thead>
      <tr>
          <th width="160">市场</th>
          <th>标的</th>
      </tr>
    </thead>
    <tbody>
    <tr>
        <td width="160" rowspan="2">港股</td>
        <td>证券类产品（含股票、ETFs、窝轮、牛熊、界内证）</td>
    </tr>
    <tr>
        <td>恒生指数</td>
    </tr>
    <tr>
        <td rowspan="3">美股</td>
        <td>证券类产品（含纽交所、美交所、纳斯达克上市的股票、ETFs）</td>
    </tr>
    <tr>
        <td>纳斯达克指数</td>
    </tr>
    <tr>
        <td>OPRA 期权</td>
    </tr>
    <tr>
        <td rowspan="2">A 股</td>
        <td>证券类产品（含股票、ETFs）</td>
    </tr>
    <tr>
        <td>指数</td>
    </tr>
    </tbody>
</table>

## 交易标的类别

目前 OpenAPI 支持交易以下标的类别：

| 市场     | 股票 ETF | 权证 | 期权 |
| -------- | -------- | ---- | ---- |
| 香港市场 | ✓        | ✓    |      |
| 美国市场 | ✓        | ✓    | ✓    |

## 频率限制 {#rate-limit}

| 类别         | 限制规则                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| 行情相关 API | <ul><li>一个账号同时只能建立一个长连接，最多同时订阅 500 个标的</li><li>1 秒内不超过 10 次调用，并发请求数不超过 5</li></ul> |
| 交易相关 API | <ul><li>30 秒内累计不超过 30 次调用，且每两次调用之间间隔不小于 0.02 秒</li></ul>                                            |

:::success

我们 [OpenAPI SDK](https://open.longbridge.com/sdk) 内部已经做了有效的频率控制：

- 行情类：`QuoteContext` 下的接口，SDK 内部会按照服务端的频率限制来主动控制，当请求过快的时候，SDK 会自动延迟请求。因此你可以不需要额外实现频率控制细节。
- 交易类：`TradeContext` 下的接口，SDK 没有做限制，由于交易下单场景特殊性，将这个交由用户自行处理。

:::

## 使用费用 {#pricing}

Longbridge 不针对接口服务额外收取开通或使用费用，只需[开通 Longbridge 综合账户](https://longbridge.com/hk/download)及 OpenAPI 服务权限后即可免费使用。行情数据订阅费用详见[定价页面](/zh-CN/pricing)。实际交易费率请咨询您开通证券账户的券商。

## 其他

OpenAPI 服务由 Longbridge 及其适用的关联公司提供（具体以协议为准）。
