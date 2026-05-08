---
title: 'ipo'
sidebar_label: 'ipo'
sidebar_position: 1
---

# longbridge ipo

追蹤 IPO 上市動態、管理認購，並查看 IPO 訂單歷史和盈虧情況。

## 子命令

| 子命令 | 說明 |
|---|---|
| `subscriptions` | 港股當前處於招股或認購階段的 IPO |
| `wait-listing` | 港股等待上市（暗盤）階段的 IPO |
| `listed` | 近期已上市的港股 IPO |
| `calendar` | 完整 IPO 日曆（港股 + 美股） |
| `detail` | 指定標的的 IPO 詳情及時間線 |
| `orders` | 你的 IPO 訂單歷史 |
| `profit-loss` | 你的 IPO 認購盈虧彙總 |
| `us-subscriptions` | 美股當前處於認購階段的 IPO |
| `us-wait-listing` | 美股等待上市階段的 IPO |
| `us-listed` | 近期已上市的美股 IPO |

## 示例

### IPO 日曆

```bash
longbridge ipo calendar
```

```
── HK ──
| name       | symbol  | state   | sub_date   | sub_end_date | ipo_date   |
|------------|---------|---------|------------|--------------|------------|
| 翼菲科技   | 6871.HK | pending | 2026-05-07 | 2026-05-13   | 2026-05-17 |
| 英派药业-B | 7630.HK | pending | 2026-05-04 | 2026-05-08   | 2026-05-12 |

── US ──
| name                       | symbol  | state   | ipo_date   |
|----------------------------|---------|---------|------------|
| Odyssey Therapeutics, Inc. | ODTX.US | pending | 2026-05-08 |
```

展示港股和美股即將上市的 IPO 日程。

### 在招 IPO

```bash
longbridge ipo subscriptions
```

列出當前開放認購的港股 IPO，包括入場費、預計認購額、融資利率及最高槓桿。

### 暗盤階段

```bash
longbridge ipo wait-listing
```

列出已截止認購、等待上市的港股 IPO，顯示參考發行價區間。

### 近期上市

```bash
longbridge ipo listed
```

顯示近期上市的 IPO，含發行價、最新價及上市以來漲跌幅。

### IPO 詳情

```bash
longbridge ipo detail 6871.HK
```

查看指定標的的完整 IPO 檔案及上市時間線。

### 我的 IPO 訂單

```bash
longbridge ipo orders
# 按狀態篩選：0=全部, 1=已認購, 2=扣款失敗, 3=未中籤, 4=已中籤, 5=已撤單
longbridge ipo orders --status 4
# 查看單筆訂單詳情
longbridge ipo orders detail 2452504
```

列出你的 IPO 認購訂單（當前及歷史）。使用 `orders detail <id>` 查看完整訂單詳情。

### 認購盈虧彙總

```bash
longbridge ipo profit-loss
# 按時間段篩選：1m | 3m | 6m | 1y | all
longbridge ipo profit-loss --period 1y
```

顯示指定時間段內的 IPO 認購盈虧彙總及逐標的明細。

## 權限要求

`orders` 和 `profit-loss` 需要 OAuth 賬戶權限。參見[賬戶權限設置](/zh-HK/docs/trade/)。
