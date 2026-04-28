---
title: Data Commands
id: biz-command
slug: /socket/biz-command
sidebar_position: 5
---

Socket Feed providers real-time stock quote data updates and trade updates.

And stock quote and order have difference endpoints, [check here](./hosts).

## Stock Quote Overview

<table>
    <tr>
        <td>Type</td>
        <td>Description</td>
    </tr>
    <tr>
        <td rowspan="20">Pull</td>
        <td><a href="../quote/pull/static">Get Basic Information Of Securities</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/quote">Get Real-time Quotes Of Securities</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/option-quote">Get Real-time Quotes Of Option Securities</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/warrant-quote">Get Real-time Quotes Of Warrant Securities</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/depth">Get Security Depth</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/brokers">Get Security Brokers</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/broker-ids">Get Broker IDs</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/trade">Get Security Trades</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/intraday">Get Security Intraday</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/candlestick">Get Security Candlestick</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/optionchain-date">Get Option Chain Expiry Date List</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/optionchain-date-strike">Get Option Chain Info By Date</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/issuer">Get Warrant Issuer IDs</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/warrant-filter">Get Filtered Warrant</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/trade-session">Get Trading Session Of The Day</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/trade-day">Get Market Trading Days</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/capital-flow-intraday">Get Security Capital Flow Intraday</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/capital-distribution">Get Security Capital Distribution</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/calc-index">Get Calculate Indexes Of Securities</a></td>
    </tr>
    <tr>
        <td><a href="../quote/pull/history-candlestick">Get Security History Candlestick</a></td>
    </tr>
    <tr>
        <td rowspan="3">Subscription</td>
        <td><a href="../quote/subscribe/subscription">Get Subscription Information</a></td>
    </tr>
    <tr>
        <td><a href="../quote/subscribe/subscribe">Subscribe Quote</a></td>
    </tr>
    <tr>
        <td><a href="../quote/subscribe/unsubscribe">Unsubscribe Quote</a></td>
    </tr>
    <tr>
        <td rowspan="4">Push</td>
        <td><a href="../quote/push/quote">Push Real-time Quote</a></td>
    </tr>
    <tr>
        <td><a href="../quote/push/depth">Push Real-time Depth</a></td>
    </tr>
    <tr>
        <td><a href="../quote/push/broker">Push Real-time Brokers</a></td>
    </tr>
    <tr>
        <td><a href="../quote/push/trade">Push Real-time Trades</a></td>
    </tr>
</table>

More detail can check [here](../quote/overview#quote-api-overview)

## Trade

| Type      | Functional                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| Subscribe | [Subscribe](../trade/trade-push#subscribe) <br/><br/> [Cancel Subscribe](../trade/trade-push#cancel-subscribe) |
| Notify    | [Notification](../trade/trade-push#notification)                                                               |

More detail check [here](../trade/trade-push)
