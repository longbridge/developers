---
title: 'anomaly'
sidebar_label: 'anomaly'
sidebar_position: 18
---

# longbridge anomaly

偵測異常市場動態和報價異常——價格急升、成交量暴增及其他異常活動。

## 基本用法

```bash
longbridge anomaly
```

```
| time       | symbol   | name              | alert    | emotion |
|------------|----------|-------------------|----------|---------|
| 1775850599 | LRCX.US  | 泛林集團          | 大筆賣出 | Bear    |
| 1775850599 | VST.US   | Vistra            | 大筆買入 | Bull    |
| 1775850599 | LPCN.US  | Lipocine          | 急速拉升 | Bull    |
| 1775850598 | C.US     | 花旗              | 大筆賣出 | Bear    |
...
```

## 示例

### 查看港股異動

```bash
longbridge anomaly
longbridge anomaly --market HK
```

預設市場為 HK。列出近期異常的價格和成交量變動。

### 查看美股異動

```bash
longbridge anomaly --market US
longbridge anomaly --market US --count 20
```

### 按標的篩選

```bash
longbridge anomaly --market US --symbol TSLA.US
```

### JSON 輸出

```bash
longbridge anomaly --market HK --format json
```

## 備註

支援的市場：`HK`、`US`、`CN`、`SG`。每次請求最多返回 100 條結果。
