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

:::warning US Data-Center Accounts Only
This method is only available for US data-center accounts.
:::

Query historical and pending orders for US accounts with pagination and filtering.

<SDKLinks module="trade" klass="TradeContext" method="us_query_orders" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | NO | Filter by symbol, e.g. `AAPL.US` |
| action | int | NO | Direction filter: `0`=all, `1`=buy, `2`=sell (default: `0`) |
| start_at | int64 | NO | Start time (Unix seconds); `0` = last 90 days |
| end_at | int64 | NO | End time (Unix seconds); `0` = now |
| query_type | int | NO | `0`=all (incl. rejected), `1`=pending, `2`=filled only (default: `0`) |
| page | int | NO | Page number, 1-based (default: `1`) |
| limit | int | NO | Page size (default: `20`) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_query_orders()
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
