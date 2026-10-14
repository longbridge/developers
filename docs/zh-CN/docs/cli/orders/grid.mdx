---
title: 'grid'
sidebar_label: 'grid'
sidebar_position: 1.5
---

# longbridge grid

在终端管理网格交易策略订单——提交网格、查看运行中的网格及其触发记录，并挂起、重启、修改或取消网格。

## 基本用法

```bash
# 列出你的网格订单
longbridge grid
```

```
| 订单 ID            | 标的    | 状态       | 基准价 | 区间          | 触发      | 数量 | 触发次数 | 币种 |
|--------------------|---------|------------|--------|---------------|-----------|------|----------|------|
| 764609681686573056 | 700.HK  | Performing | 300.00 | 240.00–360.00 | ±2%       | 100  | 3        | HKD  |
```

## 示例

### 准备

```bash
# 记录一次性的策略风险揭示确认（网格交易前必须执行一次）
longbridge grid questionnaire
# 查看标的的网格信息：每手股数、最新价、授权状态、币种
longbridge grid info 700.HK
```

### 提交网格

```bash
# 在 700.HK 上按百分比触发的网格
longbridge grid submit 700.HK --currency HKD --base-price 300 --upper-price 360 --lower-price 240 \
  --trigger-type percent --trigger-up 2 --trigger-down 2 \
  --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc
# 只校验规则，不实际提交
longbridge grid submit 700.HK --currency HKD --base-price 300 --upper-price 360 --lower-price 240 \
  --trigger-type percent --trigger-up 2 --trigger-down 2 \
  --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc --dry-run
```

### 查看

```bash
# 按标的 / 状态筛选列表
longbridge grid --symbol 700.HK --status Performing
# 按 ID 查询指定网格
longbridge grid --ids 764609681686573056 764609681686573057
# 网格详情：规则、子订单与生命周期历史
longbridge grid detail 764609681686573056
# 某网格的触发历史
longbridge grid triggers 764609681686573056
```

### 管理运行中的网格

```bash
# 修改网格规则（flag 与 submit 相同）
longbridge grid replace 764609681686573056 --base-price 305 --upper-price 360 --lower-price 240 \
  --trigger-type percent --trigger-up 2 --trigger-down 2 \
  --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc
# 挂起运行中的网格（保留，可重启）
longbridge grid suspend 764609681686573056
# 重启已挂起的网格
longbridge grid restart 764609681686573056
# 取消网格（不可恢复）
longbridge grid cancel 764609681686573056
```

## 选项

| 选项 | 说明 | 默认值 |
| ---- | ---- | ------ |
| `--symbol` | 按标的代码筛选列表（如 `700.HK`） | — |
| `--status` | 按状态筛选列表，多个用逗号连接（如 `Performing,Suspended`） | — |
| `--market` | 按市场筛选列表：`US` \| `HK` \| `CN` \| `SG` | — |
| `--ids` | 按 ID 查询指定网格订单 | — |
| `--currency` | `submit` 的结算币种（如 `HKD`） | — |
| `--base-price` / `--upper-price` / `--lower-price` | 网格基准价与上/下限 | — |
| `--trigger-type` | 触发方式：`percent`（百分比）\| `spread`（价差） | — |
| `--trigger-up` / `--trigger-down` | 上/下触发值，按 `--trigger-type` 解释为百分比或价差 | — |
| `--quantity` | 每次触发数量 | — |
| `--upper-quantity` / `--lower-quantity` | 到达上/下限时处理的数量 | — |
| `--order-type` | 双边订单类型：`GMO` \| `GLO` \| `GTG`（`--order-type-up` / `--order-type-down` 可分别覆盖） | — |
| `--tif` | 有效期：`day` \| `gtc` \| `gtd` | — |
| `--dry-run` | 只校验并打印规则，不实际提交 | false |

## 前置条件

提交或管理网格订单需要 OAuth 交易权限。首次下网格前，先执行一次 `longbridge grid questionnaire` 记录策略风险揭示确认（在 `longbridge grid info` 中可见授权状态）。完整规则与字段定义见[网格交易](/zh-CN/docs/trade/grid/overview)参考文档。

## 说明

`submit`、`replace`、`cancel` 会影响真实资金，执行前会要求确认。可用 `submit --dry-run` 安全校验规则。
