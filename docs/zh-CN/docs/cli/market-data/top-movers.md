---
title: 'top-movers'
sidebar_label: 'top-movers'
sidebar_position: 19
---

# longbridge top-movers

价格波动超过近 20 日标准差的异动股票。系统自动关联相关新闻解读异动原因，与 `anomaly` 命令（纯技术信号）不同，`top-movers` 侧重于有新闻背景的价格波动。

<QuotePermission command="top-movers" />

## 基本用法

```bash
longbridge top-movers
```

```
Top Movers — US

TSLA  特斯拉  -3.88%  [汽车制造商]
  Alert: 波动超 20 日均值
  Related news: "Tesla Q1 deliveries miss estimates..."

NVDA  英伟达  +4.21%  [半导体厂商]
  Alert: 波动超 20 日均值
  Related news: "NVIDIA announces next-gen GPU architecture..."
```

## 示例

### 查看美股异动

```bash
longbridge top-movers
longbridge top-movers --market US
```

默认显示美股异动股票，按热度排序。

### 查看港股异动

```bash
longbridge top-movers --market HK
```

### 按时间排序并增加返回数量

```bash
longbridge top-movers --market US --sort time --count 50
```

### 按涨跌幅排序

```bash
longbridge top-movers --market US --sort change
```

## 参数

| 参数 | 说明 |
|------|------|
| `--market` | 市场：`HK`、`US`、`CN`、`SG`（默认：`US`） |
| `--sort` | 排序方式：`hot`（热度，默认）、`time`（时间）、`change`（涨跌幅） |
| `--count` | 返回条数（默认：20） |
| `--format` | 输出格式：`table`（默认）或 `json` |

## 注意事项

- `top-movers` 关联新闻，适合理解异动背景；`anomaly` 侧重纯技术信号
- 波动判断基于近 20 日历史波动标准差
