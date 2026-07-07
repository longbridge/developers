---
slug: us_realized_pl
title: 美股已實現盈虧
sidebar_position: 11
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

獲取美股賬戶已實現盈虧，按資產類別（股票/期權/加密貨幣）分組。

<CliCommand>
# 美股已實現盈虧
longbridge profit-analysis realized
# 按股票類別篩選
longbridge profit-analysis realized --category stock
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_realized_pl" />

## 參數

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| currency | string | 是 | 結算貨幣，例如 `USD` |
| category | string | 否 | 資產類別：`ALL` \| `STOCK` \| `OPTION` \| `CRYPTO`（默認：`ALL`） |

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
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
