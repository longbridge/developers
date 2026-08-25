---
slug: security-facts
title: 查询证券 Facts
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

查询指定证券的事实事件列表——包含异动检测、因子信息、数据来源及自然语言摘要，支持按时间范围和数量上限筛选。

事实是策略的触发源：信号的 `key_fact_id` 即指向触发它的那条事实。

每条事实都是一个 JSON 对象，字段随类型（news、fundamental、technical）而不同。

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/facts/security_facts</td></tr>
</tbody>
</table>

### Query Parameters

| 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| symbol | string | YES | 要查询的证券代码，例如 `AAPL.US` 或 `700.HK` |
| begin_time | string | NO | 查询起始时间，UTC 时区，格式为 `2006-01-02T15:04:05Z`；留空则从最早可用数据开始 |
| end_time | string | NO | 查询结束时间，UTC 时区，格式为 `2006-01-02T15:04:05Z`；留空则返回最新数据 |
| limit | int32 | NO | 返回事实数量上限；时间范围内的事实超出该上限时，仅返回最新的 `limit` 条，默认 100 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL" default>

```bash
curl "https://openapi.longbridge.com/v1/facts/security_facts?symbol=AAPL.US&limit=20" \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

  </TabItem>
</Tabs>

## Response

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "facts": [
      {
        "fact_id": "technical_macd_12_26_9_short_1787014800188612104",
        "fact_type": "Technical",
        "occur_time": "2026-08-18T01:00:00Z",
        "direction": "short",
        "data_source": [
          {
            "type": "Technical",
            "source_name": "SEHK",
            "url": "",
            "icon": ""
          }
        ],
        "nl_info": {
          "title": "Tencent MACD Indicator Triggers Key Signal: Momentum Factor Shows Abnormal Movement",
          "sub_title": "The MACD (12,26,9) indicator has issued a critical signal, with momentum factors displaying abnormal characteristics.",
          "summary": "[{\"tag\":\"MACD\",\"value\":\"…\"}]",
          "invest_anal": "[{\"tag\":\"momentum\",\"value\":\"…\"}]",
          "eli_explain": "[{\"tag\":\"what_happened\",\"value\":\"…\"}]"
        },
        "symbols_info": [
          {
            "symbol": "700.HK",
            "security_name": "TENCENT"
          }
        ],
        "factors": [
          {
            "name": "macd_12_26_9",
            "factor_groups": [
              "MOMENTUM"
            ],
            "long_short_direction": "short",
            "trigger_condition": "",
            "anomaly_detection": {
              "test_method": "",
              "anomaly_result": "",
              "thresholds": {
                "low": "",
                "medium": "",
                "high": ""
              },
              "significance_level": ""
            }
          }
        ]
      }
    ]
  }
}
```

> **说明：** `nl_info.summary`、`invest_anal`、`eli_explain` 三个字段都是**以字符串承载**的 `{tag, value}` JSON 数组，读取时需要再解析一次字符串。

### Response Status

| 状态码 | 说明 |
| ------ | ---- |
| 200 | 成功 |
| 500 | 服务内部错误 |

## Schemas

### security_facts_response

| 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| facts | object[] | true | 事实事件列表，最新的在前 |
| ∟ fact_id | string | true | 事实 ID，例如 `technical_macd_12_26_9_short_1787014800188612104`；信号的 `key_fact_id` 指向它 |
| ∟ fact_type | string | true | `News`、`Fundamental` 或 `Technical` |
| ∟ direction | string | true | 事实指向的方向：`long`、`short` 或 `neutral` |
| ∟ occur_time | string | true | 事实发生时间，UTC 的 RFC 3339 格式 |
| ∟ symbols_info | object[] | true | 该事实涉及的证券 |
| ∟∟ symbol | string | true | 证券代码，例如 `700.HK` |
| ∟∟ security_name | string | true | 证券名称，按 `Accept-Language` 本地化 |
| ∟ factors | object[] | true | 构成该事实的因子 |
| ∟∟ name | string | true | 因子名称，例如 `macd_12_26_9` 或 `EARNINGS_RELEASED` |
| ∟∟ factor_groups | string[] | true | 因子所属分组，例如 `MOMENTUM` |
| ∟∟ long_short_direction | string | true | 因子指向的方向：`long`、`short` 或 `neutral` |
| ∟∟ trigger_condition | string | true | 触发该因子的条件；不适用时为空 |
| ∟∟ anomaly_detection | object | true | 因子背后的异动检测——`test_method`、`anomaly_result`、`significance_level` 与 `thresholds`（`low` / `medium` / `high`）。未做检测的因子为空 |
| ∟ data_source | object[] | true | 事实的数据来源 |
| ∟∟ source_name | string | true | 来源名称，例如 `AASTOCKS News`、`SEHK` |
| ∟∟ type | string | true | 来源类型，取值同 `fact_type` |
| ∟∟ url | string | true | 来源链接（如有） |
| ∟∟ icon | string | true | 来源图标 URL（如有） |
| ∟ nl_info | object | true | 事实的自然语言呈现，按 `Accept-Language` 本地化 |
| ∟∟ title | string | true | 标题 |
| ∟∟ sub_title | string | true | 副标题 |
| ∟∟ summary | string | true | 发生了什么——**以字符串承载**的 `{tag, value}` JSON 数组 |
| ∟∟ invest_anal | string | true | 对投资者可能意味着什么，同样是 JSON-in-string 结构 |
| ∟∟ eli_explain | string | true | 通俗解读，同样是 JSON-in-string 结构；可能为空 |
