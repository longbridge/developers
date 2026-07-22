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

流式模式（`Accept: text/event-stream`）下，[发起对话](/zh-CN/docs/ai/chat/conversation)和[继续对话](/zh-CN/docs/ai/chat/continue)会以一系列 SSE 事件推送运行过程。本页列出所有事件类型及解析方式。

## 帧格式

每一帧 SSE 都使用同样的信封结构：SSE 的 `event` 字段恒为 `message`，`data` 字段是一个 JSON 对象：

```
event: message
data: {"event":"<event_type>","workflow_run_id":"745910371102313","data":{...}}
```

| 名称            | 类型   | 说明                                             |
| --------------- | ------ | ------------------------------------------------ |
| event           | string | 事件类型，按此字段分发处理                       |
| workflow_run_id | string | 本次运行的 ID，为数字 ID 的字符串形式（如 `"745910371102313"`），同一次运行的所有事件中该值一致 |
| data            | object | 事件负载，结构随事件类型而不同（见下文）         |

解析规则：

- **按 `data.event` 分发**，而不是 SSE 的 `event` 字段（它恒为 `message`）。
- **忽略未知事件类型。** 事件类型可能随时新增，只处理已知事件的客户端可保持向前兼容。
- 除特别说明外，`started_at` / `finished_at` 为 Unix 秒级时间戳，`elapsed_time` 为秒数。

## 典型事件序列

一次运行始于 `chat_started`、止于 `chat_finished`，中间的事件取决于运行结果：

**成功：**

```
chat_started → workflow_started → thinking_started → message (type=think) ...
→ node_tool_use_started / node_tool_use_finished ...
→ thinking_finished → message (type=answer) ...
→ workflow_finished (status=succeeded) → chat_finished
```

**中断**（Agent 需要你补充信息，通过[继续对话](/zh-CN/docs/ai/chat/continue)恢复）：

```
chat_started → workflow_started → ... → human_interaction_required → chat_finished
```

注意：中断的运行**不会**发送 `workflow_finished`；继续被中断的运行时，恢复后的流**不会**再次发送 `workflow_started`。

**失败：**

```
chat_started → workflow_started → ... → workflow_finished (status=failed) → chat_finished
```

## 最简客户端

纯问答场景只需处理四种事件，其余事件都是可选的过程展示：

| 事件                         | 处理方式                                               |
| ---------------------------- | ------------------------------------------------------ |
| `message`（`type=answer`）   | 将 `data.text` 追加到正在展示的回答中                  |
| `human_interaction_required` | 展示问题，携带答案调用继续对话接口                     |
| `workflow_finished`          | 读取最终 `status` 和 `outputs.answer`；失败时展示错误  |
| `chat_finished`              | 关闭流，本次运行结束                                   |

## 会话生命周期

### chat_started

每个流的第一个事件。会话和消息记录已创建；保存 `chat_uid`（用于追问）和 `message_id`（用于中断后继续）。

| 名称       | 类型   | 说明                       |
| ---------- | ------ | -------------------------- |
| chat_id    | int64  | 会话内部 ID                |
| chat_uid   | string | 会话标识，用于后续请求     |
| message_id | int64  | 本轮消息 ID                |

```json
{"event":"chat_started","workflow_run_id":"745910371102313","data":{"chat_id":1001,"chat_uid":"ct_9f2c1a5b","message_id":42}}
```

### chat_finished

每个流的最后一个事件，之后服务端关闭连接。

| 名称          | 类型   | 说明                           |
| ------------- | ------ | ------------------------------ |
| chat_id       | int64  | 会话内部 ID                    |
| chat_uid      | string | 会话标识                       |
| message_id    | int64  | 本轮消息 ID                    |
| error         | string | 错误详情，成功时为空           |
| error_message | string | 面向用户的错误信息，成功时为空 |

## 运行生命周期

### workflow_started

Agent 运行已开始。通过继续对话恢复被中断的运行时不会发送此事件。

| 名称        | 类型   | 说明                                                   |
| ----------- | ------ | ------------------------------------------------------ |
| workflow_id | int64  | 该 Agent 底层工作流的 ID                               |
| started_at  | int64  | 开始时间（Unix 秒）                                    |
| inputs      | object | 运行输入                                               |
| hit_cache   | bool   | 为 `true` 时表示答案命中缓存，流会直接进入回答阶段     |

### workflow_finished

运行已结束——成功、失败或被用户停止。在此读取最终结果。

| 名称          | 类型     | 说明                                                       |
| ------------- | -------- | ---------------------------------------------------------- |
| status        | string   | `succeeded` / `failed` / `stopped`                         |
| outputs       | object   | 运行输出；`outputs.answer` 为完整的最终回答文本            |
| elapsed_time  | number   | 运行耗时（秒）                                             |
| error         | string   | 本地化的错误描述，仅 `status` 为 `failed` 时存在           |
| error_code    | int32    | 错误码，仅 `status` 为 `failed` 时存在                     |
| error_message | string   | 面向用户的错误信息，仅失败时存在                           |
| error_args    | object   | 额外错误上下文（如 `workflow_run_id`），可能省略           |
| process_data  | object[] | 运行经过的过程阶段，仅用于展示                             |

```json
{"event":"workflow_finished","workflow_run_id":"745910371102313","data":{"status":"succeeded","elapsed_time":3.21,"outputs":{"answer":"特斯拉（TSLA.US）近期..."}}}
```

说明：

- `outputs.answer` 是权威的完整回答。如果你通过 `message` 事件拼接了回答，可用它校验或替换。
- `status` 为 `stopped`（用户停止运行）时，`outputs.answer` 为已生成的部分回答。

## 回答流式输出

### message

增量文本片段。这是频率最高的事件，按到达顺序拼接 `text` 即可。

| 名称                 | 类型   | 说明                                                                     |
| -------------------- | ------ | ------------------------------------------------------------------------ |
| text                 | string | 增量文本片段                                                             |
| type                 | string | `answer` — 最终回答文本；`think` — 推理过程；`process` — 阶段进度描述    |
| key                  | string | 片段所属流段的标识。相同 `key` 的片段构成一个连续块，渲染时按 `key` 分组 |
| started_at           | int64  | 该流段开始时间（Unix 秒）                                                |
| stage                | string | 阶段标识，仅 `type=process` 时存在                                       |
| stage_title          | string | 阶段进行中的标题，仅 `type=process` 时存在                               |
| stage_finished_title | string | 阶段完成后的标题，仅 `type=process` 时存在                               |
| outputs              | object | 附加在片段上的额外负载，通常不存在                                       |

```json
{"event":"message","workflow_run_id":"745910371102313","data":{"text":"特斯拉","type":"answer","key":"n_llm_1:answer","started_at":1752048000}}
```

解析：

- 只有 `type=answer` 的片段属于用户可见的回答，全部拼接后与 `workflow_finished.outputs.answer` 一致。
- `type=think` 的片段是 Agent 的中间推理，可放入可折叠的「思考」区域展示，也可忽略。
- `type=process` 的片段描述阶段进度，附带 `stage` 系列字段用于分组。

## 思考阶段

### thinking_started

Agent 进入推理阶段（分析问题、规划工具调用）。在它与 `thinking_finished` 之间可能出现 `type=think` 的 `message` 事件和工具调用事件。

| 名称       | 类型  | 说明                 |
| ---------- | ----- | -------------------- |
| started_at | int64 | 开始时间（Unix 秒）  |

### thinking_finished

推理阶段结束，随后是回答文本（`type=answer` 的 `message`）。

| 名称         | 类型  | 说明                 |
| ------------ | ----- | -------------------- |
| finished_at  | int64 | 结束时间（Unix 秒）  |
| elapsed_time | int32 | 推理耗时（秒）       |

## 工具调用

Agent 在生成回答的过程中会调用工具（行情、账户、联网搜索等）。每次调用都由一对 started/finished 事件包裹——用 `tool_use_id` 配对。

这对事件覆盖**所有普通工具调用**。只有两种特殊调用改用各自的事件族上报：派生子智能体（`subagent_*`，见下文）和把另一个 Agent 作为工具调用（`agent_tool_*`，见下文）。如果你的 Agent 没有使用这两项能力，所有工具调用都只会以 `node_tool_use_started` / `node_tool_use_finished` 出现。

### node_tool_use_started

一次工具调用已开始。

| 名称           | 类型     | 说明                                                            |
| -------------- | -------- | --------------------------------------------------------------- |
| tool_use_id    | string   | 本次调用的唯一 ID，用于与 finished 事件配对                     |
| tool_name      | string   | 工具的本地化展示名（用于界面显示）                              |
| tool_func_name | string   | 与语言无关的稳定工具标识，按工具类型处理逻辑时用它              |
| tool_args      | string   | 调用参数（JSON 字符串）                                         |
| tips           | string   | 可直接展示的进度文案（如「正在联网搜索…」）                     |
| tip_chips      | string[] | 与 `tips` 配套的短标签，可能省略                                |
| iteration      | int      | 轮次编号。同一轮（相同 `iteration`）的调用是并行执行的          |
| started_at     | int64    | 开始时间（Unix 秒）                                             |

### node_tool_use_finished

工具调用已结束。

| 名称           | 类型     | 说明                                     |
| -------------- | -------- | ---------------------------------------- |
| tool_use_id    | string   | 与 started 事件的 `tool_use_id` 一致     |
| status         | string   | `succeeded` / `failed`                   |
| error          | string   | 失败时的错误描述                         |
| elapsed_time   | number   | 调用耗时（秒）                           |
| started_at     | int64    | 开始时间（Unix 秒）                      |
| tool_name      | string   | 本地化展示名                             |
| tool_func_name | string   | 稳定工具标识                             |
| tool_args      | string   | 调用参数（JSON 字符串）                  |
| tool_type      | string   | 工具类别                                 |
| tips           | string   | 进度文案                                 |
| tip_chips      | string[] | 短标签，可能省略                         |
| iteration      | int      | 轮次编号                                 |
| is_thinking    | bool     | 为 `true` 表示调用发生在思考阶段         |
| outputs        | object   | 过滤后的调用结果，见下                   |

`outputs` 只携带用于展示的字段：

| 字段                      | 说明                             |
| ------------------------- | -------------------------------- |
| outputs.references        | 工具结果引用的来源               |
| outputs.reference_domains | 引用来源的域名                   |
| outputs.query             | 工具执行的查询                   |
| outputs.text              | 工具的原始响应文本               |
| outputs.tool_args         | 解析后的请求参数                 |
| outputs.data              | 结构化结果，仅部分工具存在       |

```json
{"event":"node_tool_use_finished","workflow_run_id":"745910371102313","data":{"tool_use_id":"call_abc123","status":"succeeded","elapsed_time":1.42,"tool_name":"联网搜索","tool_func_name":"web_search","tool_args":"{\"query\":\"TSLA stock news\"}","tool_type":"builtin","tips":"已联网搜索","iteration":1,"is_thinking":true,"outputs":{"query":"TSLA stock news","references":[{"index":1,"title":"...","url":"..."}]}}}
```

## 子智能体事件

Agent 派生子智能体处理子任务时，其生命周期使用独立的事件族上报，而不是 `node_tool_use_*`。

### subagent_started

| 名称        | 类型   | 说明                                       |
| ----------- | ------ | ------------------------------------------ |
| node_id     | string | 派生子智能体的节点 ID                      |
| tool_use_id | string | 本次派生的唯一 ID，与 finished 事件配对    |
| started_at  | int64  | 开始时间（Unix 秒）                        |
| goal        | string | 分配给子智能体的目标                       |
| prompt      | string | 交给子智能体的完整任务提示词               |
| subagent_id | string | 子智能体标识，可能省略                     |
| tools       | array  | 授予子智能体的工具列表，可能省略           |

### subagent_progress

子智能体每调用一次自己的工具就发送一次，用于在子智能体卡片内实时渲染时间线。

| 名称                 | 类型   | 说明                                             |
| -------------------- | ------ | ------------------------------------------------ |
| node_id              | string | 派生子智能体的节点 ID                            |
| parent_tool_call_id  | string | 所属 `subagent_started` 事件的 `tool_use_id`     |
| subagent_tool_name   | string | 子智能体调用的工具名                             |
| subagent_tool_args   | string | 该调用的参数（JSON 字符串）                      |
| subagent_status      | string | 该调用的状态：`running` / `succeeded` / `failed` |
| subagent_duration_ms | int64  | 该调用耗时（**毫秒**）                           |
| subagent_iteration   | int    | 子智能体内部的轮次编号                           |
| started_at           | int64  | 开始时间（Unix 秒）                              |

### subagent_finished

| 名称         | 类型   | 说明                                                                     |
| ------------ | ------ | ------------------------------------------------------------------------ |
| node_id      | string | 派生子智能体的节点 ID                                                    |
| tool_use_id  | string | 与 `subagent_started` 的 `tool_use_id` 一致                              |
| status       | string | `succeeded` / `failed`                                                   |
| started_at   | int64  | 开始时间（Unix 秒）                                                      |
| elapsed_time | number | 子智能体总耗时（秒）                                                     |
| error        | string | 失败时的错误描述                                                         |
| outputs      | object | 子智能体结果：通常包含 `goal`、`result` 和 `subagent_tools`（其工具调用时间线） |

## Agent 工具事件

Agent 把另一个 Agent 作为工具调用时，该内部运行使用 `agent_tool_*` 事件族上报，结构与子智能体事件相似。

### agent_tool_started

| 名称            | 类型     | 说明                                    |
| --------------- | -------- | --------------------------------------- |
| node_id         | string   | 调用方节点 ID                           |
| tool_use_id     | string   | 本次调用的唯一 ID，与 finished 事件配对 |
| agent_tool_name | string   | 被调用 Agent 的标识                     |
| title           | string   | 展示标题，可能省略                      |
| started_at      | int64    | 开始时间（Unix 秒）                     |
| tool_args       | string   | 调用参数（JSON 字符串）                 |
| tool_name       | string   | 本地化展示名                            |
| tips            | string   | 进度文案，可能省略                      |
| tip_chips       | string[] | 短标签，可能省略                        |
| is_thinking     | bool     | 为 `true` 表示发生在思考阶段            |

### agent_tool_progress

被委托 Agent 每进行一次内部工具调用就发送一次。

| 名称                | 类型   | 说明                                                 |
| ------------------- | ------ | ---------------------------------------------------- |
| node_id             | string | 调用方节点 ID                                        |
| parent_tool_call_id | string | 所属 `agent_tool_started` 事件的 `tool_use_id`       |
| agent_tool_name     | string | 被调用 Agent 的标识                                  |
| inner_tool_name     | string | 被委托 Agent 调用的内部工具名                        |
| inner_tool_args     | string | 该内部调用的参数（JSON 字符串）                      |
| status              | string | 内部调用的状态：`running` / `succeeded` / `failed`   |
| duration_ms         | int64  | 内部调用耗时（**毫秒**）                             |
| started_at          | int64  | 开始时间（Unix 秒）                                  |
| is_thinking         | bool   | 为 `true` 表示发生在思考阶段                         |

### agent_tool_finished

| 名称            | 类型     | 说明                                          |
| --------------- | -------- | --------------------------------------------- |
| node_id         | string   | 调用方节点 ID                                 |
| tool_use_id     | string   | 与 `agent_tool_started` 的 `tool_use_id` 一致 |
| agent_tool_name | string   | 被调用 Agent 的标识                           |
| status          | string   | `succeeded` / `failed`                        |
| started_at      | int64    | 开始时间（Unix 秒）                           |
| elapsed_time    | number   | 总耗时（秒）                                  |
| error           | string   | 失败时的错误描述                              |
| tool_args       | string   | 调用参数（JSON 字符串）                       |
| outputs         | object   | 被委托 Agent 的结果                           |
| tool_type       | string   | 工具类别                                      |
| tips            | string   | 进度文案，可能省略                            |
| tip_chips       | string[] | 短标签，可能省略                              |
| is_thinking     | bool     | 为 `true` 表示发生在思考阶段                  |

## 中断

### human_interaction_required

运行已暂停：Agent 需要你补充信息或确认。收集 `questions` 的答案后调用[继续对话](/zh-CN/docs/ai/chat/continue)——答案以 `tool_call_id` 为键。

| 名称           | 类型     | 说明                                                        |
| -------------- | -------- | ----------------------------------------------------------- |
| node_id        | string   | 触发中断的节点 ID                                           |
| tool_call_id   | string   | 本次询问的 ID，继续对话时作为 `answers_by_tool_call` 的外层键 |
| questions      | object[] | 需要回答的问题                                              |
| ∟ question     | string   | 问题文本，继续对话时作为 `answers_by_tool_call` 的内层键    |
| ∟ options      | object[] | 选项，为空表示自由输入                                      |
| ∟∟ description | string   | 选项文本                                                    |
| ∟ multi_select | boolean  | 是否可多选                                                  |
| message_id     | int64    | 被暂停消息的 ID，用于继续对话接口的 URL                     |
| chat_id        | int64    | 所属会话的 ID                                               |

```json
{"event":"human_interaction_required","workflow_run_id":"745910371102313","data":{"node_id":"n_ask_human","tool_call_id":"call_abc123","questions":[{"question":"你想查看哪个时间范围？","options":[{"description":"近一周"},{"description":"近一月"}],"multi_select":false}],"message_id":43,"chat_id":1001}}
```

此事件之后流以 `chat_finished` 结束；被中断的运行不会发送 `workflow_finished`。

## 辅助事件

以下事件均为信息性事件，最简客户端可全部忽略。

### query_masked

用户提问中的敏感内容在处理前被脱敏。展示时用 `masked_query` 替换原始提问。

| 名称         | 类型   | 说明           |
| ------------ | ------ | -------------- |
| raw_query    | string | 原始用户提问   |
| masked_query | string | 脱敏后的提问   |

### plan_changed

Agent 创建或更新了任务计划。

| 名称       | 类型   | 说明                     |
| ---------- | ------ | ------------------------ |
| node_id    | string | 规划节点的 ID            |
| started_at | int64  | 变更时间（Unix 秒）      |
| outputs    | object | 当前计划内容             |

此事件额外携带一个顶层 `tool_name` 字段（与 `data` 同级），标识规划工具。

### context_compress_started / context_compress_finished

长对话会触发上下文压缩，这两个事件包裹压缩过程。与其他事件不同，这里的时间戳是 RFC 3339 字符串。

`context_compress_started`：

| 名称       | 类型   | 说明                 |
| ---------- | ------ | -------------------- |
| started_at | string | 开始时间（RFC 3339） |
| inputs     | object | 压缩输入摘要         |

`context_compress_finished`：

| 名称       | 类型   | 说明                 |
| ---------- | ------ | -------------------- |
| created_at | string | 结束时间（RFC 3339） |
| inputs     | object | 压缩输入摘要         |
| outputs    | object | 压缩结果摘要         |
