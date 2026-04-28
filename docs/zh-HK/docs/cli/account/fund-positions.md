---
title: 'fund-positions'
sidebar_label: 'fund-positions'
sidebar_position: 5
---

# longbridge fund-positions

列出當前持有的基金和 ETF 倉位。

## 基本用法

```bash
longbridge fund-positions
```

```
| Symbol | Name | Net Asset Value | Cost Net Asset Value | Currency | Holding Units |
|--------|------|-----------------|----------------------|----------|---------------|
```

## 示例

### 查看基金/ETF 持倉

```bash
longbridge fund-positions
longbridge fund-positions --format json
```

展示帳戶中所有基金和 ETF 持倉，包括標的代碼、數量及成本資訊。

## 權限要求

需要 OAuth 帳戶權限。參見[帳戶權限設置](/zh-HK/docs/trade/)。
