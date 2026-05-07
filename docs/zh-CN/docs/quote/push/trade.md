---
id: push_trade
title: 实时成交明细推送
slug: trade
sidebar_position: 4
---

已订阅的标的的实时逐笔成交明细推送。

<QuotePermission command="trades" />

<SDKLinks module="quote" klass="QuoteContext" method="set_on_trades" go="OnTrade" />

:::info

[业务指令](../../socket/protocol/push)：`104`

:::

## 数据格式

### Properties

| Name            | Type     | Description                                                                       |
|-----------------|----------|-----------------------------------------------------------------------------------|
| symbol          | string   | 标的代码，例如：`AAPL.US`                                                           |
| sequence        | int64    | 序列号                                                                            |
| trades          | object[] | 逐笔明细数据                                                                      |
| ∟ price         | string   | 价格                                                                              |
| ∟ volume        | int64    | 成交量                                                                            |
| ∟ timestamp     | int64    | 成交时间                                                                          |
| ∟ trade_type    | string   | [交易类型说明](#交易类型)                                                         |
| ∟ direction     | int32    | 交易方向 <br /><br />**可选值：**<br />`0` - neutral<br />`1` - down<br />`2` - up |
| ∟ trade_session | int32    | 交易时段，详见 [TradeSession](../objects#tradesession---交易时段)                  |

#### 交易类型

港股

- `*` - 场外交易
- `D` - 碎股交易
- `M` - 非自动对盘
- `P` - 开市前成交盘
- `U` - 竞价交易
- `X` - 同一券商非自动对盘
- `Y` - 同一券商自动对盘
- ` ` - 自动对盘

美股

- ` ` - 自动对盘
- `A` - 收购
- `B` - 批量交易
- `D` - 分配
- `F` - 跨市扫盘单
- `G` - 批量卖出
- `H` - 离价交易
- `I` - 碎股交易
- `K` - 第 155 条交易（纽交所规则）
- `M` - 交易所收盘价
- `P` - 前参考价
- `Q` - 交易所开盘价
- `S` - 拆单交易
- `V` - 附属交易
- `W` - 平均价成交
- `X` - 跨市场交易
- `1` - 停售股票（常规交易）

### Protobuf

```protobuf
message PushTrade {
  string symbol = 1;
  int64 sequence = 2;
  repeated Trade trade = 3;
}

message Trade {
  string price = 1;
  int64 volume = 2;
  int64 timestamp = 3;
  string trade_type = 4;
  int32 direction = 5;
  TradeSession trade_session = 6;
}
```

### Example

```python
from time import sleep
from longbridge.openapi import QuoteContext, Config, SubType, PushTrades, OAuthBuilder

def on_trades(symbol: str, event: PushTrades):
    print(symbol, event)

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
ctx.set_on_trades(on_trades)

ctx.subscribe(["700.HK", "AAPL.US"], [SubType.Trade])
sleep(30)
```

### JSON Example

```json
{
  "symbol": "700.HK",
  "sequence": 160808750000000,
  "trades": [
    {
      "price": "158.760",
      "volume": 1,
      "timestamp": 1651103979,
      "trade_type": "I",
      "direction": 0,
      "trade_session": 2
    },
    {
      "price": "158.745",
      "volume": 1,
      "timestamp": 1651103985,
      "trade_type": "I",
      "direction": 0,
      "trade_session": 2
    },
    {
      "price": "158.800",
      "volume": 1,
      "timestamp": 1651103995,
      "trade_type": "I",
      "direction": 0,
      "trade_session": 2
    }
  ]
}
```
