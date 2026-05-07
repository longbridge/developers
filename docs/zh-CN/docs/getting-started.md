---
sidebar_position: 1
slug: getting-started
title: 快速开始
id: getting-started
sidebar_icon: zap
---

## 前言

[Longbridge OpenAPI SDK](https://github.com/longbridge/openapi) 基于 Rust 底层提供标准实现，目前我们已经发布了 Python、Node.js、Rust、C++/C、Java 等多种编程语言 SDK，其他语言的支持后面会陆续推出。

## API Host

- HTTP API - `https://openapi.longbridge.com`
- WebSocket Quote - `wss://openapi-quote.longbridge.com`
- WebSocket Trade - `wss://openapi-trade.longbridge.com`

:::info
中国大陆地区可使用 `.cn` 域名提升访问速度：

- HTTP API - `https://openapi.longbridge.cn`
- WebSocket Quote - `wss://openapi-quote.longbridge.cn`
- WebSocket Trade - `wss://openapi-trade.longbridge.cn`

SDK 会自动选择接入点；若判断不正确，可设置环境变量 `LONGBRIDGE_REGION`（如 `cn`、`hk`）。
:::

## 时间格式

所有 API 返回有关时间的字段，我们都采用 [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time) 时区为 UTC。

## 环境需求

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>
    <ul>
      <li><a href="https://www.python.org/">Python 3</a></li>
      <li>Pip</li>
    </ul>
  </TabItem>
  <TabItem value="javascript" label="JavaScript">
    <ul>
      <li><a href="https://nodejs.org/">Node.js</a></li>
      <li>Yarn</li>
    </ul>
  </TabItem>
  <TabItem value="rust" label="Rust">
    <ul>
      <li><a href="https://www.rust-lang.org/">Rust</a></li>
    </ul>
  </TabItem>
  <TabItem value="java" label="Java">
    <ul>
      <li><a href="https://openjdk.org/">JDK</a></li>
      <li><a href="https://maven.apache.org/">Maven</a></li>
    </ul>
  </TabItem>
  <TabItem value="go" label="Go">
    <ul>
      <li><a href="https://go.dev">Go</a></li>
      <li><a href="https://pkg.go.dev/github.com/longbridge/openapi-go">Go Docs</a></li>
    </ul>
  </TabItem>
</Tabs>

## CLI 快速入门

如果你不需要写代码，[Longbridge CLI](/docs/cli) 提供更轻量的接入方式——安装即用，OAuth 一键授权，无需配置环境变量。

### 安装

<Tabs groupId="cli-install">
  <TabItem value="homebrew" label="macOS (Homebrew)" default>

```bash
brew install --cask longbridge/tap/longbridge-terminal
```

  </TabItem>
  <TabItem value="script" label="Linux / macOS (脚本)">

```bash
curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
```

  </TabItem>
  <TabItem value="scoop" label="Windows (Scoop)">

```powershell
scoop install https://open.longbridge.com/longbridge/longbridge-terminal/longbridge.json
```

  </TabItem>
  <TabItem value="powershell" label="Windows (PowerShell)">

```powershell
iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex
```

  </TabItem>
</Tabs>

### 登录

```bash
longbridge auth login
```

浏览器会自动打开授权页面，完成后 Token 自动保存，后续无需重复操作。

### 快速验证

```bash
longbridge quote AAPL.US TSLA.US    # 实时行情
longbridge positions                 # 查看持仓
longbridge --help                    # 查看全部可用命令
```

查看完整命令列表见 [CLI 参考文档](/docs/cli)。

## 安装 SDK

:::warning 包名变更
SDK 包名已从 `longport` 更名为 `longbridge`，旧包名 `longport` 已废弃。如果你之前使用的是 `longport`，请先卸载旧包再安装新包。
:::

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>

```bash
pip3 install longbridge
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```bash
yarn add longbridge
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```toml
[dependencies]
longbridge = "4.0.5"
tokio = { version = "1", features = "rt-multi-thread" }
```

  </TabItem>
  <TabItem value="java" label="Java">

```xml
<dependencies>
    <dependency>
        <groupId>io.github.longbridge</groupId>
        <artifactId>openapi-sdk</artifactId>
        <version>4.0.5</version>
    </dependency>
</dependencies>
```

  </TabItem>
  <TabItem value="go" label="Go">

```shell
go env -w GOPROXY="https://goproxy.io,direct"
go get github.com/longbridge/openapi-go
```

  </TabItem>

</Tabs>

下面我们以获取资产为例，演示一下如何使用 SDK。

## 配置

### 开通开发者账户

1. 下载 [Longbridge](https://longbridge.com/download)，并完成开户
2. 从 [Longbridge Developers](https://open.longbridge.com) 官网获取认证信息

### 认证方式

Longbridge Developers 支持两种认证方式：

#### 方式一：OAuth 2.0（推荐） ⭐

OAuth 2.0 是现代化的认证方式，使用 Bearer Token，无需 HMAC 签名，更加安全便捷。

**第一步：注册 OAuth 客户端**

执行以下命令注册 OAuth 客户端，获取 `client_id`：

<Tabs groupId="shell">
<TabItem value="bash" label="Bash" default>

```bash
curl -X POST https://openapi.longbridge.com/oauth2/register \
     -H "Content-Type: application/json" \
     -d '{
            "redirect_uris": ["http://localhost:60355/callback"],
            "token_endpoint_auth_method": "none",
            "grant_types": ["authorization_code","refresh_token"],
            "response_types": ["code"],
            "client_name": "My Longbridge OpenAPI"
        }'
```

</TabItem>
<TabItem value="powershell" label="PowerShell">

```powershell
$body = @{
    redirect_uris                = @("http://localhost:60355/callback")
    token_endpoint_auth_method   = "none"
    grant_types                  = @("authorization_code", "refresh_token")
    response_types               = @("code")
    client_name                  = "My Longbridge OpenAPI"
} | ConvertTo-Json

Invoke-RestMethod -Method POST `
    -Uri "https://openapi.longbridge.com/oauth2/register" `
    -ContentType "application/json" `
    -Body $body
```

</TabItem>
</Tabs>

响应示例：

```json
{
  "client_id": "72d9caaf-0bd4-4000-85a7-8c7978c74544",
  "client_id_issued_at": 1773311221,
  "client_secret_expires_at": 1773314821,
  "client_name": "My Longbridge OpenAPI",
  "redirect_uris": ["http://localhost:60355/callback"],
  "grant_types": ["authorization_code", "refresh_token"],
  "token_endpoint_auth_method": "none",
  "response_types": ["code"],
  "registration_access_token": "BVlMLEtNUUu4FoRFNItC2FfeR/rLpqLNyEuCJNNTCWE=",
  "registration_client_uri": "https://openapi.longbridge.com/oauth2/register/72d9caaf-0bd4-4000-85a7-8c7978c74544"
}
```

保存 `client_id` 供后续使用。

**第二步：授权并获取 Token**

SDK 提供内置 OAuth 支持。使用 `OAuthBuilder` 完成浏览器授权流程，授权后使用 `Config.from_oauth()` 创建配置。Token 会自动持久化，过期时自动刷新。

**Token 存储路径：** macOS/Linux 为 `~/.longbridge/openapi/tokens/<client_id>`，Windows 为 `%USERPROFILE%\.longbridge\openapi\tokens\<client_id>`。

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print(f"请访问此 URL 进行授权：{url}")
)
config = Config.from_oauth(oauth)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(
        lambda url: print(f"请访问此 URL 进行授权：{url}")
    )
    config = Config.from_oauth(oauth)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const { Config, OAuth } = require('longbridge')

const oauth = await OAuth.build('your-client-id', (_, url) => {
  console.log('请访问此 URL 进行授权：' + url)
})
const config = Config.fromOAuth(oauth)
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{Config, oauth::OAuthBuilder};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("请访问此 URL 进行授权：{url}"))
        .await?;
    let config = Arc::new(Config::from_oauth(oauth));
    Ok(())
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;

public class Main {
    public static void main(String[] args) throws Exception {
        String clientId = "your-client-id";
        OAuth oauth = new OAuthBuilder(clientId)
                .build(url -> System.out.println("请打开此 URL 授权：" + url))
                .get();
        try (oauth) {
            Config config = Config.fromOAuth(oauth);
        }
    }
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
)

func main() {
	o := oauth.New("your-client-id").
		OnOpenURL(func(url string) { fmt.Println("请访问此 URL 进行授权：", url) })
	if err := o.Build(context.Background()); err != nil {
		log.Fatal(err)
	}
	conf, err := config.New(config.WithOAuthClient(o))
	if err != nil {
		log.Fatal(err)
	}
	_ = conf // 用于创建 TradeContext 或 QuoteContext
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#include <iostream>
#include <longbridge.hpp>

using namespace longbridge;

int main(int argc, char const* argv[]) {
    const std::string client_id = "your-client-id";
    OAuthBuilder(client_id).build(
    [](const std::string& url) {
        std::cout << "请访问此 URL 进行授权：" << url << std::endl;
    },
    [](auto res) {
        if (!res) {
            std::cout << "authorization failed: " << *res.status().message() << std::endl;
            return;
        }
        Config config = Config::from_oauth(*res);
        // 使用 config 创建 QuoteContext 或 TradeContext
    });

    std::cin.get();
    return 0;
}
```

  </TabItem>

</Tabs>

:::tip OAuth 优势

- ✅ 更安全（无需共享密钥）
- ✅ 更简单（无需计算签名）
- ✅ 基于 Token 的现代认证方式
- ✅ 更适合现代应用程序
  :::

:::caution Token 安全
OAuth Token 应安全存储在应用程序中（如加密文件、安全密钥链），**不要存储在环境变量中**。
:::

#### 方式二：传统 API Key（兼容）

**_获取 App Key, App Secret, Access Token 等信息_**

请登录 [https://open.longbridge.com/](https://open.longbridge.com/)，进入**用户中心**。

页面会展示**应用凭证**（App Key、App Secret、Access Token）。此处的 Access Token 为**旧版** API Key 凭证，与 OAuth 或 Refresh Token API 返回的 access token **不是**同一种东西。获取后请设置为环境变量以便开发使用。

### 环境变量

:::caution
请注意保护好您的 **Access Token** 信息，任何人获得到它，都可以通过 OpenAPI 来交易你的账户！
:::

**传统 API Key 凭证（仅需设置以下 3 个）：**

| 环境变量                  | 说明                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `LONGBRIDGE_APP_KEY`      | 从页面上获取到的 App Key                                                                                                             |
| `LONGBRIDGE_APP_SECRET`   | 从页面上获取到的 App Secret                                                                                                          |
| `LONGBRIDGE_ACCESS_TOKEN` | 在 [https://open.longbridge.com/](https://open.longbridge.com/)（用户中心 → 应用凭证）获取的旧版 Access Token，非 OAuth access token |

**其他环境变量：**

| 名称                               | 说明                                                                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `LONGBRIDGE_LANGUAGE`              | 语言标识，`zh-CN`、`zh-HK` 或 `en`（默认：`en`）                                                                        |
| `LONGBRIDGE_HTTP_URL`              | HTTP 接口地址（默认：`https://openapi.longbridge.com`）                                                                 |
| `LONGBRIDGE_QUOTE_WS_URL`          | 行情 WebSocket 地址（默认：`wss://openapi-quote.longbridge.com/v2`）                                                    |
| `LONGBRIDGE_TRADE_WS_URL`          | 交易 WebSocket 地址（默认：`wss://openapi-trade.longbridge.com/v2`）                                                    |
| `LONGBRIDGE_REGION`                | 覆盖接入点；SDK 会按网络自动选择，若判断不正确可设置（如 `cn`、`hk`）                                                   |
| `LONGBRIDGE_ENABLE_OVERNIGHT`      | 是否开启夜盘行情，`true` 或 `false`（默认：`false`）；需在 App 行情商店购买「LV1 实时行情 (OpenAPI)」行情卡，仅支持美股 |
| `LONGBRIDGE_PUSH_CANDLESTICK_MODE` | K 线推送模式，`realtime` 或 `confirmed`（默认：`realtime`）                                                             |
| `LONGBRIDGE_PRINT_QUOTE_PACKAGES`  | 连接时是否打印行情包，`true` 或 `false`（默认：`true`）                                                                 |
| `LONGBRIDGE_LOG_PATH`              | 日志文件路径（默认：不写日志）                                                                                          |

:::info
SDK 同时支持旧版 `LONGPORT_*` 环境变量名以保持兼容。
:::

建议您设置好这几个环境变量，我们后面各章节文档中的示例代码都会使用这几个环境变量。

:::tip 关于环境变量

环境变量**非必要**条件，如设置不方便或遇到问题难以解决，可不用环境变量，而是直接在代码里用参数来初始化。

Longbridge OpenAPI SDK 的 `Config` 可使用 `Config.from_apikey_env()`（或 Node/Java 的 `Config.fromApikeyEnv()`）从环境变量创建，或使用 `Config.from_apikey(app_key, app_secret, access_token)` 直接传参。见下方示例代码中的「不使用 ENV 初始化」注释。

:::

#### macOS / Linux 环境下设置环境变量

打开终端，输入下面的命令即可：

```bash
export LONGBRIDGE_APP_KEY="从页面上获取到的 App Key"
export LONGBRIDGE_APP_SECRET="从页面上获取到的 App Secret"
export LONGBRIDGE_ACCESS_TOKEN="从页面上获取到的 Access Token"
```

#### Windows 下设置环境变量

Windows 要稍微复杂一些，有下面两种方式可以设置环境变量：

1. **通过图形界面设置**：在桌面上找到"我的电脑"，右键点击，选择"属性"，在弹出的窗口中点击"高级系统设置"。
   - 在弹出的窗口中点击"环境变量"。

     <img src="https://assets.lbkrs.com/uploads/82e31e5e-6062-4726-966b-2a72954f4192/windows-env-set.png" width="500" />

   - 在弹出的窗口中点击"新建"，然后输入环境变量名称，比如 `LONGBRIDGE_APP_KEY`，`Value` 分别填写从页面上获取到的 App Key、App Secret、Access Token。

2. **CMD 命令行设置**：按下 `Win + R` 快捷键，输入 `cmd` 命令启动命令行（建议使用 [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701) 获得更好的开发体验）。

   在命令行里面输入下面的命令设置环境变量：

   ```bash
   C:\Users\jason> setx LONGBRIDGE_APP_KEY "从页面上获取到的 App Key"
   成功：指定的值已得到保存。

   C:\Users\jason> setx LONGBRIDGE_APP_SECRET "从页面上获取到的 App Secret"
   成功：指定的值已得到保存。

   C:\Users\jason> setx LONGBRIDGE_ACCESS_TOKEN "从页面上获取到的 Access Token"
   成功：指定的值已得到保存。
   ```

   :::caution Windows 环境变量

   Windows 环境变量限制，当上面命令执行成功以后，你需要重新启动 Windows 或者注销后重新登录一次，才可以读取到。

   :::

   注销或重新启动后，再次打开命令行，输入下面的命令验证一下环境变量是否设置正确：

   ```bash
   C:\Users\jason> set LONGBRIDGE
   LONGBRIDGE_APP_KEY=xxxxxxx
   LONGBRIDGE_APP_SECRET=xxxxxx
   LONGBRIDGE_ACCESS_TOKEN=xxxxxxx
   ```

   如果能正确打印你刚才设置的值，那么环境变量就是对了。

## 场景示范

### 获取资产总览

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>

创建 `account_asset.py` 贴入下面的代码：

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print(f"请访问此 URL 进行授权：{url}")
)
config = Config.from_oauth(oauth)
# 或使用 API Key：config = Config.from_apikey_env()
# 或不使用 ENV：config = Config.from_apikey("YOUR_APP_KEY", "YOUR_APP_SECRET", "YOUR_ACCESS_TOKEN")

ctx = TradeContext(config)
resp = ctx.account_balance()
print(resp)
```

运行

```bash
python account_asset.py
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

创建 `account_asset_async.py` 贴入下面的代码：

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(
        lambda url: print(f"请访问此 URL 进行授权：{url}")
    )
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)
    resp = await ctx.account_balance()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

运行

```bash
python account_asset_async.py
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

创建 `account_asset.js` 贴入下面的代码：

```javascript
const { Config, TradeContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('请访问此 URL 进行授权：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.accountBalance()
  for (const obj of resp) {
    console.log(obj.toString())
  }
}
main().catch(console.error)
```

运行

```bash
node account_asset.js
```

  </TabItem>
  <TabItem value="rust" label="Rust">

创建 `main.rs` 贴入下面的代码：

```rust
use std::sync::Arc;

use longbridge::{oauth::OAuthBuilder, trade::TradeContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("请访问此 URL 进行授权：{url}"))
        .await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);
    let resp = ctx.account_balance(None).await?;
    println!("{:?}", resp);
    Ok(())
}
```

运行

```bash
cargo run
```

  </TabItem>
  <TabItem value="java" label="Java">

创建 `Main.java` 贴入下面的代码：

```java
import com.longbridge.*;
import com.longbridge.trade.*;

class Main {
    public static void main(String[] args) throws Exception {
        String clientId = "your-client-id";
        OAuth oauth = new OAuthBuilder(clientId)
                .build(url -> System.out.println("请打开此 URL 授权：" + url))
                .get();
        try (oauth;
             Config config = Config.fromOAuth(oauth);
             TradeContext ctx = TradeContext.create(config)) {
            for (AccountBalance obj : ctx.getAccountBalance().get()) {
                System.out.println(obj);
            }
        }
    }
}
```

运行

```bash
mvn compile exec:exec
```

  </TabItem>

  <TabItem value="go" label="Go">

创建 `main.go` 贴入如下代码：

```go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/longbridge/openapi-go/config"
	"github.com/longbridge/openapi-go/oauth"
	"github.com/longbridge/openapi-go/trade"
)

func main() {
	o := oauth.New("your-client-id").
		OnOpenURL(func(url string) { fmt.Println("请访问此 URL 进行授权：", url) })
	if err := o.Build(context.Background()); err != nil {
		log.Fatal(err)
	}
	conf, err := config.New(config.WithOAuthClient(o))
	// 或使用 API Key 环境变量：config.New()
	// 或不使用 ENV：config.New(config.WithConfigKey("YOUR_APP_KEY", "YOUR_APP_SECRET", "YOUR_ACCESS_TOKEN"))
	if err != nil {
		log.Fatal(err)
	}
	tradeContext, err := trade.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer tradeContext.Close()
	ctx := context.Background()
	ab, err := tradeContext.AccountBalance(ctx, &trade.GetAccountBalance{})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", ab[0])
}
```

运行：

```shell
go mod tidy
go run ./
```

  </TabItem>
  <TabItem value="cpp" label="C++">

创建 `account_asset.cpp` 贴入下面的代码：

```cpp
#include <iostream>
#include <longbridge.hpp>

#ifdef WIN32
#include <windows.h>
#endif

using namespace longbridge;
using namespace longbridge::trade;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    TradeContext ctx = TradeContext::create(config);

    ctx.account_balance([](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        for (const auto& b : *res) {
            std::cout << b.currency << " " << (double)b.available_cash << std::endl;
        }
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

运行

```bash
g++ -std=c++17 account_asset.cpp -o account_asset -llongbridge && ./account_asset
```

  </TabItem>

</Tabs>

运行后，会输出如下：

```
[
  AccountBalance {
    total_cash: 503898884.81,
    max_finance_amount: 0.00,
    remaining_finance_amount: 501403229.49,
    risk_level: Some(1),
    margin_call: 0,
    currency: "HKD",
    cash_infos: [
      CashInfo {
        withdraw_cash: 501214985.15,
        available_cash: 501214985.15,
        frozen_cash: 584438.25,
        settling_cash: -3897793.90,
        currency: "HKD",
      },
      CashInfo {
        withdraw_cash: -25546.89,
        available_cash: -25546.89,
        frozen_cash: 295768.57,
        settling_cash: 2326.60,
        currency: "USD",
      }
    ]
  }
]
```

### 订阅实时行情

订阅行情数据请检查 [开发者中心](https://open.longbridge.com/account) - "行情权限"是否正确

- 港股 - BMP 基础报价，无实时行情推送，无法用 WebSocket 订阅
- 美股 - 纳斯达克 Basic 行情（只限 OpenAPI）

运行前访问 [开发者中心](https://open.longbridge.com/account)，检查确保账户有正确的行情权限。

:::info

如没有开通行情权限，可以通过"Longbridge"手机客户端，并进入"我的 - 我的行情 - 行情商城"购买开通行情权限。

https://longbridge.com/download
:::

当你有正确的行情权限，看起来可能会是这样：

<img src="https://pub.pbkrs.com/files/202205/JjCceNDSqeBJpaWv/SCR-20220507-rnm.png" className="max-w-2xl" />

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>

创建 `subscribe_quote.py` 贴入下面的代码：

```python
from time import sleep
from longbridge.openapi import QuoteContext, Config, OAuthBuilder, SubType, PushQuote


def on_quote(symbol: str, quote: PushQuote):
    print(symbol, quote)


oauth = OAuthBuilder("your-client-id").build(
    lambda url: print(f"请访问此 URL 进行授权：{url}")
)
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
ctx.set_on_quote(on_quote)
ctx.subscribe(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"], [SubType.Quote])
sleep(30)
```

运行

```bash
python subscribe_quote.py
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

创建 `subscribe_quote_async.py` 贴入下面的代码：

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, OAuthBuilder, SubType, PushQuote


async def on_quote(symbol: str, quote: PushQuote) -> None:
    print(symbol, quote)


async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(
        lambda url: print(f"请访问此 URL 进行授权：{url}")
    )
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config, loop_=asyncio.get_running_loop())
    ctx.set_on_quote(on_quote)
    await ctx.subscribe(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"], [SubType.Quote])
    await asyncio.sleep(30)

if __name__ == "__main__":
    asyncio.run(main())
```

运行

```bash
python subscribe_quote_async.py
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

创建 `subscribe_quote.js` 贴入下面的代码：

```javascript
const { Config, QuoteContext, SubType, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('请访问此 URL 进行授权：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  ctx.setOnQuote((_, event) => console.log(event.toString()))
  await ctx.subscribe(['700.HK', 'AAPL.US', 'TSLA.US', 'NFLX.US'], [SubType.Quote])
  await new Promise(() => {})
}
main().catch(console.error)
```

运行

```bash
node subscribe_quote.js
```

  </TabItem>
  <TabItem value="rust" label="Rust">

创建 `main.rs` 贴入下面的代码：

```rust
use std::sync::Arc;

use longbridge::{
    oauth::OAuthBuilder,
    quote::{QuoteContext, SubFlags},
    Config,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("请访问此 URL 进行授权：{url}"))
        .await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, mut receiver) = QuoteContext::new(config);

    ctx.subscribe(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"], SubFlags::QUOTE)
        .await?;

    while let Some(event) = receiver.recv().await {
        println!("{:?}", event);
    }
    Ok(())
}
```

运行

```bash
cargo run
```

  </TabItem>
  <TabItem value="java" label="Java">

创建 `Main.java` 贴入下面的代码：

```java
import com.longbridge.*;
import com.longbridge.quote.*;

class Main {
    public static void main(String[] args) throws Exception {
        String clientId = "your-client-id";
        OAuth oauth = new OAuthBuilder(clientId)
                .build(url -> System.out.println("请打开此 URL 授权：" + url))
                .get();
        try (oauth;
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            ctx.setOnQuote((symbol, quote) -> {
                System.out.printf("%s\t%s\n", symbol, quote);
            });
            ctx.subscribe(new String[] { "700.HK", "AAPL.US", "TSLA.US", "NFLX.US" }, SubFlags.Quote).get();
            Thread.sleep(30000);
        }
    }
}
```

运行

```bash
mvn compile exec:exec
```

  </TabItem>

  <TabItem value="go" label="Go">

创建 `main.go`，贴入一下内容：

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/longbridge/openapi-go/config"
    "github.com/longbridge/openapi-go/quote"
)

func main() {
 // create quote context from environment variables
    conf, err := config.New()
    if err != nil {
        log.Fatal(err)
    }
    quoteContext, err := quote.NewFromCfg(conf)
    if err != nil {
        log.Fatal(err)
        return
    }
    defer quoteContext.Close()
    ctx := context.Background()
    quoteContext.OnQuote(func(pe *quote.PushQuote) {
        bytes, _ := json.Marshal(pe)
        fmt.Println(string(bytes))
    })
    quoteContext.OnDepth(func(d *quote.PushDepth) {
        bytes, _ := json.Marshal(d)
        if d.Sequence != 0 {
            fmt.Print(time.UnixMicro(d.Sequence/1000).Format(time.RFC3339) + " ")
        }
        fmt.Println(string(bytes))
    })

    // Subscribe some symbols
    err = quoteContext.Subscribe(ctx, []string{"700.HK", "AAPL.US", "NFLX.US"}, []quote.SubType{quote.SubTypeDepth}, true)
    if err != nil {
        log.Fatal(err)
        return
    }

    quitChannel := make(chan os.Signal, 1)
    signal.Notify(quitChannel, syscall.SIGINT, syscall.SIGTERM)
    <-quitChannel
}
```

运行：

```shell
go run ./
```

  </TabItem>

  <TabItem value="cpp" label="C++">

创建 `subscribe_quote.cpp` 贴入下面的代码：

```cpp
#include <iostream>
#include <longbridge.hpp>

#ifdef WIN32
#include <windows.h>
#endif

using namespace longbridge;
using namespace longbridge::quote;

static QuoteContext g_ctx;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    g_ctx = QuoteContext::create(config);

    g_ctx.set_on_quote([](auto event) {
        std::cout << event->symbol
                  << " last_done=" << (double)event->last_done
                  << " volume=" << event->volume << std::endl;
    });

    std::vector<std::string> symbols = {"700.HK", "AAPL.US", "TSLA.US", "NFLX.US"};
    g_ctx.subscribe(symbols, SubFlags::QUOTE(), [](auto res) {
        if (!res) {
            std::cout << "failed to subscribe: " << *res.status().message() << std::endl;
        }
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

运行

```bash
g++ -std=c++17 subscribe_quote.cpp -o subscribe_quote -llongbridge && ./subscribe_quote
```

  </TabItem>

</Tabs>

运行后，会输出如下：

```
700.HK PushQuote {
    last_done: 367.000,
    open: 362.000,
    high: 369.400,
    low: 356.000,
    timestamp: "2022-06-06T08:10:00Z",
    volume: 22377421,
    turnover: 8081883405.000,
    trade_status: Normal,
    trade_session: Normal
}
AAPL.US PushQuote {
  last_done: 147.350,
  open: 150.700,
  high: 151.000,
  low: 146.190,
  timestamp: "2022-06-06T11:57:36Z",
  volume: 3724407,
  turnover: 550606662.815,
  trade_status: Normal,
  trade_session: Pre
}
NFLX.US PushQuote {
  last_done: 201.250,
  open: 205.990,
  high: 205.990,
  low: 200.110,
  timestamp: "2022-06-06T11:57:26Z",
  volume: 137821,
  turnover: 27888085.590,
  trade_status: Normal,
  trade_session: Pre
}
```

### 委托下单

下面我们做一次 [委托下单](https://open.longbridge.com/docs/trade/order/submit) 动作，我们假设要以 50 HKD 买入 `700.HK` 的数量为 `100`。

> NOTE: 为了防止测试买入成功，这里演示给了一个较低的价格，避免成交。OpenAPI 操作均等同与线上交易，请谨慎操作，开发调试注意参数细节。

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>

创建 `submit_order.py` 贴入下面的代码：

```python
from decimal import Decimal
from longbridge.openapi import TradeContext, Config, OAuthBuilder, OrderSide, OrderType, TimeInForceType

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print(f"请访问此 URL 进行授权：{url}")
)
config = Config.from_oauth(oauth)
ctx = TradeContext(config)

resp = ctx.submit_order(
    side=OrderSide.Buy,
    symbol="700.HK",
    order_type=OrderType.LO,
    submitted_price=Decimal(50),
    submitted_quantity=Decimal(200),
    time_in_force=TimeInForceType.Day,
    remark="Hello from Python SDK",
)
print(resp)
```

运行

```bash
python submit_order.py
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

创建 `submit_order_async.py` 贴入下面的代码：

```python
import asyncio
from decimal import Decimal
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder, OrderSide, OrderType, TimeInForceType

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(
        lambda url: print(f"请访问此 URL 进行授权：{url}")
    )
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)
    resp = await ctx.submit_order(
        side=OrderSide.Buy,
        symbol="700.HK",
        order_type=OrderType.LO,
        submitted_price=Decimal(50),
        submitted_quantity=Decimal(200),
        time_in_force=TimeInForceType.Day,
        remark="Hello from Python SDK",
    )
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

运行

```bash
python submit_order_async.py
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

创建 `submit_order.js` 贴入下面的代码：

```javascript
const { Config, TradeContext, OrderType, OrderSide, Decimal, TimeInForceType, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('请访问此 URL 进行授权：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.submitOrder({
    symbol: '700.HK',
    orderType: OrderType.LO,
    side: OrderSide.Buy,
    timeInForce: TimeInForceType.Day,
    submittedPrice: new Decimal(50),
    submittedQuantity: new Decimal(200),
  })
  console.log(resp.toString())
}
main().catch(console.error)
```

运行

```bash
node submit_order.js
```

  </TabItem>
  <TabItem value="rust" label="Rust">

创建 `main.rs` 贴入下面的代码：

```rust
use std::sync::Arc;

use longbridge::{
    decimal,
    oauth::OAuthBuilder,
    trade::{OrderSide, OrderType, SubmitOrderOptions, TimeInForceType, TradeContext},
    Config,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("请访问此 URL 进行授权：{url}"))
        .await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);

    let opts = SubmitOrderOptions::new(
        "700.HK",
        OrderType::LO,
        OrderSide::Buy,
        decimal!(200),
        TimeInForceType::Day,
    )
    .submitted_price(decimal!(50i32));
    let resp = ctx.submit_order(opts).await?;
    println!("{:?}", resp);
    Ok(())
}
```

运行

```bash
cargo run
```

  </TabItem>
  <TabItem value="java" label="Java">

创建 `Main.java` 贴入下面的代码：

```java
import com.longbridge.*;
import com.longbridge.trade.*;
import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) throws Exception {
        String clientId = "your-client-id";
        OAuth oauth = new OAuthBuilder(clientId)
                .build(url -> System.out.println("请打开此 URL 授权：" + url))
                .get();
        try (oauth;
             Config config = Config.fromOAuth(oauth);
             TradeContext ctx = TradeContext.create(config)) {
            SubmitOrderOptions opts = new SubmitOrderOptions("700.HK",
                    OrderType.LO,
                    OrderSide.Buy,
                    new BigDecimal(200),
                    TimeInForceType.Day).setSubmittedPrice(new BigDecimal(50));
            SubmitOrderResponse resp = ctx.submitOrder(opts).get();
            System.out.println(resp);
        }
    }
}
```

运行

```bash
mvn compile exec:exec
```

  </TabItem>

  <TabItem value="go" label="Go">

创建 `main.go`，贴入一下内容：

```go
package main

import (
    "context"
    "fmt"
    "log"
    "os"
    "os/signal"
    "syscall"

    "github.com/shopspring/decimal"

    "github.com/longbridge/openapi-go/config"
    "github.com/longbridge/openapi-go/trade"
)

func main() {
    // create trade context from environment variables
    conf, err := config.New()
    if err != nil {
        log.Fatal(err)
    }
    tradeContext, err := trade.NewFromCfg(conf)
    if err != nil {
        log.Fatal(err)
        return
    }


    defer tradeContext.Close()

    // subscribe order status
    tradeContext.OnTrade(func(ev *trade.PushEvent) {
        // handle order changing event
    })

    ctx := context.Background()
    // submit order
    order := &trade.SubmitOrder{
        Symbol:            "700.HK",
        OrderType:         trade.OrderTypeLO,
        Side:              trade.OrderSideBuy,
        SubmittedQuantity: 200,
        TimeInForce:       trade.TimeTypeDay,
        SubmittedPrice:    decimal.NewFromFloat(12),
    }
    orderId, err := tradeContext.SubmitOrder(ctx, order)
    if err != nil {
        log.Fatal(err)
        return
    }
    fmt.Printf("orderId: %v\n", orderId)


    quitChannel := make(chan os.Signal, 1)
    signal.Notify(quitChannel, syscall.SIGINT, syscall.SIGTERM)
    <-quitChannel
}
```

运行：

```shell
go run ./
```

  </TabItem>

  <TabItem value="cpp" label="C++">

创建 `submit_order.cpp` 贴入下面的代码：

```cpp
#include <iostream>
#include <longbridge.hpp>

#ifdef WIN32
#include <windows.h>
#endif

using namespace longbridge;
using namespace longbridge::trade;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    TradeContext ctx = TradeContext::create(config);

    SubmitOrderOptions opts{
        "700.HK",     OrderType::LO,        OrderSide::Buy,
        Decimal(200), TimeInForceType::Day,  Decimal(50.0),
        std::nullopt, std::nullopt,          std::nullopt,
        std::nullopt, std::nullopt,          std::nullopt,
        std::nullopt,
    };
    ctx.submit_order(opts, [](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        std::cout << "order id: " << res->order_id << std::endl;
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

运行

```bash
g++ -std=c++17 submit_order.cpp -o submit_order -llongbridge && ./submit_order
```

  </TabItem>

</Tabs>

运行后，会输出如下：

```
SubmitOrderResponse { order_id: "718437534753550336" }
```

### 获取当日订单

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>

创建 `today_orders.py` 贴入下面的代码：

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print(f"请访问此 URL 进行授权：{url}")
)
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.today_orders()
print(resp)
```

运行

```bash
python today_orders.py
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

创建 `today_orders_async.py` 贴入下面的代码：

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(
        lambda url: print(f"请访问此 URL 进行授权：{url}")
    )
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)
    resp = await ctx.today_orders()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

运行

```bash
python today_orders_async.py
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

创建 `today_orders.js` 贴入下面的代码：

```javascript
const { Config, TradeContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('请访问此 URL 进行授权：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.todayOrders()
  for (const obj of resp) {
    console.log(obj.toString())
  }
}
main().catch(console.error)
```

运行

```bash
node today_orders.js
```

  </TabItem>
  <TabItem value="rust" label="Rust">

创建 `main.rs` 贴入下面的代码：

```rust
use std::sync::Arc;

use longbridge::{oauth::OAuthBuilder, trade::TradeContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("请访问此 URL 进行授权：{url}"))
        .await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);

    let resp = ctx.today_orders(None).await?;
    for obj in resp {
        println!("{:?}", obj);
    }
    Ok(())
}
```

运行

```bash
cargo run
```

  </TabItem>
  <TabItem value="java" label="Java">

创建 `Main.java` 贴入下面的代码：

```java
import com.longbridge.*;
import com.longbridge.trade.*;

class Main {
    public static void main(String[] args) throws Exception {
        String clientId = "your-client-id";
        OAuth oauth = new OAuthBuilder(clientId)
                .build(url -> System.out.println("请打开此 URL 授权：" + url))
                .get();
        try (oauth;
             Config config = Config.fromOAuth(oauth);
             TradeContext ctx = TradeContext.create(config)) {
            Order[] orders = ctx.getTodayOrders(null).get();
            for (Order order : orders) {
                System.out.println(order);
            }
        }
    }
}
```

运行

```bash
mvn compile exec:exec
```

  </TabItem>

  <TabItem value="go" label="Go">

创建 `main.go`，贴入以下内容：

```go
package main

import (
    "context"
    "fmt"
    "log"

    "github.com/longbridge/openapi-go/config"
    "github.com/longbridge/openapi-go/trade"
)

func main() {
    // create trade context from environment variables
    conf, err := config.New()
    if err != nil {
        log.Fatal(err)
    }
    tradeContext, err := trade.NewFromCfg(conf)
    if err != nil {
        log.Fatal(err)
    }
    defer tradeContext.Close()
    ctx := context.Background()
    // today orders
    orders, err := tradeContext.TodayOrders(ctx, &trade.GetTodayOrders{})
    if err != nil {
        log.Fatal(err)
    }

    for _, order := range orders {
        fmt.Printf("%+v\n", order)
    }
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

创建 `today_orders.cpp` 贴入下面的代码：

```cpp
#include <iostream>
#include <longbridge.hpp>

#ifdef WIN32
#include <windows.h>
#endif

using namespace longbridge;
using namespace longbridge::trade;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    TradeContext ctx = TradeContext::create(config);

    ctx.today_orders(std::nullopt, [](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        for (auto it = res->cbegin(); it != res->cend(); ++it) {
            std::cout << "order_id=" << it->order_id
                      << " quantity=" << it->quantity << std::endl;
        }
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

运行

```bash
g++ -std=c++17 today_orders.cpp -o today_orders -llongbridge && ./today_orders
```

  </TabItem>

</Tabs>

运行后，会输出如下：

```
Order {
  order_id: "718437534753550336",
  status: NotReported,
  stock_name: "腾讯控股 1",
  quantity: 200,
  executed_quantity: None,
  price: Some(50.000),
  executed_price: None,
  submitted_at: 2022-06-06T12:14:16Z,
  side: Buy,
  symbol: "700.HK",
  order_type: LO,
  last_done: None,
  trigger_price: Some(0.000),
  msg: "",
  tag: Normal,
  time_in_force: Day,
  expire_date: Some(NaiveDate(Date { year: 2022, ordinal: 158 })),
  updated_at: Some(2022-06-06T12:14:16Z),
  trigger_at: None,
  trailing_amount: None,
  trailing_percent: None,
  limit_offset: None,
  trigger_status: None,
  currency: "HKD",
  outside_rth: nonce
}
```

上面例子已经完整演示了如何使用 SDK 访问 OpenAPI 的接口，更多其他接口请详细阅读 [Longbridge Developers 文档](https://longbridge.github.io/openapi/)，根据不同的接口使用。

## 更多例子

我们在 Longbridge OpenAPI Python SDK 的 GitHub 仓库中提供了上面几个例子的完整代码，当然后期我们也会持续往里面补充或更新。

https://github.com/longbridge/openapi/tree/master/examples

## SDK API 文档

SDK 的详细 API 文档请访问：https://longbridge.github.io/openapi/

## 反馈及沟通

如果您在使用 SDK 的过程中遇到任何问题，欢迎通过以下方式返回或与我们讨论，我们会尽力帮助您解决问题。

### GitHub Issues

在 GitHub 上，也有很多历史的讨论和问题可以参考，你也可以试着搜索一下，或许也能找到问题的解决方案。

访问地址：https://github.com/longbridge/developers/issues
