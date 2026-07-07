---
title: General
sidebar_position: 0
---

## Q1: Do I need to open a live account to call Longbridge Developers?

No. The platform provides a **paper account** — you can develop and debug quote and trading interfaces without opening a real securities account. The **paper account** supports real-time quotes for HK, US, and A-share markets, as well as basic trading functionality for HK and US stocks and ETFs, making it suitable for API integration and feature verification.

That said, the paper account differs from the live environment in areas such as order matching and cash rules. If you want to experience the platform's full capabilities, we recommend opening a live account as well.

## Q2: How to open a paper account for debugging?

Please visit [Development Center](https://open.longbridge.com/dashboard/) to enable the paper account and obtain the corresponding App Key & Secret and Access Token.

## Q3: Are the trading permissions for simulation debugging the same as for real accounts?

Quote is the same, trading might be different.

Paper accounts and live accounts share the same App Key & Secret, but have different Access Tokens. Quote permissions are associated with the App Key & Secret, while trading permissions are associated with the Access Token. Therefore, under paper accounts and live accounts, quote permissions are the same, but trading permissions are associated with the securities account and may differ.

## Q4: Which markets and types of securities are supported for quote and trading in paper account debugging?

Market: Supports real-time market data for Hong Kong stocks, US stocks, and A-share markets. For advanced market data such as full US market data and Hong Kong Level2 data, they can be purchased through the online market store and accessed via OpenAPI.

Trading: Supports trading of Hong Kong and US stocks, ETFs, Hong Kong warrant trading, and US options. Short selling is supported for US stocks. OTC stocks and pre & post market trading are not supported in paper accounts.

## Q5: Interface call frequency limits

Please visit [Rate Limit](docs/#rate-limit) for specific descriptions.

## Q6: How are interface call frequency limits applied in the case of multiple accounts?

If a customer holds multiple securities accounts, such as intraday financing or other sub-accounts, the trading interface call frequency limits are calculated and controlled based on different securities accounts, while quote interface calls are not affected by multiple accounts and are uniformly limited.

## Q7: Are there additional charges for trading operations through Longbridge Developers?

We do not charge additional fees for accessing market queries, trading, etc., via OpenAPI. For account-related fees such as trading commissions, platform fees, and market permissions, please refer to the information provided by the app and the official website.

## Q8: How to disable the permission table output in the console after the SDK connects to the server?

You can set the environment variable `LONGBRIDGE_PRINT_QUOTE_PACKAGES` to `false` (or legacy `LONGPORT_PRINT_QUOTE_PACKAGES`), or set `enable_print_quote_packages` to `false` when creating the `Config` object in the code to disable the permission table output in the console.

## Q9: I don't know how to code. How can I access stock data from the Longbridge Developers platform?

The platform offers two ways to access stock data without writing any code:

**CLI (Command-line Tool)**

Install the [Longbridge CLI](/docs/cli) and query market data with simple commands — no programming required:

<CliCommand>
longbridge quote AAPL.US TSLA.US
longbridge static NVDA.US
</CliCommand>

**MCP (AI Tool Integration)**

If you use AI tools like ChatGPT, Claude, or Cursor, connect the [Longbridge MCP service](/docs/mcp). In ChatGPT, search `longbridge` in Apps or open the [Longbridge ChatGPT App](https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef) directly to authorize; in other clients, complete MCP setup and then ask in plain language so the AI can query market data on your behalf.

Both methods require a Longbridge account.
