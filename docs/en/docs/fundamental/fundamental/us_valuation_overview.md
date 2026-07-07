---
slug: us_valuation_overview
title: US Valuation Overview
sidebar_position: 31
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

Get valuation overview for a US stock — current valuation indicators and historical range.

<CliCommand>
# US valuation overview
longbridge valuation AAPL.US
longbridge valuation NVDA.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_valuation_overview" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Stock symbol, e.g. `AAPL.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_valuation_overview("AAPL.US")
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
package main

import (
    "context"
    "fmt"
    "log"

    "github.com/longbridge/openapi-go/config"
    "github.com/longbridge/openapi-go/oauth"
    "github.com/longbridge/openapi-go/fundamental"
)

func main() {
    o := oauth.New("your-client-id").
        OnOpenURL(func(url string) { fmt.Println("Open:", url) })
    if err := o.Build(context.Background()); err != nil {
        log.Fatal(err)
    }
    conf, _ := config.New(config.WithOAuthClient(o))
    c, _ := fundamental.NewFromCfg(conf)
    defer c.Close()
    resp, err := c.ValuationOverview(context.Background(), "AAPL.US")
    if err != nil { log.Fatal(err) }
    fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>

## Response

Returns `UsValuationOverview` with the following fields:

| Field | Type | Description |
| ----- | ---- | ----------- |
| indicator | string | Valuation indicator name |
| current_indicator | object | Current indicator value |
| range | int | Historical percentile range |
| date | string | Valuation date |
| ai_summary | string | AI-generated valuation summary |
