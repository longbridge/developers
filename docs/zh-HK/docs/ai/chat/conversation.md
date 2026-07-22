---
slug: conversation
title: 發起對話
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

向指定 Agent 提問。可以開啟一個全新會話，也可以傳入已有會話的 `chat_uid` 在同一會話中追加提問。

Agent 會結合行情、賬戶等能力生成回答。當 Agent 需要你補充信息或確認時，本次運行會**中斷**（`status` 為 `interrupted`），此時需通過 [繼續對話](/zh-HK/docs/ai/chat/continue) 回傳答案後才能繼續。

通過請求頭 `Accept` 選擇響應模式：`text/event-stream` 為 SSE 流式，逐步推送運行過程與回答；其他值為阻塞式，一次性返回聚合後的最終結果。

<SDKLinks module="agent" klass="AgentContext" method="conversation" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/ai/agents/:id/conversations</td></tr>
</tbody>
</table>

### Path Parameters

| Name | Type   | Required | Description                              |
| ---- | ------ | -------- | ---------------------------------------- |
| id   | string | YES      | 目標 Agent 的 UID，需為已發佈 Agent      |

:::tip 如何獲取 Agent 的 UID
除通過 [Workspace 下的 Agent](/zh-HK/docs/ai/workspace/agents) 接口查詢外，也可以直接從 Longbridge 網頁端獲取：打開 Agent 的對話頁，URL 形如 `https://longbridge.com/zh-HK/ai/agents/chatbot/chat`，其中 `chatbot` 即為該 Agent 的 UID。
:::

### Request Body

| Name     | Type   | Required | Description                                        |
| -------- | ------ | -------- | -------------------------------------------------- |
| query    | string | YES      | 用戶問題，不能為空                                 |
| chat_uid | string | NO       | 已有會話標識。傳入則在該會話中繼續提問，不傳則新建會話 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL (JSON)" default>

```bash
# 阻塞式：一次性拿到最終結果
curl -X POST "https://openapi.longbridge.com/v1/ai/agents/123/conversations" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "query": "幫我看看特斯拉最近的股價表現"
  }'
```

  </TabItem>
  <TabItem value="curl-sse" label="cURL (SSE)">

```bash
# 流式：實時接收運行過程與回答
curl -N -X POST "https://openapi.longbridge.com/v1/ai/agents/123/conversations" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "query": "幫我看看特斯拉最近的股價表現"
  }'
```

  </TabItem>
</Tabs>

## Response

### Response Headers

- Content-Type: application/json（阻塞式）
- Content-Type: text/event-stream（流式）

### Response Example

運行成功：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "chat_uid": "ct_9f2c1a5b",
    "message_id": "42",
    "status": "succeeded",
    "answer": "特斯拉（TSLA.US）最近……",
    "references": [
      { "index": 1, "title": "...", "url": "..." }
    ],
    "elapsed_time": 3.21
  }
}
```

運行中斷（Agent 需要你補充信息，運行暫停）：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "chat_uid": "ct_9f2c1a5b",
    "message_id": "43",
    "status": "interrupted",
    "answer": "",
    "references": null,
    "elapsed_time": 1.05,
    "interrupt": {
      "node_id": "n_ask_human",
      "tool_call_id": "call_abc123",
      "questions": [
        {
          "question": "你想查詢哪個時間區間？",
          "options": [
            { "description": "近一週" },
            { "description": "近一個月" }
          ],
          "multi_select": false
        }
      ],
      "message_id": 43,
      "chat_id": 1001
    }
  }
}
```

流式模式下，服務端以 `event: message` 持續推送運行過程，`data` 中的 `event` 字段標識事件類型：

```
event: message
data: {"event":"chat_started","workflow_run_id":"745910371102313","data":{"chat_uid":"ct_9f2c1a5b","message_id":42}}

event: message
data: {"event":"message","workflow_run_id":"745910371102313","data":{"text":"特斯拉"}}

event: message
data: {"event":"workflow_finished","workflow_run_id":"745910371102313","data":{"status":"succeeded","elapsed_time":3.21,"outputs":{"answer":"..."}}}
```

完整的事件類型列表、負載結構與解析方式見 [SSE 事件](/zh-HK/docs/ai/chat/events)。

### Response Status

| Status | Description | Schema                                          |
| ------ | ----------- | ----------------------------------------------- |
| 200    | 返回成功    | [conversation_response](#schemaconversation_response) |
| 400    | 參數非法或命中風控 | `query` 為空、請求體錯誤，或內容風控攔截    |
| 500    | 內部錯誤    | None                                            |

## Schemas

### conversation_response

<a id="schemaconversation_response"></a>

| Name                 | Type     | Required | Description                                      |
| -------------------- | -------- | -------- | ------------------------------------------------ |
| chat_uid             | string   | true     | 會話標識，追加提問或排查問題時使用               |
| message_id           | string   | true     | 本輪消息 ID（字符串形式）                        |
| status               | string   | true     | 運行終態：`succeeded` / `interrupted` / `failed` / `stopped` |
| answer               | string   | false    | 最終回答文本，`status` 為 `succeeded` 時有效      |
| references           | object[] | false    | 回答引用的資料來源，無引用時為 `null`            |
| elapsed_time         | number   | false    | 運行耗時（秒）                                   |
| interrupt            | object   | false    | 僅當 `status` 為 `interrupted` 時出現            |
| ∟ node_id            | string   | true     | 觸發中斷的節點 ID                                |
| ∟ tool_call_id       | string   | true     | 本次詢問對應的工具調用 ID，繼續對話時作為答案的 key |
| ∟ questions          | object[] | true     | 需要你回答的問題列表                             |
| ∟∟ question          | string   | true     | 問題文本                                         |
| ∟∟ options           | object[] | false    | 可選項，為空表示自由作答                         |
| ∟∟∟ description      | string   | false    | 選項文本                                         |
| ∟∟ multi_select      | boolean  | false    | 是否允許多選                                     |
| ∟ message_id         | int64    | false    | 被暫停的消息 ID                                  |
| ∟ chat_id            | int64    | false    | 所屬會話 ID                                      |
| error                | object   | false    | 僅當運行出錯時出現                               |
| ∟ code               | int32    | false    | 錯誤碼                                           |
| ∟ message            | string   | false    | 錯誤信息                                         |
