---
slug: us_realized_pl
title: 美股已实现盈亏
sidebar_position: 11
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning 仅限美股账户
此方法仅适用于美国数据中心账户。
:::

获取美股账户已实现盈亏，按资产类别（股票/期权/加密货币）分组。

<SDKLinks module="trade" klass="TradeContext" method="us_realized_pl" />

## 参数

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| currency | string | 是 | 结算货币，例如 `USD` |
| category | string | 否 | 资产类别：`ALL` \| `STOCK` \| `OPTION` \| `CRYPTO`（默认：`ALL`） |

## 请求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_realized_pl("USD", category="STOCK")
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
cat := "STOCK"
resp, err := c.USRealizedPL(ctx, &trade.GetUSRealizedPL{Currency: "USD", Category: &cat})
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>
