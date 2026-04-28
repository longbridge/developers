---
title: 業務指令
id: biz-command
slug: /socket/biz-command
sidebar_position: 5
---

長連接目前支持行情和交易的推送，兩個業務有不同的接入地址，具體[查看](./hosts)

## 行情

<table>
    <tr>
        <td>類型</td>
        <td>功能簡介</td>
    </tr>
    <tr>
        <td rowspan="20">拉取</td>
        <td><a href="../quote/pull/static">獲取標的基礎信息</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/quote">獲取標的實時行情</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/option-quote">獲取期權實時行情</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/warrant-quote">獲取輪證實時行情</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/depth">獲取標的盤口</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/brokers">獲取標的經紀隊列</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/broker-ids">獲取券商席位 id</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/trade">獲取標的成交明細</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/intraday">獲取標的分時</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/candlestick">獲取標的 k 線</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/optionchain-date">獲取標的的期權鏈到期日列表</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/optionchain-date-strike">獲取標的的期權鏈到期日期權標的列表</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/issuer">獲取輪證發行商 id</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/warrant-filter">獲取輪證篩選列表</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/trade-session">獲取各市場當日交易時段</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/trade-day">獲取市場交易日</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/capital-flow-intraday">獲取標的當日資金流向</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/capital-distribution">獲取標的當日資金分佈</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/calc-index">獲取標的計算指標</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/history-candlestick">獲取標的曆史 K 線</a></td>
    </tr>
    <tr>
        <td rowspan="3">訂閱</td>
        <td><a href="../quote/subscribe/subscription">獲取已訂閱標的行情</a></td>
    </tr>
    <tr>
        <td><a href="../quote/subscribe/subscribe">訂閱行情數據</a></td>
    </tr>
    <tr>
        <td><a href="../quote/subscribe/unsubscribe">取消訂閱行情數據</a></td>
    </tr>
    <tr>
        <td rowspan="4">推送</td>
        <td><a href="../quote/push/quote">實時價格推送</a></td>
    </tr>
    <tr>
        <td><a href="../quote/push/depth">實時盤口推送</a></td>
    </tr>
    <tr>
        <td><a href="../quote/push/broker">實時經紀隊列推送</a></td>
    </tr>
    <tr>
        <td><a href="../quote/push/trade">實時成交明細推送</a></td>
    </tr>
</table>

更多細節查看[行情接口概覽](../quote/overview#行情接口概覽)

## 交易

| 類型 | 功能                                                                                     |
| ---- | ---------------------------------------------------------------------------------------- |
| 訂閱 | [訂閱推送](../trade/trade-push#訂閱) <br/><br/> [取消訂閱](../trade/trade-push#取消訂閱) |
| 通知 | [通知推送](../trade/trade-push#通知推送)                                                 |

更多細節查看[交易推送](../trade/trade-push)
