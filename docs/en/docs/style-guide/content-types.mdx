---
title: 'Content Types'
id: style-guide_content-types
slug: '/style-guide/content-types'
sidebar_position: 1
---

# Content Types

Every page must have exactly one content type. The type is fixed at creation and determines the page's required sections, title format, and placement in the site. A page that mixes two content types must be split into separate pages.

## Content type taxonomy

| Type | Required per product area? | Primary audience |
|------|---------------------------|-----------------|
| [Overview](#overview) | Yes | Developers discovering a product area |
| [Get Started](#get-started) | Yes | Developers starting integration |
| [Concept](#concept) | As needed | Developers needing background knowledge |
| [How-to Guide](#how-to-guide) | As needed | Developers completing a specific task |
| [Implementation Guide](#implementation-guide) | As needed | Developers building end-to-end integrations |
| [Reference](#reference) | As needed | Developers looking up values or limits |
| [Changelog](#changelog) | Yes (site-wide) | All developers tracking platform changes |
| [FAQ / Troubleshooting](#faq--troubleshooting) | As needed | Developers who are stuck |
| [API Endpoint Doc](#api-endpoint-doc) | Per endpoint | Developers making specific API calls |

---

## Overview

**Purpose:** Welcome developers to a product area and orient them.

**Required sections:**
- One-paragraph product description — what it does and when to use it
- Key capabilities (bullet list or table)
- Next steps / navigation links to child pages

**Rules:**
- Must be the first page (`index.md`) in any nested navigation section
- Do not bury setup instructions here — link to Get Started
- If the overview adds no value beyond a table of contents, remove it and promote child pages directly

**Title format:** noun phrase matching the product area — "Market Data", "Trading", "Quote API"

---

## Get Started

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
- A Get Started page over ~400 lines is a signal that reference content must be extracted

**Title format:** "Get started with [product area]" or plain "Get Started"

---

## Concept

**Purpose:** Explain background knowledge developers need before using a feature.

**When to create:** When a term, behavior, or design decision requires explanation that does not fit inline in a how-to — for example: "WebSocket connection model", "Quote subscription model", "Order types".

**Required sections:**
- A clear definition in the first paragraph
- How it relates to the developer's work
- Links to related how-to guides

**Rules:**
- No step-by-step instructions — concepts explain, they do not instruct
- Keep to one concept per page; cross-link related concepts

**Title format:** noun phrase — "Quote subscription model", "Order lifecycle"

---

## How-to Guide

**Purpose:** Step-by-step instructions for a specific, bounded task.

**Required sections:**
1. Prerequisites
2. Numbered steps
3. Expected result

**Rules:**
- Each step = one action + its expected outcome; never multi-action steps
- Code examples must be complete and runnable for the target language
- Do not explain concepts inline — link to a concept page instead

**Title format:** imperative verb phrase — "Subscribe to real-time quotes", not "Subscribing to quotes"

---

## Implementation Guide

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
- Longer than a how-to — but keep it focused on the stated goal

**Title format:** imperative verb phrase describing the outcome — "Build a real-time quote dashboard"

---

## Reference

**Purpose:** Enumerate values, limits, error codes, field definitions, or configuration options.

**Rules:**
- Table-first format — minimize prose
- Keep in sync with `openapi.yaml` for anything covered by the spec
- Do not duplicate API Reference content here; link to it instead

---

## Changelog

**Purpose:** Record platform-level changes visible to developers.

**Rules:**
- One entry per date (`## YYYY-MM-DD`), newest first
- Each entry: 1–3 bullet points, user-facing value only (no internal jargon)
- CLI releases: sub-heading `### CLI vX.Y.Z` with link to GitHub release
- All three language versions updated simultaneously

---

## FAQ / Troubleshooting

**Purpose:** Answer the top questions and unblock common failure modes.

**Rules:**
- FAQ: question as heading (`### Why does X happen?`), concise answer below
- Troubleshooting: symptom → cause → fix structure
- Keep entries short; if the fix requires multiple steps, link to a how-to

---

## API Endpoint Doc

**Purpose:** Technical reference for a single HTTP or WebSocket API endpoint.

**Required sections** (in this order):
1. One-sentence description in active voice (third-person present: "Returns…", "Filters…", "Lists…")
2. `<CliCommand>` block — if a CLI command maps to this endpoint
3. `<SDKLinks>` component — required on all API endpoint pages (see [API Reference Standards](./api-reference#sdklinks-component))
4. `## Request` — HTTP method + URL table; then `### Parameters` table (name / type / required / description); then `### Request Example` using `<Tabs groupId="programming-language">` (see [Writing Guidelines](./writing-guidelines#multi-language-tabs)) with all supported SDK languages
5. `## Response` — response headers, `### Response Example` (JSON), `### Response Status` (status code table)
6. `## Schemas` — field definition tables for complex nested types

**Rules:**
- One endpoint per page — never combine two endpoints on a single page
- All parameter names, types, and required/optional flags must match `openapi.yaml` exactly
- Do not invent parameters or response fields not in the spec

**Title format:** imperative verb + object noun — "Get static quote", "Submit order"

**Valid frontmatter fields:** `title`, `id`, `slug`, `sidebar_position`, `sidebar_icon`

**Deprecated frontmatter fields** (from a legacy Slate-based system; remove when editing existing pages):

`language_tabs`, `toc_footers`, `includes`, `highlight_theme`, `headingLevel`
