---
slug: macroeconomic
title: 宏观经济历史数据
sidebar_position: 21
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取指定宏观经济指标的历史发布数据，包括实际值、预测值、前值和下次发布时间。

<CliCommand>
# 查询非农就业人数历史数据
longbridge macrodata 61744
# 指定日期范围
longbridge macrodata 61744 --start 2024-01-01 --end 2024-12-31
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="macroeconomic" />

## 参数

> **SDK 方法参数。**

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| indicator_code | string | 是 | 指标代码，来自 `macroeconomic_indicators` |
| start_date | string | 否 | 开始日期，格式 `YYYY-MM-DD` |
| end_date | string | 否 | 结束日期，格式 `YYYY-MM-DD` |
| offset | int | 否 | 分页偏移量，默认 0 |
| limit | int | 否 | 最大返回条数，默认 100，最大 100 |

## 请求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
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
    console.log('请访问此 URL 授权：' + url)
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("请访问：{url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = FundamentalContext::new(config);
    let resp = ctx.macroeconomic("61744", Some("2024-01-01"), Some("2024-12-31"), None, None).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
</Tabs>

## 响应

### 响应示例

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

## 数据结构

### MacroeconomicResponse

| 字段 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| info | MacroeconomicIndicator | 是 | 指标元数据 |
| data | Macroeconomic[] | 是 | 历史数据点列表 |
| count | int | 是 | 数据总条数 |

### Macroeconomic

| 字段 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| period | string | 是 | 统计周期（如 `2024-12-01`、`2024-Q4`） |
| release_at | int | 否 | 发布时间 Unix 时间戳 |
| actual_value | string | 是 | 实际值 |
| previous_value | string | 是 | 前值 |
| forecast_value | string | 是 | 市场预期值 |
