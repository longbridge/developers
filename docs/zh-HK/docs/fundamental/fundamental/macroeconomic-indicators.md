---
slug: macroeconomic-indicators
title: 宏觀經濟指標列表
sidebar_position: 20
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

列出 Longbridge 支持的宏觀經濟指標，可按國家/地區篩選。

<CliCommand>
# 列出全部指標
longbridge macrodata
# 篩選美國指標
longbridge macrodata --country US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="macroeconomic_indicators" />

## 參數

> **SDK 方法參數。**

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| country | MacroeconomicCountry | 否 | 按國家/地區篩選。不填返回全部。 |
| keyword | string | 否 | 按指標名稱模糊搜索（不區分大小寫） |
| offset | int | 否 | 分頁偏移量，默認 0 |
| limit | int | 否 | 每頁最大條數，默認 100，最大 1000 |

### MacroeconomicCountry

| 枚舉值 | 國家/地區 |
| ------ | --------- |
| HK | 香港 |
| CN | 中國大陸 |
| US | 美國 |
| EU | 歐元區 |
| JP | 日本 |
| SG | 新加坡 |

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder, MacroeconomicCountry

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.macroeconomic_indicators(country=MacroeconomicCountry.UnitedStates, limit=50)
print(resp)
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, FundamentalContext, OAuth, MacroeconomicCountry } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('請訪問此 URL 授權：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = FundamentalContext.new(config)
  const resp = await ctx.macroeconomicIndicators({ country: MacroeconomicCountry.UnitedStates })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, fundamental::FundamentalContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("請訪問：{url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = FundamentalContext::new(config);
    let resp = ctx.macroeconomic_indicators(None, None, None).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
</Tabs>

## 響應

### 響應示例

```json
{
  "count": 619,
  "list": [
    {
      "indicator_code": "62267",
      "country": "US",
      "name": "Non-Farm Payroll",
      "periodicity": "Monthly",
      "describe": "Employment situation report...",
      "importance": 3
    }
  ]
}
```

## 數據結構

### MacroeconomicIndicatorListResponse

| 字段 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| list | MacroeconomicIndicator[] | 是 | 指標列表 |
| count | int | 是 | 滿足條件的指標總數 |

### MacroeconomicIndicator

| 字段 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| indicator_code | string | 是 | 指標代碼（用於 `macroeconomic` 查詢） |
| country | string | 是 | 國家/地區名稱 |
| name | string | 是 | 指標名稱  |
| periodicity | string | 是 | 發布頻率（如 `Monthly`、`Quarterly`） |
| describe | string | 是 | 指標說明  |
| importance | int | 是 | 重要性（1=低、2=中、3=高） |

