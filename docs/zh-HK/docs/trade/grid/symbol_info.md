---
slug: symbol_info
sidebar_position: 11
title: 網格標的信息
sidebar_label: '標的信息'
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取標的的網格交易信息：每手股數、最新成交價、價格步長以及授權狀態。在調用[提交網格訂單](./submit)之前，用它來構建合法的網格規則。`channel_info.strategy_granted` 欄位告訴你是否已記錄策略風險披露同意——若為 `false`，請先提交[策略問卷](./questionnaire)。

<SDKLinks module="grid" klass="GridContext" method="symbol_info" hideGo />

<CliCommand>
# 查看 700.HK 的網格交易信息
longbridge grid info 700.HK
</CliCommand>

## 請求

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/orders/info</td></tr>
</tbody>
</table>

### 請求參數

> Content-Type: application/json; charset=utf-8

| 名稱       | 類型   | 必填 | 說明                                                |
| ---------- | ------ | ---- | --------------------------------------------------- |
| counter_id | string | 是   | 標的代碼，`ticker.region` 格式，例如：`700.HK`      |

### 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# 網格 REST 調用通過獨立的 GridContext
ctx = GridContext(config)

resp = ctx.symbol_info("700.HK")
print(resp)
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, GridContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = GridContext.new(config)
  const resp = await ctx.symbolInfo('700.HK')
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.grid.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             GridContext ctx = GridContext.create(config)) {
            GridSymbolInfo info = ctx.symbolInfo("700.HK").get();
            System.out.println(info);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{
    Config,
    grid::GridContext,
    oauth::OAuthBuilder,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    let info = ctx.symbol_info("700.HK").await?;
    println!("{info:?}");
    Ok(())
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#include <iostream>
#include <longbridge.hpp>

using namespace longbridge;
using namespace longbridge::grid;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    GridContext ctx = GridContext::create(config);

    ctx.symbol_info("700.HK", [](auto res) {
        if (!res) {
            std::cout << "failed" << std::endl;
            return;
        }
        std::cout << "last_done: " << res->last_done << std::endl;
    });
}

int main(int argc, char const* argv[]) {
    const std::string client_id = "your-client-id";
    OAuthBuilder(client_id).build(
    [](const std::string& url) {
        std::cout << "Open this URL to authorize: " << url << std::endl;
    },
    [](auto res) {
        if (!res) {
            std::cout << "authorization failed" << std::endl;
            return;
        }
        run(*res);
    });

    std::cin.get();
    return 0;
}
```

  </TabItem>
</Tabs>

## 響應

### Response Headers

- Content-Type: application/json

### 響應示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "name": "TENCENT",
    "last_done": "300.000",
    "lot_size": "100",
    "buy_lot_size": "100",
    "sell_lot_size": "100",
    "bid_sizes": [
      {
        "str_proceed": "0.010",
        "end_proceed": "500.000",
        "bid_size": "0.200"
      }
    ],
    "channel_info": {
      "strategy_granted": true,
      "support_rth": false,
      "currency": "HKD",
      "settlement_currency": ["HKD"]
    }
  }
}
```

### 響應狀態

| 狀態 | 說明                             | Schema |
| ---- | -------------------------------- | ------ |
| 200  | 成功返回標的網格信息。           | [grid_symbol_info_rsp](#schemagrid_symbol_info_rsp) |
| 400  | 請求被拒絕，請求參數不正確。     | None   |

<aside className="success">
</aside>

## Schemas

### grid_symbol_info_rsp

<a id="schemagrid_symbol_info_rsp"></a>

| Name                    | Type     | Required | Description                                                              |
| ----------------------- | -------- | -------- | ------------------------------------------------------------------------ |
| name                    | string   | true     | 標的名稱                                                                 |
| last_done               | string   | true     | 最新成交價                                                               |
| lot_size                | string   | true     | 每手股數                                                                 |
| buy_lot_size            | string   | true     | 買入最小手數                                                             |
| sell_lot_size           | string   | true     | 賣出最小手數                                                             |
| bid_sizes               | object[] | true     | 價格步長檔位                                                             |
| ∟ str_proceed           | string   | true     | 檔位起始價格                                                             |
| ∟ end_proceed           | string   | true     | 檔位結束價格                                                             |
| ∟ bid_size              | string   | true     | 檔位內的最小價格步長                                                     |
| channel_info            | object   | true     | 交易通道信息與授權狀態。`strategy_granted` 表示是否已記錄一次性策略風險披露同意 |
| ∟ strategy_granted      | boolean  | true     | 是否已記錄一次性策略風險披露同意                                         |
| ∟ support_rth           | boolean  | true     | 標的是否支持盤中交易時段網格                                             |
| ∟ currency              | string   | true     | 交易貨幣                                                                 |
| ∟ settlement_currency   | string[] | true     | 支持的結算貨幣                                                           |
