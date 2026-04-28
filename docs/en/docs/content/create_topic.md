---
slug: create-topic
title: Create Topic
sidebar_position: 4
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Create a new community topic. Two content types are supported:

| Type             | `title`      | `body` format   | Notes                                                                                                                  |
| ---------------- | ------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `post` (default) | Optional     | Plain text only | Markdown syntax (e.g. `**bold**`, `# heading`) is NOT rendered — it appears as literal characters, similar to a tweet. |
| `article`        | **Required** | Markdown        | The server converts Markdown to HTML for display. Supports headers, tables, bold, code blocks, etc.                    |

Only users who have opened a **Longbridge account and hold assets** are allowed to publish community topics and replies via Longbridge Developers API or CLI. Returns `403` otherwise.

<TipContainer type="tip">
Stock symbols mentioned in the body (e.g. `700.HK`, `TSLA.US`) are automatically recognized and linked as related stocks by the platform. Use `tickers` to associate additional symbols not explicitly mentioned in the body.

> ⚠️ Do not abuse symbol linking to associate unrelated stocks. Content moderation may restrict publishing or mute the account.
</TipContainer>

**Rate limit:** Max 3 topics per user per minute and 10 per 24 hours. Exceeding the limit returns `429`.

> ⚠️ Rate limit thresholds are for reference only and may be adjusted by the platform at any time.

<CliCommand>
# publish a topic for Tesla
longbridge topic create TSLA.US "Tesla Q1 earnings analysis"
# publish a topic for Apple
longbridge topic create AAPL.US "Apple WWDC preview"
</CliCommand>

<SDKLinks module="content" klass="ContentContext" method="create_topic" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/content/topics</td></tr>
</tbody>
</table>

### Request Body

| Name       | Type     | Required          | Description                                                                                                                                                                                                                                                                                                      |
| ---------- | -------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title      | string   | YES (for article) | Topic title. Required when `topic_type` is `article`; optional for `post`.                                                                                                                                                                                                                                       |
| body       | string   | YES               | Topic body. \n- For `post`: plain text only — Markdown is not rendered.\n- For `article`: Markdown is supported.                                                                                                                                                                                                 |
| topic_type | string   | NO                | Content type: `post` (plain text, default) or `article` (Markdown).                                                                                                                                                                                                                                              |
| tickers    | string[] | NO                | Related security symbols, format `{symbol}.{market}` (e.g. `["AAPL.US", "700.HK"]`). Maximum 10. **Note:** Symbols mentioned in the body (e.g. `700.HK`, `TSLA.US`) are automatically recognized and linked by the platform. Use `tickers` to associate additional symbols not explicitly mentioned in the body. |
| hashtags   | string[] | NO                | Hashtag names (e.g. `["earnings", "fed"]`). Maximum 1.                                                                                                                                                                                                                                                           |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

<CliCommand>
# Short post — plain text (default). Markdown is NOT rendered.
longbridge topic create --body "Bullish on 700.HK today"

# Short post with related tickers
longbridge topic create --body "NVDA GTC highlights" --tickers NVDA.US,700.HK

# Article — Markdown body, title is required
longbridge topic create --title "My Analysis" --body "**Bullish** on 700.HK because..." --type article

# Article from a Markdown file
longbridge topic create --title "Q4 Earnings Preview" --body "$(cat analysis.md)" --type article

# JSON output
longbridge topic create --body "Test post" --format json
</CliCommand>

  </TabItem>
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ContentContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ContentContext(config)

# Short post (plain text)
resp = ctx.create_topic(
    title="",
    body="Bullish on 700.HK today",
    topic_type="post",
    tickers=["700.HK"],
)
print(resp)

# Article (Markdown)
resp = ctx.create_topic(
    title="My Analysis",
    body="**Bullish** on 700.HK because...",
    topic_type="article",
    tickers=["700.HK"],
    license=1,
)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncContentContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncContentContext.create(config)

    resp = await ctx.create_topic(
        title="My Analysis",
        body="**Bullish** on 700.HK because...",
        topic_type="article",
        tickers=["700.HK"],
    )
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, ContentContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = ContentContext.new(config)

  // Article (Markdown body)
  const resp = await ctx.createTopic({
    title: 'My Analysis',
    body: '**Bullish** on 700.HK because...',
    topicType: 'article',
    tickers: ['700.HK'],
  })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.content.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             ContentContext ctx = ContentContext.create(config)) {
            // Article (Markdown body, title required)
            CreateTopicOptions opts = new CreateTopicOptions("My Analysis", "**Bullish** on 700.HK because...")
                .setTopicType("article")
                .setTickers(new String[]{"700.HK"})
                .setLicense(1);
            OwnedTopic resp = ctx.createTopic(opts).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, content::{ContentContext, CreateTopicOptions}, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = ContentContext::new(config);

    // Article (Markdown body, title required)
    let opts = CreateTopicOptions {
        title: "My Analysis".to_string(),
        body: "**Bullish** on 700.HK because...".to_string(),
        topic_type: Some("article".to_string()),
        tickers: Some(vec!["700.HK".to_string()]),
        hashtags: None,
        license: Some(1),
    };
    let resp = ctx.create_topic(opts).await?;
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
using namespace longbridge::content;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    ContentContext ctx = ContentContext::create(config);

    // Article (Markdown body, title required)
    CreateTopicOptions opts;
    opts.title = "My Analysis";
    opts.body = "**Bullish** on 700.HK because...";
    opts.topic_type = "article";
    opts.tickers = {"700.HK"};

    ctx.create_topic(opts, [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "created topic: " << res->id << std::endl;
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
	"github.com/longbridge/openapi-go/content"
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
	ctx, err := content.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	// Article (Markdown body, title required)
	opts := content.CreateTopicOptions{
		Title:     "My Analysis",
		Body:      "**Bullish** on 700.HK because...",
		TopicType: "article",
		Tickers:   []string{"700.HK"},
	}
	resp, err := ctx.CreateTopic(context.Background(), opts)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("created topic: %s\n", resp.ID)
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
    "item": {
      "id": "39304657",
      "title": "My View on AAPL",
      "topic_type": "article",
      "tickers": ["AAPL.US"],
      "hashtags": ["earnings"],
      "created_at": "1742000000"
    }
  }
}
```

### Response Status

| Status | Description                                                            | Schema                                                |
| ------ | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| 200    | Success                                                                | [create_topic_response](#schemacreate_topic_response) |
| 403    | Forbidden — user has not opened a Longbridge account or has no assets  | None                                                  |
| 429    | Too Many Requests — rate limit exceeded (3/min or 10/24h); retry later | None                                                  |
| 500    | Internal error                                                         | None                                                  |

## Schemas

### create_topic_response

<a id="schemacreate_topic_response"></a>

| Name             | Type     | Required | Description                                         |
| ---------------- | -------- | -------- | --------------------------------------------------- |
| item             | object   | true     | Newly created topic details                         |
| ∟ id             | string   | true     | Topic ID                                            |
| ∟ title          | string   | false    | Topic title                                         |
| ∟ description    | string   | false    | Plain-text summary (auto-generated from body)       |
| ∟ body           | string   | false    | Full body text (Markdown for `article`)             |
| ∟ topic_type     | string   | false    | Topic type. One of `article`, `post`                |
| ∟ tickers        | string[] | false    | Associated security symbols                         |
| ∟ hashtags       | string[] | false    | Associated hashtag names                            |
| ∟ images         | object[] | false    | Image list                                          |
| ∟∟ url           | string   | false    | Original image URL                                  |
| ∟∟ sm            | string   | false    | Small thumbnail URL                                 |
| ∟∟ lg            | string   | false    | Large thumbnail URL                                 |
| ∟ likes_count    | int32    | false    | Number of likes                                     |
| ∟ comments_count | int32    | false    | Number of replies                                   |
| ∟ views_count    | int32    | false    | Number of views                                     |
| ∟ shares_count   | int32    | false    | Number of shares                                    |
| ∟ detail_url     | string   | false    | Direct URL to the topic                             |
| ∟ author         | object   | false    | Author information                                  |
| ∟∟ member_id     | string   | false    | Author member ID                                    |
| ∟∟ name          | string   | false    | Author display name                                 |
| ∟∟ avatar        | string   | false    | Author avatar URL                                   |
| ∟ created_at     | string   | true     | Unix timestamp (seconds) when the topic was created |
| ∟ updated_at     | string   | false    | Unix timestamp (seconds) of last update             |
