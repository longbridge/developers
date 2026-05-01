---
sidebar_position: 0
id: quote_overview
sidebar_label: 概览
title: 概览
slug: overview
---

# 行情接口概览

<table>
    <tr>
        <td>类型</td>
        <td>功能简介</td>
    </tr>
    <tr>
        <td rowspan="20">拉取</td>
        <td><a href="./pull/static">获取标的基础信息</a></td>
    </tr>
    <tr>
        <td><a href="./pull/quote">获取标的实时行情</a></td>
    </tr>
    <tr>
        <td><a href="./pull/option-quote">获取期权实时行情</a></td>
    </tr>
    <tr>
        <td><a href="./pull/warrant-quote">获取轮证实时行情</a></td>
    </tr>
    <tr>
        <td><a href="./pull/depth">获取标的盘口</a></td>
    </tr>
    <tr>
        <td><a href="./pull/brokers">获取标的经纪队列</a></td>
    </tr>
    <tr>
        <td><a href="./pull/broker-ids">获取券商席位 id</a></td>
    </tr>
    <tr>
        <td><a href="./pull/trade">获取标的成交明细</a></td>
    </tr>
    <tr>
        <td><a href="./pull/intraday">获取标的分时</a></td>
    </tr>
    <tr>
        <td><a href="./pull/candlestick">获取标的 K 线</a></td>
    </tr>
    <tr>
        <td><a href="./pull/optionchain-date">获取标的的期权链到期日列表</a></td>
    </tr>
    <tr>
        <td><a href="./pull/optionchain-date-strike">获取标的的期权链到期日期权标的列表</a></td>
    </tr>
    <tr>
        <td><a href="./pull/issuer">获取轮证发行商 id</a></td>
    </tr>
    <tr>
        <td><a href="./pull/warrant-filter">获取轮证筛选列表</a></td>
    </tr>
    <tr>
        <td><a href="./pull/trade-session">获取各市场当日交易时段</a></td>
    </tr>
    <tr>
        <td><a href="./pull/trade-day">获取市场交易日</a></td>
    </tr>
    <tr>
        <td><a href="./pull/capital-flow-intraday">获取标的当日资金流向</a></td>
    </tr>
    <tr>
        <td><a href="./pull/capital-distribution">获取标的当日资金分布</a></td>
    </tr>
    <tr>
        <td><a href="./pull/calc-index">获取标的计算指标</a></td>
    </tr>
    <tr>
        <td><a href="./pull/history-candlestick">获取标的历史 k 线</a></td>
    </tr>
    <tr>
        <td rowspan="3">订阅</td>
        <td><a href="./subscribe/subscription">获取已订阅标的行情</a></td>
    </tr>
    <tr>
        <td><a href="./subscribe/subscribe">订阅行情数据</a></td>
    </tr>
    <tr>
        <td><a href="./subscribe/unsubscribe">取消订阅行情数据</a></td>
    </tr>
    <tr>
        <td rowspan="4">推送</td>
        <td><a href="./push/quote">实时价格推送</a></td>
    </tr>
    <tr>
        <td><a href="./push/depth">实时盘口推送</a></td>
    </tr>
    <tr>
        <td><a href="./push/broker">实时经纪队列推送</a></td>
    </tr>
    <tr>
        <td><a href="./push/trade">实时成交明细推送</a></td>
    </tr>
    <tr>
        <td rowspan="4">个性化</td>
        <td><a href="./individual/watchlist_create_group">创建自选股分组</a></td>
    </tr>
    <tr>
        <td><a href="./individual/watchlist_delete_group">删除自选股分组</a></td>
    </tr>
    <tr>
        <td><a href="./individual/watchlist_groups">获取自选股分组</a></td>
    </tr>
    <tr>
        <td><a href="./individual/watchlist_update_group">更新自选股分组</a></td>
    </tr>
    <tr>
        <td rowspan="1">标的</td>
        <td><a href="./security/security_list">获取标的列表</a></td>
    </tr>
</table>

## 标的代码说明

标的代码使用 `ticker.region` 格式，`ticker` 表示标的代码，各个市场的标的代码示例：

- 美股市场：`region` 为 `US`，例如：`AAPL.US`
- 港股市场：`region` 为 `HK`，例如：`700.HK`
- A 股市场：`region` 上交所为 `SH`，深交所为 `SZ`，例如：`399001.SZ`，`600519.SH`
- 新加坡市场：`region` 为 `SG`，例如：`D05.SG`

## 接入方式

1. 使用私有协议，长连接方式进行接入，接入方法请参考 <a href="../socket/protocol/overview" target="_blank">二进制通信协议</a>。
2. 使用 SDK 进行接入，[SDK 介绍及下载地址](https://open.longbridge.com/sdk)。

## 业务数据序列化方式

行情的请求、响应、推送数据作为业务数据，存放在私有协议的数据包 body 部分。
我们使用 [Protobuf](https://developers.google.cn/protocol-buffers) 协议对业务数据进行序列化，相较于常见的文本协议（如 JSON, XML 等），Protobuf 协议具有如下优点：

- 序列化时间快
- 数据包体积小
- 较强的版本前向后向兼容性

行情 Protobuf 协议文档[下载地址](https://github.com/longbridge/openapi-protobufs/blob/main/quote/api.proto)。

## 行情权限等级

所有行情接口均需要 OpenAPI 行情权限。**OpenAPI 行情权限与手机客户端/PC/网页端权限完全独立**，需单独开通。

| 权限等级 | 包含内容 | 获取方式 |
|---|---|---|
| **基础行情** | 美/A/新加坡股实时报价；港股 BMP（约 15 分钟延迟，不支持推送） | 开通 OpenAPI 后自动获得 |
| **LV1 实时**（港股） | 港股实时报价 + WebSocket 推送支持 | 通过行情商城购买「LV1 Real-time Quote (OpenAPI)」 |
| **LV2 订阅** | Level 2 买卖盘（depth）、港股经纪商队列（brokers） | 通过行情商城购买 LV2 订阅卡 |
| **盘前盘后**（美股） | 美股盘前/盘后延伸时段数据 | 购买 LV1 卡 + 设置 `LONGBRIDGE_ENABLE_OVERNIGHT=true` |

查看当前权限：[开发者中心](https://open.longbridge.com/account)。购买行情卡：**Longbridge App → 我的 → 我的行情 → 行情商城**。
