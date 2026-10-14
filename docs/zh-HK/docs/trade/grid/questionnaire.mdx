---
slug: questionnaire
sidebar_position: 10
title: 提交策略問卷
sidebar_label: '策略問卷'
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

記錄策略風險披露同意。這是在下達任何網格訂單之前必須**一次性**提交的確認。在記錄之前，提交網格訂單將被拒絕。

<SDKLinks module="grid" klass="GridContext" method="submit_strategy_questionnaire" hideGo />

<CliCommand>
# 提交策略風險披露問卷（一次性同意）
longbridge grid questionnaire
</CliCommand>

## 請求

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/record/questionnaire</td></tr>
</tbody>
</table>

### 請求參數

> Content-Type: application/json; charset=utf-8

| 名稱  | 類型   | 必填 | 說明                                     |
| ----- | ------ | ---- | ---------------------------------------- |
| type  | string | 是   | 問卷類型，固定值：`strategy`             |
| items | object | 是   | 同意項，例如 `{ "agree": "true" }`       |

### 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# 網格 REST 調用通過獨立的 GridContext
ctx = GridContext(config)

resp = ctx.submit_strategy_questionnaire()
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
  const resp = await ctx.submitStrategyQuestionnaire()
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
            ctx.submitStrategyQuestionnaire().get();
            System.out.println("consent recorded");
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
    grid::{GridContext, SubmitStrategyQuestionnaireOptions},
    oauth::OAuthBuilder,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    ctx.submit_strategy_questionnaire(SubmitStrategyQuestionnaireOptions::new()).await?;
    println!("consent recorded");
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

    ctx.submit_strategy_questionnaire([](auto res) {
        if (!res) {
            std::cout << "failed" << std::endl;
            return;
        }
        std::cout << "consent recorded" << std::endl;
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
  "data": {}
}
```

### 響應狀態

| 狀態 | 說明                             | Schema |
| ---- | -------------------------------- | ------ |
| 200  | 策略同意已成功記錄。             | None   |
| 400  | 請求被拒絕，請求參數不正確。     | None   |

<aside className="success">
</aside>
