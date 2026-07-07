---
slug: us_asset_overview
title: US Asset Overview
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

Get an overview of US account assets — buying power, cash, stocks, options, and crypto.

<CliCommand>
# US account asset overview
longbridge positions
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_asset_overview" />

## Parameters

No parameters required.

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_asset_overview()
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.USAssetOverview(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>

## Response

Returns `USAssetOverview` with the following fields:

| Field | Type | Description |
| ----- | ---- | ----------- |
| account_type | string | Account type identifier |
| asset_timestamp | datetime | Snapshot time of the asset data |
| cash_buy_power | string | Available buying power (cash) |
| cash_list | object[] | Cash balances by currency |
| crypto_list | object[] | Crypto holdings with quantity and value |
