---
id: quote_warrant_filter
title: 獲取輪證篩選列表
slug: warrant-filter
sidebar_position: 14
---

該接口用於獲取輪證行情列表數據，支持按不同字段排序和篩選輪證。

<CliCommand>
# 騰訊相關窩輪列表
longbridge warrant list 700.HK
# 阿里巴巴相關窩輪列表
longbridge warrant list 9988.HK
# 京東相關窩輪列表
longbridge warrant list 9618.HK
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="warrant_list" />

:::info

[業務指令](../../socket/biz-command)：`23`

:::

## Request

### Parameters

| Name          | Type    | Required | Description                                                                                                                                        |
| ------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol        | string  | 是       | 標的代碼，使用 `ticker.region` 格式，例如：`700.HK`                                                                                                |
| filter_config | object  | 是       | 篩選條件                                                                                                                                           |
| ∟ sort_by     | int32   | 是       | 根據哪一項數據進行排序，例如：`0`，序號見響應數據 `OrderSequence` 字段。                                                                           |
| ∟ sort_order  | int32   | 是       | 升降順序，例如：`1` <br /><br />**可选值：**<br />`0` - 升序<br />`1` - 降序                                                                       |
| ∟ sort_offset | int32   | 是       | 分頁的第一條數據偏移量，例如 `0`                                                                                                                   |
| ∟ sort_count  | int32   | 是       | 分頁的每一頁數量，例如 `20`, 填 `0` 時不分頁                                                                                                       |
| ∟ type        | int32[] | 否       | 篩選輪證類型 例如：`[0,1]` <br /><br />**可选值：**<br />`0` - 認購<br />`1` - 認沽<br />`2` - 牛證<br />`3` - 熊證<br />`4` - 界內證              |
| ∟ issuer      | int32[] | 否       | 篩選發行商，例如：`[12,14]`，[發行商 ID](./issuer) 通過接口獲取                                                                                    |
| ∟ expiry_date | int32[] | 否       | 篩選輪證過期時間，例如：`[1]` <br /><br />**可選值：**<br />`1` - 低於 3 個月<br />`2` - 3 - 6 個月<br />`3` - 6 - 12 個月<br />`4` - 大於 12 個月 |
| ∟ price_type  | int32[] | 否       | 篩選價內價外，例如：`[2]` <br /><br />**可选值：**<br />`1` - 價內<br />`2` - 價外                                                                 |
| ∟ status      | int32[] | 否       | 篩選狀態，例如：`[2]` <br /><br />**可选值：**<br />`2` - 終止交易<br />`3` - 等待上市<br />`4` - 正常                                             |
| language      | int32   | 是       | 響應的語言，例如：`[1]` <br /><br />**可选值：**<br />`0` - 簡體<br />`1` - English<br />`2` - 繁体                                                |

### Protobuf

```protobuf
message WarrantFilterListRequest {
  string symbol = 1;
  FilterConfig filter_config = 2;
  int32 language = 3;
}

message FilterConfig {
  int32 sort_by = 1;
  int32 sort_order = 2;
  int32 sort_offset = 3;
  int32 sort_count = 4;
  repeated int32 type = 5;
  repeated int32 issuer = 6;
  repeated int32 expiry_date = 7;
  repeated int32 price_type = 8;
  repeated int32 status = 9;
}
```

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import QuoteContext, Config, WarrantSortBy, SortOrderType, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

resp = ctx.warrant_list("700.HK", WarrantSortBy.LastDone, SortOrderType.Ascending)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, WarrantSortBy, SortOrderType, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    resp = await ctx.warrant_list("700.HK", WarrantSortBy.LastDone, SortOrderType.Ascending)
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth, WarrantSortBy, SortOrderType } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.warrantList("700.HK", WarrantSortBy.LastDone, SortOrderType.Ascending)
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.quote.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            WarrantInfo[] resp = ctx.queryWarrantList(new QueryWarrantOptions("700.HK", WarrantSortBy.LastDone, SortOrderType.Ascending)).get();
            for (WarrantInfo w : resp) System.out.println(w);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::{QuoteContext, WarrantSortBy, SortOrderType}, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.warrant_list("700.HK", WarrantSortBy::LastDone, SortOrderType::Ascending, None, None, None, None, None).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#include <iostream>
#include <longbridge.hpp>

#ifdef WIN32
#include <windows.h>
#endif

using namespace longbridge;
using namespace longbridge::quote;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    QuoteContext ctx = QuoteContext::create(config);

    ctx.warrant_list("700.HK", WarrantSortBy::Turnover, SortOrderType::Descending, {}, {}, {}, {}, {}, [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "warrants: " << res->size() << std::endl;
    });
}

int main(int argc, char const* argv[]) {
#ifdef WIN32
    SetConsoleOutputCP(CP_UTF8);
#endif

    const std::string client_id = "your-client-id";
    OAuthBuilder(client_id).build(
    [](const std::string& url) {
        std::cout << "Open this URL to authorize: " << url << std::endl;
    },
    [](auto res) {
        if (!res) {
            std::cout << "authorization failed: " << *res.status().message() << std::endl;
            return;
        }
        run(*res);
    });

    std::cin.get();
    return 0;
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
	"github.com/longbridge/openapi-go/quote"
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
	qctx, err := quote.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer qctx.Close()
	list, err := qctx.WarrantList(context.Background(), "700.HK", quote.WarrantFilter{
		SortBy: quote.WarrantVolume, SortOrder: quote.WarrantDesc, SortOffset: 0, SortCount: 10,
	}, quote.WarrantEN)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("warrants:", len(list))
}
```

  </TabItem>
</Tabs>


## Response

### Response Properties

| Name                 | Type     | Description                                                                            | OrderSequence | Support_Call/Put | Support_Bull/Bear | Support_Inline |
| -------------------- | -------- | -------------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------- | -------------- |
| warrant_list         | object[] | 渦輪篩選數據列表                                                                       |               |                  |                   |                |
| ∟ symbol             | string   | 標的代碼                                                                               |               | true             | true              | true           |
| ∟ name               | string   | 標的名稱                                                                               |               | true             | true              | true           |
| ∟ last_done          | string   | 最新價                                                                                 | 0             | true             | true              | true           |
| ∟ change_rate        | string   | 漲跌幅                                                                                 | 1             | true             | true              | true           |
| ∟ change_val         | string   | 漲跌額                                                                                 | 2             | true             | true              | true           |
| ∟ volume             | int64    | 成交量                                                                                 | 3             | true             | true              | true           |
| ∟ turnover           | string   | 成交額                                                                                 | 4             | true             | true              | true           |
| ∟ expiry_date        | string   | 到期日，使用 `YYMMDD` 格式                                                             | 5             | true             | true              | true           |
| ∟ strike_price       | string   | 行權價                                                                                 | 6             | true             | true              | false          |
| ∟ upper_strike_price | string   | 上限價                                                                                 | 7             | false            | false             | true           |
| ∟ lower_strike_price | string   | 下限價                                                                                 | 8             | false            | false             | true           |
| ∟ outstanding_qty    | string   | 街貨量                                                                                 | 9             | true             | true              | true           |
| ∟ outstanding_ratio  | string   | 街貨比                                                                                 | 10            | true             | true              | true           |
| ∟ premium            | string   | 溢價率                                                                                 | 11            | true             | true              | true           |
| ∟ itm_otm            | string   | 價內/價外                                                                              | 12            | true             | true              | false          |
| ∟ implied_volatility | string   | 引伸波幅                                                                               | 13            | true             | false             | false          |
| ∟ delta              | string   | 對沖值                                                                                 | 14            | true             | false             | false          |
| ∟ call_price         | string   | 收回價                                                                                 | 15            | false            | true              | false          |
| ∟ to_call_price      | string   | 距收回價                                                                               | 16            | false            | true              | false          |
| ∟ effective_leverage | string   | 有效槓桿                                                                               | 17            | true             | false             | false          |
| ∟ leverage_ratio     | string   | 槓桿比率                                                                               | 18            | true             | true              | true           |
| ∟ conversion_ratio   | string   | 換股比率                                                                               | 19            | true             | true              | false          |
| ∟ balance_point      | string   | 打和點                                                                                 | 20            | true             | true              | false          |
| ∟ status             | int32    | 狀態，<br /><br />**可選值：**<br />`2` - 終止交易<br />`3` - 等待上市<br />`4` - 正常 | 21            | true             | true              | true           |
| total_count          | int32    | 符合條件的輪證總數量                                                                   |               |                  |                   |                |

### Protobuf

```protobuf
message WarrantFilterListResponse {
  repeated FilterWarrant warrant_list = 1;
  int32 total_count = 2;
}

message FilterWarrant {
  string symbol = 1;
  string name = 2;
  string last_done = 3;
  string change_rate = 4;
  string change_val = 5;
  int64 volume = 6;
  string turnover = 7;
  string expiry_date = 8;
  string strike_price = 9;
  string upper_strike_price = 10;
  string lower_strike_price = 11;
  string outstanding_qty = 12;
  string outstanding_ratio = 13;
  string premium = 14;
  string itm_otm = 15;
  string implied_volatility = 16;
  string delta = 17;
  string call_price = 18;
  string to_call_price = 19;
  string effective_leverage = 20;
  string leverage_ratio = 21;
  string conversion_ratio = 22;
  string balance_point = 23;
  int32 status = 24;
}
```

### Response JSON Example

```json
{
  "warrant_list": [
    {
      "symbol": "13157.HK",
      "name": "騰訊麥銀二七沽 A",
      "last_done": "2.26",
      "change_rate": "-0.0216450216450218",
      "change_val": "-0.050000000000000266",
      "turnover": "0",
      "expiry_date": "20220705",
      "strike_price": "442.233",
      "upper_strike_price": "0",
      "lower_strike_price": "0",
      "outstanding_qty": "5000",
      "outstanding_ratio": "0.0003",
      "premium": "0.016784269662921222",
      "itm_otm": "0.23524476916014864",
      "implied_volatility": "0.5275",
      "delta": "-0.8524",
      "call_price": "0",
      "effective_leverage": "-2.627683451852457",
      "leverage_ratio": "3.0826882353970637",
      "conversion_ratio": "48.544",
      "balance_point": "332.52356000000003",
      "status": 4
    },
    {
      "symbol": "13649.HK",
      "name": "騰訊摩通二五沽 A",
      "last_done": "1.14",
      "change_rate": "0",
      "change_val": "0",
      "turnover": "0",
      "expiry_date": "20220518",
      "strike_price": "445.223",
      "upper_strike_price": "0",
      "lower_strike_price": "0",
      "outstanding_qty": "80000",
      "outstanding_ratio": "0.0004",
      "premium": "0.010810703725606",
      "itm_otm": "0.24038066317328624",
      "implied_volatility": "0.5997",
      "delta": "-0.7964",
      "call_price": "0",
      "effective_leverage": "-2.4335424241487873",
      "leverage_ratio": "3.055678583813144",
      "conversion_ratio": "97.087",
      "balance_point": "334.54382000000004",
      "status": 4
    }
  ],
  "total_count": 1197
}
```

## 錯誤碼

| 協議錯誤碼 | 業務錯誤碼 | 描述           | 排查建議                     |
| ---------- | ---------- | -------------- | ---------------------------- |
| 3          | 301600     | 無效的請求     | 請求參數有誤或解包失敗       |
| 3          | 301606     | 限流           | 降低請求頻次                 |
| 7          | 301602     | 服務端內部錯誤 | 請重試或聯繫技術人員處理     |
| 7          | 301600     | 請求標的不存在 | 檢查請求的 `symbol` 是否正確 |
| 7          | 301603     | 標的無行情     | 標的沒有請求的行情數據       |
| 7          | 301604     | 無權限         | 沒有獲取標的行情的權限       |
| 7          | 301607     | 接口限制       | 減少每頁數據數量             |
