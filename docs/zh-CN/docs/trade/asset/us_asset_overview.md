---
slug: us_asset_overview
title: 美股资产概览
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Longbridge US 账户
此方法仅适用于美国数据中心账户。
:::

获取美股账户资产概览——买入力、现金、股票、期权和加密货币。

<CliCommand>
# 美股账户资产概览
longbridge positions
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_asset_overview" />

## 参数

无需参数。

## 请求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
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
