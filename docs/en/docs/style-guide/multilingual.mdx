---
title: 'Multilingual and Frontmatter'
id: style-guide_multilingual
slug: '/style-guide/multilingual'
sidebar_position: 5
---

# Multilingual and Frontmatter

## Three-language rule

Every `.md` page must exist in all three directories:

- `docs/en/` — English, primary; served at `/docs/...`
- `docs/zh-CN/` — Simplified Chinese; served at `/zh-CN/docs/...`
- `docs/zh-HK/` — Traditional Chinese; served at `/zh-HK/docs/...`

English is the source of truth. `zh-CN` and `zh-HK` follow English structure and content. Never add a page to only one language directory.

:::info Exception
Files under `docs/en/docs/style-guide/` are English-only and exempt from the three-language rule — they are contributor guidelines, not product documentation.
:::

---

## Translation scope

| Element | Translate? |
|---------|-----------|
| Prose and headings | Yes |
| Code sample comments | Yes — translate the comment text only |
| Code identifiers, string literals | No — keep identical to English |
| CLI command names and flags | No |
| Frontmatter `title` | Yes |
| Frontmatter `slug` and `id` | No — must be identical across locales |

---

## Sync discipline

When updating an English page:

1. Update the English page
2. Update `zh-CN` to match
3. Update `zh-HK` to match

All three changes go in the same commit. Never merge a change that updates only one or two locales.

---

## Page frontmatter

Every `.md` file requires this frontmatter block:

```yaml
---
title: 'Page Title'
id: category_filename      # e.g., quote_pull-static — stable identifier, no spaces
slug: '/quote/pull/static' # absolute path, must start with /
sidebar_position: 3        # lower = higher in sidebar
sidebar_icon: book         # optional; book_open | book | zap | cpu | terminal | sparkles
---
```

### Field rules

| Field | Required | Rule |
|-------|----------|------|
| `title` | Yes | Translated in zh-CN and zh-HK |
| `id` | Yes | Identical across all locales; missing `id` breaks cross-locale link resolution |
| `slug` | Yes | Absolute path starting with `/`; a slug without a leading `/` is a violation |
| `sidebar_position` | Yes | Assign deliberately following the [user-journey order](./information-architecture) |
| `sidebar_icon` | No | Valid values: `book_open`, `book`, `zap`, `cpu`, `terminal`, `sparkles` |

### Deprecated frontmatter fields

The following fields are carried over from a legacy Slate/Swagger doc system. Do not add them to new pages. Remove them when editing an existing page.

`language_tabs`, `toc_footers`, `includes`, `highlight_theme`, `headingLevel`

---

## What not to write

**Do not duplicate the API spec in Docs.** If a parameter is fully described in the API Reference, link there — do not copy the table.

**Do not write aspirational content.** "You can build amazing trading bots", "Start today!" — cut it. Describe what exists, not what could be built.

**Do not write feature announcements in Docs.** That belongs in the Changelog.

**Do not describe SDK internals.** Docs covers what developers call, not how the SDK is implemented. Do not mention the implementation language (e.g., "SDK is implemented based on Rust") or internal architecture in user-facing documentation.

**Do not add inapplicable caveats.** Qualifier bloat erodes trust. Only warn about things that can actually affect the reader's scenario.

**Do not mix content types on one page.** A page with both how-to steps and reference tables must be split. See [Content Types](./content-types) and [Information Architecture](./information-architecture).
