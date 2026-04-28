---
title: 业务指令
id: biz-command
slug: /socket/biz-command
sidebar_position: 5
---

长连接目前支持行情和交易的推送，两个业务有不同的接入地址，具体[查看](./hosts)

## 行情

<table>
    <tr>
        <td>类型</td>
        <td>功能简介</td>
    </tr>
    <tr>
        <td rowspan="20">拉取</td>
        <td><a href="../quote/pull/static">获取标的基础信息</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/quote">获取标的实时行情</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/option-quote">获取期权实时行情</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/warrant-quote">获取轮证实时行情</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/depth">获取标的盘口</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/brokers">获取标的经纪队列</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/broker-ids">获取券商席位 id</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/trade">获取标的成交明细</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/intraday">获取标的分时</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/candlestick">获取标的 K 线</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/optionchain-date">获取标的的期权链到期日列表</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/optionchain-date-strike">获取标的的期权链到期日期权标的列表</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/issuer">获取轮证发行商 ID</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/warrant-filter">获取轮证筛选列表</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/trade-session">获取各市场当日交易时段</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/trade-day">获取市场交易日</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/capital-flow-intraday">获取标的当日资金流向</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/capital-distribution">获取标的当日资金分布</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/calc-index">获取标的计算指标</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/history-candlestick">获取标的历史 K 线</a></td>
    </tr>
    <tr>
        <td rowspan="3">订阅</td>
        <td><a href="../quote/subscribe/subscription">获取已订阅标的行情</a></td>
    </tr>
    <tr>
        <td><a href="../quote/subscribe/subscribe">订阅行情数据</a></td>
    </tr>
    <tr>
        <td><a href="../quote/subscribe/unsubscribe">取消订阅行情数据</a></td>
    </tr>
    <tr>
        <td rowspan="4">推送</td>
        <td><a href="../quote/push/quote">实时价格推送</a></td>
    </tr>
    <tr>
        <td><a href="../quote/push/depth">实时盘口推送</a></td>
    </tr>
    <tr>
        <td><a href="../quote/push/broker">实时经纪队列推送</a></td>
    </tr>
    <tr>
        <td><a href="../quote/push/trade">实时成交明细推送</a></td>
    </tr>
</table>

更多细节查看[行情接口概览](../quote/overview#行情接口概览)

## 交易

| 类型 | 功能                                                                                     |
| ---- | ---------------------------------------------------------------------------------------- |
| 订阅 | [订阅推送](../trade/trade-push#订阅) <br/><br/> [取消订阅](../trade/trade-push#取消订阅) |
| 通知 | [通知推送](../trade/trade-push#通知推送)                                                 |

更多细节查看[交易推送](../trade/trade-push)
