---
slug: agents
title: Public Agents
sidebar_position: 0.5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

List all publicly available Agents on the platform — the same catalog shown on the Explore page. The returned `uid` is the Agent identifier used in the [Start Conversation](/docs/ai/chat/conversation) endpoint path.

Unlike [Agents in Workspace](/docs/ai/workspace/agents), this endpoint is not scoped to a Workspace: it returns every Agent that is published and publicly shared.

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/ai/agents</td></tr>
</tbody>
</table>

### Query Parameters

| Name  | Type   | Required | Description                          |
| ----- | ------ | -------- | ------------------------------------ |
| page  | int32  | NO       | Page number, starts at 1, default 1  |
| limit | int32  | NO       | Page size, default 20, maximum 50    |
| name  | string | NO       | Fuzzy search by Agent name           |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL" default>

```bash
curl "https://openapi.longbridge.com/v1/ai/agents?page=1&limit=20" \
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
    "total": 35
  }
}
```

### Response Status

| Status | Description    | Schema                                                  |
| ------ | -------------- | -------------------------------------------------------- |
| 200    | Success        | [public_agents_response](#schemapublic_agents_response)  |
| 500    | Internal error | None                                                     |

## Schemas

### public_agents_response

<a id="schemapublic_agents_response"></a>

| Name           | Type     | Required | Description                                                          |
| -------------- | -------- | -------- | -------------------------------------------------------------------- |
| agents         | object[] | true     | Agent list, ordered by last updated time descending                   |
| ∟ uid          | string   | true     | Agent UID, used as the path parameter of [Start Conversation](/docs/ai/chat/conversation) |
| ∟ name         | string   | true     | Agent name, localized by the `Accept-Language` header                 |
| ∟ description  | string   | false    | Agent description, localized by the `Accept-Language` header          |
| ∟ mode         | string   | true     | Agent mode, e.g. `chat`                                               |
| ∟ icon         | string   | false    | Icon URL                                                              |
| ∟ is_published | boolean  | true     | Always `true` for this endpoint                                       |
| ∟ published_at | int64    | false    | Publish time, Unix timestamp in seconds                               |
| ∟ created_at   | int64    | false    | Creation time, Unix timestamp in seconds                              |
| ∟ updated_at   | int64    | false    | Last updated time, Unix timestamp in seconds                          |
| total          | int32    | true     | Total number of public Agents matching the query                      |
