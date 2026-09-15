# Macroeconomic Indicators Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add SDK and CLI documentation for the two new macroeconomic indicator APIs (SDK v4.3.1) and the new `macroeconomic` CLI command, plus update changelog and CLI release notes across all three languages (en / zh-CN / zh-HK).

**Architecture:** New SDK docs go under `docs/{lang}/docs/fundamental/fundamental/`; new CLI docs go under `docs/{lang}/docs/cli/fundamentals/`. Changelog and release-notes files are prepended in-place. All files are in the worktree at `.worktrees/docs-macroeconomic/`.

**Tech Stack:** VitePress Markdown, `<CliCommand>`, `<SDKLinks>`, `<Tabs>/<TabItem>` components

---

## Source Material

### SDK — Two new `FundamentalContext` methods (v4.3.1)

**`macroeconomic_indicators(country?, offset?, limit?)`**
- Endpoint: `GET /v1/quote/macrodata`
- `country`: enum `MacroeconomicCountry` (HongKong / China / UnitedStates / EuroZone / Japan / Singapore) — optional, pass null for all
- `offset`: int, default 0
- `limit`: int, default 100, max 1000
- Returns `MacroeconomicIndicatorListResponse { data: MacroeconomicIndicator[], count: int }`

**`macroeconomic(indicator_code, start_date?, end_date?, offset?, limit?)`**
- Endpoint: `GET /v1/quote/macrodata/{indicator_code}`
- `indicator_code`: string — from `macroeconomic_indicators` response
- `start_date` / `end_date`: "YYYY-MM-DD" strings, optional
- `offset`: int; `limit`: int default 100 max 100
- Returns `MacroeconomicResponse { info: MacroeconomicIndicator, data: Macroeconomic[], count: int }`

**Key types:**
- `MacroeconomicIndicator`: indicator_code, source_org, country, name (MultiLanguageText), adjustment_factor, periodicity, category, describe (MultiLanguageText), importance (int), start_date (optional datetime)
- `Macroeconomic`: period, release_at (optional datetime), actual_value, previous_value, forecast_value, revised_value, next_release_at (optional datetime), unit (MultiLanguageText), unit_prefix (MultiLanguageText)
- `MultiLanguageText`: english, simplified_chinese, traditional_chinese

### CLI — New command `longbridge macroeconomic`

```
longbridge macroeconomic [CODE] [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `[CODE]` | Indicator code (from list). Omit for list mode. |
| `--country HK\|CN\|US\|EU\|JP\|SG` | Filter list by country |
| `--start YYYY-MM-DD` | History start date |
| `--end YYYY-MM-DD` | History end date |
| `--limit N` | Max records (list: default 1000 max 1000; history: default 20 max 100) |
| `--page N` | Page number, 1-based |
| `--format json` | JSON output |

**Version:** TBD (confirm before merging; currently v0.22.4 is latest — this will be v0.23.0 or v0.22.5)

---

## Files

| Action | Path |
|--------|------|
| Create | `docs/en/docs/fundamental/fundamental/macroeconomic-indicators.md` |
| Create | `docs/en/docs/fundamental/fundamental/macroeconomic.md` |
| Create | `docs/zh-CN/docs/fundamental/fundamental/macroeconomic-indicators.md` |
| Create | `docs/zh-CN/docs/fundamental/fundamental/macroeconomic.md` |
| Create | `docs/zh-HK/docs/fundamental/fundamental/macroeconomic-indicators.md` |
| Create | `docs/zh-HK/docs/fundamental/fundamental/macroeconomic.md` |
| Create | `docs/en/docs/cli/fundamentals/macroeconomic.md` |
| Create | `docs/zh-CN/docs/cli/fundamentals/macroeconomic.md` |
| Create | `docs/zh-HK/docs/cli/fundamentals/macroeconomic.md` |
| Modify | `docs/en/docs/changelog.md` |
| Modify | `docs/zh-CN/docs/changelog.md` |
| Modify | `docs/zh-HK/docs/changelog.md` |
| Modify | `docs/en/docs/cli/release-notes.md` |
| Modify | `docs/zh-CN/docs/cli/release-notes.md` |
| Modify | `docs/zh-HK/docs/cli/release-notes.md` |

All paths are relative to `.worktrees/docs-macroeconomic/`.

---

## Task 1: SDK Doc — `macroeconomic_indicators` (EN)

**Files:**
- Create: `docs/en/docs/fundamental/fundamental/macroeconomic-indicators.md`

- [ ] **Step 1: Create the file**

```markdown
---
slug: macroeconomic-indicators
title: Macroeconomic Indicators
sidebar_position: 20
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

List macroeconomic indicators available through Longbridge, optionally filtered by country.

<CliCommand>
# List all indicators
longbridge macroeconomic
# Filter by US indicators
longbridge macroeconomic --country US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="macroeconomic_indicators" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| country | MacroeconomicCountry | NO | Filter by country. Omit for all countries. |
| offset | int | NO | Pagination offset. Default: 0 |
| limit | int | NO | Max records per page. Default: 100, max: 1000 |

### MacroeconomicCountry

| Value | Country |
| ----- | ------- |
| HongKong | Hong Kong SAR |
| China | China (Mainland) |
| UnitedStates | United States |
| EuroZone | Euro Zone |
| Japan | Japan |
| Singapore | Singapore |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder, MacroeconomicCountry

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

# All indicators
resp = ctx.macroeconomic_indicators()
print(resp)

# US only
resp = ctx.macroeconomic_indicators(country=MacroeconomicCountry.UnitedStates, limit=50)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncFundamentalContext, Config, OAuthBuilder, MacroeconomicCountry

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncFundamentalContext.create(config)
    resp = await ctx.macroeconomic_indicators(country=MacroeconomicCountry.UnitedStates)
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, FundamentalContext, OAuth, MacroeconomicCountry } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = FundamentalContext.new(config)
  const resp = await ctx.macroeconomicIndicators({ country: MacroeconomicCountry.UnitedStates })
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
            var resp = ctx.getMacroeconomicIndicators(null, null, null).get();
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
    let resp = ctx.macroeconomic_indicators(None, None, None).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
</Tabs>

## Response

### Response Example

```json
{
  "count": 619,
  "list": [
    {
      "indicator_code": "US00175",
      "source_org": "Bureau of Labor Statistics",
      "country": "United States",
      "name": {
        "english": "Non-Farm Payroll",
        "simplified_chinese": "非农就业人数",
        "traditional_chinese": "非農就業人數"
      },
      "adjustment_factor": "",
      "periodicity": "Monthly",
      "category": "Employment",
      "describe": {
        "english": "Employment situation report...",
        "simplified_chinese": "",
        "traditional_chinese": ""
      },
      "importance": 3,
      "start_date": 1356998400
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200 | Success | [MacroeconomicIndicatorListResponse](#MacroeconomicIndicatorListResponse) |
| 400 | Bad request | None |

## Schemas

### MacroeconomicIndicatorListResponse

<a id="MacroeconomicIndicatorListResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| list | MacroeconomicIndicator[] | true | Indicator list |
| count | int | true | Total number of matching indicators |

### MacroeconomicIndicator

<a id="MacroeconomicIndicator"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| indicator_code | string | true | Indicator code (use as input to `macroeconomic`) |
| source_org | string | true | Publishing organisation |
| country | string | true | Country name |
| name | MultiLanguageText | true | Indicator name |
| adjustment_factor | string | false | Adjustment factor |
| periodicity | string | true | Release periodicity (e.g. `Monthly`, `Quarterly`) |
| category | string | true | Indicator category (e.g. `Employment`, `Inflation`) |
| describe | MultiLanguageText | true | Indicator description |
| importance | int | true | Importance level (1 = Low, 2 = Medium, 3 = High) |
| start_date | int | false | Unix timestamp of data coverage start date |

### MultiLanguageText

<a id="MultiLanguageText"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| english | string | English text |
| simplified_chinese | string | Simplified Chinese text |
| traditional_chinese | string | Traditional Chinese text |
```

- [ ] **Step 2: Commit**

```bash
git add docs/en/docs/fundamental/fundamental/macroeconomic-indicators.md
git commit -m "docs(fundamental): add macroeconomic-indicators SDK doc (EN)"
```

---

## Task 2: SDK Doc — `macroeconomic` (EN)

**Files:**
- Create: `docs/en/docs/fundamental/fundamental/macroeconomic.md`

- [ ] **Step 1: Create the file**

```markdown
---
slug: macroeconomic
title: Macroeconomic Historical Data
sidebar_position: 21
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get historical releases for a specific macroeconomic indicator — actual values, forecasts, previous values, and next release dates.

<CliCommand>
# Historical data for Non-Farm Payroll
longbridge macroeconomic US00175
# Date range filter
longbridge macroeconomic US00175 --start 2024-01-01 --end 2024-12-31
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="macroeconomic" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| indicator_code | string | YES | Indicator code from `macroeconomic_indicators` |
| start_date | string | NO | Start date in `YYYY-MM-DD` format |
| end_date | string | NO | End date in `YYYY-MM-DD` format |
| offset | int | NO | Pagination offset. Default: 0 |
| limit | int | NO | Max records. Default: 100, max: 100 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.macroeconomic("US00175", start_date="2024-01-01", end_date="2024-12-31")
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
    resp = await ctx.macroeconomic("US00175", start_date="2024-01-01", end_date="2024-12-31")
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
  const resp = await ctx.macroeconomic('US00175', { startDate: '2024-01-01', endDate: '2024-12-31' })
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
            var resp = ctx.getMacroeconomic("US00175", "2024-01-01", "2024-12-31", null, null).get();
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
    let resp = ctx.macroeconomic("US00175", Some("2024-01-01"), Some("2024-12-31"), None, None).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
</Tabs>

## Response

### Response Example

```json
{
  "count": 24,
  "info": {
    "indicator_code": "US00175",
    "source_org": "Bureau of Labor Statistics",
    "country": "United States",
    "name": { "english": "Non-Farm Payroll", "simplified_chinese": "非农就业人数", "traditional_chinese": "非農就業人數" },
    "periodicity": "Monthly",
    "category": "Employment",
    "describe": { "english": "...", "simplified_chinese": "", "traditional_chinese": "" },
    "importance": 3,
    "start_date": 1356998400
  },
  "data": [
    {
      "period": "2024-12-01",
      "release_at": 1735900200,
      "actual_value": "256000",
      "previous_value": "212000",
      "forecast_value": "165000",
      "revised_value": "212000",
      "next_release_at": 1738492200,
      "unit": { "english": "Thousand", "simplified_chinese": "千", "traditional_chinese": "千" },
      "unit_prefix": { "english": "", "simplified_chinese": "", "traditional_chinese": "" }
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200 | Success | [MacroeconomicResponse](#MacroeconomicResponse) |
| 400 | Bad request | None |

## Schemas

### MacroeconomicResponse

<a id="MacroeconomicResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| info | MacroeconomicIndicator | true | Indicator metadata |
| data | Macroeconomic[] | true | Historical data points |
| count | int | true | Total number of data points |

### Macroeconomic

<a id="Macroeconomic"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| period | string | true | Statistical period (e.g. `2024-12-01`, `2024-Q4`) |
| release_at | int | false | Unix timestamp of release datetime |
| actual_value | string | true | Actual released value |
| previous_value | string | true | Previous period value |
| forecast_value | string | true | Market consensus forecast |
| revised_value | string | true | Revised value (if any) |
| next_release_at | int | false | Unix timestamp of next scheduled release |
| unit | MultiLanguageText | true | Unit (e.g. Thousand, %) |
| unit_prefix | MultiLanguageText | true | Unit prefix / scale (e.g. millions, billions) |

See [MultiLanguageText](#MultiLanguageText) in `macroeconomic_indicators`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/en/docs/fundamental/fundamental/macroeconomic.md
git commit -m "docs(fundamental): add macroeconomic SDK doc (EN)"
```

---

## Task 3: CLI Doc — `macroeconomic` (EN)

**Files:**
- Create: `docs/en/docs/cli/fundamentals/macroeconomic.md`

- [ ] **Step 1: Create the file**

```markdown
---
title: 'macroeconomic'
sidebar_label: 'macroeconomic'
sidebar_position: 20
---

# longbridge macroeconomic

Browse macroeconomic indicators and their historical release data — covering US, HK, CN, EU, JP, and SG markets.

## Modes

| Mode | Usage | Description |
| ---- | ----- | ----------- |
| List | `longbridge macroeconomic` | List all available indicators |
| History | `longbridge macroeconomic <CODE>` | Historical releases for one indicator |

## Examples

### List all indicators

```bash
longbridge macroeconomic
```

```
Total: 619
Code     Name                    Category    Country   Frequency   Source
US00175  Non-Farm Payroll        Employment  US        Monthly     Bureau of Labor Statistics
US00176  Unemployment Rate       Employment  US        Monthly     Bureau of Labor Statistics
...
```

### Filter by country

```bash
longbridge macroeconomic --country US
longbridge macroeconomic --country HK
longbridge macroeconomic --country CN
```

Supported country codes: `HK`, `CN`, `US`, `EU`, `JP`, `SG`.

### Paginate the list

```bash
longbridge macroeconomic --country US --limit 50 --page 2
```

### Historical releases for a specific indicator

```bash
longbridge macroeconomic US00175
```

```
Non-Farm Payroll  [Employment | Bureau of Labor Statistics · Monthly]

Period      Actual   Forecast  Previous  Revised   Unit
2026-05-01  272000   250000    265000    263500    Thousand
2026-04-01  228000   137000    228000    228000    Thousand
...
```

### Filter history by date range

```bash
longbridge macroeconomic US00175 --start 2024-01-01 --end 2024-12-31
```

### JSON output for AI / scripting

```bash
# List as JSON
longbridge macroeconomic --format json

# History as JSON
longbridge macroeconomic US00175 --format json
```

## Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `--country` | Filter list: `HK` \| `CN` \| `US` \| `EU` \| `JP` \| `SG` | All |
| `--start` | History start date `YYYY-MM-DD` | — |
| `--end` | History end date `YYYY-MM-DD` | — |
| `--limit` | Max records (list: max 1000, history: max 100) | 1000 (list) / 20 (history) |
| `--page` | Page number, 1-based | 1 |
| `--format` | `table` or `json` | `table` |
```

- [ ] **Step 2: Commit**

```bash
git add docs/en/docs/cli/fundamentals/macroeconomic.md
git commit -m "docs(cli): add macroeconomic command doc (EN)"
```

---

## Task 4: SDK Docs — `macroeconomic_indicators` + `macroeconomic` (zh-CN)

**Files:**
- Create: `docs/zh-CN/docs/fundamental/fundamental/macroeconomic-indicators.md`
- Create: `docs/zh-CN/docs/fundamental/fundamental/macroeconomic.md`

- [ ] **Step 1: Create `macroeconomic-indicators.md`**

```markdown
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
longbridge macroeconomic
# 筛选美国指标
longbridge macroeconomic --country US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="macroeconomic_indicators" />

## 参数

> **SDK 方法参数。**

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| country | MacroeconomicCountry | 否 | 按国家/地区筛选。不填返回全部。 |
| offset | int | 否 | 分页偏移量，默认 0 |
| limit | int | 否 | 每页最大条数，默认 100，最大 1000 |

### MacroeconomicCountry

| 枚举值 | 国家/地区 |
| ------ | --------- |
| HongKong | 香港 |
| China | 中国大陆 |
| UnitedStates | 美国 |
| EuroZone | 欧元区 |
| Japan | 日本 |
| Singapore | 新加坡 |

## 请求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder, MacroeconomicCountry

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问:", url))
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("请访问: {url}")).await?;
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
      "indicator_code": "US00175",
      "source_org": "Bureau of Labor Statistics",
      "country": "United States",
      "name": {
        "english": "Non-Farm Payroll",
        "simplified_chinese": "非农就业人数",
        "traditional_chinese": "非農就業人數"
      },
      "periodicity": "Monthly",
      "category": "Employment",
      "importance": 3,
      "start_date": 1356998400
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
| source_org | string | 是 | 发布机构 |
| country | string | 是 | 国家/地区名称 |
| name | MultiLanguageText | 是 | 指标名称（多语言） |
| adjustment_factor | string | 否 | 调整因子 |
| periodicity | string | 是 | 发布频率（如 `Monthly`、`Quarterly`） |
| category | string | 是 | 指标分类（如 `Employment`、`Inflation`） |
| describe | MultiLanguageText | 是 | 指标说明（多语言） |
| importance | int | 是 | 重要性（1=低、2=中、3=高） |
| start_date | int | 否 | 数据起始日期的 Unix 时间戳 |

### MultiLanguageText

| 字段 | 类型 | 描述 |
| ---- | ---- | ---- |
| english | string | 英文 |
| simplified_chinese | string | 简体中文 |
| traditional_chinese | string | 繁体中文 |
```

- [ ] **Step 2: Create `macroeconomic.md`**

```markdown
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
longbridge macroeconomic US00175
# 指定日期范围
longbridge macroeconomic US00175 --start 2024-01-01 --end 2024-12-31
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

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.macroeconomic("US00175", start_date="2024-01-01", end_date="2024-12-31")
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
  const resp = await ctx.macroeconomic('US00175', { startDate: '2024-01-01', endDate: '2024-12-31' })
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("请访问: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = FundamentalContext::new(config);
    let resp = ctx.macroeconomic("US00175", Some("2024-01-01"), Some("2024-12-31"), None, None).await?;
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
    "indicator_code": "US00175",
    "source_org": "Bureau of Labor Statistics",
    "country": "United States",
    "name": { "english": "Non-Farm Payroll", "simplified_chinese": "非农就业人数", "traditional_chinese": "非農就業人數" },
    "periodicity": "Monthly",
    "category": "Employment",
    "importance": 3
  },
  "data": [
    {
      "period": "2024-12-01",
      "release_at": 1735900200,
      "actual_value": "256000",
      "previous_value": "212000",
      "forecast_value": "165000",
      "revised_value": "212000",
      "next_release_at": 1738492200,
      "unit": { "english": "Thousand", "simplified_chinese": "千", "traditional_chinese": "千" },
      "unit_prefix": { "english": "", "simplified_chinese": "", "traditional_chinese": "" }
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
| revised_value | string | 是 | 修正值 |
| next_release_at | int | 否 | 下次发布时间 Unix 时间戳 |
| unit | MultiLanguageText | 是 | 单位（如 Thousand、%） |
| unit_prefix | MultiLanguageText | 是 | 单位前缀/数量级（如 百万、十亿） |
```

- [ ] **Step 3: Commit**

```bash
git add docs/zh-CN/docs/fundamental/fundamental/macroeconomic-indicators.md docs/zh-CN/docs/fundamental/fundamental/macroeconomic.md
git commit -m "docs(fundamental): add macroeconomic SDK docs (zh-CN)"
```

---

## Task 5: SDK Docs — `macroeconomic_indicators` + `macroeconomic` (zh-HK)

**Files:**
- Create: `docs/zh-HK/docs/fundamental/fundamental/macroeconomic-indicators.md`
- Create: `docs/zh-HK/docs/fundamental/fundamental/macroeconomic.md`

- [ ] **Step 1: Create `macroeconomic-indicators.md`**

Content: same as zh-CN with Traditional Chinese substitutions:
- Title: `宏觀經濟指標列表`
- `列出` → `列出`, `筛选` → `篩選`, `按国家/地区` → `按國家/地區`, `必填` → `必填`, `描述` → `描述`, `响应` → `響應`, `数据结构` → `數據結構`
- All 简体 terms converted to 繁体 equivalents

```markdown
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
longbridge macroeconomic
# 篩選美國指標
longbridge macroeconomic --country US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="macroeconomic_indicators" />

## 參數

> **SDK 方法參數。**

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| country | MacroeconomicCountry | 否 | 按國家/地區篩選。不填返回全部。 |
| offset | int | 否 | 分頁偏移量，默認 0 |
| limit | int | 否 | 每頁最大條數，默認 100，最大 1000 |

### MacroeconomicCountry

| 枚舉值 | 國家/地區 |
| ------ | --------- |
| HongKong | 香港 |
| China | 中國大陸 |
| UnitedStates | 美國 |
| EuroZone | 歐元區 |
| Japan | 日本 |
| Singapore | 新加坡 |

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder, MacroeconomicCountry

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問:", url))
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("請訪問: {url}")).await?;
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
      "indicator_code": "US00175",
      "source_org": "Bureau of Labor Statistics",
      "country": "United States",
      "name": {
        "english": "Non-Farm Payroll",
        "simplified_chinese": "非农就业人数",
        "traditional_chinese": "非農就業人數"
      },
      "periodicity": "Monthly",
      "category": "Employment",
      "importance": 3,
      "start_date": 1356998400
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
| source_org | string | 是 | 發布機構 |
| country | string | 是 | 國家/地區名稱 |
| name | MultiLanguageText | 是 | 指標名稱（多語言） |
| adjustment_factor | string | 否 | 調整因子 |
| periodicity | string | 是 | 發布頻率（如 `Monthly`、`Quarterly`） |
| category | string | 是 | 指標分類（如 `Employment`、`Inflation`） |
| describe | MultiLanguageText | 是 | 指標說明（多語言） |
| importance | int | 是 | 重要性（1=低、2=中、3=高） |
| start_date | int | 否 | 數據起始日期的 Unix 時間戳 |

### MultiLanguageText

| 字段 | 類型 | 描述 |
| ---- | ---- | ---- |
| english | string | 英文 |
| simplified_chinese | string | 簡體中文 |
| traditional_chinese | string | 繁體中文 |
```

- [ ] **Step 2: Create `macroeconomic.md`** (same as zh-CN but Traditional Chinese throughout)

```markdown
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
longbridge macroeconomic US00175
# 指定日期範圍
longbridge macroeconomic US00175 --start 2024-01-01 --end 2024-12-31
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

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.macroeconomic("US00175", start_date="2024-01-01", end_date="2024-12-31")
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
  const resp = await ctx.macroeconomic('US00175', { startDate: '2024-01-01', endDate: '2024-12-31' })
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("請訪問: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = FundamentalContext::new(config);
    let resp = ctx.macroeconomic("US00175", Some("2024-01-01"), Some("2024-12-31"), None, None).await?;
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
    "indicator_code": "US00175",
    "name": { "english": "Non-Farm Payroll", "simplified_chinese": "非农就业人数", "traditional_chinese": "非農就業人數" },
    "periodicity": "Monthly",
    "category": "Employment",
    "importance": 3
  },
  "data": [
    {
      "period": "2024-12-01",
      "release_at": 1735900200,
      "actual_value": "256000",
      "previous_value": "212000",
      "forecast_value": "165000",
      "revised_value": "212000",
      "next_release_at": 1738492200,
      "unit": { "english": "Thousand", "simplified_chinese": "千", "traditional_chinese": "千" },
      "unit_prefix": { "english": "", "simplified_chinese": "", "traditional_chinese": "" }
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
| revised_value | string | 是 | 修正值 |
| next_release_at | int | 否 | 下次發布時間 Unix 時間戳 |
| unit | MultiLanguageText | 是 | 單位（如 Thousand、%） |
| unit_prefix | MultiLanguageText | 是 | 單位前綴/數量級 |
```

- [ ] **Step 3: Commit**

```bash
git add docs/zh-HK/docs/fundamental/fundamental/macroeconomic-indicators.md docs/zh-HK/docs/fundamental/fundamental/macroeconomic.md
git commit -m "docs(fundamental): add macroeconomic SDK docs (zh-HK)"
```

---

## Task 6: CLI Docs — `macroeconomic` (zh-CN + zh-HK)

**Files:**
- Create: `docs/zh-CN/docs/cli/fundamentals/macroeconomic.md`
- Create: `docs/zh-HK/docs/cli/fundamentals/macroeconomic.md`

- [ ] **Step 1: Create zh-CN CLI doc**

```markdown
---
title: 'macroeconomic'
sidebar_label: 'macroeconomic'
sidebar_position: 20
---

# longbridge macroeconomic

浏览宏观经济指标及其历史发布数据，覆盖美国、香港、中国大陆、欧元区、日本和新加坡市场。

## 模式

| 模式 | 用法 | 描述 |
| ---- | ---- | ---- |
| 列表 | `longbridge macroeconomic` | 列出全部可用指标 |
| 历史 | `longbridge macroeconomic <CODE>` | 查询指定指标的历史数据 |

## 示例

### 列出全部指标

```bash
longbridge macroeconomic
```

```
Total: 619
Code     Name          Category    Country   Frequency   Source
US00175  非农就业人数  Employment  US        Monthly     Bureau of Labor Statistics
...
```

### 按国家/地区筛选

```bash
longbridge macroeconomic --country US
longbridge macroeconomic --country HK
longbridge macroeconomic --country CN
```

支持的国家代码：`HK`、`CN`、`US`、`EU`、`JP`、`SG`。

### 分页查看

```bash
longbridge macroeconomic --country US --limit 50 --page 2
```

### 查看某个指标的历史发布数据

```bash
longbridge macroeconomic US00175
```

```
Non-Farm Payroll  [Employment | Bureau of Labor Statistics · Monthly]

Period      Actual   Forecast  Previous  Revised   Unit
2026-05-01  272000   250000    265000    263500    Thousand
2026-04-01  228000   137000    228000    228000    Thousand
...
```

### 按日期范围筛选历史数据

```bash
longbridge macroeconomic US00175 --start 2024-01-01 --end 2024-12-31
```

### JSON 输出（适合 AI / 脚本）

```bash
longbridge macroeconomic --format json
longbridge macroeconomic US00175 --format json
```

## 选项

| 选项 | 描述 | 默认值 |
| ---- | ---- | ------ |
| `--country` | 筛选列表：`HK` \| `CN` \| `US` \| `EU` \| `JP` \| `SG` | 全部 |
| `--start` | 历史开始日期 `YYYY-MM-DD` | — |
| `--end` | 历史结束日期 `YYYY-MM-DD` | — |
| `--limit` | 最大条数（列表最大 1000，历史最大 100） | 1000（列表）/ 20（历史） |
| `--page` | 页码，从 1 开始 | 1 |
| `--format` | `table` 或 `json` | `table` |
```

- [ ] **Step 2: Create zh-HK CLI doc** (same with Traditional Chinese substitutions: `列出` stays, `筛选` → `篩選`, `按国家/地区` → `按國家/地區`, `历史` → `歷史`, `选项` → `選項`, `描述` → `描述`, `全部` stays, etc.)

```markdown
---
title: 'macroeconomic'
sidebar_label: 'macroeconomic'
sidebar_position: 20
---

# longbridge macroeconomic

瀏覽宏觀經濟指標及其歷史發布數據，覆蓋美國、香港、中國大陸、歐元區、日本和新加坡市場。

## 模式

| 模式 | 用法 | 描述 |
| ---- | ---- | ---- |
| 列表 | `longbridge macroeconomic` | 列出全部可用指標 |
| 歷史 | `longbridge macroeconomic <CODE>` | 查詢指定指標的歷史數據 |

## 示例

### 列出全部指標

```bash
longbridge macroeconomic
```

### 按國家/地區篩選

```bash
longbridge macroeconomic --country US
longbridge macroeconomic --country HK
```

支持的國家代碼：`HK`、`CN`、`US`、`EU`、`JP`、`SG`。

### 查看某個指標的歷史發布數據

```bash
longbridge macroeconomic US00175
longbridge macroeconomic US00175 --start 2024-01-01 --end 2024-12-31
```

### JSON 輸出（適合 AI / 腳本）

```bash
longbridge macroeconomic --format json
longbridge macroeconomic US00175 --format json
```

## 選項

| 選項 | 描述 | 默認值 |
| ---- | ---- | ------ |
| `--country` | 篩選列表：`HK` \| `CN` \| `US` \| `EU` \| `JP` \| `SG` | 全部 |
| `--start` | 歷史開始日期 `YYYY-MM-DD` | — |
| `--end` | 歷史結束日期 `YYYY-MM-DD` | — |
| `--limit` | 最大條數（列表最大 1000，歷史最大 100） | 1000（列表）/ 20（歷史） |
| `--page` | 頁碼，從 1 開始 | 1 |
| `--format` | `table` 或 `json` | `table` |
```

- [ ] **Step 3: Commit**

```bash
git add docs/zh-CN/docs/cli/fundamentals/macroeconomic.md docs/zh-HK/docs/cli/fundamentals/macroeconomic.md
git commit -m "docs(cli): add macroeconomic command doc (zh-CN + zh-HK)"
```

---

## Task 7: Update Changelog (all 3 languages)

**Files:**
- Modify: `docs/en/docs/changelog.md` — prepend new entry after `---` frontmatter block
- Modify: `docs/zh-CN/docs/changelog.md`
- Modify: `docs/zh-HK/docs/changelog.md`

**Note:** Confirm the CLI version number before committing — check the release tag on https://github.com/longbridge/longbridge-terminal/releases or substitute `vX.Y.Z` below.

- [ ] **Step 1: Prepend to `docs/en/docs/changelog.md`** (after the frontmatter block, before the first `## date` entry)

```markdown
## 2026-06-11

### SDK v4.3.1

- **Macroeconomic indicators** — Two new `FundamentalContext` methods: `macroeconomic_indicators` lists all indicators (filter by country), `macroeconomic` returns historical release data (actual / forecast / previous / revised values) for a given indicator code

### CLI vX.Y.Z

- **New `macroeconomic` command** — Browse 600+ macro indicators across US/HK/CN/EU/JP/SG and query historical release data with actual, forecast, previous, and revised values; supports `--country`, `--start`, `--end`, `--limit`, `--page`, `--format json`

```

- [ ] **Step 2: Prepend to `docs/zh-CN/docs/changelog.md`**

```markdown
## 2026-06-11

### SDK v4.3.1

- **宏观经济数据接口** — 新增两个 `FundamentalContext` 方法：`macroeconomic_indicators` 列出全部指标（支持按国家筛选），`macroeconomic` 查询指定指标的历史发布数据（实际值/预期值/前值/修正值）

### CLI vX.Y.Z

- **新增 `macroeconomic` 命令** — 浏览 600+ 宏观指标（覆盖美/港/中/欧/日/新）并查询历史发布数据；支持 `--country`、`--start`、`--end`、`--limit`、`--page`、`--format json`

```

- [ ] **Step 3: Prepend to `docs/zh-HK/docs/changelog.md`**

```markdown
## 2026-06-11

### SDK v4.3.1

- **宏觀經濟數據接口** — 新增兩個 `FundamentalContext` 方法：`macroeconomic_indicators` 列出全部指標（支持按國家篩選），`macroeconomic` 查詢指定指標的歷史發布數據（實際值/預期值/前值/修正值）

### CLI vX.Y.Z

- **新增 `macroeconomic` 命令** — 瀏覽 600+ 宏觀指標（覆蓋美/港/中/歐/日/新）並查詢歷史發布數據；支持 `--country`、`--start`、`--end`、`--limit`、`--page`、`--format json`

```

- [ ] **Step 4: Commit**

```bash
git add docs/en/docs/changelog.md docs/zh-CN/docs/changelog.md docs/zh-HK/docs/changelog.md
git commit -m "docs: update changelog for SDK v4.3.1 + macroeconomic CLI command"
```

---

## Task 8: Update CLI Release Notes (all 3 languages)

**Files:**
- Modify: `docs/en/docs/cli/release-notes.md` — prepend new version section
- Modify: `docs/zh-CN/docs/cli/release-notes.md`
- Modify: `docs/zh-HK/docs/cli/release-notes.md`

**Note:** Replace `vX.Y.Z` with the actual release version and GitHub releases tag URL.

- [ ] **Step 1: Prepend to `docs/en/docs/cli/release-notes.md`** (after the `# Release Notes` heading, before the first `### [v0.22.4]` entry)

```markdown
### [vX.Y.Z](https://github.com/longbridge/longbridge-terminal/releases/tag/vX.Y.Z)

- **New `macroeconomic` command** — Browse 600+ macroeconomic indicators across US/HK/CN/EU/JP/SG; list mode with optional `--country` filter, history mode for a specific indicator code with `--start`/`--end` date range; `--format json` for AI/scripting workflows

```

- [ ] **Step 2: Prepend to `docs/zh-CN/docs/cli/release-notes.md`**

```markdown
### [vX.Y.Z](https://github.com/longbridge/longbridge-terminal/releases/tag/vX.Y.Z)

- **新增 `macroeconomic` 命令** — 浏览 600+ 宏观经济指标，覆盖美/港/中/欧/日/新六大市场；列表模式支持 `--country` 筛选，历史模式支持 `--start`/`--end` 日期区间；`--format json` 满足 AI / 脚本需求

```

- [ ] **Step 3: Prepend to `docs/zh-HK/docs/cli/release-notes.md`**

```markdown
### [vX.Y.Z](https://github.com/longbridge/longbridge-terminal/releases/tag/vX.Y.Z)

- **新增 `macroeconomic` 命令** — 瀏覽 600+ 宏觀經濟指標，覆蓋美/港/中/歐/日/新六大市場；列表模式支持 `--country` 篩選，歷史模式支持 `--start`/`--end` 日期區間；`--format json` 滿足 AI / 腳本需求

```

- [ ] **Step 4: Commit**

```bash
git add docs/en/docs/cli/release-notes.md docs/zh-CN/docs/cli/release-notes.md docs/zh-HK/docs/cli/release-notes.md
git commit -m "docs(cli): add release notes for macroeconomic command (vX.Y.Z)"
```

---

## Final: Push and Create PR

- [ ] **Push branch and open PR**

```bash
git push -u origin docs/macroeconomic
gh pr create \
  --repo longbridge/developers \
  --title "docs: add macroeconomic indicators SDK + CLI docs (SDK v4.3.1)" \
  --base main \
  --head docs/macroeconomic \
  --body "..."
```
