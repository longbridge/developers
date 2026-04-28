---
title: 'operating'
sidebar_label: 'operating'
sidebar_position: 11
---

# longbridge operating

查看公司經營回顧——按報告期展示關鍵財務指標和管理層評述。

## 基本用法

```bash
longbridge operating 700.HK
```

```
Currency: HKD

| period | 營業收入 | 營業收入_yoy | 淨利潤   | 淨利潤_yoy | 每股收益 | 每股收益_yoy |
|--------|----------|--------------|----------|------------|----------|--------------|
| af *   | 8217 億  | 14.96%       | 2457 億  | 16.98%     | 26.4     | 19.04%       |
| q3     | 6056 億  | 13.98%       | 1811 億  | 16.41%     | 19.47    | 18.88%       |
| saf    | 3947 億  | 14.07%       | 1120 億  | 15.95%     | 12.05    | 19.04%       |
...
```

## 示例

### 查看經營回顧

```bash
longbridge operating AAPL.US
longbridge operating 700.HK
```

展示財務指標表格和管理層回顧摘要。

### 按報告期篩選

```bash
# 年報
longbridge operating AAPL.US --report af
# 第一季報告
longbridge operating TSLA.US --report q1
```

支援的報告類型：`af`（年報）、`saf`（半年報）、`q1`（第一季）、`q3`（第三季）。可用逗號分隔多個類型。

### JSON 輸出

```bash
longbridge operating TSLA.US --format json
```
