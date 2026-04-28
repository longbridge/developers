---
title: 'security-list'
sidebar_label: 'security-list'
sidebar_position: 12
---

# longbridge security-list

列出 Longbridge 支持夜盘交易的美股标的。

## 基本用法

```bash
longbridge security-list
```

```
| Symbol   | Name                       |
|----------|----------------------------|
| GDS.US   | GDS                        |
| ZK.US    | ZEEKR Intelligent Tech     |
| ALTM.US  | Arcadium Lithium           |
| HE.US    | Hawaiian Electric Inds     |
| WB.US    | Weibo                      |
...
```

## 示例

### 查看可夜盘交易的美股标的

```bash
# 默认（美股市场）
longbridge security-list
# 明确指定市场
longbridge security-list US
# JSON 输出，可在下单前校验标的资格
longbridge security-list US --format json
```

返回当前在 Longbridge 支持夜盘交易的美股标的完整列表。使用 `--format json` 获取机器可读列表，便于自动化资格校验。

## 说明

仅支持美股市场（Longbridge API 限制）。此列表会随资格更新而变化——请在提交夜盘委托前实时查询，勿依赖缓存数据。
