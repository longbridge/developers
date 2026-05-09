---
slug: check-support
title: 檢查定投支持
sidebar_position: 9
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

檢查指定標的是否支持定投。

<CliCommand>
longbridge dca check AAPL.US 700.HK
</CliCommand>

<SDKLinks module="dca" klass="DCAContext" method="check_support" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/dca/support</td></tr>
</tbody>
</table>

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbols | string[] | 是 | 待檢查的標的代碼列表 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import DCAContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = DCAContext(config)

resp = ctx.check_support(["AAPL.US", "700.HK"])
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncDCAContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncDCAContext.create(config)

    resp = await ctx.check_support(["AAPL.US", "700.HK"])
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, DCAContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = DCAContext.new(config)
  const resp = await ctx.checkSupport(['AAPL.US', '700.HK'])
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.dca.*;
import java.util.Arrays;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             DCAContext ctx = DCAContext.create(config)) {
            var resp = ctx.checkSupport(Arrays.asList("AAPL.US", "700.HK")).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, dca::DCAContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = DCAContext::new(config);
    let resp = ctx.check_support(vec!["AAPL.US".into(), "700.HK".into()]).await?;
    println!("{:?}", resp);
    Ok(())
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
	"github.com/longbridge/openapi-go/dca"
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
	c, err := dca.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.CheckSupport(context.Background(), []string{"AAPL.US", "700.HK"})
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
    "list": [
      { "symbol": "AAPL.US", "support": true },
      { "symbol": "700.HK", "support": true }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [DcaSupportList](#DcaSupportList) |
| 400    | 請求錯誤    | None   |

## Schemas

### DcaSupportList

<a id="DcaSupportList"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| list | DcaSupportItem[] | true | 支持情況列表 |

### DcaSupportItem

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | true | 標的代碼 |
| support | boolean | true | 是否支持定投 |
