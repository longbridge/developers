---
slug: us_query_orders
title: 美股歷史委託
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

查詢美股賬戶的歷史委託和待成交委託，支持分頁和篩選。

<CliCommand>
# 查詢美股委託
longbridge order
# 篩選待成交委託
longbridge order --status pending
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_query_orders" />

## 參數

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 否 | 按標的篩選，例如 `AAPL.US` |
| action | int | 否 | 方向篩選：`0`=全部，`1`=買入，`2`=賣出（默認：`0`） |
| start_at | int64 | 否 | 開始時間（Unix 秒）；`0` = 最近 90 天 |
| end_at | int64 | 否 | 結束時間（Unix 秒）；`0` = 當前時間 |
| query_type | int32 | 否 | 0=全部，1=待成交，2=已成交（默認：0） |
| page | int32 | 否 | 頁碼，從 1 開始（默認：1） |
| limit | int32 | 否 | 每頁數量（默認：20） |

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_query_orders()
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.QueryUSOrders(ctx, &trade.GetUSHistoryOrders{Page: 1, Limit: 20})
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>
