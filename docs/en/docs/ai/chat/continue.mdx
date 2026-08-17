---
slug: continue
title: Continue Conversation
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

When [Start Conversation](/docs/ai/chat/conversation) returns `status = interrupted`, the Agent is waiting for more information from you. Send your answers via this endpoint and the paused run resumes from the interrupt point, until it succeeds, gets interrupted again, or fails.

A single round of conversation may be interrupted multiple times: if the run returns `interrupted` again after continuing, call this endpoint again with the new `interrupt`.

As with Start Conversation, choose blocking / SSE streaming response mode with the `Accept` header.

<SDKLinks module="agent" klass="AgentContext" method="continue" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/ai/agents/:id/conversations/:chat_uid/messages/:message_id/continue</td></tr>
</tbody>
</table>

### Path Parameters

| Name       | Type   | Required | Description                                                              |
| ---------- | ------ | -------- | ------------------------------------------------------------------------ |
| id         | string | YES      | UID of the target Agent                                                  |
| chat_uid   | string | YES      | `chat_uid` of the interrupted conversation, from the Start Conversation response |
| message_id | string | YES      | ID of the interrupted message, from the `message_id` in the interrupt response |

### Request Body

| Name                 | Type   | Required | Description                                                                                       |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------- |
| answers_by_tool_call | object | YES      | Answers keyed by `tool_call_id`; must not be empty. Each value is a map of question text → answer |

The structure of `answers_by_tool_call` is "tool call ID → answers for that inquiry", where each answer set is a map of "question → answer":

- The outer key corresponds to `tool_call_id` in the interrupt structure.
- The inner key is the interrupt question text, and the value is the answer you selected or typed.
- All questions required by the interrupt must be answered, otherwise an error is returned.

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
        "Which time range would you like to check?": "Past month"
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
        "Which time range would you like to check?": "Past month"
      }
    }
  }'
```

  </TabItem>
</Tabs>

## Response

The response structure is identical to [Start Conversation](/docs/ai/chat/conversation#schemaconversation_response).

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
    "message_id": "43",
    "status": "succeeded",
    "answer": "Over the past month, Tesla (TSLA.US)...",
    "references": [],
    "elapsed_time": 2.74
  }
}
```

### Response Status

| Status | Description        | Schema                                                                        |
| ------ | ------------------ | ----------------------------------------------------------------------------- |
| 200    | Success            | [conversation_response](/docs/ai/chat/conversation#schemaconversation_response) |
| 400    | Invalid parameters | Empty `answers_by_tool_call`, message not interrupted, missing required interrupt answers, or conversation / message ownership mismatch |
| 500    | Internal error     | None                                                                          |

### Ownership Checks

To prevent resuming someone else's run, the server verifies that the conversation identified by `chat_uid` belongs to the authenticated member, and the message identified by `message_id` belongs to that conversation. Failing either check returns `400`.
