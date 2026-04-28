---
title: 'security-list'
sidebar_label: 'security-list'
sidebar_position: 12
---

# longbridge security-list

列出 Longbridge 支援夜盤交易的美股標的。

## 基本用法

```bash
longbridge security-list
```

```
| Symbol   | Name                       |
|----------|----------------------------|
| GDS.US   | GDS                        |
| ZK.US    | ZEEKR Intelligent Tech     |
| ALTM.US  | Arcadium Lithium           |
| HE.US    | Hawaiian Electric Inds     |
| WB.US    | Weibo                      |
...
```

## 示例

### 查看可夜盤交易的美股標的

```bash
# 默認（美股市場）
longbridge security-list
# 明確指定市場
longbridge security-list US
# JSON 輸出，可在下單前校驗標的資格
longbridge security-list US --format json
```

返回當前在 Longbridge 支援夜盤交易的美股標的完整列表。使用 `--format json` 取得機器可讀列表，便於自動化資格校驗。

## 說明

僅支援美股市場（Longbridge API 限制）。此列表會隨資格更新而變化——請在提交夜盤委託前即時查詢，勿依賴緩存數據。
