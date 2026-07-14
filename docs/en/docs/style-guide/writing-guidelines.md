---
title: 'Writing Guidelines'
id: style-guide_writing-guidelines
slug: '/style-guide/writing-guidelines'
sidebar_position: 4
---

# Writing Guidelines

## Voice and tone

- **Second person:** "you" for the developer — not "the user" or "the developer"
- **Active voice:** "Call the endpoint", not "The endpoint should be called"
- **Present tense:** "The API returns…", not "The API will return…"
- **Concise:** one idea per sentence; remove filler phrases — "In order to", "Please note that"

---

## Headings

- **Sentence case:** "Get static quote", not "Get Static Quote"
- **Be specific:** "Subscribe to real-time quotes", not "Subscription"
- **No gerunds in titles:** "Submit an order", not "Submitting an order"

---

## Code examples

Every how-to, implementation guide, and Get Started page must have runnable code. Code must be verifiable — do not include examples that cannot be tested (trade-execution examples are exempt).

Use real symbols: prefer US stocks (`AAPL.US`, `TSLA.US`, `NVDA.US`) and `700.HK` as examples.

### Multi-language tabs

Use `<Tabs groupId="programming-language">` for SDK code examples.

**Language order:** Python, JavaScript, Rust, Go, Java, C++

**Tab labels:** Use `JavaScript` as the label for the Node.js/JavaScript SDK tab. Do not use `Node.js` — inconsistent labels break cross-page tab sync. Existing pages that use `Node.js` as a label must be corrected when the page is edited.

The `python-async` tab is optional. Include it only when async usage meaningfully differs from the sync example — for example, when the async version uses a different context class such as `AsyncTradeContext` vs `TradeContext`, or requires a different import pattern. Do not include it when the only difference is adding `await`.

**Standard `groupId` values:**

| `groupId` | Use case |
|-----------|----------|
| `programming-language` | SDK code examples by language |
| `cli-install` | CLI installation steps by OS or method |
| `shell` | Shell variant differences |

Do not use ad-hoc `groupId` values. Inconsistent values break cross-page tab-sync behavior.

### `<CliCommand>` rules

- Comments go *before* the command, not inline
- Multi-command blocks require a comment before each command
- Single-command blocks with self-explanatory commands (e.g., `longbridge auth login`) may omit the comment
- Provide 2–4 examples using real ticker symbols; prefer US stocks
- Do not use angle-bracket placeholders like `<order_id>` — Vue parses them as HTML tags and breaks the build; use a numeric example with a preceding comment instead

**Example:**

```markdown
<CliCommand>
# Get real-time quote for Apple
longbridge quote AAPL.US
# Get quotes for multiple symbols
longbridge quote AAPL.US TSLA.US 700.HK
</CliCommand>
```

---

## Callout boxes

Use sparingly. A callout that could be a sentence in the main text should be a sentence in the main text.

**Supported types:**

| Type | When to use |
|------|-------------|
| `:::tip` | Better alternatives, shortcuts, recommended practices |
| `:::info` | Background context the reader might not know |
| `:::warning` | Non-obvious gotchas that could cause silent failures |
| `:::danger` | Security implications, irreversible actions |

**Deprecated types** — migrate to the supported equivalent when editing a page:

| Deprecated | Migrate to |
|-----------|-----------|
| `:::success` | `:::tip` |
| `:::caution` | `:::warning` |

---

## Links

- Link to related pages on first mention of a concept
- Do not repeat the same link within one page
- External links: use descriptive text, not raw URLs
- `openapi.yaml` path references: link to the rendered API Reference page, not the YAML file

---

## Tables

Prefer Markdown table syntax. Raw HTML `<table>` elements are acceptable only when the required structure — merged cells, `rowspan`, or `colspan` — cannot be expressed in standard Markdown. Do not use raw HTML tables purely for formatting preference.

---

## Language integrity

English pages must contain no Chinese characters — including inside code blocks, code comments, and string literals. If a code block was copied from a Chinese locale page, remove all CJK text before committing.
