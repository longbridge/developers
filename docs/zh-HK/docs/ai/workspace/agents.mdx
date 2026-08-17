---
slug: agents
title: Workspace 下的 Agent
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取指定 Workspace 下的 Agent 列表。返回的 `uid` 即 [發起對話](/zh-HK/docs/ai/chat/conversation) 接口路徑中的 Agent 標識；只有 `is_published` 為 `true` 的 Agent 才能發起對話。

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

| Name  | Type   | Required | Description                        |
| ----- | ------ | -------- | ---------------------------------- |
| page  | int32  | NO       | 頁碼，從 1 開始，默認 1            |
| limit | int32  | NO       | 每頁數量，默認 20                  |
| name  | string | NO       | 按 Agent 名稱模糊搜索              |

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
        "name": "美股分析助手",
        "description": "結合行情與基本面數據，回答美股相關問題",
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

| Status | Description | Schema                                    |
| ------ | ----------- | ----------------------------------------- |
| 200    | 返回成功    | [agents_response](#schemaagents_response) |
| 400    | 參數非法    | Workspace 不存在或無權訪問                |
| 500    | 內部錯誤    | None                                      |

## Schemas

### agents_response

<a id="schemaagents_response"></a>

| Name           | Type     | Required | Description                                          |
| -------------- | -------- | -------- | ---------------------------------------------------- |
| agents         | object[] | true     | Agent 列表                                           |
| ∟ uid          | string   | true     | Agent UID，用於 [發起對話](/zh-HK/docs/ai/chat/conversation) 的路徑參數 |
| ∟ name         | string   | true     | Agent 名稱                                           |
| ∟ description  | string   | false    | Agent 描述                                           |
| ∟ mode         | string   | true     | Agent 模式，如 `chat`                                |
| ∟ icon         | string   | false    | 圖標 URL                                             |
| ∟ is_published | boolean  | true     | 是否已發佈，僅已發佈的 Agent 可發起對話              |
| ∟ published_at | int64    | false    | 發佈時間，Unix 時間戳（秒），未發佈為 0              |
| ∟ created_at   | int64    | false    | 創建時間，Unix 時間戳（秒）                          |
| ∟ updated_at   | int64    | false    | 最後更新時間，Unix 時間戳（秒）                      |
| total          | int32    | true     | 符合條件的 Agent 總數                                |
