---
slug: us_etf_files
title: US ETF Files
sidebar_position: 38
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Longbridge US Accounts
This method is only available for US data-center accounts.
:::

List regulatory documents for a US ETF — prospectus, fact sheets, and annual reports.

<CliCommand>
# US ETF regulatory documents
longbridge etf-docs IVV.US
longbridge etf-docs SPY.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_etf_files" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | ETF symbol, e.g. `IVV.US` |
| size | int | NO | Maximum number of files to return; omit to return all |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_etf_files("IVV.US")
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
    resp = await ctx.us_etf_files("IVV.US")
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
  const resp = await ctx.usEtfFiles("IVV.US")
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
            var resp = ctx.getUsEtfFiles("IVV.US", null).get();
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
    let resp = ctx.us_etf_files("IVV.US", None).await?;
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
    resp, err := c.ETFFiles(context.Background(), "IVV.US", nil)
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
  "files": [
    {
      "file_name": "iShares Core S&P 500 ETF Prospectus",
      "file_path": "https://www.iShares.com/content/dam/iShares/prospectus/en/IVV.pdf",
      "update_date": "2024-01-15",
      "code": "IVV_PROSPECTUS",
      "format": "pdf"
    },
    {
      "file_name": "iShares Core S&P 500 ETF Annual Report",
      "file_path": "https://www.iShares.com/content/dam/iShares/reports/en/IVV_AR.pdf",
      "update_date": "2024-02-01",
      "code": "IVV_ANNUAL",
      "format": "pdf"
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [UsETFFileList](#UsETFFileList) |
| 400    | Bad request | None   |


## Schemas

### UsETFFilesResponse

<a id="UsETFFilesResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| files | USETFFile[] | true | List of ETF regulatory documents |

### USETFFile

<a id="USETFFile"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| file_name | string | Document file name |
| file_path | string | Document file path or URL |
| update_date | string | Last update date |
| code | string | Document code |
| format | string | File format (e.g. `pdf`) |
