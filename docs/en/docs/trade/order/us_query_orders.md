---
slug: us_query_orders
title: US Order History
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning US Only
This method is only available for US data-center accounts.
:::

Query historical and pending orders for US accounts with pagination and filtering.

<SDKLinks module="trade" klass="TradeContext" method="us_query_orders" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | NO | Filter by symbol, e.g. `AAPL.US` |
| side | OrderSide | NO | Filter by side: Buy or Sell |
| start_at | int64 | NO | Start time (Unix seconds) |
| end_at | int64 | NO | End time (Unix seconds) |
| query_type | int32 | NO | 0=all, 1=pending, 2=filled (default: 0) |
| page | int32 | NO | Page number, 1-based (default: 1) |
| limit | int32 | NO | Page size (default: 20) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.query_us_orders()
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.QueryUSOrders(ctx, &trade.GetUSHistoryOrders{Page: 1, Limit: 20})
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>
