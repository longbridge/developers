---
title: 'shareholder'
sidebar_label: 'shareholder'
sidebar_position: 1
---

# longbridge shareholder

查看公司主要股東——機構和個人——及其持股比例和最新持股變動。

## 基本用法

```bash
longbridge shareholder TSLA.US
```

```
| shareholder                        | symbol | % shares | chg shares | report_date |
|------------------------------------|--------|----------|------------|-------------|
| Elon R. Musk                       | -      | 24.86%   | +423.53M   | 2025-12-30  |
| The Vanguard Group, Inc.           | -      | 6.90%    | +6.54M     | 2025-12-31  |
| BlackRock, Inc.                    | BLK.US | 5.57%    | +2.81M     | 2025-12-31  |
| State Street Global Advisors, Inc. | -      | 3.06%    | +1.08M     | 2025-12-31  |
| Geode Capital Management, LLC      | -      | 1.75%    | +375.95K   | 2025-12-31  |
```

## 示例

### 查看主要股東

```bash
longbridge shareholder TSLA.US
longbridge shareholder TSLA.US --format json
```

按持股比例列出最大股東，包括機構投資者和個人內部人士。
