---
title: 'etf-docs'
sidebar_label: 'etf-docs'
sidebar_position: 21
---

# longbridge etf-docs

列出美股 ETF 的監管文件，包括招股書、事實說明書及申報文件。

:::warning 僅限美股賬戶
此命令僅適用於美國數據中心賬戶。
:::

## 基本用法

```bash
longbridge etf-docs IVV.US
```

```
Name
----
iShares Core S&P 500 ETF Prospectus
iShares Core S&P 500 ETF Statement of Additional Information
iShares Core S&P 500 ETF Annual Report
...
```

## 示例

### 列出 ETF 文件

<CliCommand>
longbridge etf-docs IVV.US
longbridge etf-docs SPY.US
</CliCommand>

### 限制返回數量

```bash
longbridge etf-docs IVV.US --limit 5
```

## 選項

| 選項 | 描述 | 默認值 |
| ---- | ---- | ------ |
| `--limit` | 返回文件數量上限 | 10 |
