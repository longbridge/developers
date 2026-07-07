---
slug: us_crypto_overview
title: 美股加密货币概览
sidebar_position: 10
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

获取美股加密货币交易对的概览信息——历史最高/最低价、资产详情和货币信息。

<SDKLinks module="quote" klass="QuoteContext" method="us_crypto_overview" />

## 参数

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 加密货币交易对，例如 `DOGEUSD.BKKT` |

## 请求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
resp = ctx.us_crypto_overview("DOGEUSD.BKKT")
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.CryptoOverview(ctx, "DOGEUSD.BKKT")
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>
