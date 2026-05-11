---
slug: company-profile
title: 公司概況
sidebar_position: 5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取公司基本資料，包括成立年份、員工人數、總部地址和業務描述。

<CliCommand>
longbridge company TSLA.US
longbridge company AAPL.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="company_profile" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/fundamental/company_profile</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 證券代碼，例如 `AAPL.US` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.company_profile("AAPL.US")
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

    resp = await ctx.company_profile("AAPL.US")
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
  const resp = await ctx.company_profile('AAPL.US')
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
            var resp = ctx.getCompanyProfile("AAPL.US").get();
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
    let resp = ctx.company_profile("AAPL.US").await?;
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
            ctx.company_profile("AAPL.US", [](auto resp) {
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
	resp, err := c.CompanyProfile(context.Background(), "AAPL.US")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>

## Response

### Response Headers

- Content-Type: application/json

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "name": "Apple Inc.",
    "symbol": "AAPL.US",
    "founded": "1976",
    "ceo": "Timothy D. Cook",
    "employees": 166000,
    "website": "www.apple.com",
    "description": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide."
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功     | [CompanyProfileResponse](#CompanyProfileResponse) |
| 400    | 請求錯誤 | None   |

## Schemas

### CompanyProfileResponse

<a id="CompanyProfileResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| name | string | 否 | 中文名稱 |
| company_name | string | 否 | 完整公司名稱 |
| ticker | string | 否 | 股票代碼 |
| market | string | 否 | 上市交易所 |
| sector | string | 否 | 行業 |
| category | string | 否 | 公司類別 |
| founded | string | 否 | 成立年份 |
| listing_date | string | 否 | 上市日期 |
| employees | string | 否 | 員工人數 |
| chairman | string | 否 | 董事長 |
| manager | string | 否 | CEO / 總經理 |
| secretary | string | 否 | 公司秘書 |
| address | string | 否 | 註冊地址 |
| office_address | string | 否 | 辦公地址 |
| email | string | 否 | 聯繫郵箱 |
| website | string | 否 | 公司官網 |
| profile | string | 否 | 業務描述 |
| icon | string | 否 | 股票圖標 URL |
| region | string | 否 | 地區 |
| shares_offered | string | 否 | 發行總股數 |
| issue_price | string | 否 | 發行價格 |
| year_end | string | 否 | 財年截止日 |
| zip_code | string | 否 | 郵政編碼 |
| Phone | string | 否 | 電話號碼 |
| fax | string | 否 | 傳真 |
| legal_repr | string | 否 | 法定代表人 |
| legal_counsel | string | 否 | 法律顧問 |
| accounting_firm | string | 否 | 會計師事務所 |
| audit_inst | string | 否 | 審計機構 |
| securities_rep | string | 否 | 證券代表 |
| bus_license | string | 否 | 營業執照號 |
| ads_ratio | string | 否 | ADS 比例 |
