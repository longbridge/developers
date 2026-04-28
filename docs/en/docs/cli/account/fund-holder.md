---
title: 'fund-holder'
sidebar_label: 'fund-holder'
sidebar_position: 6
---

# longbridge fund-holder

Find which ETFs and funds hold a given stock, along with each fund's position ratio and report date.

## Basic Usage

```bash
longbridge fund-holder AAPL.US
```

```
| name                                   | symbol  | currency | weight | report_date |
|----------------------------------------|---------|----------|--------|-------------|
| T-Rex 2X Long Apple Daily Target ETF   | AAPX.US | USD      | 67.62% | 2026.04.03  |
| Global X PureCap MSCI Infor Tech ETF   | GXPT.US | USD      | 19.58% | 2026.04.06  |
| Roundhill Apple Weekly Income ETF       | AAPW.US | USD      | 16.76% | 2026.04.06  |
| Vanguard Information Technology ETF     | VGT.US  | USD      | 15.84% | 2026.02.28  |
...
```

## Examples

### Find top ETF holders of a stock

```bash
longbridge fund-holder AAPL.US
longbridge fund-holder AAPL.US --format json
```

Lists the ETFs and funds with the largest exposure to the given stock, sorted by position ratio.

### Get more holders

```bash
longbridge fund-holder TSLA.US --count 50
```

Use `--count` to retrieve more results beyond the default limit.

## Requirements

OAuth account permission required. See the [account permission setup](/docs/trade/) guide.
