---
title: 'anomaly'
sidebar_label: 'anomaly'
sidebar_position: 18
---

# longbridge anomaly

Detect unusual market movements and quote anomalies — price spikes, volume surges, and other abnormal activity.

## Basic Usage

```bash
longbridge anomaly --market US
```

```
| time       | symbol   | name              | alert         | emotion |
|------------|----------|-------------------|---------------|---------|
| 1775850599 | LRCX.US  | Lam Research      | Large Sell    | Bear    |
| 1775850599 | VST.US   | Vistra            | Large Buy     | Bull    |
| 1775850599 | LPCN.US  | Lipocine           | Rapid Rise    | Bull    |
| 1775850598 | C.US     | Citigroup         | Large Sell    | Bear    |
...
```

## Examples

### View HK market anomalies

```bash
longbridge anomaly
longbridge anomaly --market HK
```

Default market is HK. Lists recent unusual price and volume movements.

### View US market anomalies

```bash
longbridge anomaly --market US
longbridge anomaly --market US --count 20
```

### Filter by symbol

```bash
longbridge anomaly --market US --symbol TSLA.US
```

### JSON output

```bash
longbridge anomaly --market HK --format json
```

## Notes

Supported markets: `HK`, `US`, `CN`, `SG`. Maximum 100 results per request.
