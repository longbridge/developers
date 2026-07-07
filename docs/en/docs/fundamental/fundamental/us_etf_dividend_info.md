---
slug: us_etf_dividend_info
title: US ETF Dividend Info
sidebar_position: 36
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

Get dividend information for a US ETF — TTM dividend yield, payout frequency, and fiscal year breakdown.

<CliCommand>
# ETF dividend info (US accounts)
longbridge dividend IVV.US
longbridge dividend SPY.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_etf_dividend_info" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | ETF symbol, e.g. `IVV.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_etf_dividend_info("IVV.US")
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
    resp, err := c.ETFDividendInfo(context.Background(), "IVV.US")
    if err != nil { log.Fatal(err) }
    fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>

## Response

Returns `UsETFDividendInfo` with the following fields:

| Field | Type | Description |
| ----- | ---- | ----------- |
| dividend_ttm | string | Trailing twelve-month dividend per share |
| dividend_yield_ttm | string | TTM dividend yield (%) |
| dividend_freq | string | Payout frequency (e.g. `Quarterly`) |
| currency | string | Currency code, e.g. `USD` |
| fiscal_year_info | object[] | Annual dividend breakdown by fiscal year |
