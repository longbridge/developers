---
slug: macroeconomic
title: 宏觀經濟歷史數據
sidebar_position: 21
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取指定宏觀經濟指標的歷史發布數據，包括實際值、預測值、前值和下次發布時間。

<CliCommand>
# 查詢非農就業人數歷史數據
longbridge macrodata 61744
# 指定日期範圍
longbridge macrodata 61744 --start 2024-01-01 --end 2024-12-31
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="macroeconomic" />

## 參數

> **SDK 方法參數。**

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| indicator_code | string | 是 | 指標代碼，來自 `macroeconomic_indicators` |
| start_date | string | 否 | 開始日期，格式 `YYYY-MM-DD` |
| end_date | string | 否 | 結束日期，格式 `YYYY-MM-DD` |
| offset | int | 否 | 分頁偏移量，默認 0 |
| limit | int | 否 | 最大返回條數，默認 100，最大 100 |

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.macroeconomic("61744", start_date="2024-01-01", end_date="2024-12-31")
print(resp)
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, FundamentalContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('請訪問此 URL 授權：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = FundamentalContext.new(config)
  const resp = await ctx.macroeconomic('61744', { startDate: '2024-01-01', endDate: '2024-12-31' })
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
    let resp = ctx.macroeconomic("61744", Some("2024-01-01"), Some("2024-12-31"), None, None).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
</Tabs>

## 響應示例

```json
{
  "count": 24,
  "info": {
    "indicator_code": "61744",
    "country": "US",
    "name": "Non-Farm Payroll",
    "periodicity": "Monthly",
    "describe": "...",
    "importance": 3
  },
  "data": [
    {
      "period": "2024-12-01",
      "release_at": 1735900200,
      "actual_value": "256000",
      "previous_value": "212000",
      "forecast_value": "165000"
    }
  ]
}
```

## 數據結構

### MacroeconomicResponse

| 字段 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| info | MacroeconomicIndicator | 是 | 指標元數據 |
| data | Macroeconomic[] | 是 | 歷史數據點列表 |
| count | int | 是 | 數據總條數 |

### Macroeconomic

| 字段 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| period | string | 是 | 統計週期（如 `2024-12-01`、`2024-Q4`） |
| release_at | int | 否 | 發布時間 Unix 時間戳 |
| actual_value | string | 是 | 實際值 |
| previous_value | string | 是 | 前值 |
| forecast_value | string | 是 | 市場預期值 |
