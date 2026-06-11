---
title: 'macroeconomic'
sidebar_label: 'macroeconomic'
sidebar_position: 20
---

# longbridge macroeconomic

瀏覽宏觀經濟指標及其歷史發布數據，覆蓋美國、香港、中國大陸、歐元區、日本和新加坡市場。

## 模式

| 模式 | 用法 | 描述 |
| ---- | ---- | ---- |
| 列表 | `longbridge macroeconomic` | 列出全部可用指標 |
| 歷史 | `longbridge macroeconomic <CODE>` | 查詢指定指標的歷史數據 |

## 示例

### 列出全部指標

```bash
longbridge macroeconomic
```

### 按國家/地區篩選

```bash
longbridge macroeconomic --country US
longbridge macroeconomic --country HK
```

支持的國家代碼：`HK`、`CN`、`US`、`EU`、`JP`、`SG`。

### 查看某個指標的歷史發布數據

```bash
longbridge macroeconomic US00175
longbridge macroeconomic US00175 --start 2024-01-01 --end 2024-12-31
```

### JSON 輸出（適合 AI / 腳本）

```bash
longbridge macroeconomic --format json
longbridge macroeconomic US00175 --format json
```

## 選項

| 選項 | 描述 | 默認值 |
| ---- | ---- | ------ |
| `--country` | 篩選列表：`HK` \| `CN` \| `US` \| `EU` \| `JP` \| `SG` | 全部 |
| `--start` | 歷史開始日期 `YYYY-MM-DD` | — |
| `--end` | 歷史結束日期 `YYYY-MM-DD` | — |
| `--limit` | 最大條數（列表最大 1000，歷史最大 100） | 1000（列表）/ 20（歷史） |
| `--page` | 頁碼，從 1 開始 | 1 |
| `--format` | `table` 或 `json` | `table` |
