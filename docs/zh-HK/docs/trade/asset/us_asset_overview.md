---
slug: us_asset_overview
title: 美股資產概覽
sidebar_position: 10
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

獲取美股賬戶資產概覽——買入力、現金、股票、期權和加密貨幣。

<CliCommand>
# 美股賬戶資產概覽
longbridge positions
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_asset_overview" />

## 參數

無需參數。

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
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
