---
slug: us_company_dividends
title: US Company Dividends
sidebar_position: 37
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

Get dividend history for a US stock — TTM yield, payout count, and individual dividend records.

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_company_dividends" />

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
resp = ctx.us_company_dividends("AAPL.US")
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
    resp, err := c.CompanyDividends(context.Background(), "AAPL.US")
    if err != nil { log.Fatal(err) }
    fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>
