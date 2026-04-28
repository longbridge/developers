---
title: 'shareholder'
sidebar_label: 'shareholder'
sidebar_position: 1
---

# longbridge shareholder

View the top shareholders of a company — institutional and individual — with ownership percentages and recent share count changes.

## Basic Usage

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

## Examples

### Check top shareholders

```bash
longbridge shareholder TSLA.US
longbridge shareholder TSLA.US --format json
```

Lists the largest shareholders by ownership percentage, including both institutional investors and individual insiders.
