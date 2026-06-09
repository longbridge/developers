---
sidebar_position: -999
title: Overview
id: overview
sidebar_icon: book_open
---

Longbridge Developers provides programmatic interfaces for investors with research and development capabilities, enabling them to build trading or market analysis tools based on their own investment strategies. The platform covers the following categories:

- **Quote** — Real-time and historical quotes, market depth, candlesticks, options/warrants data, subscriptions
- **Fundamental** — Company profiles, financials, valuations, analyst ratings, market data, calendars
- **News & Contents** — Market news, community topics, sharelist management
- **Trade** — Create, amend, and cancel orders; query orders, executions, and assets
- **Account** — Portfolio analysis, price alerts, DCA plans, watchlist
- **CLI** — Command-line tool covering all of the above, plus quant backtesting and research
- **MCP** — Model Context Protocol integration for AI assistant workflows

## Interface Type

Longbridge provides diversified access methods such as HTTP / WebSockets interfaces for accessing the underlying services and SDK (Python / C++, etc.) encapsulated in the upper layer, allowing flexible choices.

## How to Enable OpenAPI

1. Log in to the [Longbridge App](https://longbridge.com/download) to complete the account opening process;

2. Log in to the [longbridge.com](https://longbridge.com) and enter the developer platform, complete the developer verification (OpenAPI permission application), and obtain a token.

## Quote Coverage

<table>
    <thead>
    <tr>
        <th>Market</th>
        <th>Symbol</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td width="160" rowspan="2">HK Market</td>
        <td>Securities (including equities, ETFs, Warrants, CBBCs)</td>
    </tr>
    <tr>
        <td>Hang Seng Index</td>
    </tr>
    <tr>
        <td rowspan="3">US Market</td>
        <td>Securities (including stocks, ETFs)</td>
    </tr>
    <tr>
        <td>Nasdsaq Index</td>
    </tr>
    <tr>
        <td>OPRA Options</td>
    </tr>
    <tr>
        <td rowspan="2">CN Market</td>
        <td>Securities (including stocks, ETFs)</td>
    </tr>
    <tr>
        <td>Index</td>
    </tr>
    </tbody>
</table>

## Trading

Supported trading functions include:

| Market    | Stock and ETF | Warrant & CBBC | Options |
| --------- | ------------- | -------------- | ------- |
| HK Market | ✓             | ✓              |         |
| US Market | ✓             | ✓              | ✓       |

## Rate Limit {#rate-limit}

| Category  | Limitation                                                                                                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Quote API | <ul><li>One account can only create one long link and subscribe to a maximum of 500 symbols at the same time</li><li>No more than 10 calls in a 1-second interval and the number of concurrent requests should not exceed 5</li></ul> |
| Trade API | <ul><li>No more than 30 calls in a 30-second interval, and the interval between two calls should not be less than 0.02 seconds</li></ul>                                                                                              |

:::success

The [OpenAPI SDK](https://open.longbridge.com/sdk) has done effective frequency control internally:

- Quote: The methods under `QuoteContext` will be actively controlled by the SDK according to the server's rate limit. When the request is too fast, the SDK will automatically delay the request. Therefore, you do not need to implement the frequency control details separately.
- Trade: The methods under `TradeContext` are not limited by the SDK. Due to the special nature of the trading order placement scenario, this is left to the user to handle.

:::

## Pricing {#pricing}

Longbridge does not charge any additional fees for activating or using interface services. You only need to [open a Longbridge Integrated A/C](https://longbridge.com/hk/download) and get OpenAPI service permissions to use it for free. See the [Pricing](/pricing) page for details on quote data subscription fees. For actual transaction fees, please contact the brokerage firm where you have opened your securities account.

## Other

The OpenAPI services are provided by Longbridge and the applicable affiliates (subject to the agreement).
openapi-trade.longbridge.com
