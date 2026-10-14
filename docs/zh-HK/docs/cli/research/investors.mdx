---
title: 'investors'
sidebar_label: 'investors'
sidebar_position: 3
---

# longbridge investors

瀏覽按 AUM 排名的活躍機構基金經理（數據來自 [SEC 13F 申報](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=13F&dateb=&owner=include&count=40)），並深入查看任意基金經理的當前持倉。

## 基本用法

```bash
longbridge investors
```

```
| #  | name                              | AUM      | period      | cik        |
|----|-----------------------------------|----------|-------------|------------|
| 1  | Capital International Investors   | $637.97B | 31-DEC-2025 | 0001562230 |
| 2  | Capital Research Global Investors | $541.73B | 31-DEC-2025 | 0001422848 |
| 3  | CTC LLC                           | $404.44B | 31-DEC-2025 | 0001445893 |
| 4  | BERKSHIRE HATHAWAY INC            | $274.16B | 31-DEC-2025 | 0001067983 |
| 5  | DODGE & COX                       | $185.26B | 31-DEC-2025 | 0000200217 |
...
```

## 示例

### 瀏覽頂級基金經理

列出按 AUM 排名的最大機構投資者，包含 CIK 標識符、名稱、報告 AUM 及最新 [13F 申報](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=13F&dateb=&owner=include&count=40)的報告期。

### 查看基金經理持倉

```bash
# 使用投資者列表中的 CIK 深入查看持倉
longbridge investors 0001067983
longbridge investors 0001067983 --format json
```

```
BERKSHIRE HATHAWAY INC (period: 2025-12-31)
Portfolio: 42 positions, total value ~$274.16B

| company               | value   | shares  | weight |
|-----------------------|---------|---------|--------|
| APPLE INC             | $61.96B | 227.92M | 22.6%  |
| AMERICAN EXPRESS CO   | $56.09B | 151.61M | 20.5%  |
| BANK AMERICA CORP     | $28.45B | 517.30M | 10.4%  |
| COCA COLA CO          | $27.96B | 400.00M | 10.2%  |
| CHEVRON CORP NEW      | $19.84B | 130.16M | 7.2%   |
...
```

傳入 CIK 可查看該基金經理申報的完整股票持倉列表。CIK `0001067983` 為伯克希爾·哈撒韋。

### 對比兩期持倉變動

```bash
# 對比最近兩期申報的變動
longbridge investors changes 0001067983
# 指定基準期對比
longbridge investors changes 0001067983 --from 2024-09-30
```

```
BERKSHIRE HATHAWAY INC — changes vs 2024-09-30

| action  | company                | shares_change | value_change | current_shares | current_value |
|---------|------------------------|---------------|--------------|----------------|---------------|
| NEW     | CONSTELLATION BRANDS   | +5.21M        | +$1.24B      | 5.21M          | $1.24B        |
| ADDED   | SIRIUS XM HOLDINGS INC | +57.83M       | +$1.52B      | 144.42M        | $3.80B        |
| REDUCED | CHEVRON CORP NEW       | -12.50M       | -$1.93B      | 130.16M        | $19.84B       |
| EXITED  | FLOOR & DECOR HLDGS    | -3.97M        | -$414.30M    | 0              | $0            |
...
```

展示兩期申報之間的新增（NEW）、加倉（ADDED）、減倉（REDUCED）和清倉（EXITED）持倉變動。預設對比最新一期與前一期的變化。
