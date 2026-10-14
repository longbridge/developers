---
slug: agents
title: Agents in Workspace
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

List the Agents in the specified Workspace. The returned `uid` is the Agent identifier used in the [Start Conversation](/docs/ai/chat/conversation) endpoint path; only Agents with `is_published` set to `true` can start conversations.

<SDKLinks module="agent" klass="AgentContext" method="agents" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/ai/workspaces/:id/agents</td></tr>
</tbody>
</table>

### Path Parameters

| Name | Type   | Required | Description  |
| ---- | ------ | -------- | ------------ |
| id   | string | YES      | Workspace ID |

### Query Parameters

| Name  | Type   | Required | Description                          |
| ----- | ------ | -------- | ------------------------------------ |
| page  | int32  | NO       | Page number, starts at 1, default 1  |
| limit | int32  | NO       | Page size, default 20                |
| name  | string | NO       | Fuzzy search by Agent name           |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL" default>

```bash
curl "https://openapi.longbridge.com/v1/ai/workspaces/1001/agents?page=1&limit=20" \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

  </TabItem>
</Tabs>

## Response

### Response Headers

- Content-Type: application/json

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "agents": [
      {
        "uid": "ag_7d3f9b2c",
        "name": "US Stock Analyst",
        "description": "Answers US stock questions with market and fundamental data",
        "mode": "chat",
        "icon": "https://cdn.longbridge.com/icons/agent.png",
        "is_published": true,
        "published_at": 1742000000,
        "created_at": 1741000000,
        "updated_at": 1742001000
      }
    ],
    "total": 12
  }
}
```

### Response Status

| Status | Description        | Schema                                    |
| ------ | ------------------ | ----------------------------------------- |
| 200    | Success            | [agents_response](#schemaagents_response) |
| 400    | Invalid parameters | Workspace not found or not accessible     |
| 500    | Internal error     | None                                      |

## Schemas

### agents_response

<a id="schemaagents_response"></a>

| Name           | Type     | Required | Description                                                          |
| -------------- | -------- | -------- | -------------------------------------------------------------------- |
| agents         | object[] | true     | Agent list                                                            |
| ∟ uid          | string   | true     | Agent UID, used as the path parameter of [Start Conversation](/docs/ai/chat/conversation) |
| ∟ name         | string   | true     | Agent name                                                            |
| ∟ description  | string   | false    | Agent description                                                     |
| ∟ mode         | string   | true     | Agent mode, e.g. `chat`                                               |
| ∟ icon         | string   | false    | Icon URL                                                              |
| ∟ is_published | boolean  | true     | Whether published; only published Agents can start conversations      |
| ∟ published_at | int64    | false    | Publish time, Unix timestamp in seconds; 0 if unpublished             |
| ∟ created_at   | int64    | false    | Creation time, Unix timestamp in seconds                              |
| ∟ updated_at   | int64    | false    | Last updated time, Unix timestamp in seconds                          |
| total          | int32    | true     | Total number of matching Agents                                       |
