---
sidebar_position: 0
id: quote_overview
title: Overview
slug: overview
---

# Quote API Overview

<table>
    <tr>
        <td>Type</td>
        <td>Description</td>
    </tr>
    <tr>
        <td rowspan="20">Pull</td>
        <td><a href="./pull/static">Get Basic Information Of Securities</a></td>
    </tr>
    <tr>
        <td><a href="./pull/quote">Get Real-time Quotes Of Securities</a></td>
    </tr>
    <tr>
        <td><a href="./pull/option-quote">Get Real-time Quotes Of Option Securities</a></td>
    </tr>
    <tr>
        <td><a href="./pull/warrant-quote">Get Real-time Quotes Of Warrant Securities</a></td>
    </tr>
    <tr>
        <td><a href="./pull/depth">Get Security Depth</a></td>
    </tr>
    <tr>
        <td><a href="./pull/brokers">Get Security Brokers</a></td>
    </tr>
    <tr>
        <td><a href="./pull/broker-ids">Get Broker IDs</a></td>
    </tr>
    <tr>
        <td><a href="./pull/trade">Get Security Trades</a></td>
    </tr>
    <tr>
        <td><a href="./pull/intraday">Get Security Intraday</a></td>
    </tr>
    <tr>
        <td><a href="./pull/candlestick">Get Security Candlestick</a></td>
    </tr>
    <tr>
        <td><a href="./pull/optionchain-date">Get Option Chain Expiry Date List</a></td>
    </tr>
    <tr>
        <td><a href="./pull/optionchain-date-strike">Get Option Chain Info By Date</a></td>
    </tr>
    <tr>
        <td><a href="./pull/issuer">Get Warrant Issuer IDs</a></td>
    </tr>
    <tr>
        <td><a href="./pull/warrant-filter">Get Filtered Warrant</a></td>
    </tr>
    <tr>
        <td><a href="./pull/trade-session">Get Trading Session Of The Day</a></td>
    </tr>
    <tr>
        <td><a href="./pull/trade-day">Get Market Trading Days</a></td>
    </tr>
    <tr>
        <td><a href="./pull/capital-flow-intraday">Get Security Capital Flow Intraday</a></td>
    </tr>
    <tr>
        <td><a href="./pull/capital-distribution">Get Security Capital Distribution</a></td>
    </tr>
    <tr>
        <td><a href="./pull/calc-index">Get Calculate Indexes Of Securities</a></td>
    </tr>
    <tr>
        <td><a href="./pull/history-candlestick">Get Security History Candlestick</a></td>
    </tr>
    <tr>
        <td rowspan="3">Subscription</td>
        <td><a href="./subscribe/subscription">Get Subscription Information</a></td>
    </tr>
    <tr>
        <td><a href="./subscribe/subscribe">Subscribe Quote</a></td>
    </tr>
    <tr>
        <td><a href="./subscribe/unsubscribe">Unsubscribe Quote</a></td>
    </tr>
    <tr>
        <td rowspan="4">Push</td>
        <td><a href="./push/quote">Push Real-time Quote</a></td>
    </tr>
    <tr>
        <td><a href="./push/depth">Push Real-time Depth</a></td>
    </tr>
    <tr>
        <td><a href="./push/broker">Push Real-time Brokers</a></td>
    </tr>
    <tr>
        <td><a href="./push/trade">Push Real-time Trades</a></td>
    </tr>
    <tr>
        <td rowspan="4">Individual</td>
        <td><a href="./individual/watchlist_create_group">Create watched group</a></td>
    </tr>
    <tr>
        <td><a href="./individual/watchlist_delete_group">Delete watched group</a></td>
    </tr>
    <tr>
        <td><a href="./individual/watchlist_groups">Get watched groups</a></td>
    </tr>
    <tr>
        <td><a href="./individual/watchlist_update_group">Update watched group</a></td>
    </tr>
    <tr>
        <td rowspan="1">Security</td>
        <td><a href="./security/security_list">Get Security List</a></td>
    </tr>
</table>

## Description Of Security Code

The security code uses the `ticker.region` format, `ticker` represents the code, and example for each market:

- US Market: `region` is `US`, for example: `AAPL.US`.
- HK Market: `region` is `HK`, for example: `700.HK`.
- CN Market: `region` is `SH` for Shanghai Stock Exchange and `SZ` for Shenzhen Stock Exchange, for example: `399001.SZ`, `600519.SH`.
- SG Market: `region` is `SG`, for example: `D05.SG`.

## Access Method

1. Use private protocol and long connection mode to access, please refer to <a href="../socket/protocol/overview" target="_blank">Binary Communication Protocol</a> for access method.
2. Use SDK for access, [SDK introduction and download address](https://open.longbridge.com/sdk).

## Business Data Serialization

The market request, response and push data are stored as business data in the body part of the data package of the private protocol.
We use the [Protobuf](https://developers.google.cn/protocol-buffers) protocol to serialize business data. Compared with common text protocols (such as JSON, XML, etc.), the Protobuf protocol has the following advantages:

- Faster serialization time.
- Smaller packet size.
- Strongger version forward and backward compatibility.

Quote Protobuf protocol document [download link](https://github.com/longbridge/openapi-protobufs/blob/main/quote/api.proto).

## Quote Permission Levels

All Quote APIs require OpenAPI quote permissions. These are **separate from App/PC/Web permissions** and must be activated independently.

| Level | What's Included | How to Get |
|---|---|---|
| **Basic** | LV1 US/CN/SG real-time; HK BMP (~15 min delay, no push) | Included with OpenAPI activation |
| **LV1 Real-time** (HK) | HK real-time quotes + WebSocket push support | Purchase "LV1 Real-time Quotes (OpenAPI)" via Quote Store |
| **LV2 Subscription** | Level 2 order book (depth), HK broker queue | Purchase LV2 subscription via Quote Store |
| **Overnight** (US) | US pre/post-market extended-hours data | Purchase LV1 card + set `LONGBRIDGE_ENABLE_OVERNIGHT=true` |

Check your current permissions at [Developer Center](https://open.longbridge.com/account). Purchase quote cards via **Longbridge App → My → My Quotes → Quote Store**.
