---
slug: overview
title: Overview
sidebar_position: 1
---

Streaming provides real-time market data via WebSocket subscriptions. Instead of polling, you subscribe to specific securities and data types, and the server pushes updates to your connection as they happen.

## How It Works

1. **Establish a connection** — Connect to the Longbridge WebSocket endpoint using the SDK or the [binary protocol](../../socket/protocol/overview).
2. **Subscribe** — Call [Subscribe](./subscribe) with the securities and data types you want (quotes, depth, trades, brokers).
3. **Receive pushes** — The server sends real-time updates to your connection whenever there is a market change.
4. **Unsubscribe** — Call [Unsubscribe](./unsubscribe) to stop receiving updates for specific symbols or data types.

## Subscription Types

| Type | Description |
|------|-------------|
| `Quote` | Real-time bid/ask and last-done price |
| `Depth` | Level 2 order book |
| `Brokers` | Broker queue data |
| `Trade` | Real-time trade ticks |

## Pull vs. Subscribe

Subscriptions push incremental updates in real time. For one-off or on-demand queries, use the pull APIs instead:

| Data | Pull API |
|------|----------|
| Quotes | [Quotes](../stocks/quote) |
| Depth | [Depth](../stocks/depth) |
| Broker queue | [Broker Queue](../stocks/brokers) |
| Trades | [Trades](../stocks/trade) |
| Intraday | [Intraday](../stocks/intraday) |
| Candlesticks | [Candlesticks](../stocks/candlestick) |

## Notes

- Subscriptions are scoped to the current connection; they are cleared when the connection drops.
- Use [Get Subscriptions](./subsciption) to inspect your active subscriptions at any time.
- Quote permissions determine which data types are available. See [Quote Permission Levels](../overview#quote-permission-levels).
