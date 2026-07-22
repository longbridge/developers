---
slug: conversation
title: 发起对话
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

向指定 Agent 提问。可以开启一个全新会话，也可以传入已有会话的 `chat_uid` 在同一会话中追加提问。

Agent 会结合行情、账户等能力生成回答。当 Agent 需要你补充信息或确认时，本次运行会**中断**（`status` 为 `interrupted`），此时需通过 [继续对话](/zh-CN/docs/ai/chat/continue) 回传答案后才能继续。

通过请求头 `Accept` 选择响应模式：`text/event-stream` 为 SSE 流式，逐步推送运行过程与回答；其他值为阻塞式，一次性返回聚合后的最终结果。

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
| id   | string | YES      | 目标 Agent 的 UID，需为已发布 Agent      |

:::tip 如何获取 Agent 的 UID
除通过 [Workspace 下的 Agent](/zh-CN/docs/ai/workspace/agents) 接口查询外，也可以直接从 Longbridge 网页端获取：打开 Agent 的对话页，URL 形如 `https://longbridge.com/zh-CN/ai/agents/chatbot/chat`，其中 `chatbot` 即为该 Agent 的 UID。
:::

### Request Body

| Name     | Type   | Required | Description                                        |
| -------- | ------ | -------- | -------------------------------------------------- |
| query    | string | YES      | 用户问题，不能为空                                 |
| chat_uid | string | NO       | 已有会话标识。传入则在该会话中继续提问，不传则新建会话 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL (JSON)" default>

```bash
# 阻塞式：一次性拿到最终结果
curl -X POST "https://openapi.longbridge.com/v1/ai/agents/123/conversations" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "query": "帮我看看特斯拉最近的股价表现"
  }'
```

  </TabItem>
  <TabItem value="curl-sse" label="cURL (SSE)">

```bash
# 流式：实时接收运行过程与回答
curl -N -X POST "https://openapi.longbridge.com/v1/ai/agents/123/conversations" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "query": "帮我看看特斯拉最近的股价表现"
  }'
```

  </TabItem>
</Tabs>

## Response

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

运行中断（Agent 需要你补充信息，运行暂停）：

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
          "question": "你想查询哪个时间区间？",
          "options": [
            { "description": "近一周" },
            { "description": "近一个月" }
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

流式模式下，服务端以 `event: message` 持续推送运行过程，`data` 中的 `event` 字段标识事件类型：

```
event: message
data: {"event":"chat_started","workflow_run_id":"745910371102313","data":{"chat_uid":"ct_9f2c1a5b","message_id":42}}

event: message
data: {"event":"message","workflow_run_id":"745910371102313","data":{"text":"特斯拉"}}

event: message
data: {"event":"workflow_finished","workflow_run_id":"745910371102313","data":{"status":"succeeded","elapsed_time":3.21,"outputs":{"answer":"..."}}}
```

完整的事件类型列表、负载结构与解析方式见 [SSE 事件](/zh-CN/docs/ai/chat/events)。

### Response Status

| Status | Description | Schema                                          |
| ------ | ----------- | ----------------------------------------------- |
| 200    | 返回成功    | [conversation_response](#schemaconversation_response) |
| 400    | 参数非法或命中风控 | `query` 为空、请求体错误，或内容风控拦截    |
| 500    | 内部错误    | None                                            |

## Schemas

### conversation_response

<a id="schemaconversation_response"></a>

| Name                 | Type     | Required | Description                                      |
| -------------------- | -------- | -------- | ------------------------------------------------ |
| chat_uid             | string   | true     | 会话标识，追加提问或排查问题时使用               |
| message_id           | string   | true     | 本轮消息 ID（字符串形式）                        |
| status               | string   | true     | 运行终态：`succeeded` / `interrupted` / `failed` / `stopped` |
| answer               | string   | false    | 最终回答文本，`status` 为 `succeeded` 时有效      |
| references           | object[] | false    | 回答引用的资料来源，无引用时为 `null`            |
| elapsed_time         | number   | false    | 运行耗时（秒）                                   |
| interrupt            | object   | false    | 仅当 `status` 为 `interrupted` 时出现            |
| ∟ node_id            | string   | true     | 触发中断的节点 ID                                |
| ∟ tool_call_id       | string   | true     | 本次询问对应的工具调用 ID，继续对话时作为答案的 key |
| ∟ questions          | object[] | true     | 需要你回答的问题列表                             |
| ∟∟ question          | string   | true     | 问题文本                                         |
| ∟∟ options           | object[] | false    | 可选项，为空表示自由作答                         |
| ∟∟∟ description      | string   | false    | 选项文本                                         |
| ∟∟ multi_select      | boolean  | false    | 是否允许多选                                     |
| ∟ message_id         | int64    | false    | 被暂停的消息 ID                                  |
| ∟ chat_id            | int64    | false    | 所属会话 ID                                      |
| error                | object   | false    | 仅当运行出错时出现                               |
| ∟ code               | int32    | false    | 错误码                                           |
| ∟ message            | string   | false    | 错误信息                                         |
