---
title: Trade
sidebar_position: 2
---

## Q1: What types of orders are supported?

Both paper and live accounts support regular Limit orders, Market orders, and Conditional orders (such as Buy if touched, Sell if touched, etc.), but do not currently support Attached orders and Grid orders.

## Q2: What are the trading hours for paper accounts?

Trading hours for paper accounts for Hong Kong stocks are the same as in the real environment. Trading pre & post market is not supported for U.S. stocks in the paper environment, only regular trading hours are supported.

## Q3: How can I trade overnight sessions for U.S. stocks?

To place orders for overnight trading, you can specify overnight trading by passing the OVERNIGHT value to the `outside_rth` parameter in the order placement API.

## Q4: What are the trading rules for paper accounts?

Paper accounts currently support trading in Hong Kong and U.S. stocks, ETFs, and Hong Kong warrants. Short selling is supported for U.S. stocks. However, OTC trading, pre & post market trading, and options trading are not supported in paper accounts.

Trades in the paper environment are matched based on the bid-ask spread from the real market. If the buy order price is higher than or equal to the ask price and the sell order price is lower than or equal to the bid price, a trade can be executed. Market orders are matched by default.

## Q5: How can I reset the funds in my paper account?

Manual resetting of demo funds is not supported at the moment. If needed, please contact your customer service or account manager for offline processing.

## Q6: After placing orders through the OpenAPI, how can I view them?

After placing orders via the OpenAPI, you can view them through any of the following:

- **Order inquiry API**: Call the API to query real-time order status
- **WebSocket push**: Subscribe to trade push events to receive order updates in real time
- **CLI**: Use the [Longbridge CLI](/docs/cli) to query from the command line, e.g. `longbridge orders`
- **App / PC**: View orders and their statuses directly in the terminal products

## Q7: How can I know if my account has sufficient funds for trading?

You can use the trading API `/v1/trade/estimate/buy_limit` to estimate the available cash & margin buying power, and short selling quantity in your account. Due to the complexity of risk control requirements, it's not recommended to calculate the tradable quantity manually.

## Q8: What does it mean when the order placement API returns "User authentication failed"?

This error usually indicates that the user does not have permission for the corresponding trading operation, such as options trading or short selling U.S. stocks. You can complete the permission opening process guided by the order placement in the app. After obtaining the necessary permissions, you can continue trading or performing other operations through OpenAPI.
