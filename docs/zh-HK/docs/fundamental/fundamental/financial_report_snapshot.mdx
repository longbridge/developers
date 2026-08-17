---
slug: financial-report-snapshot
title: 財報快照（AI 摘要 + 預測對比）
sidebar_position: 26
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取 AI 生成的財報摘要、營收/EBIT/EPS 預測對比（超預期/低於預期），以及關鍵財務指標。

<CliCommand>
longbridge financial-report snapshot AAPL.US
longbridge financial-report snapshot AAPL.US --report qf --year 2024 --period 4
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="financial_report_snapshot" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 證券代碼，例如 `AAPL.US` |
| report | string | 否 | 報告類型：`qf`（季報）/ `saf`（半年報）/ `af`（年報） |
| fiscal_year | uint32 | 否 | 財政年度，例如 `2024` |
| fiscal_period | string | 否 | 財政季度，例如 `1` / `2` / `3` / `4` |

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
| 400    | 請求錯誤    | None   |

## Schemas

### FinancialReportSnapshotResponse

<a id="FinancialReportSnapshotResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| name | string | 否 | 公司名稱 |
| ticker | string | 否 | 證券代碼（不含市場後綴，例如 `AAPL`） |
| fp_start | string | 否 | 財政期開始日期，格式 `YYYY.MM.DD` |
| fp_end | string | 否 | 財政期結束日期，格式 `YYYY.MM.DD` |
| currency | string | 否 | 貨幣代碼 |
| report_desc | string | 否 | AI 生成的財報摘要 |
| fo_revenue | object | 否 | 營收預測對比，見 [ForecastMetric](#ForecastMetric) |
| fo_ebit | object | 否 | EBIT 預測對比，見 [ForecastMetric](#ForecastMetric) |
| fo_eps | object | 否 | EPS 預測對比，見 [ForecastMetric](#ForecastMetric) |
| fr_revenue | object | 否 | 營收財務數據，見 [ReportedMetric](#ReportedMetric) |
| fr_profit | object | 否 | 淨利潤財務數據，見 [ReportedMetric](#ReportedMetric) |
| fr_operate_cash | object | 否 | 經營現金流，見 [ReportedMetric](#ReportedMetric) |
| fr_invest_cash | object | 否 | 投資現金流，見 [ReportedMetric](#ReportedMetric) |
| fr_finance_cash | object | 否 | 融資現金流，見 [ReportedMetric](#ReportedMetric) |
| fr_total_assets | object | 否 | 總資產，見 [ReportedMetric](#ReportedMetric) |
| fr_total_liability | object | 否 | 總負債，見 [ReportedMetric](#ReportedMetric) |
| fr_roe_ttm | string | 否 | 淨資產收益率 TTM（百分比，例如 `141.47`） |
| fr_profit_margin | string | 否 | 淨利率（百分比） |
| fr_profit_margin_ttm | string | 否 | 淨利率 TTM（百分比） |
| fr_asset_turn_ttm | string | 否 | 資產周轉率 TTM（百分比） |
| fr_leverage_ttm | string | 否 | 槓桿率 TTM（百分比） |
| fr_debt_assets_ratio | string | 否 | 資產負債率（百分比） |

### ForecastMetric

<a id="ForecastMetric"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| value | string | 否 | 實際值 |
| yoy | string | 否 | 同比增速（百分比，例如 `16.6`） |
| cmp_desc | string | 否 | 超預期/低於預期描述（可能為空） |
| est_value | string | 否 | 一致預期值（可能為空） |

### ReportedMetric

<a id="ReportedMetric"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| value | string | 否 | 數值 |
| yoy | string | 否 | 同比增速（百分比） |
