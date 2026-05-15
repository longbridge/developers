---
title: 'industry-rank'
sidebar_label: 'industry-rank'
sidebar_position: 16
---

# longbridge industry-rank

按選定指標對某市場所有行業排名——查看今日哪些板塊領漲、哪些營收增速最強，或哪些正在吸引最多資金。

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

`counter_id` 列（如 `BK/US/IN00258`）可直接傳給 [`industry-peers`](./industry-peers)，展開該板塊的完整競爭樹。

## 示例

### 今日領漲行業

```bash
longbridge industry-rank --market US
```

按日內價格表現對行業排名。將 `US` 替換為 `HK`、`CN` 或 `SG` 可切換市場。

### 按市值排名的頭部行業

```bash
longbridge industry-rank --market HK --indicator market-cap
```

### 按營收增速排名的頭部行業

```bash
longbridge industry-rank --market CN --indicator revenue-growth
```

### 進一步下探某板塊

```bash
# 從 industry-rank 獲取 counter_id，再探索其子板塊
longbridge industry-peers BK/US/IN00258
```

## 選項

| 參數 | 說明 |
|------|------|
| `--market <MARKET>` | 排名市場：`US`、`HK`、`CN`、`SG` |
| `--indicator <IND>` | 排名指標（見下方） |
| `--format json` | 輸出原始 JSON |

### 指標說明

| 值 | 說明 |
|----|------|
| `leading-gainer` | 日內價格漲幅（預設） |
| `today-trend` | 盤中趨勢強度 |
| `popularity` | 搜尋與自選活躍度 |
| `market-cap` | 總市值 |
| `revenue` | 最新營收 |
| `revenue-growth` | 同比營收增速 |
| `net-profit` | 最新淨利潤 |
| `net-profit-growth` | 同比淨利潤增速 |
