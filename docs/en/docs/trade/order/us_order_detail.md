---
slug: us_order_detail
title: US Order Detail
sidebar_position: 11
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

Get detail for a specific US order — execution history, order status, and any attached child orders.


<CliCommand>
# View US order detail
longbridge order detail 701276261045858304
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_order_detail" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| order_id | string | YES | Order ID |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_order_detail("701276261045858304")
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.USOrderDetail(ctx, "701276261045858304")
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>

## Response

Returns `USOrderDetailResponse` with the following fields:

| Field | Type | Description |
| ----- | ---- | ----------- |
| order | object | Full order object with status and fill details |
| order_histories | object[] | Historical status changes for the order |
| current_attached_order | object | Attached child order (e.g. bracket/OCO), if any |
