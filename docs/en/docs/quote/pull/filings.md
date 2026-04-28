---
slug: filings
title: Security Filings
sidebar_position: 20.5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get the filings list for a specified security.

<CliCommand>
# regulatory filings for Apple
longbridge filing list AAPL.US
# regulatory filings for Tesla
longbridge filing list TSLA.US
# regulatory filings for NVDA
longbridge filing list NVDA.US
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="filings" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/quote/filings</td></tr>
</tbody>
</table>

### Query Parameters

| Name   | Type   | Required | Description                                              |
| ------ | ------ | -------- | -------------------------------------------------------- |
| symbol | string | YES      | Stock symbol, use `ticker.region` format, e.g. `AAPL.US` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

resp = ctx.filings("AAPL.US")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    resp = await ctx.filings("AAPL.US")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.filings('AAPL.US')
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
            FilingItem[] resp = ctx.getFilings("AAPL.US").get();
            for (FilingItem item : resp) System.out.println(item);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.filings("AAPL.US").await?;
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

    ctx.filings("AAPL.US", [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "filings: " << res->size() << std::endl;
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
	items, err := qctx.Filings(context.Background(), "AAPL.US")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("filings:", len(items))
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
    "items": [
      {
        "id": "627391979864985729",
        "title": "Apple | (4) Statement of changes in beneficial ownership",
        "description": "",
        "file_name": "4 - Apple Inc. (0000320193) (Issuer)",
        "file_urls": [
          "https://www.sec.gov/Archives/edgar/data/320193/000178052526000005/xslF345X05/wk-form4_1773786674.xml"
        ],
        "publish_at": "1773786677"
      }
    ]
  }
}
```

### Response Status

| Status | Description    | Schema                                      |
| ------ | -------------- | ------------------------------------------- |
| 200    | Success        | [filings_response](#schemafilings_response) |
| 500    | Internal error | None                                        |

## Schemas

### filings_response

<a id="schemafilings_response"></a>

| Name          | Type     | Required | Description                            |
| ------------- | -------- | -------- | -------------------------------------- |
| items         | object[] | true     | Filings list                           |
| ∟ id          | string   | true     | Filing ID                              |
| ∟ title       | string   | true     | Title                                  |
| ∟ description | string   | true     | Summary                                |
| ∟ file_name   | string   | true     | File name                              |
| ∟ file_urls   | string[] | true     | List of file URLs                      |
| ∟ publish_at  | string   | true     | Publish time, Unix timestamp (seconds) |
