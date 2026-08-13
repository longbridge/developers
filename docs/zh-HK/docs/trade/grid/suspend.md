---
slug: suspend
sidebar_position: 8
title: 暫停網格訂單
sidebar_label: '暫停訂單'
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

暫停運行中的網格訂單。網格停止觸發新訂單，但會保留原有配置，之後可透過[重啟網格訂單](./restart)恢復運行。當你希望暫停策略但不丟失其配置時，使用暫停操作。

<CliCommand>
# 按 ID 暫停運行中的網格訂單
longbridge grid suspend 764609681686573056
</CliCommand>

<SDKLinks module="grid" klass="GridContext" method="suspend" hideGo />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/gridtrading/suspend</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name     | Type   | Required | Description                              |
| -------- | ------ | -------- | ---------------------------------------- |
| order_id | string | YES      | 網格訂單 ID，例如：`764609681686573056`   |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# Grid REST calls go through the standalone GridContext
ctx = GridContext(config)

resp = ctx.suspend("764609681686573056")
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
  const resp = await ctx.suspend('764609681686573056')
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
            ctx.suspend("764609681686573056").get();
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{Config, grid::GridContext, oauth::OAuthBuilder};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    ctx.suspend("764609681686573056").await?;
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

    ctx.suspend("764609681686573056", [](auto res) {
        if (!res) {
            std::cout << "failed" << std::endl;
            return;
        }
        std::cout << "suspended" << std::endl;
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

## Response

### Response Headers

- Content-Type: application/json

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### Response Status

| Status | Description                | Schema |
| ------ | -------------------------- | ------ |
| 200    | 網格訂單暫停成功。         | None   |
| 400    | 請求被拒絕，請求參數錯誤。 | None   |

<aside className="success">
</aside>
