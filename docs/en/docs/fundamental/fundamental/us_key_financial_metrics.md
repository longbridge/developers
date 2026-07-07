---
slug: us_key_financial_metrics
title: US Key Financial Metrics
sidebar_position: 34
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

Get key financial metrics for a US stock — revenue, net income, EPS, margins, and growth rates.

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_key_financial_metrics" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Stock symbol, e.g. `AAPL.US` |
| report | string | NO | Period: `annual` or `quarterly` (default: annual) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_key_financial_metrics("AAPL.US", report="annual")
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
    resp, err := c.KeyFinancialMetrics(context.Background(), "AAPL.US", "annual")
    if err != nil { log.Fatal(err) }
    fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>
