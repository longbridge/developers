---
slug: us_query_orders
title: 美股历史委托
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

查询美股账户的历史委托和待成交委托，支持分页和筛选。

<SDKLinks module="trade" klass="TradeContext" method="us_query_orders" />

## 参数

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 否 | 按标的筛选，例如 `AAPL.US` |
| action | int | 否 | 方向筛选：`0`=全部，`1`=买入，`2`=卖出（默认：`0`） |
| start_at | int64 | 否 | 开始时间（Unix 秒）；`0` = 最近 90 天 |
| end_at | int64 | 否 | 结束时间（Unix 秒）；`0` = 当前时间 |
| query_type | int32 | 否 | 0=全部，1=待成交，2=已成交（默认：0） |
| page | int32 | 否 | 页码，从 1 开始（默认：1） |
| limit | int32 | 否 | 每页数量（默认：20） |

## 请求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
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
