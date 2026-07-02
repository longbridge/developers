---
title: 'macrodata'
sidebar_label: 'macrodata'
sidebar_position: 5
---

# longbridge macrodata

按指標查詢宏觀經濟數據，是 `finance-calendar macrodata` 的指標維度版本：同一數據源，但按指標組織而非按發布日期組織。

## 基本用法

```bash
# 列出所有指標
longbridge macrodata

# 按國家和關鍵詞篩選
longbridge macrodata --country US --keyword CPI

# 查詢單個指標的歷史數據
longbridge macrodata US00175 --start 2024-01-01 --limit 12
```

## 示例

### 列出所有宏觀經濟指標

```bash
longbridge macrodata
longbridge macrodata --country US
longbridge macrodata --keyword CPI --country US
```

輸出包含指標代碼、名稱、分類、國家/地區、發布週期與重要性等級（1–3 星）。

### 查詢歷史發布值

```bash
longbridge macrodata 61744 --start 2024-01-01 --limit 12 --format json
```

返回該指標每次發布時的實際值、預測值和前值。

## 常用選項

| 選項 | 說明 |
| ---- | ---- |
| `--country HK\|CN\|US\|EU\|JP\|SG` | 僅列出指定國家/地區的指標 |
| `--keyword <KEYWORD>` | 按指標名稱關鍵詞篩選 |
| `--start` / `--end` | 歷史數據日期範圍（YYYY-MM-DD） |
| `--limit` / `--page` | 分頁，預設每頁 20 條 |
| `--lang zh-CN\|en` | 指標名稱與描述的語言 |
| `--format json` | 結構化輸出，便於腳本或 AI Agent 使用 |
