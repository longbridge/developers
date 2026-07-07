---
slug: /us_etf_files
title: 美股 ETF 文件
sidebar_position: 38
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning 僅限美股賬戶
此方法僅適用於美國數據中心賬戶。
:::

列出美股 ETF 的監管文件——招股書、事實說明書和年報。

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_etf_files" />

## 參數

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| counter_id | string | YES | ETF 代碼，如 `IVV.US` |
| size | int | NO | 最大返回文件數 |

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_etf_files("IVV.US")
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
    resp, err := c.ETFFiles(context.Background(), "IVV.US", nil)
    if err != nil { log.Fatal(err) }
    fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>
