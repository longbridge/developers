---
slug: continue
title: 继续对话
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

当 [发起对话](/zh-CN/docs/ai/chat/conversation) 返回 `status = interrupted` 时，Agent 正等待你补充信息。通过本接口回传答案，暂停的运行会从中断处继续执行，直到成功、再次中断或失败。

同一轮对话可能发生多次中断：若继续后再次返回 `interrupted`，按新的 `interrupt` 重复调用本接口即可。

与发起对话一致，通过请求头 `Accept` 选择阻塞式 / SSE 流式响应。

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
| id         | string | YES      | 目标 Agent 的 UID                                  |
| chat_uid   | string | YES      | 中断所属会话的 `chat_uid`，取自发起对话的响应      |
| message_id | string | YES      | 被中断的消息 ID，取自中断响应的 `message_id`       |

### Request Body

| Name                 | Type   | Required | Description                                                    |
| -------------------- | ------ | -------- | -------------------------------------------------------------- |
| answers_by_tool_call | object | YES      | 以 `tool_call_id` 为 key 的答案集合，不能为空。value 为「问题文本 → 回答」的键值对 |

`answers_by_tool_call` 的结构为「工具调用 ID → 该次询问的答案」，其中每个答案又是一组「问题 → 回答」：

- 外层 key 对应中断结构里的 `tool_call_id`。
- 内层 key 为中断问题文本，value 为你选择或填写的答案。
- 必须回答该次中断要求的所有问题，否则返回错误。

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
        "你想查询哪个时间区间？": "近一个月"
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
        "你想查询哪个时间区间？": "近一个月"
      }
    }
  }'
```

  </TabItem>
</Tabs>

## Response

响应结构与 [发起对话](/zh-CN/docs/ai/chat/conversation#schemaconversation_response) 完全一致。

### Response Headers

- Content-Type: application/json（阻塞式）
- Content-Type: text/event-stream（流式）

### Response Example

运行成功：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "chat_uid": "ct_9f2c1a5b",
    "message_id": "43",
    "status": "succeeded",
    "answer": "近一个月特斯拉（TSLA.US）……",
    "references": [],
    "elapsed_time": 2.74
  }
}
```

### Response Status

| Status | Description | Schema                                                |
| ------ | ----------- | ----------------------------------------------------- |
| 200    | 返回成功    | [conversation_response](/zh-CN/docs/ai/chat/conversation#schemaconversation_response) |
| 400    | 参数非法    | `answers_by_tool_call` 为空、消息未处于中断状态、缺少中断所需答案，或会话 / 消息归属不符 |
| 500    | 内部错误    | None                                                  |

### 归属校验

为防止续跑他人的运行，服务端会校验：`chat_uid` 对应的会话必须属于当前认证成员，且 `message_id` 对应的消息必须属于该会话。任一不满足都会返回 `400`。
