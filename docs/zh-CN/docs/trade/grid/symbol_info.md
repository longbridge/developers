---
slug: symbol_info
sidebar_position: 11
title: 网格标的信息
search: true
headingLevel: 3
---

获取标的的网格交易信息：每手股数、最新成交价、价格步长以及授权状态。在调用[提交网格订单](./submit)之前，用它来构建合法的网格规则。`channel_info.strategy_granted` 字段告诉你是否已记录策略风险披露同意——若为 `false`，请先提交[策略问卷](./questionnaire)。

<SDKLinks module="grid" klass="GridContext" method="symbol_info" hideGo />

<CliCommand>
# 查看 700.HK 的网格交易信息
longbridge grid info 700.HK
</CliCommand>

## 请求

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/orders/info</td></tr>
</tbody>
</table>

### 请求参数

| 名称       | 类型   | 必填 | 说明                                                |
| ---------- | ------ | ---- | --------------------------------------------------- |
| counter_id | string | 是   | 标的代码，`ticker.region` 格式，例如：`700.HK`      |

### 请求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# 网格 REST 调用通过独立的 GridContext
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

## 响应

### Response Headers

- Content-Type: application/json

### 响应字段

| 名称          | 类型     | 说明                                     |
| ------------- | -------- | ---------------------------------------- |
| name          | string   | 标的名称                                 |
| last_done     | string   | 最新成交价                               |
| lot_size      | string   | 每手股数                                 |
| buy_lot_size  | string   | 买入最小手数                             |
| sell_lot_size | string   | 卖出最小手数                             |
| bid_sizes     | object[] | 价格步长档位，见下表                     |
| channel_info  | object   | 交易通道信息与授权状态，见下表           |

#### bid_sizes

| 名称         | 类型   | 说明                       |
| ------------ | ------ | -------------------------- |
| str_proceed  | string | 档位起始价格               |
| end_proceed  | string | 档位结束价格               |
| bid_size     | string | 档位内的最小价格步长       |

#### channel_info

| 名称                | 类型     | 说明                                     |
| ------------------- | -------- | ---------------------------------------- |
| strategy_granted    | boolean  | 是否已记录策略风险披露同意               |
| support_rth         | boolean  | 标的是否支持盘中交易时段网格             |
| currency            | string   | 交易货币                                 |
| settlement_currency | string[] | 支持的结算货币                           |

### 响应示例

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

### 响应状态

| 状态 | 说明                             | Schema |
| ---- | -------------------------------- | ------ |
| 200  | 成功返回标的网格信息。           | None   |
| 400  | 请求被拒绝，请求参数不正确。     | None   |

<aside className="success">
</aside>
