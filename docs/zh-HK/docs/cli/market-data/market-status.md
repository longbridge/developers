---
title: 'market-status'
sidebar_label: 'market-status'
sidebar_position: 14
---

# longbridge market-status

查看各交易所當前的開市/收市狀態。

## 基本用法

```bash
longbridge market-status
```

```
| market | status     |
|--------|------------|
| US     | Pre-Market |
| HK     | Closed     |
| CN     | Closed     |
| SG     | Closed     |
```

## 示例

### 查看所有市場狀態

```bash
longbridge market-status
longbridge market-status --format json
```

展示各交易所（US、HK、CN、SG 等）當前是否開市、收市，或處於盤前/盤後時段。
