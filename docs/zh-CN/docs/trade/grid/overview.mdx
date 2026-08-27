---
slug: overview
sidebar_position: 0
title: 网格交易概览
sidebar_label: '概览'
search: true
headingLevel: 3
---

网格交易是一种自动化策略：在以基准价为锚点的价格区间内，价格下跌时买入、上涨时卖出，通过价格震荡获利。每下跌一格挂一笔买单，每上涨一格挂一笔卖单，累积的价差即为已实现收益。网格交易 API 让你以编程方式提交、监控、调整和撤销网格策略。

## 运作方式

一个网格由基准价和价格区间，以及每一格何时、以多少数量成交的规则共同定义。

- **基准价** — `submitted_base_price` 是网格锚定的中心价格，触发档位以该价格为基准计算。
- **上限 / 下限** — `upper_limit_price` 与 `lower_limit_price` 标记区间的上沿与下沿，网格仅在 `[lower_limit_price, upper_limit_price]` 区间内运行。
- **按百分比或价差触发** — `trigger_price_type` 决定档位间距的计量方式：`1` = 价差（绝对价格差，对应 `trigger_spread_up` / `trigger_spread_down`），`2` = 百分比（基准价的百分比，对应 `trigger_percent_up` / `trigger_percent_down`）。
- **每次触发数量** — `trigger_quantity` 是每次触发档位时买入或卖出的数量。`upper_limit_quantity` 与 `lower_limit_quantity` 是触及区间上沿或下沿时处理的数量。
- **上限 / 下限事件** — `upper_limit_event` 与 `lower_limit_event` 决定触及边界时的行为：`1` = 忽略（保持网格运行），`2` = 以最新价平仓。
- **网格订单类型** — 当对应的盘口深度（`trigger_sell_depth` / `trigger_buy_depth`）为 `0` 时，由 `grid_order_type_up` / `grid_order_type_down` 决定订单类型：`GMO`（网格市价单）、`GLO`（网格限价单）、`GTG`（网格触价单）。
- **有效期** — `time_in_force` 控制网格保持活跃的时长：`0` = 当日有效，`1` = GTC（撤销前有效），`6` = GTD（指定日期前有效，需配合 `expire_time`）。

## 前置条件

::: tip 前置条件
网格交易要求访问令牌具备 **Trade** 权限。在提交任何网格订单之前，你还必须**一次性**记录策略风险披露同意书，详见[提交策略问卷](./questionnaire)。你可以通过[网格标的信息](./symbol_info)的 `strategy_granted` 字段确认是否已记录同意。
:::

## 典型流程

1. 一次性记录风险披露同意 —— [提交策略问卷](./questionnaire)。
2. 获取标的的网格信息（每手股数、最新价、授权状态）—— [网格标的信息](./symbol_info)。
3. 提交网格策略 —— [提交网格订单](./submit)。
4. 列出并查看运行中的网格 —— [网格订单列表](./list) 与 [网格订单详情](./detail)。
5. 查看网格已触发的记录 —— [触发历史](./trigger_history)。
6. 调整或停止网格 —— [挂起](./suspend)、[重启](./restart)、[修改](./replace) 或 [撤销](./cancel)。

## 快速开始（CLI）

<CliCommand>
# 一次性记录策略风险披露同意
longbridge grid questionnaire
# 查看标的的网格信息（每手股数、最新价、授权状态）
longbridge grid info 700.HK
# 在 700.HK 上提交一个按百分比触发的网格
longbridge grid submit 700.HK --currency HKD --base-price 300 --upper-price 360 --lower-price 240 --trigger-type percent --trigger-up 2 --trigger-down 2 --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc
# 列出你的网格订单
longbridge grid
</CliCommand>

<aside className="success">
</aside>
