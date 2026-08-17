---
slug: financial-report-snapshot
title: 财报快照（AI 摘要 + 预测对比）
sidebar_position: 26
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取 AI 生成的财报摘要、营收/EBIT/EPS 预测对比（超预期/低于预期），以及关键财务指标。

<CliCommand>
longbridge financial-report snapshot AAPL.US
longbridge financial-report snapshot AAPL.US --report qf --year 2024 --period 4
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="financial_report_snapshot" />


## Parameters

> **SDK 方法参数。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 证券代码，例如 `AAPL.US` |
| report | string | 否 | 报告类型：`qf`（季报）/ `saf`（半年报）/ `af`（年报） |
| fiscal_year | uint32 | 否 | 财政年度，例如 `2024` |
| fiscal_period | string | 否 | 财政季度，例如 `1` / `2` / `3` / `4` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.financial_report_snapshot("AAPL.US", report="qf", fiscal_year=2024, fiscal_period="4")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncFundamentalContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncFundamentalContext.create(config)

    resp = await ctx.financial_report_snapshot("AAPL.US", report="qf", fiscal_year=2024, fiscal_period="4")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, FundamentalContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = FundamentalContext.new(config)
  const resp = await ctx.financialReportSnapshot('AAPL.US', { report: 'qf', fiscalYear: 2024, fiscalPeriod: '4' })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.fundamental.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             FundamentalContext ctx = FundamentalContext.create(config)) {
            var resp = ctx.getFinancialReportSnapshot("AAPL.US", "qf", 2024, "4").get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, fundamental::FundamentalContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = FundamentalContext::new(config);
    let resp = ctx.financial_report_snapshot("AAPL.US", Some("qf"), Some(2024), Some("4")).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#include <iostream>
#include <longbridge.hpp>

using namespace longbridge;
using namespace longbridge::fundamental;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            FundamentalContext ctx = FundamentalContext::create(config);
            ctx.financial_report_snapshot("AAPL.US", "qf", 2024, "4", [](auto resp) {
                if (resp) std::cout << "OK" << std::endl;
            });
        });
    std::cin.get();
}
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/longbridge/openapi-go/config"
	"github.com/longbridge/openapi-go/oauth"
	"github.com/longbridge/openapi-go/fundamental"
)

func main() {
	o := oauth.New("your-client-id").
		OnOpenURL(func(url string) { fmt.Println("Open this URL to authorize:", url) })
	if err := o.Build(context.Background()); err != nil {
		log.Fatal(err)
	}
	conf, err := config.New(config.WithOAuthClient(o))
	if err != nil {
		log.Fatal(err)
	}
	c, err := fundamental.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.FinancialReportSnapshot(context.Background(), "AAPL.US", "qf", 2024, "4")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>

## Response


### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "name": "苹果",
    "ticker": "AAPL",
    "fp_start": "2025.12.28",
    "fp_end": "2026.03.28",
    "currency": "USD",
    "report_desc": "概要：苹果（AAPL）的营业收入是 1112 亿（+16.6%）；每股收益是 2.01（+21.82%）。",
    "fo_revenue": {"value": "111184000000.0000", "yoy": "16.6", "cmp_desc": "", "est_value": ""},
    "fo_ebit": {"value": "35885000000.0000", "yoy": "21.28", "cmp_desc": "", "est_value": ""},
    "fo_eps": {"value": "2.0100", "yoy": "21.82", "cmp_desc": "", "est_value": ""},
    "fr_revenue": {"value": "111184000000.0000", "yoy": "16.6"},
    "fr_profit": {"value": "29578000000.0000", "yoy": "19.36"},
    "fr_roe_ttm": "141.4705",
    "fr_profit_margin": "26.6027",
    "fr_debt_assets_ratio": "71.3025"
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [FinancialReportSnapshotResponse](#FinancialReportSnapshotResponse) |
| 400    | 请求错误    | None   |

## Schemas

### FinancialReportSnapshotResponse

<a id="FinancialReportSnapshotResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| name | string | 否 | 公司名称 |
| ticker | string | 否 | 证券代码（不含市场后缀，例如 `AAPL`） |
| fp_start | string | 否 | 财政期开始日期，格式 `YYYY.MM.DD` |
| fp_end | string | 否 | 财政期结束日期，格式 `YYYY.MM.DD` |
| currency | string | 否 | 货币代码 |
| report_desc | string | 否 | AI 生成的财报摘要 |
| fo_revenue | object | 否 | 营收预测对比，见 [ForecastMetric](#ForecastMetric) |
| fo_ebit | object | 否 | EBIT 预测对比，见 [ForecastMetric](#ForecastMetric) |
| fo_eps | object | 否 | EPS 预测对比，见 [ForecastMetric](#ForecastMetric) |
| fr_revenue | object | 否 | 营收财务数据，见 [ReportedMetric](#ReportedMetric) |
| fr_profit | object | 否 | 净利润财务数据，见 [ReportedMetric](#ReportedMetric) |
| fr_operate_cash | object | 否 | 经营现金流，见 [ReportedMetric](#ReportedMetric) |
| fr_invest_cash | object | 否 | 投资现金流，见 [ReportedMetric](#ReportedMetric) |
| fr_finance_cash | object | 否 | 融资现金流，见 [ReportedMetric](#ReportedMetric) |
| fr_total_assets | object | 否 | 总资产，见 [ReportedMetric](#ReportedMetric) |
| fr_total_liability | object | 否 | 总负债，见 [ReportedMetric](#ReportedMetric) |
| fr_roe_ttm | string | 否 | 净资产收益率 TTM（百分比，例如 `141.47`） |
| fr_profit_margin | string | 否 | 净利率（百分比） |
| fr_profit_margin_ttm | string | 否 | 净利率 TTM（百分比） |
| fr_asset_turn_ttm | string | 否 | 资产周转率 TTM（百分比） |
| fr_leverage_ttm | string | 否 | 杠杆率 TTM（百分比） |
| fr_debt_assets_ratio | string | 否 | 资产负债率（百分比） |

### ForecastMetric

<a id="ForecastMetric"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| value | string | 否 | 实际值 |
| yoy | string | 否 | 同比增速（百分比，例如 `16.6`） |
| cmp_desc | string | 否 | 超预期/低于预期描述（可能为空） |
| est_value | string | 否 | 一致预期值（可能为空） |

### ReportedMetric

<a id="ReportedMetric"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| value | string | 否 | 数值 |
| yoy | string | 否 | 同比增速（百分比） |
