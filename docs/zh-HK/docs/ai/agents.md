---
slug: agents
title: 公開 Agent
sidebar_position: 0.5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

列出平台上所有公開可用的 Agent——與探索頁展示的是同一份目錄。返回的 `uid` 即[發起對話](/zh-HK/docs/ai/chat/conversation)接口路徑中使用的 Agent 標識。

與 [Workspace 下的 Agent](/zh-HK/docs/ai/workspace/agents) 不同，本接口不限定 Workspace：返回所有已發佈且公開分享的 Agent。

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/ai/agents</td></tr>
</tbody>
</table>

### Query Parameters

| Name  | Type   | Required | Description                    |
| ----- | ------ | -------- | ------------------------------ |
| page  | int32  | NO       | 頁碼，從 1 開始，默認 1        |
| limit | int32  | NO       | 每頁條數，默認 20，最大 50     |
| name  | string | NO       | 按 Agent 名稱模糊搜索          |

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
        "name": "美股分析師",
        "description": "結合行情與基本面數據回答美股問題",
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

| Status | Description | Schema                                                  |
| ------ | ----------- | -------------------------------------------------------- |
| 200    | 返回成功    | [public_agents_response](#schemapublic_agents_response)  |
| 500    | 內部錯誤    | None                                                     |

## Schemas

### public_agents_response

<a id="schemapublic_agents_response"></a>

| Name           | Type     | Required | Description                                                    |
| -------------- | -------- | -------- | -------------------------------------------------------------- |
| agents         | object[] | true     | Agent 列表，按最後更新時間倒序                                 |
| ∟ uid          | string   | true     | Agent UID，用作[發起對話](/zh-HK/docs/ai/chat/conversation)的路徑參數 |
| ∟ name         | string   | true     | Agent 名稱，按 `Accept-Language` 請求頭本地化                  |
| ∟ description  | string   | false    | Agent 描述，按 `Accept-Language` 請求頭本地化                  |
| ∟ mode         | string   | true     | Agent 模式，如 `chat`                                          |
| ∟ icon         | string   | false    | 圖標 URL                                                       |
| ∟ is_published | boolean  | true     | 本接口下恆為 `true`                                            |
| ∟ published_at | int64    | false    | 發佈時間，Unix 秒級時間戳                                      |
| ∟ created_at   | int64    | false    | 創建時間，Unix 秒級時間戳                                      |
| ∟ updated_at   | int64    | false    | 最後更新時間，Unix 秒級時間戳                                  |
| total          | int32    | true     | 符合條件的公開 Agent 總數                                      |
