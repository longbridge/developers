---
title: 'API Reference Standards'
id: style-guide_api-reference
slug: '/style-guide/api-reference'
sidebar_position: 3
---

# API Reference Standards

The API Reference is grounded in `openapi.yaml`. Writing in this area means maintaining the spec first, then the rendered pages.

## Source of truth

`openapi.yaml` is the single source of truth for all API endpoints. Never invent parameter names, types, or response fields in the documentation — always check the spec first. When the docs and spec conflict, fix the spec, then the docs.

---

## Resource naming

Each resource is a top-level grouping of related endpoints.

- **Name:** short noun phrase — "Quotes", "Orders", "Positions"
- **Description:** one sentence, high-level — what operations this resource covers

---

## Endpoint titles and descriptions

### Title format

Use **imperative verb + object noun phrase** — active voice.

| Good | Bad |
|------|-----|
| "Get static quote" | "Static quote retrieval" |
| "Submit order" | "Order submission" |
| "List today's orders" | "Getting today's orders" |

**Standard verbs by HTTP method:**

| HTTP Method | Preferred verbs |
|-------------|----------------|
| GET (single resource) | Get |
| GET (collection) | List |
| POST (create) | Create, Submit, Place |
| POST (action) | Send, Trigger, Execute |
| PUT / PATCH | Update, Modify |
| DELETE | Delete, Cancel, Remove |

Use the root form of the verb in the title — not the gerund. "Submit an order", not "Submitting an order".

### Description format

Write the description in **third-person singular present tense**: "Filters…", "Returns…", "Lists…". Do not use the imperative form ("Filter…", "Return…", "List…") — the imperative is for titles; descriptions use the declarative form.

One to two sentences. Explain what the endpoint does and when to use it. Write for developers who may not know the business domain.

**Prohibited patterns:**

Do not start a description with any of these phrases:
- "The API is used to…"
- "This endpoint can be used to…"
- "This endpoint is used to…"

Use a direct active verb instead: "Returns the available balance…", "Submits a limit order…", "Lists orders placed today…".

---

## Parameter and field descriptions

- Every required parameter must have a description
- Descriptions: one sentence; explain the value's meaning in business terms, not just the data type
- Include valid values or ranges where bounded
- Timestamps: note the format and timezone — Unix timestamp in seconds, UTC unless otherwise stated

---

## Request examples

- Include a working cURL example for every endpoint
- Always include `Content-Type: application/json` header for requests with a body
- Do not pipe through `jq` — keep examples dependency-free
- Use realistic but non-sensitive placeholder values — real ticker symbols like `AAPL.US`, `700.HK`, `TSLA.US`

:::info Existing pages
Many existing endpoint pages lack a cURL example. All new and updated endpoint pages must include one. Existing pages without cURL are not retroactively invalid until edited.
:::

---

## Response examples

- Show a representative successful response
- Do not show error responses inline — link to the error code reference

---

## Deprecated endpoints

When an endpoint is deprecated:

1. Add `deprecated: true` to the OpenAPI spec
2. Add this notice at the top of the endpoint description: "Deprecated. Use [alternative] instead. This endpoint will be removed on [full date, e.g. August 1, 2027]."
3. Link to the replacement endpoint or migration guide
4. Do not remove the endpoint from the spec until the end-of-life date passes

---

## `<SDKLinks>` component

All API endpoint doc pages must include the `<SDKLinks>` component to link to SDK-specific method documentation:

```markdown
<SDKLinks module="trade" klass="TradeContext" method="submit_order" />
```

| Attribute | Description |
|-----------|-------------|
| `module` | Lowercase domain name — `trade`, `quote`, `account` |
| `klass` | SDK context class name — `TradeContext`, `QuoteContext` |
| `method` | snake_case method name as defined in the Rust SDK |
