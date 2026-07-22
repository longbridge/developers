---
slug: conversation
title: Start Conversation
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Ask a question to the specified Agent. You can start a brand-new conversation, or pass the `chat_uid` of an existing one to continue asking in the same conversation.

The Agent generates the answer using capabilities such as market data and account access. When the Agent needs more information or confirmation from you, the run is **interrupted** (`status` is `interrupted`) — send your answers via [Continue Conversation](/docs/ai/chat/continue) to resume it.

Choose the response mode with the `Accept` header: `text/event-stream` streams the run progress and answer via SSE; any other value returns a blocking response with the aggregated final result.

<SDKLinks module="agent" klass="AgentContext" method="conversation" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/ai/agents/:id/conversations</td></tr>
</tbody>
</table>

### Path Parameters

| Name | Type   | Required | Description                                        |
| ---- | ------ | -------- | -------------------------------------------------- |
| id   | string | YES      | UID of the target Agent; must be a published Agent |

:::tip How to find an Agent's UID
Besides querying the [Agents in Workspace](/docs/ai/workspace/agents) endpoint, you can also get it directly from the Longbridge website: open the Agent's chat page — the URL looks like `https://longbridge.com/en/ai/agents/chatbot/chat`, where `chatbot` is the Agent's UID.
:::

### Request Body

| Name     | Type   | Required | Description                                                                                      |
| -------- | ------ | -------- | ------------------------------------------------------------------------------------------------ |
| query    | string | YES      | The user question; must not be empty                                                             |
| chat_uid | string | NO       | Identifier of an existing conversation. Pass it to continue that conversation; omit to start a new one |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL (JSON)" default>

```bash
# Blocking: get the final result in one response
curl -X POST "https://openapi.longbridge.com/v1/ai/agents/123/conversations" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "query": "How has Tesla stock performed recently?"
  }'
```

  </TabItem>
  <TabItem value="curl-sse" label="cURL (SSE)">

```bash
# Streaming: receive run progress and the answer in real time
curl -N -X POST "https://openapi.longbridge.com/v1/ai/agents/123/conversations" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "query": "How has Tesla stock performed recently?"
  }'
```

  </TabItem>
</Tabs>

## Response

### Response Headers

- Content-Type: application/json (blocking)
- Content-Type: text/event-stream (streaming)

### Response Example

Run succeeded:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "chat_uid": "ct_9f2c1a5b",
    "message_id": "42",
    "status": "succeeded",
    "answer": "Tesla (TSLA.US) recently...",
    "references": [
      { "index": 1, "title": "...", "url": "..." }
    ],
    "elapsed_time": 3.21
  }
}
```

Run interrupted (the Agent needs more information from you; the run is paused):

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
          "question": "Which time range would you like to check?",
          "options": [
            { "description": "Past week" },
            { "description": "Past month" }
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

In streaming mode, the server keeps pushing run progress as `event: message` events; the `event` field inside `data` identifies the event type:

```
event: message
data: {"event":"chat_started","workflow_run_id":"745910371102313","data":{"chat_uid":"ct_9f2c1a5b","message_id":42}}

event: message
data: {"event":"message","workflow_run_id":"745910371102313","data":{"text":"Tesla"}}

event: message
data: {"event":"workflow_finished","workflow_run_id":"745910371102313","data":{"status":"succeeded","elapsed_time":3.21,"outputs":{"answer":"..."}}}
```

See [SSE Events](/docs/ai/chat/events) for the full list of event types, their payload structures, and parsing guidance.

### Response Status

| Status | Description                       | Schema                                                 |
| ------ | --------------------------------- | ------------------------------------------------------ |
| 200    | Success                           | [conversation_response](#schemaconversation_response)  |
| 400    | Invalid parameters or risk control | Empty `query`, malformed request body, or blocked by content risk control |
| 500    | Internal error                    | None                                                   |

## Schemas

### conversation_response

<a id="schemaconversation_response"></a>

| Name                 | Type     | Required | Description                                                    |
| -------------------- | -------- | -------- | -------------------------------------------------------------- |
| chat_uid             | string   | true     | Conversation identifier, used for follow-up questions and troubleshooting |
| message_id           | string   | true     | Message ID of this round (as a string)                          |
| status               | string   | true     | Final run status: `succeeded` / `interrupted` / `failed` / `stopped` |
| answer               | string   | false    | Final answer text; valid when `status` is `succeeded`           |
| references           | object[] | false    | Sources referenced by the answer; `null` if none                |
| elapsed_time         | number   | false    | Run duration in seconds                                         |
| interrupt            | object   | false    | Present only when `status` is `interrupted`                     |
| ∟ node_id            | string   | true     | ID of the node that triggered the interrupt                     |
| ∟ tool_call_id       | string   | true     | Tool call ID of this inquiry; used as the answer key when continuing |
| ∟ questions          | object[] | true     | Questions you need to answer                                    |
| ∟∟ question          | string   | true     | Question text                                                   |
| ∟∟ options           | object[] | false    | Options; empty means free-form answer                           |
| ∟∟∟ description      | string   | false    | Option text                                                     |
| ∟∟ multi_select      | boolean  | false    | Whether multiple options may be selected                        |
| ∟ message_id         | int64    | false    | ID of the paused message                                        |
| ∟ chat_id            | int64    | false    | ID of the owning conversation                                   |
| error                | object   | false    | Present only when the run failed                                |
| ∟ code               | int32    | false    | Error code                                                      |
| ∟ message            | string   | false    | Error message                                                   |
