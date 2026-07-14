# Longbridge Developers — Documentation Content Strategy

> Reference: [Cloudflare Developer Docs Content Strategy](https://developers.cloudflare.com/style-guide/documentation-content-strategy/) · [Cloudflare API Content Strategy](https://developers.cloudflare.com/style-guide/api-content-strategy/)

---

## 1. Mission

Create documentation that makes developers successful on the Longbridge platform as quickly as possible. Every page should serve a clear purpose: reduce time-to-first-working-integration, deflect support, and build confidence in the API surface.

---

## 2. Content Architecture

The site has two distinct content areas with different audiences and purposes:

| Area | Path | Audience | Purpose |
|------|------|----------|---------|
| **Docs** | `docs/{lang}/docs/` | Developers integrating Longbridge | Scenario-based usage guides, tutorials, conceptual background |
| **API Reference** | `docs/{lang}/api/` | Developers making specific API calls | Technical reference driven by `openapi.yaml` |

These two areas are separate in IA and must not be blended. Docs explains *how to use* the platform; API Reference explains *what* each endpoint does.

---

## 3. Docs Content Types

Every page must have a clear type. The type determines structure, scope, and voice.

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

## 4. Information Architecture (IA)

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

---

## 5. API Reference Standards

The API Reference is generated from `openapi.yaml`. Writing in this area means maintaining the spec first, then syncing the rendered pages.

### 5.1 Source of truth

`openapi.yaml` is the single source of truth. Never invent parameter names, types, or response fields in the documentation — always check the spec first. When the docs and spec conflict, fix the spec, then the docs.

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
| GET (single) | Get, Retrieve |
| GET (list) | List |
| POST (create) | Create, Submit, Place |
| POST (action) | Send, Trigger, Execute |
| PUT / PATCH | Update, Modify |
| DELETE | Delete, Cancel, Remove |

Use the root form of the verb in the title (not gerund — no "Getting", "Submitting").

### 5.4 Parameter and field descriptions

- Every required parameter must have a description
- Descriptions: one sentence; explain the value's meaning in business terms, not just the data type
- Include valid values / ranges where bounded
- Timestamps: note the format and timezone (Unix timestamp, UTC)

### 5.5 Request examples

- Include a working cURL example for every endpoint
- Always include `Content-Type: application/json` header for requests with a body
- Do not pipe through `jq` — keep examples dependency-free
- Use realistic but non-sensitive placeholder values (e.g., real ticker symbols like `AAPL.US`, `700.HK`)

### 5.6 Response examples

- Show a representative successful response
- Do not show error responses inline — link to the error code reference

### 5.7 Deprecated endpoints

When an endpoint is deprecated:

1. Add `deprecated: true` to the OpenAPI spec
2. Add a notice at the top of the endpoint description: "Deprecated. Use [alternative] instead. This endpoint will be removed on [full date, e.g. August 1, 2027]."
3. Link to the replacement endpoint or migration guide
4. Do not remove the endpoint from the spec until the end-of-life date passes

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
- Multi-language examples use `<Tabs groupId="programming-language">` with tabs for Python, JavaScript, Rust, Go, Java, C++ (in that order)
- CLI examples use `<CliCommand>` — comments go *before* the command, not inline
- Code must be verifiable — do not include examples that cannot be tested (except trade-execution examples)
- Use real symbols: prefer US stocks (`AAPL.US`, `TSLA.US`, `NVDA.US`) and `700.HK` as examples

### 6.4 Callout boxes

Use sparingly:

| Type | When to use |
|------|-------------|
| `:::tip` | Better alternatives, shortcuts, recommended practices |
| `:::info` | Background context the reader might not know |
| `:::warning` | Non-obvious gotchas that could cause silent failures |
| `:::danger` | Security implications, irreversible actions |

Do not use callouts for information that belongs in the main text.

### 6.5 Links

- Link to related pages on first mention of a concept
- Do not repeat the same link within one page
- External links: use descriptive text, not raw URLs
- `openapi.yaml` path references: link to the rendered API Reference, not the YAML file

---

## 7. Multilingual Requirements

### 7.1 Three-language rule

Every `.md` page must exist in all three directories:

- `docs/en/` — English, primary; served at `/docs/...`
- `docs/zh-CN/` — Simplified Chinese; served at `/zh-CN/docs/...`
- `docs/zh-HK/` — Traditional Chinese; served at `/zh-HK/docs/...`

English is the source of truth. `zh-CN` and `zh-HK` follow English structure and content. Never add a page to only one language directory.

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
slug: '/quote/pull/static' # absolute path, starts with /
sidebar_position: 3        # lower = higher in sidebar
sidebar_icon: book         # optional; book_open | book | zap | cpu | terminal | sparkles
---
```

- `id` and `slug` must be identical across all three locale versions of the same page
- `sidebar_position` drives the user journey order — assign deliberately, not arbitrarily

---

## 9. What Not to Write

- **Do not duplicate the API spec in Docs.** If a parameter is fully described in the API Reference, link there — do not copy the table.
- **Do not write aspirational content.** "You can build amazing trading bots" — cut it. Describe what exists.
- **Do not write feature announcements in Docs.** That goes in Changelog.
- **Do not describe the SDK internals.** Docs covers what developers call, not how the SDK is implemented.
- **Do not add caveats or warnings that don't apply** to the reader's scenario. Qualifier bloat erodes trust.
