# Longbridge Developers — Documentation Content Strategy

> Reference: [Cloudflare Developer Docs Content Strategy](https://developers.cloudflare.com/style-guide/documentation-content-strategy/) · [Cloudflare API Content Strategy](https://developers.cloudflare.com/style-guide/api-content-strategy/)

---

## 1. Mission

Create documentation that makes developers successful on the Longbridge platform as quickly as possible. Every page should serve a clear purpose: reduce time-to-first-working-integration, deflect support, and build confidence in the API surface.

---

## 2. Content Architecture

The site has **one unified content directory**. There is no separate `api/` directory. All documentation lives under `docs/{lang}/docs/`.

| Area | Path | Audience | Purpose |
|------|------|----------|---------|
| **Docs (scenario guides)** | `docs/{lang}/docs/` | Developers integrating Longbridge | Scenario-based guides, tutorials, conceptual background |
| **API endpoint docs** | `docs/{lang}/docs/{domain}/{endpoint}.md` | Developers making specific API calls | Per-endpoint reference: HTTP method, parameters, request/response examples |
| **Interactive API reference** | `docs/en/docs/api.md` | Developers exploring the full API surface | Single special page with `layout: api-reference` rendering `openapi.yaml` interactively via `<TryIt>` — no per-endpoint `.md` files are generated from this |

Docs explains *how to use* the platform; API endpoint docs explain *what* each endpoint does. These two areas share the same directory tree and must not be blended on a single page.

---

## 3. Content Types

Every page must have exactly one content type. The type is fixed at creation. A page that mixes two content types must be split into separate pages.

### 3.1 Overview (Landing Page)

**Purpose:** Welcome developers to a product area and orient them.

**Required sections:**
- One-paragraph product description — what it does and when to use it
- Key capabilities (bullet list or table)
- Next steps / navigation links to child pages

**Rules:**
- Must be the first page (`index.md`) in any nested navigation section
- Do not bury setup instructions here — link to Get Started
- If the overview adds no value beyond a table of contents, remove it and promote child pages directly

**Title format:** noun phrase matching the product area (e.g., "Market Data", "Trading")

---

### 3.2 Get Started

**Purpose:** Take a developer from zero to their first working integration.

**Required sections:**
1. Prerequisites (account, permissions, installed tools)
2. Installation / setup steps (numbered)
3. A minimal working example
4. Next steps (link to deeper guides)

**Rules:**
- Must exist at the top level of every major product area
- Steps must be numbered and actionable — no vague guidance
- The working example must actually run without modification beyond credentials
- One path only — pick the recommended approach (OAuth, not legacy API key as the primary example)
- Do not embed reference tables (environment variables, legacy API key details) inline — link to a dedicated Reference page instead

**Title format:** "Get started with [product area]" or plain "Get Started"

---

### 3.3 Concept

**Purpose:** Explain background knowledge developers need before using a feature.

**When to create:** When a term, behavior, or design decision requires explanation that does not fit inline in a how-to. Examples: "WebSocket connection model", "Quote subscription model", "Order types".

**Required sections:**
- A clear definition in the first paragraph
- How it relates to the developer's work
- Links to related how-to guides

**Rules:**
- No step-by-step instructions — concepts explain, they do not instruct
- Keep to one concept per page; cross-link related concepts
- Title: noun phrase (e.g., "Quote subscription model", "Order lifecycle")

---

### 3.4 How-to Guide

**Purpose:** Step-by-step instructions for a specific, bounded task.

**Required sections:**
1. Prerequisites
2. Numbered steps
3. Expected result

**Rules:**
- Title: imperative verb phrase — "Subscribe to real-time quotes", not "Subscribing to quotes"
- Each step = one action + its expected outcome; never multi-action steps
- Code examples must be complete and runnable for the target language
- Do not explain concepts inline — link to a concept page instead

---

### 3.5 Implementation Guide

**Purpose:** End-to-end walkthrough for achieving a specific integration goal that spans multiple API areas.

Examples: "Build a real-time quote dashboard", "Automate a DCA strategy with the Trade API".

**Required sections:**
1. What you'll build (2–3 sentences + diagram if helpful)
2. Prerequisites
3. Numbered implementation steps
4. Complete working code
5. Next steps

**Rules:**
- Scope to a concrete outcome, not a feature tour
- Title: imperative verb phrase describing the outcome
- Longer than a how-to — but keep it focused on the stated goal

---

### 3.6 Reference

**Purpose:** Enumerate values, limits, error codes, field definitions, or configuration options.

**Rules:**
- Table-first format — minimize prose
- Keep in sync with `openapi.yaml` for anything covered by the spec
- Do not duplicate API Reference content here; link to it instead

---

### 3.7 Changelog

**Purpose:** Record platform-level changes visible to developers.

**Rules:**
- One entry per date (`## YYYY-MM-DD`), newest first
- Each entry: 1–3 bullet points, user-facing value only (no internal jargon)
- CLI releases: sub-heading `### CLI vX.Y.Z` with link to GitHub release
- All three language versions updated simultaneously

---

### 3.8 FAQ / Troubleshooting

**Purpose:** Answer the top questions and unblock common failure modes.

**Rules:**
- FAQ: question as heading (`### Why does X happen?`), concise answer below
- Troubleshooting: symptom → cause → fix structure
- Keep entries short; if the fix requires multiple steps, link to a how-to

---

### 3.9 API Endpoint Doc

**Purpose:** Technical reference for a single HTTP or WebSocket API endpoint.

**Required sections** (in this order):
1. One-sentence description in active voice (see §5.3)
2. `<CliCommand>` block — if a CLI command maps to this endpoint
3. `<SDKLinks>` component (see §5.8) — required on all API endpoint pages
4. `## Request` — HTTP method + URL table; then `### Parameters` table (name / type / required / description); then `### Request Example` using `<Tabs groupId="programming-language">` with all supported SDK languages
5. `## Response` — response headers, `### Response Example` (JSON), `### Response Status` (status code table)
6. `## Schemas` — field definition tables for complex nested types

**Rules:**
- One endpoint per page — never combine two endpoints on a single page
- All parameter names, types, and required/optional flags must match `openapi.yaml` exactly
- Do not invent parameters or response fields not in the spec
- Title: imperative verb + object noun (see §5.3)

**Valid frontmatter fields for API endpoint pages:** `title`, `id`, `slug`, `sidebar_position`, `sidebar_icon`

**Deprecated frontmatter fields** — carried over from a legacy Slate-based doc system; must not appear in new pages and must be removed when editing existing pages:

`language_tabs`, `toc_footers`, `includes`, `highlight_theme`, `headingLevel`

---

## 4. Information Architecture (IA)

### 4.1 Standard user journey

Every product area in Docs follows this standard user journey:

```
Overview          ← required: welcome + capabilities
Get Started       ← required: first working integration
Concepts          ← as needed: background knowledge
How-to guides     ← as needed: specific tasks
Implementation    ← as needed: end-to-end scenarios
Reference         ← as needed: enumerations, limits, codes
Troubleshooting   ← as needed: common failures
FAQ               ← as needed: common questions
```

**Rules:**
- Overview and Get Started are required for every top-level product area
- Concepts come before how-tos — don't force developers to learn concepts mid-task
- Troubleshooting and FAQ go last — developers reach them when stuck
- Sidebar order reflects the user journey above; use `sidebar_position` to enforce it

**`sidebar_position` reference ranges:**

| Content type | Typical `sidebar_position` |
|---|---|
| Overview | 0 |
| Get Started | 1 |
| Concepts | 10–19 |
| How-to guides | 20–49 |
| Implementation guides | 50–69 |
| Reference | 70–89 |
| Troubleshooting / FAQ | 90+ |

### 4.2 Mixed-concern pages

A page with more than one content type must be split into separate pages. The only permitted exception is a designated entry-point page (e.g., top-level Get Started) that links out to reference material instead of embedding it.

**`getting-started.md` ruling:** Keep as a single Get Started page. Do not embed environment variable reference tables, legacy API key configuration details, or language-specific reference material inline. Move such reference content to a dedicated Reference page and link to it from the Get Started page. A Get Started page over ~400 lines is a signal that reference content must be extracted.

---

## 5. API Reference Standards

The API Reference is grounded in `openapi.yaml`. Writing in this area means maintaining the spec first, then the rendered pages.

### 5.1 Source of truth

`openapi.yaml` is the single source of truth for all API endpoints. Never invent parameter names, types, or response fields in the documentation — always check the spec first. When the docs and spec conflict, fix the spec, then the docs.

### 5.2 Resource naming

Each resource is a top-level grouping of related endpoints.

- **Name:** short noun phrase (e.g., "Quotes", "Orders", "Positions")
- **Description:** one sentence, high-level — what operations this resource covers

### 5.3 Endpoint titles and descriptions

- **Title:** imperative verb + object noun phrase — active voice
  - Good: "Get static quote", "Submit order", "List today's orders"
  - Bad: "Static quote retrieval", "Order submission"
- **Description:** one to two sentences; explain what the endpoint does and when to use it; write for developers who may not know the business domain

**Standard verbs by method:**

| HTTP Method | Preferred verbs |
|-------------|----------------|
| GET (single) | Get |
| GET (list) | List |
| POST (create) | Create, Submit, Place |
| POST (action) | Send, Trigger, Execute |
| PUT / PATCH | Update, Modify |
| DELETE | Delete, Cancel, Remove |

Use the root form of the verb in the title (not gerund — no "Getting", "Submitting").

**Prohibited description patterns:** Do not use "The API is used to…", "This endpoint can be used to…", or "This endpoint is used to…". Use a direct active verb: "Returns…", "Submits…", "Lists…", "Creates…".

**Description verb form:** Use the **third-person singular present** ("Filters…", "Returns…", "Lists…"), not the imperative ("Filter…", "Return…", "List…"). The imperative is correct for endpoint *titles*; descriptions use the declarative form.

### 5.4 Parameter and field descriptions

- Every required parameter must have a description
- Descriptions: one sentence; explain the value's meaning in business terms, not just the data type
- Include valid values / ranges where bounded
- Timestamps: note the format and timezone (Unix timestamp in seconds, UTC unless otherwise stated)

### 5.5 Request examples

- Include a working cURL example for every endpoint
- Always include `Content-Type: application/json` header for requests with a body
- Do not pipe through `jq` — keep examples dependency-free
- Use realistic but non-sensitive placeholder values (e.g., real ticker symbols like `AAPL.US`, `700.HK`, `TSLA.US`)

**Existing gap:** Many existing endpoint pages lack a cURL example. All new and updated endpoint pages must include one. Existing pages without cURL are encouraged to add it when edited; they are not retroactively invalid until edited.

### 5.6 Response examples

- Show a representative successful response
- Do not show error responses inline — link to the error code reference

### 5.7 Deprecated endpoints

When an endpoint is deprecated:

1. Add `deprecated: true` to the OpenAPI spec
2. Add a notice at the top of the endpoint description: "Deprecated. Use [alternative] instead. This endpoint will be removed on [full date, e.g. August 1, 2027]."
3. Link to the replacement endpoint or migration guide
4. Do not remove the endpoint from the spec until the end-of-life date passes

### 5.8 `<SDKLinks>` component

All API endpoint doc pages must include the `<SDKLinks>` component to link to SDK-specific method documentation:

```markdown
<SDKLinks module="trade" klass="TradeContext" method="submit_order" />
```

Attributes:
- `module` — lowercase domain name (e.g., `trade`, `quote`, `account`)
- `klass` — SDK context class name (e.g., `TradeContext`, `QuoteContext`)
- `method` — snake_case method name as defined in the Rust SDK

---

## 6. Writing Guidelines

### 6.1 Voice and tone

- Second person: "you" for the developer, not "the user" or "the developer"
- Active voice: "Call the endpoint" not "The endpoint should be called"
- Present tense: "The API returns..." not "The API will return..."
- Concise: one idea per sentence; remove filler phrases ("In order to", "Please note that")

### 6.2 Headings

- Use sentence case: "Get static quote", not "Get Static Quote"
- Be specific: "Subscribe to real-time quotes", not "Subscription"
- Do not use gerund phrases in titles: "Submit an order", not "Submitting an order"

### 6.3 Code examples

- Every how-to, implementation guide, and Get Started page must have runnable code
- Code must be verifiable — do not include examples that cannot be tested (trade-execution examples are exempt)
- Use real symbols: prefer US stocks (`AAPL.US`, `TSLA.US`, `NVDA.US`) and `700.HK` as examples

**Multi-language tabs:** Use `<Tabs groupId="programming-language">` for SDK code examples. Language order: Python, JavaScript, Rust, Go, Java, C++. The `python-async` tab is optional — include it only when async usage meaningfully differs from the sync example (for example, when the async version uses a different context class such as `AsyncTradeContext` vs `TradeContext`, or requires a different import pattern). Do not include it when the only difference is adding `await`.

**Tab labels:** Use `JavaScript` as the label for the Node.js/JavaScript SDK tab. Do not use `Node.js` — inconsistent labels break cross-page tab sync. Existing pages that use `Node.js` as a label must be corrected when the page is edited.

**Standard `groupId` values:**

| `groupId` | Use case |
|-----------|----------|
| `programming-language` | SDK code examples by language |
| `cli-install` | CLI installation steps by OS or method |
| `shell` | Shell variant differences |

Do not use ad-hoc `groupId` values. Inconsistent values break cross-page tab-sync behavior.

**`<CliCommand>` rules:**
- Comments go *before* the command, not inline
- Multi-command blocks require a comment before each command
- Single-command blocks with self-explanatory commands (e.g., `longbridge auth login`) may omit the comment
- Provide 2–4 examples using real ticker symbols; prefer US stocks
- Do not use angle-bracket placeholders like `<order_id>` — Vue parses them as HTML tags and breaks the build; use a numeric example with a preceding comment instead

### 6.4 Callout boxes

Use sparingly. A callout that could be a sentence in the main text should be a sentence in the main text.

**Supported types:**

| Type | When to use |
|------|-------------|
| `:::tip` | Better alternatives, shortcuts, recommended practices |
| `:::info` | Background context the reader might not know |
| `:::warning` | Non-obvious gotchas that could cause silent failures |
| `:::danger` | Security implications, irreversible actions |

**Deprecated types** — migrate to the supported equivalent:

| Deprecated | Migrate to |
|-----------|-----------|
| `:::success` | `:::tip` |
| `:::caution` | `:::warning` |

### 6.5 Links

- Link to related pages on first mention of a concept
- Do not repeat the same link within one page
- External links: use descriptive text, not raw URLs
- `openapi.yaml` path references: link to the rendered API Reference page, not the YAML file

### 6.6 Tables

Prefer Markdown table syntax. Raw HTML `<table>` elements are acceptable only when the required structure — merged cells, `rowspan`, or `colspan` — cannot be expressed in standard Markdown. Do not use raw HTML tables purely for formatting preference.

### 6.7 Language integrity

English pages must contain no Chinese characters — including inside code blocks, code comments, and string literals. If a code block was copied from a Chinese locale page, remove all CJK text before committing.

---

## 7. Multilingual Requirements

### 7.1 Three-language rule

Every `.md` page must exist in all three directories:

- `docs/en/` — English, primary; served at `/docs/...`
- `docs/zh-CN/` — Simplified Chinese; served at `/zh-CN/docs/...`
- `docs/zh-HK/` — Traditional Chinese; served at `/zh-HK/docs/...`

English is the source of truth. `zh-CN` and `zh-HK` follow English structure and content. Never add a page to only one language directory.

**Exception:** Files under `specs/` are English-only and exempt from the three-language rule.

### 7.2 Translation scope

- All prose, headings, and UI text must be translated
- Code samples: translate comments only, not identifiers or string literals
- Frontmatter `title` must be translated; `slug`, `id` must remain identical across locales
- CLI command examples: keep commands identical; translate only the comment lines above them

### 7.3 Sync discipline

When updating an English page:
1. Update the English page
2. Update `zh-CN` to match
3. Update `zh-HK` to match

All three changes go in the same commit. Never merge a change that updates only one or two locales.

---

## 8. Page Frontmatter

Every `.md` file requires:

```yaml
---
title: 'Page Title'
id: category_filename      # e.g., quote_pull-static — stable identifier, no spaces
slug: '/quote/pull/static' # absolute path, must start with /
sidebar_position: 3        # lower = higher in sidebar
sidebar_icon: book         # optional; book_open | book | zap | cpu | terminal | sparkles
---
```

- `id` is required on every page — pages missing `id` break cross-locale link resolution
- `slug` must be an absolute path starting with `/` — a slug without a leading `/` is a violation
- `id` and `slug` must be identical across all three locale versions of the same page
- `sidebar_position` drives the user journey order — assign deliberately, not arbitrarily

**Deprecated frontmatter fields** (legacy Slate/Swagger system; must not appear in new pages; remove when editing existing pages):

`language_tabs`, `toc_footers`, `includes`, `highlight_theme`, `headingLevel`

**Top-level standalone pages** (e.g., pricing, about) must use folder structure: `docs/pricing/index.md`, not `docs/pricing.md`. Nginx resolves `/pricing` to `pricing/index.html`; a flat `pricing.md` generates `pricing.html` and causes a 404.

---

## 9. What Not to Write

- **Do not duplicate the API spec in Docs.** If a parameter is fully described in the API Reference, link there — do not copy the table.
- **Do not write aspirational content.** "You can build amazing trading bots", "Start today!" — cut it. Describe what exists, not what could be built.
- **Do not write feature announcements in Docs.** That goes in Changelog.
- **Do not describe the SDK internals.** Docs covers what developers call, not how the SDK is implemented. Do not mention the implementation language (e.g., "SDK is implemented based on Rust") or internal architecture in user-facing documentation.
- **Do not add caveats or warnings that don't apply** to the reader's scenario. Qualifier bloat erodes trust.
- **Do not mix content types on one page.** A page with both how-to steps and reference tables must be split. See §3 and §4.2.
