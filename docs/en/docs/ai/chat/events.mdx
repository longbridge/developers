---
slug: events
title: SSE Events
sidebar_position: 4
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

In streaming mode (`Accept: text/event-stream`), [Start Conversation](/docs/ai/chat/conversation) and [Continue Conversation](/docs/ai/chat/continue) push the run progress as a sequence of SSE events. This page lists every event type and how to parse it.

## Frame Format

Every SSE frame uses the same envelope: the SSE `event` field is always `message`, and the `data` field is a JSON object:

```
event: message
data: {"event":"<event_type>","workflow_run_id":"745910371102313","data":{...}}
```

| Name            | Type   | Description                                                        |
| --------------- | ------ | ------------------------------------------------------------------ |
| event           | string | Event type. Dispatch on this field                                 |
| workflow_run_id | string | ID of this run, a numeric ID in string form (e.g. `"745910371102313"`); identical across all events of the same run |
| data            | object | Event payload; structure varies by event type (see below)          |

Parsing rules:

- **Dispatch on `data.event`**, not on the SSE `event` field (which is always `message`).
- **Ignore unknown event types.** New event types may be added at any time; a client that only handles the events it knows stays forward compatible.
- Unless noted otherwise, `started_at` / `finished_at` are Unix timestamps in seconds, and `elapsed_time` is a duration in seconds.

## Typical Event Sequences

A run always begins with `chat_started` and ends with `chat_finished`. What happens in between depends on the outcome:

**Succeeded:**

```
chat_started → workflow_started → thinking_started → message (type=think) ...
→ node_tool_use_started / node_tool_use_finished ...
→ thinking_finished → message (type=answer) ...
→ workflow_finished (status=succeeded) → chat_finished
```

**Interrupted** (the Agent needs your input; resume via [Continue Conversation](/docs/ai/chat/continue)):

```
chat_started → workflow_started → ... → human_interaction_required → chat_finished
```

Note: an interrupted run does **not** emit `workflow_finished`. When you continue an interrupted run, the resumed stream does **not** emit `workflow_started` again.

**Failed:**

```
chat_started → workflow_started → ... → workflow_finished (status=failed) → chat_finished
```

## Minimal Client

For a plain question-and-answer integration you only need to handle four events; everything else is optional progress display:

| Event                        | What to do                                                          |
| ---------------------------- | ------------------------------------------------------------------- |
| `message` (`type=answer`)    | Append `data.text` to the answer being displayed                    |
| `human_interaction_required` | Show the questions and call Continue Conversation with the answers  |
| `workflow_finished`          | Read the final `status` and `outputs.answer`; show errors if failed |
| `chat_finished`              | Close the stream; the run is over                                   |

## Conversation Lifecycle

### chat_started

The first event of every stream. The conversation and message records have been created; save `chat_uid` (for follow-up questions) and `message_id` (for continuing after an interrupt).

| Name       | Type   | Description                                    |
| ---------- | ------ | ---------------------------------------------- |
| chat_id    | int64  | Internal ID of the conversation                |
| chat_uid   | string | Conversation identifier, used in follow-up requests |
| message_id | int64  | Message ID of this round                       |

```json
{"event":"chat_started","workflow_run_id":"745910371102313","data":{"chat_id":1001,"chat_uid":"ct_9f2c1a5b","message_id":42}}
```

### chat_finished

The last event of every stream. After this the server closes the connection.

| Name          | Type   | Description                                     |
| ------------- | ------ | ----------------------------------------------- |
| chat_id       | int64  | Internal ID of the conversation                 |
| chat_uid      | string | Conversation identifier                         |
| message_id    | int64  | Message ID of this round                        |
| error         | string | Error detail; empty on success                  |
| error_message | string | User-facing error message; empty on success     |

## Run Lifecycle

### workflow_started

The Agent run has started. Not emitted when resuming an interrupted run via Continue Conversation.

| Name        | Type   | Description                                            |
| ----------- | ------ | ------------------------------------------------------ |
| workflow_id | int64  | ID of the workflow backing this Agent                  |
| started_at  | int64  | Start time (Unix seconds)                              |
| inputs      | object | Run inputs                                             |
| hit_cache   | bool   | `true` if the answer is served from cache; the stream then goes straight to the answer |

### workflow_finished

The run has ended — successfully, with a failure, or stopped by the user. Read the final result here.

| Name          | Type     | Description                                                              |
| ------------- | -------- | ------------------------------------------------------------------------ |
| status        | string   | `succeeded` / `failed` / `stopped`                                       |
| outputs       | object   | Run outputs; `outputs.answer` is the complete final answer text          |
| elapsed_time  | number   | Run duration in seconds                                                  |
| error         | string   | Localized error description; only when `status` is `failed`              |
| error_code    | int32    | Error code; only when `status` is `failed`                               |
| error_message | string   | User-facing error message; only on failure                               |
| error_args    | object   | Extra error context (e.g. `workflow_run_id`); may be omitted             |
| process_data  | object[] | Process stages the run went through; for display only                    |

```json
{"event":"workflow_finished","workflow_run_id":"745910371102313","data":{"status":"succeeded","elapsed_time":3.21,"outputs":{"answer":"Tesla (TSLA.US) recently..."}}}
```

Notes:

- `outputs.answer` is the authoritative full answer. If you assembled the answer from `message` events, you can use this to verify or replace it.
- When `status` is `stopped` (run stopped by the user), `outputs.answer` contains the partial answer generated so far.

## Answer Streaming

### message

Incremental text chunks. This is the highest-frequency event; concatenate `text` fragments in arrival order.

| Name                 | Type   | Description                                                                 |
| -------------------- | ------ | --------------------------------------------------------------------------- |
| text                 | string | Incremental text fragment                                                    |
| type                 | string | `answer` — final answer text; `think` — reasoning process; `process` — stage progress description |
| key                  | string | Identifier of the stream segment the fragment belongs to. Fragments with the same `key` form one continuous block — group by `key` when rendering |
| started_at           | int64  | Time this segment started (Unix seconds)                                     |
| stage                | string | Stage identifier; only for `type=process`                                    |
| stage_title          | string | Stage title while running; only for `type=process`                           |
| stage_finished_title | string | Stage title after it finishes; only for `type=process`                       |
| outputs              | object | Extra payload attached to the fragment; usually absent                       |

```json
{"event":"message","workflow_run_id":"745910371102313","data":{"text":"Tesla","type":"answer","key":"n_llm_1:answer","started_at":1752048000}}
```

Parsing:

- Only `type=answer` fragments belong to the user-visible answer. Concatenating all of them yields the same text as `workflow_finished.outputs.answer`.
- `type=think` fragments are the Agent's intermediate reasoning — show them in a collapsible "thinking" section or ignore them.
- `type=process` fragments describe stage progress and come with `stage` fields for grouping.

## Thinking Phase

### thinking_started

The Agent has entered the reasoning phase (analyzing the question, planning tool calls). Between this and `thinking_finished`, `message` events with `type=think` and tool-call events may arrive.

| Name       | Type  | Description               |
| ---------- | ----- | ------------------------- |
| started_at | int64 | Start time (Unix seconds) |

### thinking_finished

The reasoning phase is over; answer text (`message` with `type=answer`) follows.

| Name         | Type  | Description                   |
| ------------ | ----- | ----------------------------- |
| finished_at  | int64 | Finish time (Unix seconds)    |
| elapsed_time | int32 | Reasoning duration in seconds |

## Tool Calls

The Agent calls tools (market data, account info, web search, …) while generating the answer. Each call is bracketed by a started/finished pair — match them by `tool_use_id`.

This pair covers **all ordinary tool calls**. Only two special cases are reported with their own event families instead: spawning a subagent (`subagent_*`, see below) and calling another Agent as a tool (`agent_tool_*`, see below). If your Agent uses neither feature, every tool call arrives as `node_tool_use_started` / `node_tool_use_finished`.

### node_tool_use_started

A tool call has started.

| Name           | Type     | Description                                                                    |
| -------------- | -------- | ------------------------------------------------------------------------------ |
| tool_use_id    | string   | Unique ID of this call; use it to match the finished event                     |
| tool_name      | string   | Localized display name of the tool (e.g. shown in your UI)                     |
| tool_func_name | string   | Locale-stable tool identifier; use this for logic keyed on the tool kind       |
| tool_args      | string   | Call arguments as a JSON string                                                |
| tips           | string   | Progress text suitable for direct display (e.g. "Searching the web…")          |
| tip_chips      | string[] | Short tags accompanying `tips`; may be omitted                                 |
| iteration      | int      | Round number. Calls in the same round (same `iteration`) run in parallel       |
| started_at     | int64    | Start time (Unix seconds)                                                      |

### node_tool_use_finished

The tool call has ended.

| Name           | Type     | Description                                                            |
| -------------- | -------- | ---------------------------------------------------------------------- |
| tool_use_id    | string   | Matches the `tool_use_id` of the started event                         |
| status         | string   | `succeeded` / `failed`                                                 |
| error          | string   | Error description on failure                                           |
| elapsed_time   | number   | Call duration in seconds                                               |
| started_at     | int64    | Start time (Unix seconds)                                              |
| tool_name      | string   | Localized display name                                                 |
| tool_func_name | string   | Locale-stable tool identifier                                          |
| tool_args      | string   | Call arguments as a JSON string                                        |
| tool_type      | string   | Tool category                                                          |
| tips           | string   | Progress text                                                          |
| tip_chips      | string[] | Short tags; may be omitted                                             |
| iteration      | int      | Round number                                                           |
| is_thinking    | bool     | `true` if the call happened during the thinking phase                  |
| outputs        | object   | Filtered call results, see below                                       |

`outputs` only carries fields that are meant for display:

| Field                     | Description                                                       |
| ------------------------- | ----------------------------------------------------------------- |
| outputs.references        | Sources referenced by the tool result                             |
| outputs.reference_domains | Domains of the referenced sources                                 |
| outputs.query             | The query the tool executed                                       |
| outputs.text              | Raw response text of the tool                                     |
| outputs.tool_args         | Parsed request arguments                                          |
| outputs.data              | Structured result; present only for selected tools                |

```json
{"event":"node_tool_use_finished","workflow_run_id":"745910371102313","data":{"tool_use_id":"call_abc123","status":"succeeded","elapsed_time":1.42,"tool_name":"Web Search","tool_func_name":"web_search","tool_args":"{\"query\":\"TSLA stock news\"}","tool_type":"builtin","tips":"Searched the web","iteration":1,"is_thinking":true,"outputs":{"query":"TSLA stock news","references":[{"index":1,"title":"...","url":"..."}]}}}
```

## Subagent Events

When the Agent spawns a subagent to work on a sub-task, the subagent's lifecycle is reported with a dedicated event family instead of `node_tool_use_*`.

### subagent_started

| Name        | Type   | Description                                     |
| ----------- | ------ | ----------------------------------------------- |
| node_id     | string | ID of the node that spawned the subagent        |
| tool_use_id | string | Unique ID of this spawn; matches the finished event |
| started_at  | int64  | Start time (Unix seconds)                       |
| goal        | string | Goal assigned to the subagent                   |
| prompt      | string | Full task prompt given to the subagent          |
| subagent_id | string | Subagent identifier; may be omitted             |
| tools       | array  | Tools granted to the subagent; may be omitted   |

### subagent_progress

Emitted every time the subagent calls one of its own tools. Use it to render a live timeline inside the subagent card.

| Name                 | Type   | Description                                             |
| -------------------- | ------ | ------------------------------------------------------- |
| node_id              | string | ID of the node that spawned the subagent                |
| parent_tool_call_id  | string | `tool_use_id` of the owning `subagent_started` event    |
| subagent_tool_name   | string | Name of the tool the subagent called                    |
| subagent_tool_args   | string | Arguments of that call (JSON string)                    |
| subagent_status      | string | Status of that call: `running` / `succeeded` / `failed` |
| subagent_duration_ms | int64  | Duration of that call in **milliseconds**               |
| subagent_iteration   | int    | The subagent's internal round number                    |
| started_at           | int64  | Start time (Unix seconds)                               |

### subagent_finished

| Name         | Type   | Description                                                          |
| ------------ | ------ | -------------------------------------------------------------------- |
| node_id      | string | ID of the node that spawned the subagent                             |
| tool_use_id  | string | Matches the `tool_use_id` of `subagent_started`                      |
| status       | string | `succeeded` / `failed`                                               |
| started_at   | int64  | Start time (Unix seconds)                                            |
| elapsed_time | number | Total subagent duration in seconds                                   |
| error        | string | Error description on failure                                         |
| outputs      | object | Subagent result: typically `goal`, `result`, and `subagent_tools` (the timeline of tool calls it made) |

## Agent Tool Events

When the Agent delegates to another Agent as a tool, that inner run is reported with the `agent_tool_*` family. The shape mirrors the subagent events.

### agent_tool_started

| Name            | Type     | Description                                        |
| --------------- | -------- | -------------------------------------------------- |
| node_id         | string   | ID of the calling node                             |
| tool_use_id     | string   | Unique ID of this call; matches the finished event |
| agent_tool_name | string   | Identifier of the Agent being called               |
| title           | string   | Display title; may be omitted                      |
| started_at      | int64    | Start time (Unix seconds)                          |
| tool_args       | string   | Call arguments (JSON string)                       |
| tool_name       | string   | Localized display name                             |
| tips            | string   | Progress text; may be omitted                      |
| tip_chips       | string[] | Short tags; may be omitted                         |
| is_thinking     | bool     | `true` if called during the thinking phase         |

### agent_tool_progress

Emitted for each inner tool call the delegated Agent makes.

| Name                | Type   | Description                                              |
| ------------------- | ------ | -------------------------------------------------------- |
| node_id             | string | ID of the calling node                                   |
| parent_tool_call_id | string | `tool_use_id` of the owning `agent_tool_started` event   |
| agent_tool_name     | string | Identifier of the Agent being called                     |
| inner_tool_name     | string | Name of the inner tool the delegated Agent called        |
| inner_tool_args     | string | Arguments of that inner call (JSON string)               |
| status              | string | Status of the inner call: `running` / `succeeded` / `failed` |
| duration_ms         | int64  | Duration of the inner call in **milliseconds**           |
| started_at          | int64  | Start time (Unix seconds)                                |
| is_thinking         | bool   | `true` if during the thinking phase                      |

### agent_tool_finished

| Name            | Type     | Description                                       |
| --------------- | -------- | ------------------------------------------------- |
| node_id         | string   | ID of the calling node                            |
| tool_use_id     | string   | Matches the `tool_use_id` of `agent_tool_started` |
| agent_tool_name | string   | Identifier of the Agent being called              |
| status          | string   | `succeeded` / `failed`                            |
| started_at      | int64    | Start time (Unix seconds)                         |
| elapsed_time    | number   | Total duration in seconds                         |
| error           | string   | Error description on failure                      |
| tool_args       | string   | Call arguments (JSON string)                      |
| outputs         | object   | Result of the delegated Agent                     |
| tool_type       | string   | Tool category                                     |
| tips            | string   | Progress text; may be omitted                     |
| tip_chips       | string[] | Short tags; may be omitted                        |
| is_thinking     | bool     | `true` if during the thinking phase               |

## Interrupt

### human_interaction_required

The run is paused: the Agent needs more information or confirmation from you. Collect answers to `questions` and call [Continue Conversation](/docs/ai/chat/continue) — the answers are keyed by `tool_call_id`.

| Name            | Type     | Description                                                        |
| --------------- | -------- | ------------------------------------------------------------------ |
| node_id         | string   | ID of the node that triggered the interrupt                        |
| tool_call_id    | string   | ID of this inquiry; the outer key of `answers_by_tool_call` when continuing |
| questions       | object[] | Questions you need to answer                                       |
| ∟ question      | string   | Question text; the inner key of `answers_by_tool_call`             |
| ∟ options       | object[] | Options; empty means free-form answer                              |
| ∟∟ description  | string   | Option text                                                        |
| ∟ multi_select  | boolean  | Whether multiple options may be selected                           |
| message_id      | int64    | ID of the paused message; used in the Continue Conversation URL    |
| chat_id         | int64    | ID of the owning conversation                                      |

```json
{"event":"human_interaction_required","workflow_run_id":"745910371102313","data":{"node_id":"n_ask_human","tool_call_id":"call_abc123","questions":[{"question":"Which time range would you like to check?","options":[{"description":"Past week"},{"description":"Past month"}],"multi_select":false}],"message_id":43,"chat_id":1001}}
```

After this event the stream ends with `chat_finished`; an interrupted run does not emit `workflow_finished`.

## Auxiliary Events

These events are informational; a minimal client can ignore all of them.

### query_masked

Sensitive content in the user query was masked before processing. Display `masked_query` instead of the original query.

| Name         | Type   | Description             |
| ------------ | ------ | ----------------------- |
| raw_query    | string | The original user query |
| masked_query | string | The masked query        |

### plan_changed

The Agent created or updated its task plan.

| Name       | Type   | Description                              |
| ---------- | ------ | ---------------------------------------- |
| node_id    | string | ID of the planning node                  |
| started_at | int64  | Time of the change (Unix seconds)        |
| outputs    | object | The current plan content                 |

This event additionally carries a top-level `tool_name` field (sibling of `data`) identifying the planning tool.

### context_compress_started / context_compress_finished

Long conversations trigger context compression; these events bracket the compression. Unlike other events, the timestamps here are RFC 3339 strings.

`context_compress_started`:

| Name       | Type   | Description                     |
| ---------- | ------ | ------------------------------- |
| started_at | string | Start time (RFC 3339)           |
| inputs     | object | Compression input summary       |

`context_compress_finished`:

| Name       | Type   | Description                     |
| ---------- | ------ | ------------------------------- |
| created_at | string | Finish time (RFC 3339)          |
| inputs     | object | Compression input summary       |
| outputs    | object | Compression result summary      |
