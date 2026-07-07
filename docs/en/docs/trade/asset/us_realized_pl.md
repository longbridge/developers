---
slug: us_realized_pl
title: US Realized P&L
sidebar_position: 11
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning US Data-Center Accounts Only
This method is only available for US data-center accounts.
:::

Get realized profit and loss for a US account, broken down by asset category.

<SDKLinks module="trade" klass="TradeContext" method="us_realized_pl" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| currency | string | YES | Settlement currency, e.g. `USD` |
| category | string | NO | Asset category: `ALL` \| `STOCK` \| `OPTION` \| `CRYPTO` (default: `ALL`) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_realized_pl("USD", category="STOCK")
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
cat := "STOCK"
resp, err := c.USRealizedPL(ctx, &trade.GetUSRealizedPL{Currency: "USD", Category: &cat})
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>
