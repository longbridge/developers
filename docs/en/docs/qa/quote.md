---
id: quote_qa
title: Quote Releated
slug: broker
sidebar_position: 1
---

## Q1: How to calculate the subscription quote, is it one or more subscriptions if I both subscribe depth and broker with the same security?

The subscription quote is only calculated according to the security dimension, only one subscription will be calculted if you subscribe muilty quote type with one security.

## Q2: What is the specific limit logic for request frequency limit?

Use the token bucket to limit request and control the request rate. No more than 10 calls in 1 second, and no more than 5 concurrent requests.

## Q3: What is the available subscribing securities and corresponding symbol formats?

The security code uses the `ticker.region` format, `ticker` represents the code — for example, Tesla is `TSLA.US`. Available subscribing securities are as follows.

<table>
    <tr>
        <td>Market</td>
        <td>Symbol</td>
        <td>Ticker</td>
        <td>Region</td>
    </tr>
    <tr>
        <td rowspan="4">HK Market</td>
        <td>Securities (including equities, ETFs, Warrants, CBBCs)</td>
        <td>The official code of the security on the exchange</td>
        <td>HK</td>
    </tr>
    <tr>
        <td>Hang Seng Index</td>
        <td>HSI</td>
        <td>HK</td>
    </tr>
    <tr>
        <td>Hang Seng China Enterprises Index</td>
        <td>HSCEI</td>
        <td>HK</td>
    </tr>
    <tr>
        <td>Hang Seng TECH Index</td>
        <td>HSTECH</td>
        <td>HK</td>
    </tr>
    <tr>
        <td rowspan="3">US Market</td>
        <td>Securities (including stocks, ETFs)</td>
        <td>The official code of the security on the exchange</td>
        <td>US</td>
    </tr>
    <tr>
        <td>Nasdsaq Index</td>
        <td>.IXIC</td>
        <td>US</td>
    </tr>
    <tr>
        <td>Dow Jones Industrial Average</td>
        <td>.DJI</td>
        <td>US</td>
    </tr>
    <tr>
        <td rowspan="2">CN Market</td>
        <td>Securities (including stocks, ETFs)</td>
        <td>The official code of the security on the exchange</td>
        <td>SH or SZ</td>
    </tr>
    <tr>
        <td>Index</td>
        <td>The official code of the security on the exchange</td>
        <td>SH or SZ</td>
    </tr>
</table>

## Q4: What is the quote authority of OpenAPI? How to buy quote cards?

- Quote Authority
  In accordance with the rules of the exchange, the authority of OpenAPI are independent, and are not shared with App, PC, or Web permissions. For example, the Hong Kong stock Level 2 authority you have on the App cannot be used on the OpenAPI side. Longbridge also presents basic market rights to OpenAPI users. If you need a higher-level market, you can activate the high-level quote authority by purchasing a market card through on-line Quote Store of brokers or Longbridge.
- How to buy quote cards  
  Longbridge users can choose the market cards they want to buy through the "Quote Store" in the Longbridge App.

## Q5: Quote Change By Date Time

- US Market: 09:20:00 EDT/EST
- HK Market: 08:50:00 CST
- CN Market: 09:00:00 CST
- SG Market: 08:20:00 CST

## Q6: How to enable Overnight quote

- **Overnight quote data is not available by default.** You need to purchase the **"LV1 Real-time Quote (OpenAPI)"** quote card in the "Quote Store" of the Longbridge mobile app to access overnight data.
- Overnight quotes are currently **only available for US stocks**. Hong Kong stocks do not support overnight quotes.
- After obtaining the overnight quote permission, you still need to actively enable it by filling in the key `need_over_night_quote`, value `true` in the `metadata` field of the authentication interface.

```protobuf
message AuthRequest {
  string token = 1;
  map<string, string> metadata = 2;
}

message ReconnectRequest {
  string session_id = 1;
  map<string, string> metadata = 2;
}
```

- After turning on the night trading quotations, both the pull and push interfaces will be able to obtain the night trading quotations during the night trading period.

## Q7: Enable Overnight quote in OpenAPI SDK

- Create `Config` from environment variables

Set environment variable `LONGBRIDGE_ENABLE_OVERNIGHT` to `true` (legacy `LONGPORT_ENABLE_OVERNIGHT` also supported)

- Create `Config` object from constructor

```python
config = Config(app_key="your_app_key", app_secret="your_app_secret", access_token="your_access_token", enable_overnight=True)
```
