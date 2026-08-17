---
slug: events
title: SSE 事件
sidebar_position: 4
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

流式模式（`Accept: text/event-stream`）下，[發起對話](/zh-HK/docs/ai/chat/conversation)和[繼續對話](/zh-HK/docs/ai/chat/continue)會以一系列 SSE 事件推送運行過程。本頁列出所有事件類型及解析方式。

## 幀格式

每一幀 SSE 都使用同樣的信封結構：SSE 的 `event` 字段恆為 `message`，`data` 字段是一個 JSON 對象：

```
event: message
data: {"event":"<event_type>","workflow_run_id":"745910371102313","data":{...}}
```

| 名稱            | 類型   | 說明                                             |
| --------------- | ------ | ------------------------------------------------ |
| event           | string | 事件類型，按此字段分發處理                       |
| workflow_run_id | string | 本次運行的 ID，為數字 ID 的字符串形式（如 `"745910371102313"`），同一次運行的所有事件中該值一致 |
| data            | object | 事件負載，結構隨事件類型而不同（見下文）         |

解析規則：

- **按 `data.event` 分發**，而不是 SSE 的 `event` 字段（它恆為 `message`）。
- **忽略未知事件類型。** 事件類型可能隨時新增，只處理已知事件的客戶端可保持向前兼容。
- 除特別說明外，`started_at` / `finished_at` 為 Unix 秒級時間戳，`elapsed_time` 為秒數。

## 典型事件序列

一次運行始於 `chat_started`、止於 `chat_finished`，中間的事件取決於運行結果：

**成功：**

```
chat_started → workflow_started → thinking_started → message (type=think) ...
→ node_tool_use_started / node_tool_use_finished ...
→ thinking_finished → message (type=answer) ...
→ workflow_finished (status=succeeded) → chat_finished
```

**中斷**（Agent 需要你補充信息，通過[繼續對話](/zh-HK/docs/ai/chat/continue)恢復）：

```
chat_started → workflow_started → ... → human_interaction_required → chat_finished
```

注意：中斷的運行**不會**發送 `workflow_finished`；繼續被中斷的運行時，恢復後的流**不會**再次發送 `workflow_started`。

**失敗：**

```
chat_started → workflow_started → ... → workflow_finished (status=failed) → chat_finished
```

## 最簡客戶端

純問答場景只需處理四種事件，其餘事件都是可選的過程展示：

| 事件                         | 處理方式                                               |
| ---------------------------- | ------------------------------------------------------ |
| `message`（`type=answer`）   | 將 `data.text` 追加到正在展示的回答中                  |
| `human_interaction_required` | 展示問題，攜帶答案調用繼續對話接口                     |
| `workflow_finished`          | 讀取最終 `status` 和 `outputs.answer`；失敗時展示錯誤  |
| `chat_finished`              | 關閉流，本次運行結束                                   |

## 會話生命週期

### chat_started

每個流的第一個事件。會話和消息記錄已創建；保存 `chat_uid`（用於追問）和 `message_id`（用於中斷後繼續）。

| 名稱       | 類型   | 說明                       |
| ---------- | ------ | -------------------------- |
| chat_id    | int64  | 會話內部 ID                |
| chat_uid   | string | 會話標識，用於後續請求     |
| message_id | int64  | 本輪消息 ID                |

```json
{"event":"chat_started","workflow_run_id":"745910371102313","data":{"chat_id":1001,"chat_uid":"ct_9f2c1a5b","message_id":42}}
```

### chat_finished

每個流的最後一個事件，之後服務端關閉連接。

| 名稱          | 類型   | 說明                           |
| ------------- | ------ | ------------------------------ |
| chat_id       | int64  | 會話內部 ID                    |
| chat_uid      | string | 會話標識                       |
| message_id    | int64  | 本輪消息 ID                    |
| error         | string | 錯誤詳情，成功時為空           |
| error_message | string | 面向用戶的錯誤信息，成功時為空 |

## 運行生命週期

### workflow_started

Agent 運行已開始。通過繼續對話恢復被中斷的運行時不會發送此事件。

| 名稱        | 類型   | 說明                                                   |
| ----------- | ------ | ------------------------------------------------------ |
| workflow_id | int64  | 該 Agent 底層工作流的 ID                               |
| started_at  | int64  | 開始時間（Unix 秒）                                    |
| inputs      | object | 運行輸入                                               |
| hit_cache   | bool   | 為 `true` 時表示答案命中緩存，流會直接進入回答階段     |

### workflow_finished

運行已結束——成功、失敗或被用戶停止。在此讀取最終結果。

| 名稱          | 類型     | 說明                                                       |
| ------------- | -------- | ---------------------------------------------------------- |
| status        | string   | `succeeded` / `failed` / `stopped`                         |
| outputs       | object   | 運行輸出；`outputs.answer` 為完整的最終回答文本            |
| elapsed_time  | number   | 運行耗時（秒）                                             |
| error         | string   | 本地化的錯誤描述，僅 `status` 為 `failed` 時存在           |
| error_code    | int32    | 錯誤碼，僅 `status` 為 `failed` 時存在                     |
| error_message | string   | 面向用戶的錯誤信息，僅失敗時存在                           |
| error_args    | object   | 額外錯誤上下文（如 `workflow_run_id`），可能省略           |
| process_data  | object[] | 運行經過的過程階段，僅用於展示                             |

```json
{"event":"workflow_finished","workflow_run_id":"745910371102313","data":{"status":"succeeded","elapsed_time":3.21,"outputs":{"answer":"特斯拉（TSLA.US）近期..."}}}
```

說明：

- `outputs.answer` 是權威的完整回答。如果你通過 `message` 事件拼接了回答，可用它校驗或替換。
- `status` 為 `stopped`（用戶停止運行）時，`outputs.answer` 為已生成的部分回答。

## 回答流式輸出

### message

增量文本片段。這是頻率最高的事件，按到達順序拼接 `text` 即可。

| 名稱                 | 類型   | 說明                                                                     |
| -------------------- | ------ | ------------------------------------------------------------------------ |
| text                 | string | 增量文本片段                                                             |
| type                 | string | `answer` — 最終回答文本；`think` — 推理過程；`process` — 階段進度描述    |
| key                  | string | 片段所屬流段的標識。相同 `key` 的片段構成一個連續塊，渲染時按 `key` 分組 |
| started_at           | int64  | 該流段開始時間（Unix 秒）                                                |
| stage                | string | 階段標識，僅 `type=process` 時存在                                       |
| stage_title          | string | 階段進行中的標題，僅 `type=process` 時存在                               |
| stage_finished_title | string | 階段完成後的標題，僅 `type=process` 時存在                               |
| outputs              | object | 附加在片段上的額外負載，通常不存在                                       |

```json
{"event":"message","workflow_run_id":"745910371102313","data":{"text":"特斯拉","type":"answer","key":"n_llm_1:answer","started_at":1752048000}}
```

解析：

- 只有 `type=answer` 的片段屬於用戶可見的回答，全部拼接後與 `workflow_finished.outputs.answer` 一致。
- `type=think` 的片段是 Agent 的中間推理，可放入可摺疊的「思考」區域展示，也可忽略。
- `type=process` 的片段描述階段進度，附帶 `stage` 系列字段用於分組。

## 思考階段

### thinking_started

Agent 進入推理階段（分析問題、規劃工具調用）。在它與 `thinking_finished` 之間可能出現 `type=think` 的 `message` 事件和工具調用事件。

| 名稱       | 類型  | 說明                 |
| ---------- | ----- | -------------------- |
| started_at | int64 | 開始時間（Unix 秒）  |

### thinking_finished

推理階段結束，隨後是回答文本（`type=answer` 的 `message`）。

| 名稱         | 類型  | 說明                 |
| ------------ | ----- | -------------------- |
| finished_at  | int64 | 結束時間（Unix 秒）  |
| elapsed_time | int32 | 推理耗時（秒）       |

## 工具調用

Agent 在生成回答的過程中會調用工具（行情、賬戶、聯網搜索等）。每次調用都由一對 started/finished 事件包裹——用 `tool_use_id` 配對。

這對事件覆蓋**所有普通工具調用**。只有兩種特殊調用改用各自的事件族上報：派生子智能體（`subagent_*`，見下文）和把另一個 Agent 作為工具調用（`agent_tool_*`，見下文）。如果你的 Agent 沒有使用這兩項能力，所有工具調用都只會以 `node_tool_use_started` / `node_tool_use_finished` 出現。

### node_tool_use_started

一次工具調用已開始。

| 名稱           | 類型     | 說明                                                            |
| -------------- | -------- | --------------------------------------------------------------- |
| tool_use_id    | string   | 本次調用的唯一 ID，用於與 finished 事件配對                     |
| tool_name      | string   | 工具的本地化展示名（用於界面顯示）                              |
| tool_func_name | string   | 與語言無關的穩定工具標識，按工具類型處理邏輯時用它              |
| tool_args      | string   | 調用參數（JSON 字符串）                                         |
| tips           | string   | 可直接展示的進度文案（如「正在聯網搜索…」）                     |
| tip_chips      | string[] | 與 `tips` 配套的短標籤，可能省略                                |
| iteration      | int      | 輪次編號。同一輪（相同 `iteration`）的調用是並行執行的          |
| started_at     | int64    | 開始時間（Unix 秒）                                             |

### node_tool_use_finished

工具調用已結束。

| 名稱           | 類型     | 說明                                     |
| -------------- | -------- | ---------------------------------------- |
| tool_use_id    | string   | 與 started 事件的 `tool_use_id` 一致     |
| status         | string   | `succeeded` / `failed`                   |
| error          | string   | 失敗時的錯誤描述                         |
| elapsed_time   | number   | 調用耗時（秒）                           |
| started_at     | int64    | 開始時間（Unix 秒）                      |
| tool_name      | string   | 本地化展示名                             |
| tool_func_name | string   | 穩定工具標識                             |
| tool_args      | string   | 調用參數（JSON 字符串）                  |
| tool_type      | string   | 工具類別                                 |
| tips           | string   | 進度文案                                 |
| tip_chips      | string[] | 短標籤，可能省略                         |
| iteration      | int      | 輪次編號                                 |
| is_thinking    | bool     | 為 `true` 表示調用發生在思考階段         |
| outputs        | object   | 過濾後的調用結果，見下                   |

`outputs` 只攜帶用於展示的字段：

| 字段                      | 說明                             |
| ------------------------- | -------------------------------- |
| outputs.references        | 工具結果引用的來源               |
| outputs.reference_domains | 引用來源的域名                   |
| outputs.query             | 工具執行的查詢                   |
| outputs.text              | 工具的原始響應文本               |
| outputs.tool_args         | 解析後的請求參數                 |
| outputs.data              | 結構化結果，僅部分工具存在       |

```json
{"event":"node_tool_use_finished","workflow_run_id":"745910371102313","data":{"tool_use_id":"call_abc123","status":"succeeded","elapsed_time":1.42,"tool_name":"聯網搜索","tool_func_name":"web_search","tool_args":"{\"query\":\"TSLA stock news\"}","tool_type":"builtin","tips":"已聯網搜索","iteration":1,"is_thinking":true,"outputs":{"query":"TSLA stock news","references":[{"index":1,"title":"...","url":"..."}]}}}
```

## 子智能體事件

Agent 派生子智能體處理子任務時，其生命週期使用獨立的事件族上報，而不是 `node_tool_use_*`。

### subagent_started

| 名稱        | 類型   | 說明                                       |
| ----------- | ------ | ------------------------------------------ |
| node_id     | string | 派生子智能體的節點 ID                      |
| tool_use_id | string | 本次派生的唯一 ID，與 finished 事件配對    |
| started_at  | int64  | 開始時間（Unix 秒）                        |
| goal        | string | 分配給子智能體的目標                       |
| prompt      | string | 交給子智能體的完整任務提示詞               |
| subagent_id | string | 子智能體標識，可能省略                     |
| tools       | array  | 授予子智能體的工具列表，可能省略           |

### subagent_progress

子智能體每調用一次自己的工具就發送一次，用於在子智能體卡片內實時渲染時間線。

| 名稱                 | 類型   | 說明                                             |
| -------------------- | ------ | ------------------------------------------------ |
| node_id              | string | 派生子智能體的節點 ID                            |
| parent_tool_call_id  | string | 所屬 `subagent_started` 事件的 `tool_use_id`     |
| subagent_tool_name   | string | 子智能體調用的工具名                             |
| subagent_tool_args   | string | 該調用的參數（JSON 字符串）                      |
| subagent_status      | string | 該調用的狀態：`running` / `succeeded` / `failed` |
| subagent_duration_ms | int64  | 該調用耗時（**毫秒**）                           |
| subagent_iteration   | int    | 子智能體內部的輪次編號                           |
| started_at           | int64  | 開始時間（Unix 秒）                              |

### subagent_finished

| 名稱         | 類型   | 說明                                                                     |
| ------------ | ------ | ------------------------------------------------------------------------ |
| node_id      | string | 派生子智能體的節點 ID                                                    |
| tool_use_id  | string | 與 `subagent_started` 的 `tool_use_id` 一致                              |
| status       | string | `succeeded` / `failed`                                                   |
| started_at   | int64  | 開始時間（Unix 秒）                                                      |
| elapsed_time | number | 子智能體總耗時（秒）                                                     |
| error        | string | 失敗時的錯誤描述                                                         |
| outputs      | object | 子智能體結果：通常包含 `goal`、`result` 和 `subagent_tools`（其工具調用時間線） |

## Agent 工具事件

Agent 把另一個 Agent 作為工具調用時，該內部運行使用 `agent_tool_*` 事件族上報，結構與子智能體事件相似。

### agent_tool_started

| 名稱            | 類型     | 說明                                    |
| --------------- | -------- | --------------------------------------- |
| node_id         | string   | 調用方節點 ID                           |
| tool_use_id     | string   | 本次調用的唯一 ID，與 finished 事件配對 |
| agent_tool_name | string   | 被調用 Agent 的標識                     |
| title           | string   | 展示標題，可能省略                      |
| started_at      | int64    | 開始時間（Unix 秒）                     |
| tool_args       | string   | 調用參數（JSON 字符串）                 |
| tool_name       | string   | 本地化展示名                            |
| tips            | string   | 進度文案，可能省略                      |
| tip_chips       | string[] | 短標籤，可能省略                        |
| is_thinking     | bool     | 為 `true` 表示發生在思考階段            |

### agent_tool_progress

被委託 Agent 每進行一次內部工具調用就發送一次。

| 名稱                | 類型   | 說明                                                 |
| ------------------- | ------ | ---------------------------------------------------- |
| node_id             | string | 調用方節點 ID                                        |
| parent_tool_call_id | string | 所屬 `agent_tool_started` 事件的 `tool_use_id`       |
| agent_tool_name     | string | 被調用 Agent 的標識                                  |
| inner_tool_name     | string | 被委託 Agent 調用的內部工具名                        |
| inner_tool_args     | string | 該內部調用的參數（JSON 字符串）                      |
| status              | string | 內部調用的狀態：`running` / `succeeded` / `failed`   |
| duration_ms         | int64  | 內部調用耗時（**毫秒**）                             |
| started_at          | int64  | 開始時間（Unix 秒）                                  |
| is_thinking         | bool   | 為 `true` 表示發生在思考階段                         |

### agent_tool_finished

| 名稱            | 類型     | 說明                                          |
| --------------- | -------- | --------------------------------------------- |
| node_id         | string   | 調用方節點 ID                                 |
| tool_use_id     | string   | 與 `agent_tool_started` 的 `tool_use_id` 一致 |
| agent_tool_name | string   | 被調用 Agent 的標識                           |
| status          | string   | `succeeded` / `failed`                        |
| started_at      | int64    | 開始時間（Unix 秒）                           |
| elapsed_time    | number   | 總耗時（秒）                                  |
| error           | string   | 失敗時的錯誤描述                              |
| tool_args       | string   | 調用參數（JSON 字符串）                       |
| outputs         | object   | 被委託 Agent 的結果                           |
| tool_type       | string   | 工具類別                                      |
| tips            | string   | 進度文案，可能省略                            |
| tip_chips       | string[] | 短標籤，可能省略                              |
| is_thinking     | bool     | 為 `true` 表示發生在思考階段                  |

## 中斷

### human_interaction_required

運行已暫停：Agent 需要你補充信息或確認。收集 `questions` 的答案後調用[繼續對話](/zh-HK/docs/ai/chat/continue)——答案以 `tool_call_id` 為鍵。

| 名稱           | 類型     | 說明                                                        |
| -------------- | -------- | ----------------------------------------------------------- |
| node_id        | string   | 觸發中斷的節點 ID                                           |
| tool_call_id   | string   | 本次詢問的 ID，繼續對話時作為 `answers_by_tool_call` 的外層鍵 |
| questions      | object[] | 需要回答的問題                                              |
| ∟ question     | string   | 問題文本，繼續對話時作為 `answers_by_tool_call` 的內層鍵    |
| ∟ options      | object[] | 選項，為空表示自由輸入                                      |
| ∟∟ description | string   | 選項文本                                                    |
| ∟ multi_select | boolean  | 是否可多選                                                  |
| message_id     | int64    | 被暫停消息的 ID，用於繼續對話接口的 URL                     |
| chat_id        | int64    | 所屬會話的 ID                                               |

```json
{"event":"human_interaction_required","workflow_run_id":"745910371102313","data":{"node_id":"n_ask_human","tool_call_id":"call_abc123","questions":[{"question":"你想查看哪個時間範圍？","options":[{"description":"近一週"},{"description":"近一月"}],"multi_select":false}],"message_id":43,"chat_id":1001}}
```

此事件之後流以 `chat_finished` 結束；被中斷的運行不會發送 `workflow_finished`。

## 輔助事件

以下事件均為信息性事件，最簡客戶端可全部忽略。

### query_masked

用戶提問中的敏感內容在處理前被脫敏。展示時用 `masked_query` 替換原始提問。

| 名稱         | 類型   | 說明           |
| ------------ | ------ | -------------- |
| raw_query    | string | 原始用戶提問   |
| masked_query | string | 脫敏後的提問   |

### plan_changed

Agent 創建或更新了任務計劃。

| 名稱       | 類型   | 說明                     |
| ---------- | ------ | ------------------------ |
| node_id    | string | 規劃節點的 ID            |
| started_at | int64  | 變更時間（Unix 秒）      |
| outputs    | object | 當前計劃內容             |

此事件額外攜帶一個頂層 `tool_name` 字段（與 `data` 同級），標識規劃工具。

### context_compress_started / context_compress_finished

長對話會觸發上下文壓縮，這兩個事件包裹壓縮過程。與其他事件不同，這裡的時間戳是 RFC 3339 字符串。

`context_compress_started`：

| 名稱       | 類型   | 說明                 |
| ---------- | ------ | -------------------- |
| started_at | string | 開始時間（RFC 3339） |
| inputs     | object | 壓縮輸入摘要         |

`context_compress_finished`：

| 名稱       | 類型   | 說明                 |
| ---------- | ------ | -------------------- |
| created_at | string | 結束時間（RFC 3339） |
| inputs     | object | 壓縮輸入摘要         |
| outputs    | object | 壓縮結果摘要         |
