---
slug: macroeconomic-indicators
title: 宏观经济指标列表
sidebar_position: 20
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

列出 Longbridge 支持的宏观经济指标，可按国家/地区筛选。

<CliCommand>
# 列出全部指标
longbridge macrodata
# 筛选美国指标
longbridge macrodata --country US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="macroeconomic_indicators" />

## 参数

> **SDK 方法参数。**

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| country | MacroeconomicCountry | 否 | 按国家/地区筛选。不填返回全部。 |
| keyword | string | 否 | 按指标名称模糊搜索（不区分大小写） |
| offset | int | 否 | 分页偏移量，默认 0 |
| limit | int | 否 | 每页最大条数，默认 100，最大 1000 |

### MacroeconomicCountry

| 枚举值 | 国家/地区 |
| ------ | --------- |
| HK | 香港 |
| CN | 中国大陆 |
| US | 美国 |
| EU | 欧元区 |
| JP | 日本 |
| SG | 新加坡 |

## 请求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder, MacroeconomicCountry

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
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
    console.log('请访问此 URL 授权：' + url)
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("请访问：{url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = FundamentalContext::new(config);
    let resp = ctx.macroeconomic_indicators(None, None, None).await?;
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
  "count": 619,
  "list": [
    {
      "indicator_code": "61744",
      "country": "US",
      "name": "Non-Farm Payroll",
      "periodicity": "Monthly",
      "describe": "Employment situation report...",
      "importance": 3
    }
  ]
}
```

## 数据结构

### MacroeconomicIndicatorListResponse

| 字段 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| list | MacroeconomicIndicator[] | 是 | 指标列表 |
| count | int | 是 | 满足条件的指标总数 |

### MacroeconomicIndicator

| 字段 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| indicator_code | string | 是 | 指标代码（用于 `macroeconomic` 查询） |
| country | string | 是 | 国家/地区名称 |
| name | string | 是 | 指标名称  |
| periodicity | string | 是 | 发布频率（如 `Monthly`、`Quarterly`） |
| describe | string | 是 | 指标说明  |
| importance | int | 是 | 重要性（1=低、2=中、3=高） |

