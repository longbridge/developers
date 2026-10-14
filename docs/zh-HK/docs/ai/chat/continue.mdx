---
slug: continue
title: 繼續對話
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

當 [發起對話](/zh-HK/docs/ai/chat/conversation) 返回 `status = interrupted` 時，Agent 正等待你補充信息。通過本接口回傳答案，暫停的運行會從中斷處繼續執行，直到成功、再次中斷或失敗。

同一輪對話可能發生多次中斷：若繼續後再次返回 `interrupted`，按新的 `interrupt` 重複調用本接口即可。

與發起對話一致，通過請求頭 `Accept` 選擇阻塞式 / SSE 流式響應。

<SDKLinks module="agent" klass="AgentContext" method="continue" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/ai/agents/:id/conversations/:chat_uid/messages/:message_id/continue</td></tr>
</tbody>
</table>

### Path Parameters

| Name       | Type   | Required | Description                                        |
| ---------- | ------ | -------- | -------------------------------------------------- |
| id         | string | YES      | 目標 Agent 的 UID                                  |
| chat_uid   | string | YES      | 中斷所屬會話的 `chat_uid`，取自發起對話的響應      |
| message_id | string | YES      | 被中斷的消息 ID，取自中斷響應的 `message_id`       |

### Request Body

| Name                 | Type   | Required | Description                                                    |
| -------------------- | ------ | -------- | -------------------------------------------------------------- |
| answers_by_tool_call | object | YES      | 以 `tool_call_id` 為 key 的答案集合，不能為空。value 為「問題文本 → 回答」的鍵值對 |

`answers_by_tool_call` 的結構為「工具調用 ID → 該次詢問的答案」，其中每個答案又是一組「問題 → 回答」：

- 外層 key 對應中斷結構裏的 `tool_call_id`。
- 內層 key 為中斷問題文本，value 為你選擇或填寫的答案。
- 必須回答該次中斷要求的所有問題，否則返回錯誤。

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL (JSON)" default>

```bash
curl -X POST "https://openapi.longbridge.com/v1/ai/agents/123/conversations/ct_9f2c1a5b/messages/43/continue" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "answers_by_tool_call": {
      "call_abc123": {
        "你想查詢哪個時間區間？": "近一個月"
      }
    }
  }'
```

  </TabItem>
  <TabItem value="curl-sse" label="cURL (SSE)">

```bash
curl -N -X POST "https://openapi.longbridge.com/v1/ai/agents/123/conversations/ct_9f2c1a5b/messages/43/continue" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "answers_by_tool_call": {
      "call_abc123": {
        "你想查詢哪個時間區間？": "近一個月"
      }
    }
  }'
```

  </TabItem>
</Tabs>

## Response

響應結構與 [發起對話](/zh-HK/docs/ai/chat/conversation#schemaconversation_response) 完全一致。

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
    "message_id": "43",
    "status": "succeeded",
    "answer": "近一個月特斯拉（TSLA.US）……",
    "references": [],
    "elapsed_time": 2.74
  }
}
```

### Response Status

| Status | Description | Schema                                                |
| ------ | ----------- | ----------------------------------------------------- |
| 200    | 返回成功    | [conversation_response](/zh-HK/docs/ai/chat/conversation#schemaconversation_response) |
| 400    | 參數非法    | `answers_by_tool_call` 為空、消息未處於中斷狀態、缺少中斷所需答案，或會話 / 消息歸屬不符 |
| 500    | 內部錯誤    | None                                                  |

### 歸屬校驗

為防止續跑他人的運行，服務端會校驗：`chat_uid` 對應的會話必須屬於當前認證成員，且 `message_id` 對應的消息必須屬於該會話。任一不滿足都會返回 `400`。
