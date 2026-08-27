---
title: 'serve'
sidebar_label: 'JSON-RPC 服務'
sidebar_position: 98
sidebar_icon: cpu
---

# longbridge serve

`longbridge serve` 把 CLI 變成一個可供你自己的應用長期使用的數據源。它只做一次認證、只建立一次行情
WebSocket 連接，隨後在 stdin/stdout 上以「一行一個 JSON 對象」的方式響應 **JSON-RPC 2.0** 請求，並把
實時行情作為服務端通知主動推送回來。

```bash
longbridge serve
```

它的存在是因為另一種做法太差：沒有它，客戶端只能定時拉起 `longbridge <命令> --format json` 輪詢，
而每次拉起都要重做一遍區域探測、令牌載入和 WebSocket 連接，只為一次請求。啓動開銷成了大頭，延遲被
輪詢間隔鎖死，兩次輪詢之間的任何一筆跳動都看不到。`serve` 把這份開銷只付一次，並保持連接。

以換行分隔的 JSON-RPC 2.0 正是 LSP、MCP 和 ACP 共同的底層協議，所以客戶端只需要一個 JSON 解析器和
一個按行切分的讀取循環 —— 不需要協議庫，不需要 SDK，也不需要自己做 HTTP 簽名。

## 快速開始

把請求喂進去，把響應讀出來：

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"quote.quote","params":{"symbols":["700.HK"]}}' \
  '{"jsonrpc":"2.0","id":2,"method":"shutdown"}' | longbridge serve
```

`longbridge serve --help` 會打印協議摘要、通知列表和全部方法名 —— 寫客戶端時把它開着當參考。

認證與其他 CLI 命令共用，因此在同一環境下執行一次 `longbridge auth login` 就是全部配置。

## 協議

stdin / stdout 上一行一個緊湊 JSON 對象，UTF-8 編碼。一行一個請求 —— 不接受批量請求（JSON 數組），
這與 LSP、MCP 一致。

```text
請求    {"jsonrpc":"2.0","id":1,"method":"quote.quote","params":{"symbols":["700.HK"]}}
響應    {"jsonrpc":"2.0","id":1,"result":[…]}
錯誤    {"jsonrpc":"2.0","id":1,"error":{"code":-32602,"message":"…"}}
通知    {"jsonrpc":"2.0","method":"quote.updated","params":{…}}
```

有四條特性值得你在設計客戶端時就考慮進去：

- **請求併發處理**，所以一個很慢的 `trade.stock_positions` 不會卡住行情推送 —— 相應地，**響應可能
  亂序到達**，請按 JSON-RPC 的本意用 `id` 做關聯。
- **最多 8 個請求同時上行**，其餘排隊，因此突發流量只會被削峯，不會被丟棄或觸發服務端限流。
- **stdin 關閉時進程退出**，因此它永遠不會比拉起它的客戶端活得更久。`shutdown` 是顯式的關閉方式；
  兩種情況下都會給在途請求最多 5 秒收尾。
- **所有輸出都以整行寫入 stdout。** stdout 由單一寫入者獨佔，因此併發的請求處理和推送流不會在一行
  中間互相穿插。

### 會話

`initialize` 是「上報能力」而不是「協商能力」—— 客戶端不調用它也可以直接調用任意方法；但調用它，
就能在協議內發現方法列表，而不必把列表硬編碼進代碼：

```jsonc
→ {"jsonrpc":"2.0","id":1,"method":"initialize"}
← {"jsonrpc":"2.0","id":1,"result":{
    "protocolVersion":"1",
    "serverInfo":{"name":"longbridge","version":"0.28.0"},
    "capabilities":{"subscribe":["quote","depth","brokers","trades"]},
    "methods":["api.get","api.post","initialize","quote.brokers", …]
  }}
```

`shutdown` 返回 `null` 並結束會話。

## 方法體系

`serve` 位於 CLI 命令**下方**，處在所有命令共用的 API 接縫上：

```text
  CLI 命令（面向 AI 的 JSON，可自由演進）
        │
        ├── QuoteApi / TradeApi ──┐
        └── http_get / http_post ─┤
                                  ▼
                    serve（上游原始結構）
```

| 命名空間 | 覆蓋範圍 |
| --- | --- |
| `quote.*` | 全部行情接口 —— `quote.quote`、`quote.depth`、`quote.candlesticks`、`quote.watchlist` 等 |
| `trade.*` | 全部交易接口 —— `trade.stock_positions`、`trade.account_balance`、`trade.submit_order` 等 |
| `api.get` / `api.post` | 直達任意 REST 端點的透傳。基本面、選股器、IPO、新聞等數據都由此獲取 |
| `quote.subscribe` / `quote.unsubscribe` | 實時推送訂閱。沒有對應的一次性 CLI 命令 |
| `initialize` / `shutdown` | 會話控制 |

由於命名空間直接鏡像 API trait 再加上 REST 透傳，`serve` 不會落後於 CLI：新命令要麼複用已經暴露的
接縫，要麼新增一個 trait 方法 —— 而只要新增 trait 方法卻沒有對應的 RPC 方法，構建期測試就會失敗。

### 返回結構是 OpenAPI 原始結構

`result` 是上游響應本身，**不是** CLI `--format json` 的輸出。這是刻意的區分：`--format json` 為
AI 消費而重塑數據，並可隨之演進；而 `serve` 是給別人的軟件用的契約，因此它對齊
[Longbridge OpenAPI](/zh-HK/docs/api)。

具體表現為：

- `trade.account_balance` 返回 SDK 字段名 —— `buy_power`、`cash_infos`、`max_finance_amount`。
- `api.get /v1/quote/market-status` 返回 `trade_status: 204`，而不是渲染好的文案。
- 小數以**字符串**形式傳輸（`"448.600"`），因此下單路徑上的精度不會丟失在 JSON 浮點裏。
- `api.get` / `api.post` 原樣返回響應體，僅剔除 CLI 同樣會剔除的賬戶標識字段（`aaid`、
  `account_channel`）。

字段含義請在 [API 文檔](/zh-HK/docs/api)中按方法自身的名字查閱；`quote.*` 與 `trade.*` 的命名來自
它們轉發的 SDK 調用。

### 刻意不提供的方法

CLI 在本地計算出來的聚合視圖 —— 例如合併資金、持倉與匯率的 `portfolio` —— 不作為方法暴露。客戶端
應當自行用 `trade.account_balance`、`trade.stock_positions` 和 `quote.quote` 組合，而不是依賴我們的
算法。（也可以像下文的 Omarchy 插件那樣，用 `longbridge portfolio --format json` 取快照，再用實時
推送持續重估。）

## 實時推送

`quote.subscribe` 正是 `serve` 存在的理由。訂閱一次，之後靠通知過日子：

```jsonc
→ {"jsonrpc":"2.0","id":1,"method":"quote.subscribe","params":{"symbols":["700.HK"],"fields":["quote"]}}
← {"jsonrpc":"2.0","id":1,"result":{
    "subscribed":[{"symbol":"700.HK","fields":["quote"]}],
    "quotes":[{"symbol":"700.HK","last_done":"448.600","prev_close":"442.400","open":"438.200", …}]
  }}
← {"jsonrpc":"2.0","method":"quote.updated","params":{"symbol":"700.HK","last_done":"448.600","volume":12441624,"current_volume":600,"trade_session":"Intraday","timestamp":"2026-08-19T05:51:30Z", …}}
← {"jsonrpc":"2.0","method":"quote.updated","params":{"symbol":"700.HK","last_done":"448.700", …}}
```

**`fields`** 決定接收哪些數據 —— `quote`、`depth`、`brokers`、`trades`；不傳時默認為 `["quote"]`。
每類數據有各自的通知：

| 通知 | 參數 |
| --- | --- |
| `quote.updated` | `symbol`、`last_done`、`open`、`high`、`low`、`volume`、`turnover`、`current_volume`、`current_turnover`、`trade_status`、`trade_session`、`timestamp` |
| `quote.depth` | `symbol`、`asks`、`bids` |
| `quote.brokers` | `symbol`、`ask_brokers`、`bid_brokers` |
| `quote.trades` | `symbol`、`trades` |

有三點務必處理正確：

1. **`quote.updated` 是一筆跳動，不是完整報價。** 它不帶 `prev_close`，也不帶標的名稱 —— 請把它疊加
   到快照上，而不是當作快照使用。`subscribe` 結果裏的 `quotes` 數組就是那份起始快照；若這一次快照
   調用失敗，該字段會直接省略（訂閱本身依然生效），此時回退到 `quote.quote` 即可。
2. **推送可能比快照更舊。** 快照是在訂閱之後取的，因此不會漏掉任何變化；但推送可能搶在快照之前
   到達 —— 請保留 `timestamp` 更新的那一份。這與處理亂序響應本來就需要的規則是同一條。
3. **`quote.unsubscribe` 會退訂該標的的全部字段**，而不只是你列出的那些。訂閱與退訂都會返回完整的
   `subscribed` 列表，因此當前會話究竟在接收什麼始終是明確的。

推送本身完全不需要定時器。設計良好的客戶端只在「發生了什麼」時才發請求 —— 視圖打開、會話重連、
關注的標的集合變化，或某隻標的進入了另一個交易時段（這是推送唯一無法獨立表達的事情，因為推送不
攜帶昨收價）。

## 錯誤

錯誤碼遵循 JSON-RPC，其劃分直接告訴客戶端「重試有沒有用」：

| 錯誤碼 | 含義 | 是否可重試 |
| --- | --- | --- |
| `-32700` | 解析錯誤 —— 該行不是合法 JSON | 否 |
| `-32600` | 非法請求 —— 不是 JSON-RPC 2.0 對象 | 否 |
| `-32601` | 未知方法 —— 通常是本機 CLI 版本早於你需要的方法 | 否；提示用户升級 |
| `-32602` | 參數錯誤 —— 消息中會指出字段名和出錯的取值 | 否，原樣重試無用 |
| `-32000` | 上游失敗 —— Longbridge 或網絡 | 是，配合退避 |

參數錯誤會説清楚哪裏不對，可以直接展示給用户：

```jsonc
← {"jsonrpc":"2.0","id":4,"error":{"code":-32602,"message":"`market`: Unknown market 'MARS'. Use: HK US CN SG"}}
```

錯誤永遠不會結束會話 —— 一個錯誤的標的代碼不該拖垮客戶端的實時行情。

## 參數約定

參數與同名 OpenAPI 請求保持一致，另有這些與 CLI 共用的寫法：

| 類型 | 取值 |
| --- | --- |
| `symbol` / `symbols` | `代碼.市場`，如 `"700.HK"`；`symbols` 為數組 |
| `market` | `HK`、`US`、`CN`（`SH` / `SZ`）、`SG` |
| `period` | `1m`、`5m`、`15m`、`30m`、`1h`、`day`、`week`、`month`、`year` |
| `adjust` | `none`（默認）或 `forward` |
| 日期 | `YYYY-MM-DD`（`start`、`end`、`expiry_date`） |
| 日期時間 | `trade.history_orders`、`trade.history_executions`、`trade.cash_flow` 的 `start` / `end` |
| 小數 | 字符串 —— `"quantity":"100"`、`"price":"448.6"` |
| `query`（`api.get`） | 對象；字符串、數字、布爾均可，會被轉成字符串 |

可選的數量參數有默認值：`quote.trades` 的 `count` 為 20，`quote.candlesticks` 的 `count` 為 100。

## 完整方法列表

以 `initialize` 的返回為準，以下是 0.28.0 暴露的方法。

**會話與透傳** —— `initialize`、`shutdown`、`api.get`、`api.post`

**實時推送** —— `quote.subscribe`、`quote.unsubscribe`

**`quote.*`** —— `quote`、`depth`、`brokers`、`trades`、`intraday`、`candlesticks`、
`history_candlesticks_by_date`、`history_candlesticks_by_offset`、`static_info`、
`us_crypto_overview`、`calc_indexes`、`capital_flow`、`capital_distribution`、`market_temperature`、
`history_market_temperature`、`trading_session`、`trading_days`、`security_list`、`participants`、
`subscriptions`、`option_quote`、`option_chain_expiry_date_list`、`option_chain_info_by_date`、
`warrant_quote`、`warrant_list`、`warrant_issuers`、`watchlist`、`create_watchlist_group`、
`delete_watchlist_group`、`update_watchlist_group`

**`trade.*`** —— `today_orders`、`history_orders`、`order_detail`、`today_executions`、
`history_executions`、`submit_order`、`cancel_order`、`replace_order`、`account_balance`、
`cash_flow`、`stock_positions`、`fund_positions`、`margin_ratio`、`estimate_max_purchase_quantity`

## 一個最小客戶端

四十行就夠跑通一條實時行情：

```python
import json, subprocess, threading, itertools

proc = subprocess.Popen(
    ["longbridge", "serve"],
    stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True, bufsize=1,
)
next_id = itertools.count(1)
pending = {}

def send(method, params=None):
    rid = next(next_id)
    req = {"jsonrpc": "2.0", "id": rid, "method": method}
    if params is not None:
        req["params"] = params
    proc.stdin.write(json.dumps(req) + "\n")
    proc.stdin.flush()
    return rid

def reader():
    for line in proc.stdout:
        msg = json.loads(line)
        if "id" in msg:                       # 響應 —— 用 id 關聯
            pending[msg["id"]] = msg
            if "error" in msg:
                print("error", msg["error"])
            elif msg["id"] == sub_id:
                for q in msg["result"].get("quotes", []):
                    print("snapshot", q["symbol"], q["last_done"])
        else:                                 # 通知 —— 沒有 id
            p = msg["params"]
            print(msg["method"], p["symbol"], p.get("last_done"))

threading.Thread(target=reader, daemon=True).start()
sub_id = send("quote.subscribe", {"symbols": ["700.HK", "AAPL.US"], "fields": ["quote"]})
input("streaming — 回車結束\n")
send("shutdown")
```

換成任何語言都是同一套骨架：拉起進程、一行寫一個 JSON 對象、一行讀一個，然後把響應（有 `id`）和
通知（沒有 `id`）分開處理。

## 案例：Longbridge for Omarchy

[Longbridge for Omarchy](https://github.com/longbridge/omarchy-longbridge) 是
[Omarchy](https://omarchy.org) 狀態欄上的自選股與持倉面板，用 QML 寫成 —— 沒有用任何 Longbridge
SDK，只有管道另一端的 `longbridge serve`。它很適合用來說明真實的 `serve` 客戶端長什麼樣。

| 自選股 | 持倉 | 個股詳情 |
| --- | --- | --- |
| ![帶實時價格與分時縮略圖的自選股列表](https://assets.lbkrs.com/uploads/1bde3f7f-25a6-4e81-afa3-9d7fc1d75699/longbridge-panel-0.png) | ![帶盈虧、資產分佈與實時持倉的持倉頁](https://assets.lbkrs.com/uploads/b8c13421-1679-4d65-9b43-bd17c5f79a87/longbridge-portfolio.png) | ![帶漲跌、走勢圖與基本面的個股詳情](https://assets.lbkrs.com/uploads/c785ccc7-5f71-4900-9d36-6b9df91fd350/longbridge-detail.png) |

### 安裝

```bash
omarchy plugin add https://github.com/longbridge/omarchy-longbridge.git --enable
```

然後從狀態欄打開 Longbridge。歡迎頁會檢查是否已安裝 Longbridge CLI，未安裝時給出
[安裝指引](/zh-HK/docs/cli/install)鏈接，隨後提供 **Log in to Longbridge**，並用
`longbridge check --format json` 驗證登錄狀態。插件自身不會下載或執行任何安裝程序。

### 它是怎麼用 `serve` 的

- **一個長期存活的會話。** 面板打開期間只運行一個 `longbridge serve` 進程。啓動它大約需要 1.5 秒
  —— 幾乎全部花在進程啓動、認證和 WebSocket 握手上 —— 而之後的每個請求大約 150 毫秒。所以關閉面板
  只是把會話**掛起**而不是殺掉：進程和它的訂閱會繼續存活十分鐘，在這段時間內重新打開可以立刻出價，
  期間到達的行情也已經緩衝好了。空閒十分鐘後進程才停止 —— 而且 `serve` 本來就在 stdin EOF 時退出，
  所以它絕不會比 shell 活得更久。
- **完全不輪詢。** 分組來自 `quote.watchlist`，首屏價格來自 `quote.quote`，`quote.static_info` 補上
  貨幣與名稱 —— 這份快照只用來建立推送無法攜帶的信息。此後它靠 `quote.subscribe` 與 `quote.updated`
  通知過活。沒有刷新按鈕，也沒有刷新間隔；只有面板打開、會話重連、切換分組，或某隻標的進入另一個
  交易時段時，才會發出請求。
- **推送是被摺疊的，不是被追着跑的。** 更新按標的合併，每 500 毫秒應用一次 —— 那是一次渲染節拍，
  不是一次取數 —— 因此一個活躍分組每分鐘重繪二十次，而不是每條通知重繪一次。刷新按鈕的位置上是
  `LIVE` 指示燈：推送正常時為綠色，否則顯示 `CONNECTING` 或 `OFFLINE`。
- **分時縮略圖來自 `quote.candlesticks`。** 每行畫 60 根 5 分鐘收盤價，並在昨收價上畫一條虛線。
  某一行第一次被繪製時才去請求自己的圖，且同時最多三個請求在途，所以幾百只的分組也只取屏幕上真正
  顯示的那些。
- **`holdings` 分組是特例。** 自選股接口對它永遠返回空，因為它的成員就是賬戶自身的持倉 —— 所以它由
  `trade.stock_positions` 填充，這也正是 Longbridge CLI 自己的 TUI 的做法。
- **持倉頁用的是 CLI，不是 `serve`。** `longbridge portfolio --format json` 提供了 `serve` 刻意不做
  的跨幣種彙總與盈虧；隨後這些持倉被登記到同一條行情推送上，所以市值和盈虧會在兩次快照之間隨行情
  變動。
- **上次狀態會被緩存。** 分組、當前分組和每隻標的最近一次報價都會寫到磁盤，因此重啓後能在毫秒級
  畫出上次的列表並在後台刷新，而不是在會話啓動期間顯示一個空面板。

## 注意事項

- `serve` 與其他命令一樣需要 `longbridge auth login` 的登錄態，且必須在拉起它的同一環境中完成。
  桌面應用未必繼承 shell 的 `PATH` —— 找不到 `longbridge` 時請使用可執行文件的完整路徑。
- 本該存在的方法返回 `-32601`，說明本機 CLI 版本過舊，請提示用户執行 `longbridge update`。
- 寫操作（`trade.submit_order`、`trade.cancel_order`、`trade.replace_order`）是暴露的，會下真實
  委託，且沒有二次確認環節。
