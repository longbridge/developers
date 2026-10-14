---
title: 'industry-rank'
sidebar_label: 'industry-rank'
sidebar_position: 16
---

# longbridge industry-rank

按选定指标对某市场所有行业排名——查看今日哪些板块领涨、哪些营收增速最强，或哪些正在吸引最多资金。

## 基本用法

```bash
longbridge industry-rank --market US
```

```
| rank | name                                    | counter_id      | chg    | indicator |
|------|-----------------------------------------|-----------------|--------|-----------|
| 1    | Semiconductors                          | BK/US/IN00258   | +3.82% | ...       |
| 2    | Software - Infrastructure               | BK/US/IN00305   | +2.91% | ...       |
| 3    | Biotechnology                           | BK/US/IN00043   | +2.54% | ...       |
| 4    | Electronic Components                   | BK/US/IN00099   | +1.98% | ...       |
| 5    | Asset Management                        | BK/US/IN00033   | +1.73% | ...       |
```

`counter_id` 列（如 `BK/US/IN00258`）可直接传给 [`industry-peers`](./industry-peers)，展开该板块的完整竞争树。

## 示例

### 今日领涨行业

```bash
longbridge industry-rank --market US
```

按日内价格表现对行业排名。将 `US` 替换为 `HK`、`CN` 或 `SG` 可切换市场。

### 按市值排名的头部行业

```bash
longbridge industry-rank --market HK --indicator market-cap
```

### 按营收增速排名的头部行业

```bash
longbridge industry-rank --market CN --indicator revenue-growth
```

### 进一步下探某板块

```bash
# 从 industry-rank 获取 counter_id，再探索其子板块
longbridge industry-peers BK/US/IN00258
```

## 选项

| 参数 | 说明 |
|------|------|
| `--market <MARKET>` | 排名市场：`US`、`HK`、`CN`、`SG` |
| `--indicator <IND>` | 排名指标（见下方） |
| `--format json` | 输出原始 JSON |

### 指标说明

| 值 | 说明 |
|----|------|
| `leading-gainer` | 日内价格涨幅（默认） |
| `today-trend` | 盘中趋势强度 |
| `popularity` | 搜索与自选活跃度 |
| `market-cap` | 总市值 |
| `revenue` | 最新营收 |
| `revenue-growth` | 同比营收增速 |
| `net-profit` | 最新净利润 |
| `net-profit-growth` | 同比净利润增速 |
