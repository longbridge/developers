---
sidebar_position: 1
slug: /getting-started
title: 快速開始
id: getting-started
sidebar_icon: zap
---

## 前言

Longbridge OpenAPI SDK 基於 Rust 底層提供標準實現，目前我們已經發布了 Python, Node.js, Rust, C++/C, Java 等多種編程語言 SDK，其他語言的支持後面會陸續推出。

## API Host

- HTTP API - `https://openapi.longbridge.com`
- WebSocket Quote - `wss://openapi-quote.longbridge.com`
- WebSocket Trade - `wss://openapi-trade.longbridge.com`

:::tip
中國大陸地區可使用 `.cn` 域名提升訪問速度：

- HTTP API - `https://openapi.longbridge.cn`
- WebSocket Quote - `wss://openapi-quote.longbridge.cn`
- WebSocket Trade - `wss://openapi-trade.longbridge.cn`

SDK 會自動選擇接入點；若判斷不正確，可設定環境變數 `LONGBRIDGE_REGION`（如 `cn`、`hk`）。
:::

## 時間格式

所有 API 傳回有關時間的字段，我們都採用 [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time) 時區為 UTC。

## 環境需求

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

## CLI 快速入門

如果你不需要寫程式，[Longbridge CLI](/docs/cli) 提供更輕量的接入方式——安裝即用，OAuth 一鍵授權，無需配置環境變數。

### 安裝

<Tabs groupId="cli-install">
  <TabItem value="homebrew" label="macOS (Homebrew)" default>

```bash
brew install --cask longbridge/tap/longbridge-terminal
```

  </TabItem>
  <TabItem value="script" label="Linux / macOS (腳本)">

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

### 登入

```bash
longbridge auth login
```

瀏覽器會自動開啟授權頁面，完成後 Token 自動儲存，後續無需重複操作。

## 安裝 SDK

:::warning 包名變更
SDK 包名已從 `longport` 更名為 `longbridge`，舊包名 `longport` 已廢棄。如果你之前使用的是 `longport`，請先卸載舊包再安裝新包。
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
go get github.com/longbridge/openapi-go
```

  </TabItem>
</Tabs>

下面我們以獲取資產為例，演示一下如何使用 SDK。

## 配置

### 開通開發者帳戶

1. 下載 [Longbridge](https://longbridge.com/download)，並完成開戶
2. 從 [Longbridge Developers](https://open.longbridge.com) 官網取得認證資訊

### 認證方式

Longbridge Developers 支援兩種認證方式：

#### 方式一：OAuth 2.0（推薦） ⭐

OAuth 2.0 是現代化的認證方式，使用 Bearer Token，無需 HMAC 簽名，更加安全便捷。

**第一步：註冊 OAuth 客戶端**

執行以下命令註冊 OAuth 客戶端，取得 `client_id`：

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

回應範例：

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

儲存 `client_id` 供後續使用。

**第二步：授權並取得 Token**

SDK 提供內建 OAuth 支援。使用 `OAuthBuilder` 完成瀏覽器授權流程，授權後使用 `Config.from_oauth()` 建立設定。Token 會自動持久化，過期時自動刷新。

**Token 儲存路徑：** macOS/Linux 為 `~/.longbridge/openapi/tokens/<client_id>`，Windows 為 `%USERPROFILE%\.longbridge\openapi\tokens\<client_id>`。

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print(f"請造訪此 URL 進行授權：{url}")
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
        lambda url: print(f"請造訪此 URL 進行授權：{url}")
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
  console.log('請造訪此 URL 進行授權：' + url)
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
        .build(|url| println!("請造訪此 URL 進行授權：{url}"))
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
                .build(url -> System.out.println("請開啟此 URL 授權：" + url))
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
		OnOpenURL(func(url string) { fmt.Println("請打開此 URL 授權：", url) })
	if err := o.Build(context.Background()); err != nil {
		log.Fatal(err)
	}
	conf, err := config.New(config.WithOAuthClient(o))
	if err != nil {
		log.Fatal(err)
	}
	_ = conf // 用於創建 TradeContext 或 QuoteContext
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
        std::cout << "請造訪此 URL 進行授權：" << url << std::endl;
    },
    [](auto res) {
        if (!res) {
            std::cout << "authorization failed: " << *res.status().message() << std::endl;
            return;
        }
        Config config = Config::from_oauth(*res);
        // 使用 config 創建 QuoteContext 或 TradeContext
    });

    std::cin.get();
    return 0;
}
```

  </TabItem>

</Tabs>

:::tip OAuth 優勢

- ✅ 更安全（無需共享金鑰）
- ✅ 更簡單（無需計算簽名）
- ✅ 基於 Token 的現代認證方式
- ✅ 更適合現代應用程式
  :::

:::caution Token 安全
OAuth Token 應安全儲存在應用程式中（如加密檔案、安全金鑰鏈），**不要儲存在環境變數中**。
:::

#### 方式二：傳統 API Key（相容）

**_取得 App Key、App Secret、Access Token 等資訊_**

請登入 [https://open.longbridge.com/](https://open.longbridge.com/)，進入**用戶中心**。

頁面會展示**應用憑證**（App Key、App Secret、Access Token）。此處的 Access Token 為**舊版** API Key 憑證，與 OAuth 或 Refresh Token API 回傳的 access token **不是**同一種東西。取得後請設定為環境變數以便開發使用。

### 環境變量

:::caution
請注意保護好您的 **Access Token** 訊息，任何人獲得到它，都可以透過 OpenAPI 來交易你的帳戶！
:::

**傳統 API Key 憑證（僅需設定以下 3 個）：**

| 環境變量                  | 說明                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `LONGBRIDGE_APP_KEY`      | 從頁面上取得的 App Key                                                                                                               |
| `LONGBRIDGE_APP_SECRET`   | 從頁面上取得的 App Secret                                                                                                            |
| `LONGBRIDGE_ACCESS_TOKEN` | 在 [https://open.longbridge.com/](https://open.longbridge.com/)（用戶中心 → 應用憑證）取得的舊版 Access Token，非 OAuth access token |

**其他環境變量：**

| 名稱                               | 說明                                                                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `LONGBRIDGE_LANGUAGE`              | 語言識別碼，`zh-CN`、`zh-HK` 或 `en`（預設：`en`）                                                                      |
| `LONGBRIDGE_HTTP_URL`              | HTTP 介面位址（預設：`https://openapi.longbridge.com`）                                                                 |
| `LONGBRIDGE_QUOTE_WS_URL`          | 行情 WebSocket 位址（預設：`wss://openapi-quote.longbridge.com/v2`）                                                    |
| `LONGBRIDGE_TRADE_WS_URL`          | 交易 WebSocket 位址（預設：`wss://openapi-trade.longbridge.com/v2`）                                                    |
| `LONGBRIDGE_REGION`                | 覆寫接入點；SDK 會依網路自動選擇，若判斷不正確可設定（如 `cn`、`hk`）                                                   |
| `LONGBRIDGE_ENABLE_OVERNIGHT`      | 是否開啟夜盤行情，`true` 或 `false`（預設：`false`）；需在 App 行情商店購買「LV1 實時行情 (OpenAPI)」行情卡，僅支援美股 |
| `LONGBRIDGE_PUSH_CANDLESTICK_MODE` | K 線推送模式，`realtime` 或 `confirmed`（預設：`realtime`）                                                             |
| `LONGBRIDGE_PRINT_QUOTE_PACKAGES`  | 連線時是否列印行情包，`true` 或 `false`（預設：`true`）                                                                 |
| `LONGBRIDGE_LOG_PATH`              | 日誌檔案路徑（預設：不寫日誌）                                                                                          |

:::info
SDK 同時支援舊版 `LONGPORT_*` 環境變數名以保持相容。
:::

建議您設定好這幾個環境變量，我們後面各章節文件中的範例程式碼都會使用這幾個環境變量。

:::tip 關於環境變量

環境變量**非必要**條件，如設定不方便或遇到問題難以解決，可不用環境變量，而是直接在程式碼裡用參數來初始化。

Longbridge OpenAPI SDK 的 `Config` 可使用 `Config.from_apikey_env()`（或 Node/Java 的 `Config.fromApikeyEnv()`）從環境變數建立，或使用 `Config.from_apikey(app_key, app_secret, access_token)` 直接傳參。見下方範例程式碼中的「不使用 ENV 初始化」註釋。

:::

#### macOS / Linux 環境下設定環境變量

打開終端，輸入下面的命令即可：

```bash
export LONGBRIDGE_APP_KEY="從頁面上取得到的 App Key"
export LONGBRIDGE_APP_SECRET="從頁面取得到的 App Secret"
export LONGBRIDGE_ACCESS_TOKEN="從頁面取得到的 Access Token"

```

#### Windows 下設定環境變量

Windows 要稍微複雜一些，有以下兩種方式可以設定環境變量：

1. **透過圖形介面設定**：在桌面上找到"我的電腦"，右鍵點擊，選擇"屬性"，在彈出的視窗中點擊"高級系統設定"。
   - 在彈出的視窗中點選「環境變量」。

     <img src="https://assets.lbkrs.com/uploads/82e31e5e-6062-4726-966b-2a72954f4192/windows-env-set.png" width="500" />

   - 在彈出的視窗中點擊"新建"，然後輸入環境變量名稱，例如 `LONGBRIDGE_APP_KEY`，`Value` 分別填寫從頁面上取得的 App Key、App Secret、Access Token。

2. **CMD 命令列設定**：按下`Win + R` 快捷鍵，輸入`cmd` 命令啟動命令列（建議使用[Windows Terminal](https://apps.microsoft.com/store/detail /windows-terminal/9N0DX20HK701) 獲得更好的開發體驗）。

   在命令列裡面輸入下面的命令設定環境變量：

   ```bash
   C:\Users\jason> setx LONGBRIDGE_APP_KEY "從頁面上取得到的 App Key"
   成功：指定的值已儲存。

   C:\Users\jason> setx LONGBRIDGE_APP_SECRET "從頁面取得到的 App Secret"
   成功：指定的值已儲存。

   C:\Users\jason> setx LONGBRIDGE_ACCESS_TOKEN "從頁面取得到的 Access Token"
   成功：指定的值已儲存。
   ```

   :::caution Windows 環境變量

   Windows 環境變量限制，當上面指令執行成功以後，你需要重新啟動 Windows 或登出後重新登入一次，才可以讀取。

   :::

   登出或重新啟動後，再次開啟命令列，輸入下面的命令以驗證環境變量是否設定正確：

   ```bash
   C:\Users\jason> set LONGBRIDGE
   LONGBRIDGE_APP_KEY=xxxxxxx
   LONGBRIDGE_APP_SECRET=xxxxxx
   LONGBRIDGE_ACCESS_TOKEN=xxxxxxx
   ```

   如果你能正確列印你剛才設定的值，那麼環境變量就是對了。

## 場景示範

### 獲取資產總覽

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>

創建 `account_asset.py` 貼入下面的代碼：

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print(f"請造訪此 URL 進行授權：{url}")
)
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.account_balance()
print(resp)
```

運行

```bash
python account_asset.py
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

創建 `account_asset_async.py` and paste the code below:

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(
        lambda url: print(f"請造訪此 URL 進行授權：{url}")
    )
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)
    resp = await ctx.account_balance()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

運行

```bash
python account_asset_async.py
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

創建 `account_asset.js` 貼入下面的代碼：

```javascript
const { Config, TradeContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('請造訪此 URL 進行授權：' + url)
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

運行

```bash
node account_asset.js
```

  </TabItem>
  <TabItem value="rust" label="Rust">

創建 `main.rs` 貼入下面的代碼：

```rust
use std::sync::Arc;

use longbridge::{oauth::OAuthBuilder, trade::TradeContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("請造訪此 URL 進行授權：{url}"))
        .await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);
    let resp = ctx.account_balance(None).await?;
    println!("{:?}", resp);
    Ok(())
}
```

運行

```bash
cargo run
```

  </TabItem>
  <TabItem value="java" label="Java">

創建 `Main.java` 貼入下面的代碼：

```java
import com.longbridge.*;
import com.longbridge.trade.*;

class Main {
    public static void main(String[] args) throws Exception {
        String clientId = "your-client-id";
        OAuth oauth = new OAuthBuilder(clientId)
                .build(url -> System.out.println("請開啟此 URL 授權：" + url))
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

運行

```bash
mvn compile exec:exec
```

  </TabItem>

  <TabItem value="go" label="Go">

創建 `main.go` 貼入如下代碼：

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
		OnOpenURL(func(url string) { fmt.Println("請打開此 URL 授權：", url) })
	if err := o.Build(context.Background()); err != nil {
		log.Fatal(err)
	}
	conf, err := config.New(config.WithOAuthClient(o))
	// 或使用 API Key 環境變數：config.New()
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

運行：

```shell
go mod tidy
go run ./
```

  </TabItem>

  <TabItem value="cpp" label="C++">

創建 `account_asset.cpp` 貼入下面的代碼：

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

運行

```bash
g++ -std=c++17 account_asset.cpp -o account_asset -llongbridge && ./account_asset
```

  </TabItem>

</Tabs>

運行後會輸出如下：

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

### 訂閱實時行情

訂閱行情數據請檢查 [開發者中心](https://open.longbridge.com/account) - "行情權限"是否正確

- 港股 - BMP 基礎報價，無實時行情推送，無法用 WebSocket 訂閱
- 美股 - 納斯達克 Basic 行情（只限 OpenAPI）

運行前訪問 [開發者中心](https://open.longbridge.com/account)，檢查確保賬戶有正確的行情權限。

:::info

如沒有開通行情權限，可以通過"Longbridge"手機客戶端，並進入"我的 - 我的行情 - 行情商城"購買開通行情權限。

https://longbridge.com/download
:::

當你有正確的行情權限，看起來可能會是這樣：

<img src="https://pub.pbkrs.com/files/202205/CicZRBp7LAV577YN/SCR-20220510-gme.png" className="max-w-2xl" />

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>

創建 `subscribe_quote.py` 貼入下面的代碼：

```python
from time import sleep
from longbridge.openapi import QuoteContext, Config, OAuthBuilder, SubType, PushQuote


def on_quote(symbol: str, quote: PushQuote):
    print(symbol, quote)


oauth = OAuthBuilder("your-client-id").build(
    lambda url: print(f"請造訪此 URL 進行授權：{url}")
)
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
ctx.set_on_quote(on_quote)
ctx.subscribe(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"], [SubType.Quote])
sleep(30)
```

運行

```bash
python subscribe_quote.py
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

創建 `subscribe_quote_async.py` and paste the code below:

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, OAuthBuilder, SubType, PushQuote


async def on_quote(symbol: str, quote: PushQuote) -> None:
    print(symbol, quote)


async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(
        lambda url: print(f"請造訪此 URL 進行授權：{url}")
    )
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config, loop_=asyncio.get_running_loop())
    ctx.set_on_quote(on_quote)
    await ctx.subscribe(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"], [SubType.Quote])
    await asyncio.sleep(30)

if __name__ == "__main__":
    asyncio.run(main())
```

運行

```bash
python subscribe_quote_async.py
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

創建 `subscribe_quote.js` 貼入下面的代碼：

```javascript
const { Config, QuoteContext, SubType, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('請造訪此 URL 進行授權：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  ctx.setOnQuote((_, event) => console.log(event.toString()))
  await ctx.subscribe(['700.HK', 'AAPL.US', 'TSLA.US', 'NFLX.US'], [SubType.Quote])
  await new Promise(() => {})
}
main().catch(console.error)
```

運行

```bash
node subscribe_quote.js
```

  </TabItem>
  <TabItem value="rust" label="Rust">

創建 `main.rs` 貼入下面的代碼：

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
        .build(|url| println!("請造訪此 URL 進行授權：{url}"))
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

運行

```bash
cargo run
```

  </TabItem>
  <TabItem value="java" label="Java">

創建 `Main.java` 貼入下面的代碼：

```java
import com.longbridge.*;
import com.longbridge.quote.*;

class Main {
    public static void main(String[] args) throws Exception {
        String clientId = "your-client-id";
        OAuth oauth = new OAuthBuilder(clientId)
                .build(url -> System.out.println("請開啟此 URL 授權：" + url))
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

運行

```bash
mvn compile exec:exec
```

  </TabItem>
  <TabItem value="cpp" label="C++">

創建 `subscribe_quote.cpp` 貼入下面的代碼：

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

運行

```bash
g++ -std=c++17 subscribe_quote.cpp -o subscribe_quote -llongbridge && ./subscribe_quote
```

  </TabItem>

</Tabs>

運行後會輸出如下：

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

### 委託下單

下面我們做一次 [委託下單](https://open.longbridge.com/docs/trade/order/submit) 動作，我們假設要以 50 HKD 買入 `700.HK` 的數量為 `100`。

> NOTE: 為了防止測試買入成功，這裡演示給了一個較低的價格，避免成交。OpenAPI 操作均等同與線上交易，請謹慎操作，開發調試注意參數細節。

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>

創建 `submit_order.py` 貼入下面的代碼：

```python
from decimal import Decimal
from longbridge.openapi import TradeContext, Config, OAuthBuilder, OrderSide, OrderType, TimeInForceType

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print(f"請造訪此 URL 進行授權：{url}")
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

運行

```bash
python submit_order.py
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

創建 `submit_order_async.py` and paste the code below:

```python
import asyncio
from decimal import Decimal
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder, OrderSide, OrderType, TimeInForceType

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(
        lambda url: print(f"請造訪此 URL 進行授權：{url}")
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

運行

```bash
python submit_order_async.py
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

創建 `submit_order.js` 貼入下面的代碼：

```javascript
const { Config, TradeContext, OrderType, OrderSide, Decimal, TimeInForceType, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('請造訪此 URL 進行授權：' + url)
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

運行

```bash
node submit_order.js
```

  </TabItem>
  <TabItem value="rust" label="Rust">

創建 `main.rs` 貼入下面的代碼：

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
        .build(|url| println!("請造訪此 URL 進行授權：{url}"))
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

運行

```bash
cargo run
```

  </TabItem>
  <TabItem value="java" label="Java">

創建 `Main.java` 貼入下面的代碼：

```java
import com.longbridge.*;
import com.longbridge.trade.*;
import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) throws Exception {
        String clientId = "your-client-id";
        OAuth oauth = new OAuthBuilder(clientId)
                .build(url -> System.out.println("請開啟此 URL 授權：" + url))
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

運行

```bash
mvn compile exec:exec
```

  </TabItem>

  <TabItem value="go" label="Go">

創建 `main.go` 貼入下面的代碼：

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

運行：

```shell
go run ./
```

  </TabItem>

  <TabItem value="cpp" label="C++">

創建 `submit_order.cpp` 貼入下面的代碼：

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

運行

```bash
g++ -std=c++17 submit_order.cpp -o submit_order -llongbridge && ./submit_order
```

  </TabItem>

</Tabs>

運行後會輸出如下：

```
SubmitOrderResponse { order_id: "718437534753550336" }
```

### 獲取當日訂單

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>

創建 `today_orders.py` 貼入下面的代碼：

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print(f"請造訪此 URL 進行授權：{url}")
)
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.today_orders()
print(resp)
```

運行

```bash
python today_orders.py
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

創建 `today_orders_async.py` and paste the code below:

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(
        lambda url: print(f"請造訪此 URL 進行授權：{url}")
    )
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)
    resp = await ctx.today_orders()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

運行

```bash
python today_orders_async.py
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

創建 `today_orders.js` 貼入下面的代碼：

```javascript
const { Config, TradeContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('請造訪此 URL 進行授權：' + url)
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

運行

```bash
node today_orders.js
```

  </TabItem>
  <TabItem value="rust" label="Rust">

創建 `main.rs` 貼入下面的代碼：

```rust
use std::sync::Arc;

use longbridge::{oauth::OAuthBuilder, trade::TradeContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("請造訪此 URL 進行授權：{url}"))
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

運行

```bash
cargo run
```

  </TabItem>
  <TabItem value="java" label="Java">

創建 `Main.java` 貼入下面的代碼：

```java
import com.longbridge.*;
import com.longbridge.trade.*;

class Main {
    public static void main(String[] args) throws Exception {
        String clientId = "your-client-id";
        OAuth oauth = new OAuthBuilder(clientId)
                .build(url -> System.out.println("請開啟此 URL 授權：" + url))
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

運行

```bash
mvn compile exec:exec
```

  </TabItem>

  <TabItem value="go" label="Go">

創建 `main.go` 貼入以下內容：

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

創建 `today_orders.cpp` 貼入下面的代碼：

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

運行

```bash
g++ -std=c++17 today_orders.cpp -o today_orders -llongbridge && ./today_orders
```

  </TabItem>

</Tabs>

運行後會輸出如下：

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

上面例子已經完整演示瞭如何使用 SDK 訪問 OpenAPI 的接口，更多其他接口請詳細閱讀 [Longbridge Developers 文檔](https://open.longbridge.com/docs)，根據不同的接口使用。

## 更多例子

我們在 Longbridge OpenAPI Python SDK 的 GitHub 倉庫中提供了上面幾個例子的完整代碼，當然後期我們也會持續往裡面補充或更新。

https://github.com/longbridge/openapi/tree/master/examples

## SDK API 文檔

SDK 的詳細 API 文檔請訪問：

https://longbridge.github.io/openapi/

## 回饋及溝通

如果您在使用 SDK 的過程中遇到任何問題，歡迎透過以下方式返回或與我們討論，我們會盡力協助您解決問題。

### GitHub Issues

在 GitHub 上，也有很多歷史的討論和問題可以參考，你也可以試著搜尋一下，或許也能找到問題的解決方案。

訪問網址：https://github.com/longbridge/developers/issues
