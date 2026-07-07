---
slug: us_crypto_overview
title: US Crypto Overview
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Longbridge US Accounts
This method is only available for US data-center accounts.
:::

Get overview data for a US crypto trading pair — all-time highs/lows, asset info, and currency details.

<SDKLinks module="quote" klass="QuoteContext" method="us_crypto_overview" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Crypto symbol, e.g. `DOGEUSD.BKKT` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
resp = ctx.us_crypto_overview("DOGEUSD.BKKT")
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.CryptoOverview(ctx, "DOGEUSD.BKKT")
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>

## Response Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| symbol | string | Trading-pair symbol |
| name | string | Asset name |
| ticker | string | Short ticker |
| base_asset | string | Base asset code |
| currency | string | Quote currency |
| all_time_high | string | All-time high price |
| all_time_high_date | string | Date of all-time high |
| all_time_low | string | All-time low price |
| all_time_low_date | string | Date of all-time low |
