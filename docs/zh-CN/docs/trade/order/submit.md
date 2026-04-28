---
slug: submit
title: 委托下单
search: true
headingLevel: 3
---

该接口用于港美股，窝轮，期权的委托下单。

<CliCommand>
longbridge buy TSLA.US 100 --price 250.00
longbridge sell TSLA.US 100 --price 260.00
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="submit_order" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/trade/order </td></tr>
</tbody>
</table>

## Parameters

> Content-Type: application/json; charset=utf-8

| Name               | Type   | Required | Description                                                                                                                               |
| ------------------ | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| symbol             | string | YES      | 股票代码，使用 `ticker.region` 格式，例如：`AAPL.US`                                                                                      |
| order_type         | string | YES      | [订单类型](../trade-definition#ordertype)                                                                                                 |
| submitted_price    | string | NO       | 下单价格，例如：`388.5`<br/><br/> `LO` / `ELO` / `ALO` / `ODD` / `LIT` 订单必填                                                           |
| submitted_quantity | string | YES      | 下单数量，例如：`100`                                                                                                                     |
| trigger_price      | string | NO       | 触发价格，例如：`388.5`<br/><br/> `LIT` / `MIT` 订单必填                                                                                  |
| limit_offset       | string | NO       | 指定价差，例如 "1.2" 表示价差 1.2 USD (如果是美股)<br/><br/> `TSLPAMT` / `TSLPPCT` 订单在 `limit_depth_level` 为 0 时必填 |
| trailing_amount    | string | NO       | 跟踪金额<br/><br/> `TSLPAMT` 订单必填                                                                                                     |
| trailing_percent   | string | NO       | 跟踪涨跌幅，单位为百分比，例如 "2.5" 表示 "2.5%"<br/><br/> `TSLPPCT` 订单必填                                                             |
| expire_date        | string | NO       | 长期单过期时间，格式为 `YYYY-MM-DD`, 例如：`2022-12-05`<br/><br/> time_in_force 为 `GTD` 时必填                                           |
| side               | string | YES      | 买卖方向<br/><br/> **可选值：**<br/> `Buy` - 买入<br/> `Sell` - 卖出                                                                      |
| outside_rth        | string | NO       | 是否允许盘前盘后，美股必填<br/><br/> **可选值：**<br/> `RTH_ONLY` - 不允许盘前盘后<br/> `ANY_TIME` - 允许盘前盘后<br/> `OVERNIGHT` - 夜盘 |
| time_in_force      | string | YES      | 订单有效期类型<br/><br/> **可选值：**<br/> `Day` - 当日有效<br/> `GTC` - 撤单前有效<br/> `GTD` - 到期前有效                               |
| remark             | string | NO       | 备注 (最大 64 字符)                                                                                                                       |
| limit_depth_level  | int32  | NO       | 指定买卖档位，取值范围为 -5 ～ 0 ～ 5，负数代表买盘档位（如 -1 表示买一），<br/>正数代表卖盘档位（如 1 表示卖一），为 0 时 limit_offset 参数生效<br/>`TSLPAMT` / `TSLPPCT` 订单有效 |
| monitor_price      | string |  NO      | 监控价格，需要达到该价格才会开始监控，更新参考价<br/>`TSLPAMT` / `TSLPPCT` 订单有效 |
| trigger_count      | int32  |  NO      | 触发次数，取值范围 0 ~ 3, 表示在 1 分钟内触发多次才会触发订单<br/>`LIT` / `MIT` / `TSLPAMT` / `TSLPPCT` 订单有效 |

## Examples

为了方便理解，我们下面以 Python 作为示例，介绍如何实现一些场景的下单操作。

### 建仓买入

我们期望以 380 HKD 价格，买入 100 股 `700.HK`，并设定“订单当日有效”。

```py
from decimal import Decimal
from longbridge.openapi import TradeContext, Config, OrderType, OrderSide, TimeInForceType, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# Create a context for trade APIs
ctx = TradeContext(config)

resp = ctx.submit_order(
    "700.HK",
    OrderType.LO,
    OrderSide.Buy,
    Decimal(100),
    TimeInForceType.Day,
    submitted_price=Decimal(380),
    remark="Hello from Python SDK",
)
```

其中：

- `OrderSide.Buy` - 表示买入
- `OrderType.LO` - 表示挂单为**限价单**，当为限价单时，我们需要传递 `submitted_price` 参数
- `TimeInForceType.Day` - 表示订单当日有效

### 平仓卖出

提交市价单，卖出 100 股 `700.HK`，并设定“订单当日有效”。

```py
ctx.submit_order(
    "700.HK",
    OrderType.MO,
    OrderSide.Sell,
    Decimal(100),
    TimeInForceType.Day,
    remark="Hello from Python SDK",
)
```

- `OrderType.MO` - 表示挂单为**市价单**
- `OrderSide.Sell` - 表示卖出

### 到价止盈止损

> 对应我们客户端下单界面上的“到价买入”和“到价卖出”订单类型。

假定我们在持有 100 股 `NVDA.US` 前提下，监控市价在跌破 1000.00 USD 价格时，以 999.00 限价单平仓，并设定**订单撤销前有效**。

:::tip
**订单撤销前有效** - 是指订单在达到条件后，会一直有效直到被成交或者被撤销。
:::

```py
ctx.submit_order(
    "NVDA.US",
    OrderType.LIT,
    OrderSide.Sell,
    Decimal(100),
    TimeInForceType.GoodTilCanceled,
    Decimal("999.00"),
    trigger_price=Decimal("1000.00"),
    remark="Hello from Python SDK",
)
```

- `OrderType.LIT` - 表示挂单为**触价限价单**
- `TimeInForceType.GoodTilCanceled` - 表示订单撤销前有效
- `trigger_price` - 参数用于设定触发价格，当行情价格达到触发价格时，订单会被提交

### 跟踪止盈止损

> 对应我们客户端下单界面上的“反弹买入”和“回落卖出”订单类型。

我们有时候需要设定一个跟踪止盈止损，以保护我们的盈利或者减少损失。

假定我们持有 100 股 `NVDA.US`，提交一个条件单，监控 `NVDA.US` 的行情变化，当市价在下单后的**最高点回落** 0.5% 时，按照触发时的市价，减少 1.2 USD，挂出一个限价单，订单在 6 月 30 日前有效。

可以用下面的代码实现：

```py
ctx.submit_order(
    "NVDA.US",
    OrderType.TSLPPCT,
    OrderSide.Sell,
    Decimal(100),
    TimeInForceType.GoodTilDate,
    expire_date=datetime.date(2024, 6, 30),
    trailing_percent=Decimal("0.5"),
    limit_offset=Decimal("1.2"),
    remark="Hello from Python SDK",
)
```

- `OrderType.TSLPPCT` - 表示挂单为**跟踪止损限价单 (跟踪涨跌幅)**，这里如果你想要使用**跟踪金额**，可以使用 `TSLPAMT`
- `TimeInForceType.GoodTilDate` - 表示订单到期前有效，当传递此类型参数是，我们也需要传递 `expire_date` 参数
- `expire_date` - 参数用于设定订单到期时间
- `trailing_percent` - 参数用于设定跟踪涨跌幅，如 `0.5` 表示 0.5%
- `limit_offset` - 参数用于设定指定价差，这里 `1.2` 表示 1.2 USD。如果你不需要指定价差，可以传递 `0` 或不传。

当我们挂出这么一个条件单以后，如果 `NVDA.US` 的市价在下单后的最高点回落 0.5% 时，比如最高点为 `1,100 USD`，回落 0.5% 就是 `1,094.5 USD`，那么我们的订单会以 `1,094.5 USD - 1.2 = 1,093.3 USD` 的价格挂出限价单。
