---
title: 'serve'
sidebar_label: 'JSON-RPC 服务'
sidebar_position: 98
sidebar_icon: cpu
---

# longbridge serve

`longbridge serve` 把 CLI 变成一个可供你自己的应用长期使用的数据源。它只做一次认证、只建立一次行情
WebSocket 连接，随后在 stdin/stdout 上以「一行一个 JSON 对象」的方式响应 **JSON-RPC 2.0** 请求，并把
实时行情作为服务端通知主动推送回来。

```bash
longbridge serve
```

它的存在是因为另一种做法太差：没有它，客户端只能定时拉起 `longbridge <命令> --format json` 轮询，
而每次拉起都要重做一遍区域探测、令牌加载和 WebSocket 连接，只为一次请求。启动开销成了大头，延迟被
轮询间隔锁死，两次轮询之间的任何一笔跳动都看不到。`serve` 把这份开销只付一次，并保持连接。

以换行分隔的 JSON-RPC 2.0 正是 LSP、MCP 和 ACP 共同的底层协议，所以客户端只需要一个 JSON 解析器和
一个按行切分的读取循环 —— 不需要协议库，不需要 SDK，也不需要自己做 HTTP 签名。

## 快速开始

把请求喂进去，把响应读出来：

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"quote.quote","params":{"symbols":["700.HK"]}}' \
  '{"jsonrpc":"2.0","id":2,"method":"shutdown"}' | longbridge serve
```

`longbridge serve --help` 会打印协议摘要、通知列表和全部方法名 —— 写客户端时把它开着当参考。

认证与其他 CLI 命令共用，因此在同一环境下执行一次 `longbridge auth login` 就是全部配置。

## 协议

stdin / stdout 上一行一个紧凑 JSON 对象，UTF-8 编码。一行一个请求 —— 不接受批量请求（JSON 数组），
这与 LSP、MCP 一致。

```text
请求    {"jsonrpc":"2.0","id":1,"method":"quote.quote","params":{"symbols":["700.HK"]}}
响应    {"jsonrpc":"2.0","id":1,"result":[…]}
错误    {"jsonrpc":"2.0","id":1,"error":{"code":-32602,"message":"…"}}
通知    {"jsonrpc":"2.0","method":"quote.updated","params":{…}}
```

有四条特性值得你在设计客户端时就考虑进去：

- **请求并发处理**，所以一个很慢的 `trade.stock_positions` 不会卡住行情推送 —— 相应地，**响应可能
  乱序到达**，请按 JSON-RPC 的本意用 `id` 做关联。
- **最多 8 个请求同时上行**，其余排队，因此突发流量只会被削峰，不会被丢弃或触发服务端限流。
- **stdin 关闭时进程退出**，因此它永远不会比拉起它的客户端活得更久。`shutdown` 是显式的关闭方式；
  两种情况下都会给在途请求最多 5 秒收尾。
- **所有输出都以整行写入 stdout。** stdout 由单一写入者独占，因此并发的请求处理和推送流不会在一行
  中间互相穿插。

### 会话

`initialize` 是「上报能力」而不是「协商能力」—— 客户端不调用它也可以直接调用任意方法；但调用它，
就能在协议内发现方法列表，而不必把列表硬编码进代码：

```jsonc
→ {"jsonrpc":"2.0","id":1,"method":"initialize"}
← {"jsonrpc":"2.0","id":1,"result":{
    "protocolVersion":"1",
    "serverInfo":{"name":"longbridge","version":"0.28.0"},
    "capabilities":{"subscribe":["quote","depth","brokers","trades"]},
    "methods":["api.get","api.post","initialize","quote.brokers", …]
  }}
```

`shutdown` 返回 `null` 并结束会话。

## 方法体系

`serve` 位于 CLI 命令**下方**，处在所有命令共用的 API 接缝上：

```text
  CLI 命令（面向 AI 的 JSON，可自由演进）
        │
        ├── QuoteApi / TradeApi ──┐
        └── http_get / http_post ─┤
                                  ▼
                    serve（上游原始结构）
```

| 命名空间 | 覆盖范围 |
| --- | --- |
| `quote.*` | 全部行情接口 —— `quote.quote`、`quote.depth`、`quote.candlesticks`、`quote.watchlist` 等 |
| `trade.*` | 全部交易接口 —— `trade.stock_positions`、`trade.account_balance`、`trade.submit_order` 等 |
| `api.get` / `api.post` | 直达任意 REST 端点的透传。基本面、选股器、IPO、新闻等数据都由此获取 |
| `quote.subscribe` / `quote.unsubscribe` | 实时推送订阅。没有对应的一次性 CLI 命令 |
| `initialize` / `shutdown` | 会话控制 |

由于命名空间直接镜像 API trait 再加上 REST 透传，`serve` 不会落后于 CLI：新命令要么复用已经暴露的
接缝，要么新增一个 trait 方法 —— 而只要新增 trait 方法却没有对应的 RPC 方法，构建期测试就会失败。

### 返回结构是 OpenAPI 原始结构

`result` 是上游响应本身，**不是** CLI `--format json` 的输出。这是刻意的区分：`--format json` 为
AI 消费而重塑数据，并可随之演进；而 `serve` 是给别人的软件用的契约，因此它对齐
[Longbridge OpenAPI](/zh-CN/docs/api)。

具体表现为：

- `trade.account_balance` 返回 SDK 字段名 —— `buy_power`、`cash_infos`、`max_finance_amount`。
- `api.get /v1/quote/market-status` 返回 `trade_status: 204`，而不是渲染好的文案。
- 小数以**字符串**形式传输（`"448.600"`），因此下单路径上的精度不会丢失在 JSON 浮点里。
- `api.get` / `api.post` 原样返回响应体，仅剔除 CLI 同样会剔除的账户标识字段（`aaid`、
  `account_channel`）。

字段含义请在 [API 文档](/zh-CN/docs/api)中按方法自身的名字查阅；`quote.*` 与 `trade.*` 的命名来自
它们转发的 SDK 调用。

### 刻意不提供的方法

CLI 在本地计算出来的聚合视图 —— 例如合并资金、持仓与汇率的 `portfolio` —— 不作为方法暴露。客户端
应当自行用 `trade.account_balance`、`trade.stock_positions` 和 `quote.quote` 组合，而不是依赖我们的
算法。（也可以像下文的 Omarchy 插件那样，用 `longbridge portfolio --format json` 取快照，再用实时
推送持续重估。）

## 实时推送

`quote.subscribe` 正是 `serve` 存在的理由。订阅一次，之后靠通知过日子：

```jsonc
→ {"jsonrpc":"2.0","id":1,"method":"quote.subscribe","params":{"symbols":["700.HK"],"fields":["quote"]}}
← {"jsonrpc":"2.0","id":1,"result":{
    "subscribed":[{"symbol":"700.HK","fields":["quote"]}],
    "quotes":[{"symbol":"700.HK","last_done":"448.600","prev_close":"442.400","open":"438.200", …}]
  }}
← {"jsonrpc":"2.0","method":"quote.updated","params":{"symbol":"700.HK","last_done":"448.600","volume":12441624,"current_volume":600,"trade_session":"Intraday","timestamp":"2026-08-19T05:51:30Z", …}}
← {"jsonrpc":"2.0","method":"quote.updated","params":{"symbol":"700.HK","last_done":"448.700", …}}
```

**`fields`** 决定接收哪些数据 —— `quote`、`depth`、`brokers`、`trades`；不传时默认为 `["quote"]`。
每类数据有各自的通知：

| 通知 | 参数 |
| --- | --- |
| `quote.updated` | `symbol`、`last_done`、`open`、`high`、`low`、`volume`、`turnover`、`current_volume`、`current_turnover`、`trade_status`、`trade_session`、`timestamp` |
| `quote.depth` | `symbol`、`asks`、`bids` |
| `quote.brokers` | `symbol`、`ask_brokers`、`bid_brokers` |
| `quote.trades` | `symbol`、`trades` |

有三点务必处理正确：

1. **`quote.updated` 是一笔跳动，不是完整报价。** 它不带 `prev_close`，也不带标的名称 —— 请把它叠加
   到快照上，而不是当作快照使用。`subscribe` 结果里的 `quotes` 数组就是那份起始快照；若这一次快照
   调用失败，该字段会直接省略（订阅本身依然生效），此时回退到 `quote.quote` 即可。
2. **推送可能比快照更旧。** 快照是在订阅之后取的，因此不会漏掉任何变化；但推送可能抢在快照之前
   到达 —— 请保留 `timestamp` 更新的那一份。这与处理乱序响应本来就需要的规则是同一条。
3. **`quote.unsubscribe` 会退订该标的的全部字段**，而不只是你列出的那些。订阅与退订都会返回完整的
   `subscribed` 列表，因此当前会话究竟在接收什么始终是明确的。

推送本身完全不需要定时器。设计良好的客户端只在「发生了什么」时才发请求 —— 视图打开、会话重连、
关注的标的集合变化，或某只标的进入了另一个交易时段（这是推送唯一无法独立表达的事情，因为推送不
携带昨收价）。

## 错误

错误码遵循 JSON-RPC，其划分直接告诉客户端「重试有没有用」：

| 错误码 | 含义 | 是否可重试 |
| --- | --- | --- |
| `-32700` | 解析错误 —— 该行不是合法 JSON | 否 |
| `-32600` | 非法请求 —— 不是 JSON-RPC 2.0 对象 | 否 |
| `-32601` | 未知方法 —— 通常是本机 CLI 版本早于你需要的方法 | 否；提示用户升级 |
| `-32602` | 参数错误 —— 消息中会指出字段名和出错的取值 | 否，原样重试无用 |
| `-32000` | 上游失败 —— Longbridge 或网络 | 是，配合退避 |

参数错误会说清楚哪里不对，可以直接展示给用户：

```jsonc
← {"jsonrpc":"2.0","id":4,"error":{"code":-32602,"message":"`market`: Unknown market 'MARS'. Use: HK US CN SG"}}
```

错误永远不会结束会话 —— 一个错误的标的代码不该拖垮客户端的实时行情。

## 参数约定

参数与同名 OpenAPI 请求保持一致，另有这些与 CLI 共用的写法：

| 类型 | 取值 |
| --- | --- |
| `symbol` / `symbols` | `代码.市场`，如 `"700.HK"`；`symbols` 为数组 |
| `market` | `HK`、`US`、`CN`（`SH` / `SZ`）、`SG` |
| `period` | `1m`、`5m`、`15m`、`30m`、`1h`、`day`、`week`、`month`、`year` |
| `adjust` | `none`（默认）或 `forward` |
| 日期 | `YYYY-MM-DD`（`start`、`end`、`expiry_date`） |
| 日期时间 | `trade.history_orders`、`trade.history_executions`、`trade.cash_flow` 的 `start` / `end` |
| 小数 | 字符串 —— `"quantity":"100"`、`"price":"448.6"` |
| `query`（`api.get`） | 对象；字符串、数字、布尔均可，会被转成字符串 |

可选的数量参数有默认值：`quote.trades` 的 `count` 为 20，`quote.candlesticks` 的 `count` 为 100。

## 完整方法列表

以 `initialize` 的返回为准，以下是 0.28.0 暴露的方法。

**会话与透传** —— `initialize`、`shutdown`、`api.get`、`api.post`

**实时推送** —— `quote.subscribe`、`quote.unsubscribe`

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

## 一个最小客户端

四十行就够跑通一条实时行情：

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
        if "id" in msg:                       # 响应 —— 用 id 关联
            pending[msg["id"]] = msg
            if "error" in msg:
                print("error", msg["error"])
            elif msg["id"] == sub_id:
                for q in msg["result"].get("quotes", []):
                    print("snapshot", q["symbol"], q["last_done"])
        else:                                 # 通知 —— 没有 id
            p = msg["params"]
            print(msg["method"], p["symbol"], p.get("last_done"))

threading.Thread(target=reader, daemon=True).start()
sub_id = send("quote.subscribe", {"symbols": ["700.HK", "AAPL.US"], "fields": ["quote"]})
input("streaming — 回车结束\n")
send("shutdown")
```

换成任何语言都是同一套骨架：拉起进程、一行写一个 JSON 对象、一行读一个，然后把响应（有 `id`）和
通知（没有 `id`）分开处理。

## 案例：Longbridge for Omarchy

[Longbridge for Omarchy](https://github.com/longbridge/omarchy-longbridge) 是
[Omarchy](https://omarchy.org) 状态栏上的自选股与持仓面板，用 QML 写成 —— 没有用任何 Longbridge
SDK，只有管道另一端的 `longbridge serve`。它很适合用来说明真实的 `serve` 客户端长什么样。

| 自选股 | 持仓 | 个股详情 |
| --- | --- | --- |
| ![带实时价格与分时缩略图的自选股列表](https://assets.lbkrs.com/uploads/1bde3f7f-25a6-4e81-afa3-9d7fc1d75699/longbridge-panel-0.png) | ![带盈亏、资产分布与实时持仓的持仓页](https://assets.lbkrs.com/uploads/b8c13421-1679-4d65-9b43-bd17c5f79a87/longbridge-portfolio.png) | ![带涨跌、走势图与基本面的个股详情](https://assets.lbkrs.com/uploads/c785ccc7-5f71-4900-9d36-6b9df91fd350/longbridge-detail.png) |

### 安装

```bash
omarchy plugin add https://github.com/longbridge/omarchy-longbridge.git --enable
```

然后从状态栏打开 Longbridge。欢迎页会检查是否已安装 Longbridge CLI，未安装时给出
[安装指引](/zh-CN/docs/cli/install)链接，随后提供 **Log in to Longbridge**，并用
`longbridge check --format json` 验证登录状态。插件自身不会下载或执行任何安装程序。

### 它是怎么用 `serve` 的

- **一个长期存活的会话。** 面板打开期间只运行一个 `longbridge serve` 进程。启动它大约需要 1.5 秒
  —— 几乎全部花在进程启动、认证和 WebSocket 握手上 —— 而之后的每个请求大约 150 毫秒。所以关闭面板
  只是把会话**挂起**而不是杀掉：进程和它的订阅会继续存活十分钟，在这段时间内重新打开可以立刻出价，
  期间到达的行情也已经缓冲好了。空闲十分钟后进程才停止 —— 而且 `serve` 本来就在 stdin EOF 时退出，
  所以它绝不会比 shell 活得更久。
- **完全不轮询。** 分组来自 `quote.watchlist`，首屏价格来自 `quote.quote`，`quote.static_info` 补上
  货币与名称 —— 这份快照只用来建立推送无法携带的信息。此后它靠 `quote.subscribe` 与 `quote.updated`
  通知过活。没有刷新按钮，也没有刷新间隔；只有面板打开、会话重连、切换分组，或某只标的进入另一个
  交易时段时，才会发出请求。
- **推送是被折叠的，不是被追着跑的。** 更新按标的合并，每 500 毫秒应用一次 —— 那是一次渲染节拍，
  不是一次取数 —— 因此一个活跃分组每分钟重绘二十次，而不是每条通知重绘一次。刷新按钮的位置上是
  `LIVE` 指示灯：推送正常时为绿色，否则显示 `CONNECTING` 或 `OFFLINE`。
- **分时缩略图来自 `quote.candlesticks`。** 每行画 60 根 5 分钟收盘价，并在昨收价上画一条虚线。
  某一行第一次被绘制时才去请求自己的图，且同时最多三个请求在途，所以几百只的分组也只取屏幕上真正
  显示的那些。
- **`holdings` 分组是特例。** 自选股接口对它永远返回空，因为它的成员就是账户自身的持仓 —— 所以它由
  `trade.stock_positions` 填充，这也正是 Longbridge CLI 自己的 TUI 的做法。
- **持仓页用的是 CLI，不是 `serve`。** `longbridge portfolio --format json` 提供了 `serve` 刻意不做
  的跨币种汇总与盈亏；随后这些持仓被登记到同一条行情推送上，所以市值和盈亏会在两次快照之间随行情
  变动。
- **上次状态会被缓存。** 分组、当前分组和每只标的最近一次报价都会写到磁盘，因此重启后能在毫秒级
  画出上次的列表并在后台刷新，而不是在会话启动期间显示一个空面板。

## 注意事项

- `serve` 与其他命令一样需要 `longbridge auth login` 的登录态，且必须在拉起它的同一环境中完成。
  桌面应用未必继承 shell 的 `PATH` —— 找不到 `longbridge` 时请使用可执行文件的完整路径。
- 本该存在的方法返回 `-32601`，说明本机 CLI 版本过旧，请提示用户执行 `longbridge update`。
- 写操作（`trade.submit_order`、`trade.cancel_order`、`trade.replace_order`）是暴露的，会下真实
  委托，且没有二次确认环节。
