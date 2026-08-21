---
title: 'Information Architecture'
id: style-guide_information-architecture
slug: '/style-guide/information-architecture'
sidebar_position: 2
---

# Information Architecture

## Standard user journey

Every product area in Docs follows this standard user journey. The order is intentional — it mirrors how a developer progresses from discovery to mastery.

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

### `sidebar_position` reference

Use these ranges to enforce the user-journey order. Gaps between ranges leave room for future pages without requiring a full renumber.

| Content type | Typical `sidebar_position` |
|---|---|
| Overview | 0 |
| Get Started | 1 |
| Concepts | 10–19 |
| How-to guides | 20–49 |
| Implementation guides | 50–69 |
| Reference | 70–89 |
| Troubleshooting / FAQ | 90+ |

---

## Mixed-content-type pages

A page with more than one content type must be split into separate pages. The only permitted exception is a designated entry-point page (for example, the top-level Get Started) that links out to reference material instead of embedding it.

**Signs a page needs to be split:**
- The page has both numbered how-to steps and reference tables
- The page is over ~400 lines and contains embedded reference content (env vars, API key details)
- The page title does not accurately describe all the content on it

### `getting-started.md` ruling

Keep the top-level `getting-started.md` as a single Get Started page. Do not embed environment variable reference tables, legacy API key configuration details, or language-specific reference material inline. Move such content to a dedicated Reference page and link to it from the Get Started page.

A Get Started page over ~400 lines is a reliable signal that reference content must be extracted.

---

## Directory structure

### New product area checklist

When adding a new product area (for example, "DCA"):

1. Create `docs/{lang}/docs/dca/` in all three locales
2. Add `_category_.json` with `position`, `label`, and `collapsed`
3. Create `index.md` (Overview) as the first page
4. Create `get-started.md` as the second page
5. Add Concept, How-to, and Reference pages as needed
6. Assign `sidebar_position` values following the reference table above

### Top-level standalone pages

Top-level standalone pages (for example, pricing, about) must use a folder structure:

```
docs/pricing/index.md   ✓  → URL: /pricing
docs/pricing.md         ✗  → generates /pricing.html, causes 404
```

Nginx resolves `/pricing` to `pricing/index.html`. A flat `pricing.md` file generates `pricing.html` and causes a 404.
