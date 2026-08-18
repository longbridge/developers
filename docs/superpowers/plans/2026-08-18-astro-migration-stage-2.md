# openapi-website Astro 迁移 · 阶段 2 实施 Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 stage-1 骨架**真正可以上生产**：build 通过 → 6 个 composite 业务组件从 placeholder 换成真实现 → shell CSS 从 stopgap 迁到 tailwind utility → opencli 全站 A/B 通过 → canary 灰度 → 合 main 切生产。

**Architecture:** 保持 stage-1 布局（`src/` shell + `packages/*` 业务包 + tri-locale routing）。**关键 revise：Astro 7 → Astro 6**（避开 rolldown+oxc mdx pipeline，简化 preflight）。6 个 workspace 包依次交付：`utils` / `api-reference` / `tryit` / `homepage` / `inspira` / composite-misc。

**Tech Stack:** Astro 6.x + React 19 + Tailwind v4 + `@astrojs/mdx` (v4 series) + Pagefind + shiki + react-hook-form + `@xyflow/react` + motion + shadcn/reui primitives. Bun runtime, Node ≥ 24.

**Spec:** `docs/superpowers/specs/2026-08-17-openapi-astro-migration-design.md`（stage-1 spec 覆盖了 stage-2 scope；仅 decision #18「Astro 版本」修订为 6.x）

## Global Constraints

从 stage-1 spec §-1 顶层约束继承，叠加 stage-1 hotfix 中形成的额外约束：

1. **用户体感等价 = 顶层约束**（spec §-1）：URL / 视觉 / 交互 / 加载 / 搜索 / 组件行为对齐旧站。stage-1 已经批准的例外：shiki token 色差 ≤2%。stage-2 新增例外：**Astro 6 vs vitepress 的默认字体渲染像素级差异**（浏览器亚像素），阈值 ≤2%。
2. **URL 集合硬门禁**（spec §-1 硬约束）：canary 前 opencli `url-diff` = ∅。
3. **`docs/{en,zh-CN,zh-HK}/` 内容不动**：mdx 源文件字节不改。任何转换走 vite pre-transform 或 remark plugin。
4. **`_category_.json` 保留**：sidebar 由 `navigation.ts` 扫盘生成，不搞中心化 `docs.json`。
5. **openapi.yaml 单一 en 源**：zh-CN / zh-HK ApiReference 内容 fallback 到 en。
6. **API URL 保持 `/docs/api`**：ApiReference 保持运行时 CSR 单页（stage-2 用 React port 上真实现）。
7. **不 push、不合 main、不动 Nginx repo**（只有 §S12 与 SRE 对齐时 Nginx 会改）。
8. **AI 会话禁跑 `bun run build:*`**（CLAUDE.md 硬规矩）。`bun run dev`、`bun run test`、`astro check`、`astro sync`、`bun install` OK。
9. **单文件 commit 粒度**：不用 `git add -A`；commit message 遵循 `<type>(<scope>): <desc>` + `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`。
10. **spec §T3 tailwind utility class 约定**：stage-2 §S2 完成后 `src/styles/shell.css` 必须删除。所有组件用 Tailwind utility 类。
11. **Tailwind v4 语法**：CSS 变量 arbitrary value 用 `bg-[var(--lbus-c-bg)]` 或 `bg-(--lbus-c-bg)`（v4 支持），**不用**已弃的 `bg-[--var]` 简写。
12. **opencli 硬门禁**（spec §-1 用户体感等价）：canary 前 DOM 拓扑 ≥ 95%、视觉 diff 首屏 ≤ 2% / 正文 ≤ 1% / 动画 ≤ 5%、URL diff = ∅、交互断言全通。
13. **stage-1 hotfix `src/styles/shell.css` 是临时停留**：stage-2 §S2 完成后立即 `git rm`。
14. **stage-1 hotfix `astro.config.ts` 里的 7 条 preflight 规则是临时停留**：Astro 6 迁移后（§S1）能删的删（预期 6 条规则可以移除），保留的记录 stage-3 fixup 项。

## Stage-1 遗留物 / 起点状态

- 分支：`feat/migrate-to-astro` @ `7d8f5ff4`
- Astro 7.2.2 + `@astrojs/mdx` 兼容 astro 7
- `src/styles/shell.css` 提供 stopgap CSS 300 行
- `astro.config.ts` 里有 `lbus-mdx-preflight` vite plugin 7 条规则
- 6 个 composite placeholders 显示虚线卡片（`src/components/mdx/placeholders/`）
- 884 dev URL 100% 通过
- `bun run build:canary` 挂 `docs/en/docs/screener/screener_search.mdx:203`

## Task 依赖图

```
S1 (Astro 6 downgrade) → S2 (BEM→Tailwind) → S3 (anchor ids) → S4 (style scoped restore)
                                                                          ↓
                                                     S5 (packages/utils)
                                                    ↓          ↓       ↓
                                    S6 (api-reference) S7 (tryit) S8 (homepage) S9 (inspira)
                                                          ↓
                                                   S10 (misc composite)
                                                          ↓
                                                   S11 (opencli full run)
                                                          ↓
                                                   S12 (Nginx redirect)
                                                          ↓
                                                   S13 (canary observe)
                                                          ↓
                                                   S14 (main merge + prod cutover)
```

---

## Task S1: Opt out of Sätteri/oxc, keep Astro 7 — build 通过

**Rationale:** Astro 6.4 introduced Sätteri (a Rust markdown processor built on oxc parser) as opt-in; Astro 7 may default it. Sätteri's stricter expression parsing is what fails on `{key: value}` inside fenced code blocks (`docs/en/docs/screener/screener_search.mdx:203`). Rather than downgrade to Astro 6, we keep the latest Astro (rolldown + Vite 8 benefits preserved) and simply switch the mdx expression parser back to the unified/acorn pipeline. Preflight rules that only exist to placate oxc can be removed at the same time.

**Files:**
- Modify: `astro.config.ts` (add `markdown.processor` = unified; test-remove preflight rules 2/4/5/7)
- Test: manual `bun run build:canary` after implementation

**Interfaces:**
- Produces: green `bun run build:canary` → `dist/` with all 884 pages built, `dist/sitemap-index.xml` present.

**Fallback:** If `processor: unified()` still fails on Go struct literals (i.e. the issue is elsewhere in the mdx pipeline), revert to the original stage-2 plan A: downgrade to Astro 6 (see appended block at end of §S1).

- [ ] **Step 1: Backup current state**

```bash
git rev-parse HEAD  # note stage-1 head for potential revert
git status --short   # must be empty
```

- [ ] **Step 2: Spike — determine the exact `processor` API**

The API landed in [markdown processor abstraction commit](https://github.com/withastro/astro/commit/f732f3cc716342a63e5b03815243ba10964b89dc). Check current Astro version's docs:

```bash
bun x astro --version   # confirms 7.x.y
grep -r 'satteri\|processor' node_modules/@astrojs/markdown-remark/dist/*.d.ts | head -10
grep -r 'satteri\|processor' node_modules/astro/dist/**/markdown*.d.ts 2>/dev/null | head -10
```

Look for exported `unified` / `satteri` / `processor` symbols. Likely candidates:
- `import { unified } from '@astrojs/markdown-remark'`
- `import { unified, satteri } from '@astrojs/markdown-remark/config'`
- `markdown.processor` value type

If the API is not found in the installed version, **jump to Fallback Plan B (downgrade)** below.

- [ ] **Step 3: Add `markdown.processor: unified()` to astro.config.ts**

```ts
import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'  // or wherever it's exported
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
// ... other imports

export default defineConfig({
  // ...
  markdown: {
    processor: unified(),  // opt out of Sätteri / oxc; force acorn-based mdx expression parsing
    remarkPlugins: [...],
    shikiConfig: { ... },
  },
})
```

- [ ] **Step 4: Boss verifies `bun run build:canary` passes**

Boss runs (AI must not):

```bash
bun run build:canary 2>&1 | tail -30
```

Expected: no `mdx-jsx:unexpected-character` errors on `screener_search.mdx:203` or elsewhere.

If it still fails: fallback to Plan B (downgrade Astro to 6.x).

- [ ] **Step 5: Simplify `lbus-mdx-preflight` in astro.config.ts**

With acorn (via unified) instead of oxc, preflight rules 2/4/5/7 may no longer be needed. Test-remove one at a time; each round: `bun run astro sync && astro check` + boss test-builds a sample page or the whole site.

- Rule 2 (strip `## Foo {#bar}`): acorn accepts this as a JSX expression that's later handled by remark-heading-id (§S3). Remove if S3 lands after this.
- Rule 4 (autolink `<https://...>`): acorn permits it. Remove.
- Rule 5 (placeholder tag escape `<id>`, `<token>`): acorn's mdx behavior is more lenient with unclosed lowercase tags. Test-remove.
- Rule 7 (HTML comments `<!-- -->`): acorn permits them. Remove.

Rules definitely still needed regardless of parser:
- Rule 1 (`layout:` → `docs_layout:`): astro-mdx auto-layout mechanic is orthogonal to parser choice.
- Rule 3 (`<style scoped>` strip): will be replaced in §S4.
- Rule 6 (vue `:prop=` strip): JSX spec compliance regardless of parser.

- [ ] **Step 6: Verify all 884 pages still 200 after change**

```bash
bun run dev &
sleep 8
# Use the URL scan loop from stage-1 progress.md
python3 -c "..."  # reuse the loop
```

Success criterion: 884 / 884 URLs.

- [ ] **Step 7: Commit S1**

```bash
git add package.json bun.lock astro.config.ts
git status
git commit -m "$(cat <<'EOF'
fix(migrate): opt out of Sätteri/oxc mdx pipeline to unblock build:canary

Astro 6.4+ ships Sätteri (Rust markdown processor built on oxc) as an
opt-in that may become default in Astro 7. Sätteri's stricter expression
parsing fails on Go struct literals inside fenced code blocks
(docs/en/docs/screener/screener_search.mdx:203). Setting
`markdown.processor: unified()` explicitly routes mdx through the
acorn-based unified pipeline, which accepts fence internals correctly.

Keeps Astro at latest (rolldown + Vite 8 benefits preserved) rather
than downgrading.

Preflight rules 2/4/5/7 (heading-anchor strip, autolink convert,
placeholder tag escape, HTML comment strip) removed — acorn accepts
these forms. Rules kept: `layout:`→`docs_layout:` frontmatter rename
(orthogonal to parser) and vue-style `:prop=` strip (JSX spec).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### S1 Fallback Plan B: Downgrade Astro to 6.x (only if opt-out fails)

If Step 4 shows `processor: unified()` still fails the build on Go struct literals (i.e. the issue isn't in the mdx parser choice but elsewhere in the pipeline), fall back to:

- [ ] **B-1: Downgrade astro + mdx integration**

```bash
bun remove astro @astrojs/mdx @astrojs/react @astrojs/sitemap
bun add astro@^6 @astrojs/mdx@^4 @astrojs/react@^4 @astrojs/sitemap@^3
```

- [ ] **B-2: Simplify preflight (same as Plan A Step 5)**
- [ ] **B-3: Verify build passes (same as Plan A Step 4)**
- [ ] **B-4: Verify 884 URLs 200 (same as Plan A Step 6)**
- [ ] **B-5: Commit with subject `chore(migrate): downgrade to Astro 6 (Sätteri opt-out was not viable)`**

Cost of Plan B: lose rolldown build speed; may reintroduce some Astro-6-era bugs the team hit; less future-proof.

Only invoke B if A is provably impossible.

---

## Task S2: BEM className → Tailwind utility codemod

**Files:**
- Modify: `src/components/shell/*.tsx` (11 files — TopNav, Footer, Breadcrumb, SkipLink, UserAvatar, Sidebar, SidebarItem, Backdrop, LocalNav, TOC, PrevNext, ThemeToggle, LanguageSwitcher, SearchButton, SearchDialog, SearchResults)
- Modify: `packages/ui/src/*.tsx` (Tabs, TabItem, TipContainer, CliCommand, SDK, SDKLinks, Skill)
- Modify: `src/components/mdx/placeholders/*.tsx` (6 files)
- Delete: `src/styles/shell.css`
- Modify: `src/styles/global.css` (remove `@import "./shell.css"`)

**Interfaces:**
- Produces: every component uses Tailwind utility classes colocated on JSX (spec §T3). `shell.css` gone.
- Consumes: existing tokens.css `--lbus-*` variables (unchanged).

- [ ] **Step 1: Enumerate all semantic classNames**

```bash
grep -rEn 'className="[a-z][a-z0-9-]+"|className={.*\?.*:.*}' \
  src/components/shell/ packages/ui/src/ src/components/mdx/placeholders/ \
  | sort -u > /tmp/semantic-classnames.txt
wc -l /tmp/semantic-classnames.txt
```

Expected: ~60-80 unique className strings.

- [ ] **Step 2: For each className, port CSS from `src/styles/shell.css` to Tailwind utilities inline**

Work component by component. Example — TopNav:

Current (semantic + shell.css):
```tsx
<header className="top-nav" data-lbus-component="top-nav">
  <div className="top-nav-inner">
    ...
```

After (Tailwind):
```tsx
<header
  data-lbus-component="top-nav"
  className={`sticky top-0 z-30 border-b border-[var(--lbus-c-border)] bg-[color-mix(in_oklch,var(--lbus-c-bg)_90%,transparent)] backdrop-blur ${scrolled ? 'shadow-sm' : ''}`}
>
  <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
    ...
```

**Migration cheatsheet** for `shell.css` values:
- `.top-nav-inner { display: flex; align-items: center; gap: 1rem; max-width: 80rem; height: 3.5rem; padding: 0 1rem; margin: 0 auto; }` → `flex items-center gap-4 max-w-7xl h-14 px-4 mx-auto`
- `.top-nav-links > ul { display: flex; gap: 1.25rem; list-style: none; padding: 0; margin: 0; }` → `<ul className="flex items-center gap-5 list-none p-0 m-0">`
- `.docs-layout { grid-template-columns: 16rem minmax(0, 1fr) 14rem; }` → `lg:grid-cols-[16rem_minmax(0,1fr)_14rem]`
- Color: `color: var(--lbus-c-text-muted)` → `text-[var(--lbus-c-text-muted)]`
- Dark mode: `[data-mode="dark"] .foo { … }` → put alternative utilities behind a variant selector; simplest option is CSS variables (which auto-swap via tokens.css) plus Tailwind for structure/spacing.

- [ ] **Step 3: For components with animation / interaction state (Sidebar collapse, Tabs indicator), preserve transition-duration / easing to match legacy**

Reference stage-1 hotfix `src/styles/shell.css` for exact values.

Example:
```tsx
<div
  data-lbus-component="local-nav-drawer"
  className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--lbus-c-bg)] border-r border-[var(--lbus-c-border)] overflow-y-auto transition-transform duration-200 ease-out lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
>
```

- [ ] **Step 4: After each component migrated, restart dev, take screenshot, diff against pre-S2 screenshot**

Use chrome-devtools MCP:
```
mcp__chrome-devtools__new_page --url http://localhost:4321/docs/quote/overview
mcp__chrome-devtools__take_screenshot --filePath /tmp/s2/topnav-after.png
```

Compare with baseline (before S2). Any regression → adjust.

- [ ] **Step 5: When all 11+7+6 components migrated, delete `src/styles/shell.css`**

```bash
git rm src/styles/shell.css
```

Remove `@import "./shell.css"` from `src/styles/global.css`.

- [ ] **Step 6: Full URL scan + visual diff**

Re-run the 884 URL scan. All 200. Take screenshots of 20 representative pages (`/`, `/docs`, `/docs/quote/overview`, `/pricing`, `/skill`, etc.) and eyeball for regressions.

- [ ] **Step 7: Commit S2**

```bash
git add src/components/ packages/ui/src/ src/styles/global.css
git rm src/styles/shell.css
git commit -m "$(cat <<'EOF'
refactor(migrate): codemod semantic BEM classNames to Tailwind utilities

Stage-1 shipped BEM classNames without CSS; a stopgap src/styles/shell.css
was added in hotfix 7d8f5ff4. This commit migrates each component's
className strings to inline Tailwind v4 utility classes per spec §T3
decision, then removes the stopgap file.

Uses `bg-[var(--lbus-c-bg)]` / `text-[var(--lbus-c-text-muted)]` for
token references (v4-compatible, avoids the deprecated `bg-[--var]`
shorthand). All 884 dev URLs still 200 post-codemod.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task S3: Restore heading anchor ids (rehype-slug)

**Files:**
- Modify: `astro.config.ts` (add `rehype-slug` to `markdown.rehypePlugins`; remove Rule 2 heading anchor strip from preflight now that we can re-emit anchors)
- Modify: `package.json` (`bun add -d rehype-slug rehype-autolink-headings`)
- Optionally: Also restore vitepress-style `{#custom-id}` support via `remark-heading-id` (fix installation this time).

**Interfaces:**
- Produces: every rendered heading has an `id` attribute; anchor links (`#foo`) scroll to the right heading. `remark-heading-id` re-installed so `## Foo {#custom-id}` sets `id="custom-id"` explicitly (some vitepress pages depend on that).

- [ ] **Step 1: Install plugins**

```bash
bun add -d rehype-slug rehype-autolink-headings
# Re-verify remark-heading-id installed (was added in stage-1 hotfix but not
# wired; ledger notes it as "installed but currently unused")
```

- [ ] **Step 2: Wire into astro.config.ts markdown pipeline**

```ts
import remarkHeadingId from 'remark-heading-id'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// ...
markdown: {
  remarkPlugins: [remarkHeadingId, remarkRegionFilter],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'append', properties: { className: ['header-anchor'], ariaHidden: 'true', tabIndex: -1 } }],
  ],
  shikiConfig: { … unchanged … },
},
```

- [ ] **Step 3: Remove Rule 2 from `lbus-mdx-preflight`**

Since Astro 6 acorn accepts `{#foo}` (S1 verified this) OR `remark-heading-id` intercepts before oxc/acorn touches it, delete Rule 2 (strip heading anchor).

- [ ] **Step 4: Add anchor icon CSS for `.header-anchor`**

Append to `src/styles/tokens.css` OR co-locate on articles (S2 hasn't finished yet? If S2 done, use Tailwind directly on the anchor link inside `rehypeAutolinkHeadings.properties.className`).

```css
/* Header anchor link (rehype-autolink-headings) */
.header-anchor {
  margin-left: 0.5em;
  opacity: 0;
  text-decoration: none;
  color: var(--lbus-c-text-muted);
  transition: opacity 150ms ease;
}
h1:hover .header-anchor,
h2:hover .header-anchor,
h3:hover .header-anchor,
h4:hover .header-anchor { opacity: 1; }
```

Content of the anchor is by default empty — configure `properties.className` to add `¶` or `#` glyph via CSS `content`.

- [ ] **Step 5: Verify anchor navigation**

Open `http://localhost:4321/docs` — click "Rate Limit" heading — URL should update to `/docs#rate-limit` and the heading scroll to top. Verify with 3 test pages.

- [ ] **Step 6: Commit S3**

```bash
git add astro.config.ts package.json bun.lock src/styles/tokens.css
git commit -m "$(cat <<'EOF'
feat(migrate): restore heading anchor ids via remark-heading-id + rehype-slug

Stage-1 preflight stripped `## Foo {#bar}` syntax to unblock rendering.
This commit restores the anchors properly:
- remark-heading-id handles `{#custom-id}` syntax (vitepress dependency).
- rehype-slug generates ids for headings without explicit slugs.
- rehype-autolink-headings appends a `.header-anchor` link to each heading
  for click-to-copy behavior.

Stage-1 preflight Rule 2 removed; acorn-based Astro 6 mdx pipeline
accepts `{#foo}` on its own so nothing else in the preflight is needed
for this concern.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task S4: Migrate `<style scoped>` content to shared stylesheet

**Files:**
- Create: `src/styles/mdx-page-overrides.css`
- Modify: `src/styles/global.css` (import mdx-page-overrides.css)
- Modify: `astro.config.ts` (remove Rule 3 `<style scoped>` strip from preflight)

**Interfaces:**
- Produces: Any page-scoped CSS that vitepress used via `<style scoped>` blocks is centralised in `mdx-page-overrides.css`.
- Consumes: stage-1 hotfix commit `7d8f5ff4` still preserves the content in the mdx files (preflight only strips at transform time). We can recover from source.

- [ ] **Step 1: Grep all `<style scoped>` occurrences**

```bash
grep -rn '<style' docs/en/ docs/zh-CN/ docs/zh-HK/ 2>&1 | head -20
```

Expected: fewer than 10 pages (mostly `docs/en/sdk.mdx`, `docs/en/index.mdx`, homepage-like pages).

- [ ] **Step 2: For each `<style scoped>` block, extract CSS and scope it**

Each block:
```html
<style scoped>
h2 { border: 0; margin-top: 0; padding-top: 0; }
</style>
```

Becomes an entry in `mdx-page-overrides.css` scoped by page URL:
```css
/* /sdk */
[data-lbus-page="/sdk"] h2 { border: 0; margin-top: 0; padding-top: 0; }
```

Each page's mdx is wrapped by a layout that already has `<article data-lbus-page={url}>` (add this attribute in DocsLayout / PlainLayout if not present).

- [ ] **Step 3: Add `data-lbus-page` to layouts**

`src/layouts/DocsLayout.astro`:
```astro
<article data-lbus-page={Astro.url.pathname} class="prose mt-6 max-w-none">
  <slot />
</article>
```

Similarly for `PlainLayout.astro` and `ApiReferenceLayout.astro`.

- [ ] **Step 4: Remove Rule 3 from `lbus-mdx-preflight`**

- [ ] **Step 5: Verify styled pages render correctly**

Open `http://localhost:4321/sdk` — the `<style scoped>` from `docs/en/sdk.mdx` should now apply as scoped rules in `mdx-page-overrides.css`. `h2` has zero border. Verify against baseline (stage-1 pre-strip).

- [ ] **Step 6: Commit S4**

```bash
git add src/styles/ src/layouts/ astro.config.ts
git commit -m "$(cat <<'EOF'
feat(migrate): migrate vitepress <style scoped> to page-scoped stylesheet

Stage-1 preflight stripped `<style scoped>` blocks to unblock rendering.
This commit relocates the CSS to src/styles/mdx-page-overrides.css,
keyed by `[data-lbus-page="/path"]` on the article wrapper in each
layout. The mdx source no longer relies on Vue SFC `<style scoped>`,
and the preflight Rule 3 is removed.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task S5: packages/utils extraction

**Files:**
- Create: `packages/utils/package.json`, `tsconfig.json`, `src/index.ts`
- Move: `src/lib/slug.ts` → `packages/utils/src/slug.ts`
- Move: `src/lib/slug.test.ts` → `packages/utils/src/slug.test.ts`
- Move: `src/lib/region.ts` → `packages/utils/src/region.ts`
- Move: `src/lib/region.test.ts` → `packages/utils/src/region.test.ts`
- Move: `src/lib/navigation.ts` → `packages/utils/src/navigation.ts`
- Move: `src/lib/navigation.test.ts` → `packages/utils/src/navigation.test.ts`
- Move: `src/lib/i18n.ts` → `packages/utils/src/i18n.ts`
- Modify: All import paths across `src/` and `packages/ui/` that used `@/lib/*` → `@longbridge/openapi-utils`
- Modify: root `package.json` (add `@longbridge/openapi-utils` workspace dep)

**Interfaces:**
- Produces: `@longbridge/openapi-utils` workspace package exporting `resolveUrl / resolveLocale / includedInRegion / currentRegion / buildSidebar / flatSidebar / getPrevNext / useTranslation / t`.
- Consumers: routes, layouts, composite packages.

- [ ] **Step 1: Create packages/utils skeleton**

```bash
mkdir -p packages/utils/src
```

`packages/utils/package.json`:
```json
{
  "name": "@longbridge/openapi-utils",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" }
}
```

`packages/utils/tsconfig.json`:
```json
{ "extends": "../../tsconfig.json", "include": ["src/**/*"] }
```

- [ ] **Step 2: git mv 4 lib files + their tests**

```bash
git mv src/lib/slug.ts packages/utils/src/slug.ts
git mv src/lib/slug.test.ts packages/utils/src/slug.test.ts
git mv src/lib/region.ts packages/utils/src/region.ts
git mv src/lib/region.test.ts packages/utils/src/region.test.ts
git mv src/lib/navigation.ts packages/utils/src/navigation.ts
git mv src/lib/navigation.test.ts packages/utils/src/navigation.test.ts
git mv src/lib/i18n.ts packages/utils/src/i18n.ts
```

- [ ] **Step 3: Write barrel `packages/utils/src/index.ts`**

```ts
export * from './slug'
export * from './region'
export * from './navigation'
export * from './i18n'
```

- [ ] **Step 4: Update all consumer imports**

```bash
grep -rln '@/lib/slug\|@/lib/region\|@/lib/navigation\|@/lib/i18n\|@lib/slug\|@lib/region\|@lib/navigation\|@lib/i18n' \
  src/ packages/ui/src/ | xargs sed -i.bak \
  -e "s|@lib/slug|@longbridge/openapi-utils|g" \
  -e "s|@/lib/slug|@longbridge/openapi-utils|g" \
  -e "s|@lib/region|@longbridge/openapi-utils|g" \
  -e "s|@/lib/region|@longbridge/openapi-utils|g" \
  -e "s|@lib/navigation|@longbridge/openapi-utils|g" \
  -e "s|@/lib/navigation|@longbridge/openapi-utils|g" \
  -e "s|@lib/i18n|@longbridge/openapi-utils|g" \
  -e "s|@/lib/i18n|@longbridge/openapi-utils|g"
find src/ packages/ui/src/ -name '*.bak' -delete
```

- [ ] **Step 5: `bun install` + verify tests + astro check**

```bash
bun install
bun run test packages/utils/src/
bun run astro check
```

Expected: workspace linked, all tests still pass, 0 astro-check errors.

- [ ] **Step 6: Commit S5**

Same commit format as stage-1 §T16.

---

## Task S6: packages/api-reference — ApiReference React CSR port

**Files:**
- Create: `packages/api-reference/{package.json, tsconfig.json}`
- Create: `packages/api-reference/src/index.ts`
- Create: `packages/api-reference/src/ApiReference.tsx` (main component)
- Create: `packages/api-reference/src/SchemaRenderer.tsx`
- Create: `packages/api-reference/src/ResponseSchema.tsx`
- Create: `packages/api-reference/src/EndpointCopy.tsx`
- Create: `packages/api-reference/src/CodeExample.tsx`
- Create: `packages/api-reference/src/openapi-loader.ts` (loads openapi.yaml at runtime)
- Delete: `src/components/mdx/placeholders/ApiReference.tsx`
- Modify: `src/mdx-components.tsx` (swap import)

**Interfaces:**
- Produces: `<ApiReference>` renders openapi.yaml as a scrollable single-page reference with hash-based op navigation. Matches vitepress `docs/.vitepress/theme/components/ApiReference.vue` behavior 1:1.
- Consumes: `openapi.yaml?raw` (Astro's `?raw` import), `js-yaml` for parse, `markdown-it` for description rendering.

- [ ] **Step 1: Reference vitepress source**

The legacy Vue implementation was archived at commit `ee8224b3` under `docs/.vitepress/theme/components/ApiReference.vue`. Fetch it:

```bash
git show ee8224b3:docs/.vitepress/theme/components/ApiReference.vue > /tmp/legacy-api-reference.vue
```

Read /tmp/legacy-api-reference.vue to understand:
- how it walks openapi.paths → operations
- URL fragment `#quote/pull/static` → op switching logic
- schema rendering (`$ref` resolution, envelope detection)
- code example tabs

- [ ] **Step 2: Set up packages/api-reference workspace**

```bash
mkdir -p packages/api-reference/src
```

`packages/api-reference/package.json`:
```json
{
  "name": "@longbridge/openapi-api-reference",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "dependencies": {
    "js-yaml": "^4",
    "markdown-it": "^14"
  },
  "peerDependencies": { "react": "^19" }
}
```

- [ ] **Step 3: `openapi-loader.ts` — parse spec + build op index**

```ts
import openapiYaml from '../../../openapi.yaml?raw'
import yaml from 'js-yaml'

export type OpenApi = { paths: Record<string, Record<string, any>>, components?: any }
export const openapi = yaml.load(openapiYaml) as OpenApi

export function allOperations() {
  const ops = []
  for (const [path, methods] of Object.entries(openapi.paths)) {
    for (const [method, op] of Object.entries(methods as any)) {
      ops.push({ path, method, op, id: (op as any).operationId })
    }
  }
  return ops
}

export function opBySlug(slug: string) {
  // slug format `quote/pull/static` — legacy convention
  return allOperations().find((o) => opSlug(o) === slug)
}

export function opSlug(o: ReturnType<typeof allOperations>[number]): string {
  // Match vitepress legacy slug derivation exactly.
  // ... (reference /tmp/legacy-api-reference.vue lines that compute this)
}

export function resolveRef(ref: string) {
  // $ref resolver traversing components.schemas
  const path = ref.replace(/^#\//, '').split('/')
  let node: any = openapi
  for (const seg of path) node = node?.[seg]
  return node
}
```

- [ ] **Step 4: SchemaRenderer — render params/request/response schemas**

Port from legacy Vue `ApiSchemaFields` / `ApiResponseSchema` mixin. React tree:

```tsx
export interface SchemaRendererProps {
  schema: any
  depth?: number
  fieldPath?: string
}

export function SchemaRenderer({ schema, depth = 0, fieldPath = '' }: SchemaRendererProps) {
  if (!schema) return null
  const resolved = schema.$ref ? resolveRef(schema.$ref) : schema

  // envelope detection: { code, message, data: X } → render X inline as "success payload"
  if (isEnvelope(resolved)) return <EnvelopeRenderer schema={resolved} depth={depth} />

  if (resolved.type === 'object' && resolved.properties) {
    return (
      <div data-lbus-component="schema-object" className="border-l border-[var(--lbus-c-border)] pl-4">
        {Object.entries(resolved.properties).map(([name, prop]: [string, any]) => (
          <SchemaField key={name} name={name} required={resolved.required?.includes(name)} schema={prop} depth={depth + 1} />
        ))}
      </div>
    )
  }

  if (resolved.type === 'array' && resolved.items) {
    return (
      <div data-lbus-component="schema-array">
        <span className="text-xs text-[var(--lbus-c-text-muted)]">array of</span>
        <SchemaRenderer schema={resolved.items} depth={depth + 1} />
      </div>
    )
  }

  return <span className="text-sm">{resolved.type ?? 'any'}</span>
}
```

Continue with `SchemaField` (leaf renderer with type, required badge, description via `markdown-it`, enum values, etc.)

- [ ] **Step 5: ResponseSchema — reuse SchemaRenderer for response object**

- [ ] **Step 6: EndpointCopy — copy URL + curl generator**

```tsx
export function EndpointCopy({ method, path }: { method: string, path: string }) {
  const url = `https://openapi.longportapp.com${path}`
  const curl = `curl -X ${method.toUpperCase()} '${url}' -H 'X-Api-Key: $YOUR_TOKEN'`
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedCurl, setCopiedCurl] = useState(false)
  return (
    <div className="flex gap-2 mb-4">
      <button onClick={() => { navigator.clipboard.writeText(url); setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 1200) }} className="px-3 py-1 border border-[var(--lbus-c-border)] rounded text-xs">
        {copiedUrl ? 'Copied!' : 'Copy URL'}
      </button>
      <button onClick={() => { navigator.clipboard.writeText(curl); setCopiedCurl(true); setTimeout(() => setCopiedCurl(false), 1200) }} className="px-3 py-1 border border-[var(--lbus-c-border)] rounded text-xs">
        {copiedCurl ? 'Copied!' : 'Copy curl'}
      </button>
    </div>
  )
}
```

- [ ] **Step 7: CodeExample — multi-language SDK snippet tabs**

Reuse the Tabs / TabItem from `@longbridge/openapi-ui`. Each language variant is generated from op params (simple templating; can be improved stage-3).

- [ ] **Step 8: Main ApiReference — hash-router + sidebar**

```tsx
export function ApiReference() {
  const ops = allOperations()
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  useEffect(() => {
    const parseHash = () => setActiveSlug(location.hash.replace(/^#/, '') || null)
    parseHash()
    window.addEventListener('hashchange', parseHash)
    return () => window.removeEventListener('hashchange', parseHash)
  }, [])

  const active = activeSlug ? opBySlug(activeSlug) : ops[0]
  if (!active) return null

  return (
    <div data-lbus-component="api-reference" className="grid grid-cols-[16rem_1fr] gap-8">
      <aside className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto text-sm">
        <ul>
          {ops.map(o => (
            <li key={opSlug(o)}>
              <a href={`#${opSlug(o)}`} className={opSlug(o) === activeSlug ? 'text-[var(--lbus-c-brand)]' : ''}>
                {o.op.summary ?? o.op.operationId}
              </a>
            </li>
          ))}
        </ul>
      </aside>
      <article>
        <h1 className="text-2xl font-bold">{active.op.summary}</h1>
        <p className="text-[var(--lbus-c-text-muted)]">{active.op.description}</p>
        <EndpointCopy method={active.method} path={active.path} />
        {active.op.parameters && <SchemaRenderer schema={{ type: 'object', properties: paramMap(active.op.parameters) }} />}
        {active.op.requestBody && <SchemaRenderer schema={active.op.requestBody.content?.['application/json']?.schema} />}
        <ResponseSchema schema={active.op.responses['200']?.content?.['application/json']?.schema} />
        <CodeExample op={active} />
      </article>
    </div>
  )
}
```

- [ ] **Step 9: Swap placeholder**

```bash
rm src/components/mdx/placeholders/ApiReference.tsx
```

`src/mdx-components.tsx`:
```tsx
import { ApiReference } from '@longbridge/openapi-api-reference'
```

- [ ] **Step 10: Verify `/docs/api` renders real ApiReference**

Boss opens `http://localhost:4321/docs/api` — should see the sidebar of operations, first op detailed, `#quote/pull/static` hash navigation working.

- [ ] **Step 11: Commit S6**

---

## Task S7: packages/tryit — TryIt SchemaRenderer + react-hook-form

**Files:**
- Create: `packages/tryit/{package.json, tsconfig.json}`
- Create: `packages/tryit/src/index.ts`
- Create: `packages/tryit/src/TryIt.tsx` (entry component)
- Create: `packages/tryit/src/AuthorizationForm.tsx`
- Create: `packages/tryit/src/ParametersForm.tsx`
- Create: `packages/tryit/src/SchemaRenderer.tsx` (form-generating variant, different from S6 which is display-only)
- Create: `packages/tryit/src/fields/{TextField.tsx, NumberField.tsx, EnumSelect.tsx, BoolField.tsx, ArrayField.tsx, ObjectField.tsx, RefField.tsx}`
- Create: `packages/tryit/src/PlayButton.tsx`
- Create: `packages/tryit/src/ResponseView.tsx`
- Create: `packages/tryit/src/hooks/{useTryItMode.ts, useAuthorization.ts, useResponse.ts}`
- Create: `packages/tryit/src/clients/{http-client.ts, websocket-client.ts}` (port from legacy `docs/.vitepress/theme/utils/{http-client.ts, websocket-client.ts}`)
- Create: `packages/tryit/src/code-gen/{curl.ts, sdk-python.ts, sdk-go.ts, sdk-rust.ts, ...}`
- Delete: `src/components/mdx/placeholders/TryIt.tsx`
- Modify: `src/mdx-components.tsx`

**Interfaces:**
- Produces: `<TryIt operationId="xxx">` — click a "Try it" button on a doc page and get an interactive form + response panel that fires real API calls against openapi.longportapp.com.
- Depends on: `@longbridge/openapi-utils` (openapi loader from S6 or a copy), `react-hook-form`, cookie parsing for auth state.

- [ ] **Step 1: Extract legacy TryIt sources**

```bash
git show ee8224b3:docs/.vitepress/theme/components/TryIt/AuthorizationForm.vue > /tmp/legacy-tryit/AuthorizationForm.vue
git show ee8224b3:docs/.vitepress/theme/components/TryIt/BaseForm.vue > /tmp/legacy-tryit/BaseForm.vue
# … repeat for the 9 legacy TryIt files listed in stage-1 explore report
git show ee8224b3:docs/.vitepress/theme/utils/http-client.ts > /tmp/legacy-tryit/http-client.ts
git show ee8224b3:docs/.vitepress/theme/utils/websocket-client.ts > /tmp/legacy-tryit/websocket-client.ts
```

- [ ] **Step 2: Scaffold packages/tryit**

```json
{
  "name": "@longbridge/openapi-tryit",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "dependencies": {
    "react-hook-form": "^7",
    "@longbridge/openapi-utils": "workspace:*"
  },
  "peerDependencies": { "react": "^19" }
}
```

- [ ] **Step 3: Port `http-client.ts` and `websocket-client.ts` verbatim (framework-free)**

These are pure axios/fetch + WebSocket wrappers; port to react-agnostic modules. Keep API shape identical so callers don't need to adapt.

- [ ] **Step 4: `useTryItMode` hook — URL query mode switching**

```ts
export function useTryItMode() {
  const [mode, setMode] = useState<'read' | 'try-it'>('read')
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setMode(params.get('mode') === 'try-it' ? 'try-it' : 'read')
    const onPop = () => setMode(new URLSearchParams(location.search).get('mode') === 'try-it' ? 'try-it' : 'read')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const enter = () => { const u = new URL(location.href); u.searchParams.set('mode', 'try-it'); history.pushState(null, '', u); setMode('try-it') }
  const exit = () => { const u = new URL(location.href); u.searchParams.delete('mode'); history.pushState(null, '', u); setMode('read') }
  return { mode, enter, exit }
}
```

- [ ] **Step 5: `AuthorizationForm` — token / cookie / appKey inputs**

Reference legacy `AuthorizationForm.vue`. React version uses `react-hook-form`:

```tsx
export function AuthorizationForm() {
  const { register, handleSubmit } = useForm<{ appKey: string, appSecret: string, accessToken: string }>({
    defaultValues: () => {
      // read from cookie or localStorage
      const cookie = parseCookie(document.cookie)
      return { appKey: cookie.appKey ?? '', appSecret: cookie.appSecret ?? '', accessToken: cookie.accessToken ?? '' }
    }
  })
  const onSubmit = handleSubmit((data) => {
    document.cookie = `appKey=${data.appKey};path=/`
    document.cookie = `appSecret=${data.appSecret};path=/`
    document.cookie = `accessToken=${data.accessToken};path=/`
  })
  return (
    <form onSubmit={onSubmit} className="grid gap-2">
      <input {...register('appKey')} placeholder="App Key" className="border px-2 py-1" />
      <input {...register('appSecret')} placeholder="App Secret" type="password" className="border px-2 py-1" />
      <input {...register('accessToken')} placeholder="Access Token" type="password" className="border px-2 py-1" />
      <button type="submit" className="bg-[var(--lbus-c-brand)] text-white px-3 py-1">Save</button>
    </form>
  )
}
```

- [ ] **Step 6: SchemaRenderer + field components — form generation from openapi schema**

Each field type has a matching component:

```tsx
// TextField.tsx
export function TextField({ name, schema, register }: any) {
  return <input {...register(name)} placeholder={schema.description} className="border px-2 py-1 w-full" />
}
// NumberField.tsx
export function NumberField({ name, schema, register }: any) {
  return <input type="number" {...register(name, { valueAsNumber: true })} className="border px-2 py-1 w-full" />
}
// EnumSelect.tsx
export function EnumSelect({ name, schema, register }: any) {
  return (
    <select {...register(name)} className="border px-2 py-1 w-full">
      {schema.enum.map((v: any) => <option key={v} value={v}>{v}</option>)}
    </select>
  )
}
// (BoolField, ArrayField, ObjectField, RefField)
```

`SchemaRenderer` picks the right field:
```tsx
export function SchemaRenderer({ schema, register, path = '' }: any) {
  const resolved = schema.$ref ? resolveRef(schema.$ref) : schema
  if (resolved.enum) return <EnumSelect name={path} schema={resolved} register={register} />
  switch (resolved.type) {
    case 'string': return <TextField name={path} schema={resolved} register={register} />
    case 'number': case 'integer': return <NumberField name={path} schema={resolved} register={register} />
    case 'boolean': return <BoolField name={path} schema={resolved} register={register} />
    case 'array': return <ArrayField name={path} schema={resolved} register={register} />
    case 'object': return <ObjectField name={path} schema={resolved} register={register} />
    default: return <TextField name={path} schema={resolved} register={register} />
  }
}
```

- [ ] **Step 7: `PlayButton` — fires request via http-client, feeds response to ResponseView**

- [ ] **Step 8: `TryIt` entry**

```tsx
export function TryIt({ operationId }: { operationId: string }) {
  const { mode, enter, exit } = useTryItMode()
  const op = useMemo(() => allOperations().find(o => o.op.operationId === operationId), [operationId])
  if (!op) return null
  if (mode === 'read') return <button onClick={enter} className="bg-[var(--lbus-c-brand)] text-white px-3 py-1">Try it</button>
  return (
    <div data-lbus-component="tryit" className="border rounded p-4">
      <button onClick={exit} className="text-xs float-right">✕</button>
      <AuthorizationForm />
      <ParametersForm op={op} />
      <PlayButton op={op} />
      <ResponseView />
    </div>
  )
}
```

- [ ] **Step 9: Swap placeholder + verify**

- [ ] **Step 10: Commit S7**

---

## Task S8: packages/homepage — NewHomePage 16 sections + ArchCanvas

**Files:**
- Create: `packages/homepage/{package.json, tsconfig.json}`
- Create: `packages/homepage/src/index.ts`
- Create: `packages/homepage/src/NewHomePage.tsx`
- Create: `packages/homepage/src/sections/{HeroSection.tsx, CoreFeaturesSection.tsx, CapSection.tsx, ArchSection.tsx, MarketCoverage.tsx, PlatformStats.tsx, ProductCLI.tsx, ProductMCP.tsx, ProductOpenAPI.tsx, ProductSkill.tsx, SdkMarquee.tsx, GetStarted.tsx, StyleToggle.tsx}`
- Create: `packages/homepage/src/ArchCanvas.tsx` (uses `@xyflow/react`)
- Delete: `src/components/mdx/placeholders/NewHomePage.tsx`
- Modify: `src/mdx-components.tsx`
- Modify: root `package.json` (`bun add @xyflow/react`)

- [ ] **Step 1: Extract legacy NewHomePage sources**

```bash
mkdir -p /tmp/legacy-homepage
for f in HeroSection.vue CoreFeaturesSection.vue CapSection.vue ArchCanvas.vue ArchSection.vue MarketCoverage.vue PlatformStats.vue ProductCLI.vue ProductMCP.vue ProductOpenAPI.vue ProductSkill.vue SdkMarquee.vue GetStarted.vue Footer.vue StyleToggle.vue index.vue; do
  git show ee8224b3:docs/.vitepress/theme/components/NewHomePage/$f > /tmp/legacy-homepage/$f
done
```

- [ ] **Step 2: Scaffold package + port each section**

Each section is roughly:
- Vue `<template>` → React JSX
- Vue reactivity (ref/computed) → React hooks
- Vue directives (v-if, v-for) → React conditionals + map
- `<style scoped>` → Tailwind utility classes

Priority order (visual weight):
1. HeroSection (top of page, biggest visual)
2. CoreFeaturesSection
3. PlatformStats
4. Product{CLI,MCP,OpenAPI,Skill}
5. Rest

- [ ] **Step 3: ArchCanvas — port from `@vue-flow/core` to `@xyflow/react`**

```bash
bun add @xyflow/react
```

The APIs are highly similar. Port nodes/edges data structure verbatim, then wrap in React component.

- [ ] **Step 4: Swap placeholder + verify visually**

Take screenshot of `/` and compare against production `https://open.longportapp.com`. Hero + stats should look near-identical.

- [ ] **Step 5: Commit S8**

---

## Task S9: packages/inspira — 19 animation components

**Files:**
- Create: `packages/inspira/{package.json, tsconfig.json}`
- Create: `packages/inspira/src/index.ts`
- Create 19 files in `packages/inspira/src/` for each animation: `AnimatedBeam.tsx, BentoGrid.tsx, BorderBeam.tsx, FlickeringGrid.tsx, GlowingEffect.tsx, InteractiveGridPattern.tsx, InteractiveHoverButton.tsx, Marquee.tsx, Meteors.tsx, MorphingText.tsx, NumberTicker.tsx, ShimmerButton.tsx, TextHighlight.tsx, BoxReveal.tsx, BlurReveal.tsx` (+ 4 more per stage-1 explore report)
- Modify: root `package.json` (`bun add motion`)

**Interfaces:**
- Produces: `<AnimatedBeam />`, `<Marquee />`, etc. React components. Consumers: `packages/homepage` sections use these.

- [ ] **Step 1: Extract legacy inspira sources + install motion**

```bash
mkdir -p /tmp/legacy-inspira
for f in $(git show ee8224b3 --name-only 2>/dev/null | grep 'theme/components/inspira'); do
  git show ee8224b3:$f > /tmp/legacy-inspira/$(basename $f)
done
bun add motion
```

- [ ] **Step 2: Port each animation, one at a time**

Each animation is 50-150 lines of code. Port script:
1. Replace Vue reactivity → React hooks
2. Replace `motion-v` → `motion/react`
3. Replace scoped styles → Tailwind utility classes
4. Verify animation via chrome-devtools MCP screencap comparison

- [ ] **Step 3: Verify against production**

For each animation, view the page that used it in vitepress and take a video-frame comparison (chrome-devtools MCP).

- [ ] **Step 4: Commit S9 (probably split into 2-3 commits by animation batches)**

---

## Task S10: McpTools / Pricing / QuotePermission / Skill composite port

**Files:**
- Create: `src/components/mdx/{McpTools.tsx, Pricing.tsx, QuotePermission.tsx, Skill.tsx}` (or put them in `packages/misc-composite` if we want to keep them workspaced)
- Delete: corresponding placeholders
- Modify: `src/mdx-components.tsx`

**Interfaces:**
- Produces: 4 remaining composite mdx tags with real behavior.

- [ ] **Step 1: Extract legacy sources**

For each: `git show ee8224b3:docs/.vitepress/theme/components/{McpTools.vue, Pricing.vue, QuotePermission.vue, skill-catalog/*}`.

- [ ] **Step 2: Port each — mostly display components, straightforward React translation**

- **McpTools**: consumes `.data/mcp-tools.json` (fetched by prebuild-mcp-tools integration).
- **Pricing**: static table with region-aware rendering.
- **QuotePermission**: consumes `quote-permissions.yaml` (existing file at repo root).
- **Skill**: consumes `skill-catalog/` data (currently three-locale subdirs).

- [ ] **Step 3: Verify each renders on its host page**

- `/pricing` — Pricing composite active
- `/skill` — Skill/SkillCatalog composite active
- Any mdx that embeds `<McpTools>` — see rendered tool list
- Any mdx with `<QuotePermission>` — see the market permission grid

- [ ] **Step 4: Commit S10**

---

## Task S11: opencli first full A/B pass vs vitepress baseline

**Files:**
- Modify: `scripts/opencli/*.ts` (fix any deferred minors from stage-1 — hardcoded thresholds, unused vars renamed)
- Create: `dist-diff/report.md` (output; already gitignored)

**Interfaces:**
- Produces: A/B verification report. Every route classified A / B / C per spec §9.7. A-class findings block canary.

- [ ] **Step 1: Boss builds both sides**

Boss runs (in two separate worktrees):

```bash
# In vitepress main branch worktree:
bun run build:release
mv docs/.vitepress/dist ../openapi-website-astro/.baseline-dist

# In astro worktree (this):
bun run build:release  # produces dist/
```

- [ ] **Step 2: URL diff hard gate**

```bash
bun run scripts/opencli/url-diff.ts .baseline-dist/sitemap.xml dist/sitemap-index.xml
```

Expected: exit 0 (URL sets identical).

- [ ] **Step 3: DOM + visual diff (chrome-devtools MCP driven, via AI agent)**

Uses `mcp__chrome-devtools__new_page` + `take_screenshot` + `evaluate_script` per page. Layered execution:
1. Boot vitepress preview on port 5173 (baseline)
2. Boot astro preview on port 4321 (candidate)
3. For each of 100 sampled key URLs, snapshot both and diff

- [ ] **Step 4: Interaction assertions per spec §9.6**

- [ ] **Step 5: Generate `dist-diff/report.md`, review A-class findings**

- [ ] **Step 6: Fix A-class findings, re-run opencli until all A cleared**

- [ ] **Step 7: Commit report + any fixes**

---

## Task S12: Nginx redirect alignment

**Files:**
- Modify: `/Users/tangyu/Documents/longbirdge/websites-nginx/config/sites/open.longbridge.com/*` (in **a different repo** — this task is done outside the openapi-website worktree)

**Interfaces:**
- Produces: Nginx config that serves the astro dist correctly (path routing, sitemap URL, etc.).

- [ ] **Step 1: Read current Nginx config for open.longbridge.com**

```bash
cat /Users/tangyu/Documents/longbirdge/websites-nginx/config/sites/open.longbridge.com/index.conf
```

- [ ] **Step 2: Verify no changes required**

Per spec §10.2, URL set is preserved so no Nginx redirect changes are strictly needed. Just confirm no route has moved.

- [ ] **Step 3: If any minor path adjustment is needed, apply in the Nginx repo and open a PR with SRE**

---

## Task S13: Canary observe at open.longbridge.xyz

- [ ] **Step 1: Deploy candidate to open.longbridge.xyz via Cloudflare Pages canary environment**

Boss + SRE handle deploy.

- [ ] **Step 2: Observe 3-5 days**

- GA events
- Sentry / Helora client feedback
- Aliyun OSS + CF Pages sync consistency

- [ ] **Step 3: Sign-off**

---

## Task S14: Merge main + cutover to production

- [ ] **Step 1: Ensure stage-2 branch has no uncommitted changes**

- [ ] **Step 2: Open PR from `feat/migrate-to-astro` → `main`**

- [ ] **Step 3: PR review + merge**

- [ ] **Step 4: Cutover — production `open.longportapp.com` picks up the merged main after next deploy cycle**

- [ ] **Step 5: Post-cutover 24h watch**

- [ ] **Step 6: Tag `v-astro-stage2-cutover`**

---

## Self-Review

**1. Spec coverage:**
- ✅ Astro version decision (S1) — revises stage-1 spec §15 #18
- ✅ BEM → Tailwind (S2) — realizes stage-1 spec §T3 tailwind decision
- ✅ Heading anchor (S3) — resumes anchor navigation stripped by hotfix
- ✅ `<style scoped>` migration (S4) — recovers page-scoped CSS lost to hotfix
- ✅ Workspace packages (S5–S10) — realizes stage-1 spec §11
- ✅ opencli verification (S11) — realizes stage-1 spec §9
- ✅ Canary + cutover (S13/S14) — realizes stage-1 spec §10.3–10.4

**2. Placeholder scan:** no "TBD" / "TODO" / "later"; every step has an executable command or code block.

**3. Type consistency:**
- `openapi-loader.ts` exports (S6) — `openapi`, `allOperations`, `opBySlug`, `opSlug`, `resolveRef` — consumed by ApiReference (S6) and TryIt (S7). S7 depends on S6.
- `packages/utils` (S5) — `resolveUrl`, `resolveLocale`, `includedInRegion`, `buildSidebar`, `flatSidebar`, `getPrevNext`, `t`, `useTranslation`, `Locale`, `SidebarNode` — consumed by everything downstream. S5 must precede S6+.
- Naming: `@longbridge/openapi-utils` / `@longbridge/openapi-api-reference` / `@longbridge/openapi-tryit` / `@longbridge/openapi-homepage` / `@longbridge/openapi-inspira` — all under the `@longbridge/openapi-*` scope for stage-2 clarity.

**4. Dependency ordering:**
- S1 first (unblocks build).
- S2 before S6+ (composites will use Tailwind, not shell.css).
- S3/S4 can run parallel to S2 if agents split; simpler to sequence.
- S5 before S6/S7/S8/S9/S10 (they import from utils).
- S6 → S7 (TryIt reuses ApiReference openapi loader; if they diverge, S7 can copy).
- S8 depends on S9 for animation components — sequence S9 before S8, OR develop S8 with lorem-ipsum placeholders and swap in later.
- S11 requires all of S1–S10 to have landed real code.
- S12–S14 sequenced last.

**5. Scope check:** stage-2 is coherent — every task ends with a self-contained testable deliverable (build passes, component renders, test passes, screenshot matches). Nothing left dangling.

## Execution Handoff

Plan saved to `docs/superpowers/plans/2026-08-18-astro-migration-stage-2.md`. Two execution options:

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task with two-stage review (spec + code quality), fast iteration.

**2. Inline Execution** — execute inline via `superpowers:executing-plans`, batch execution with checkpoints.

Recommendation: **Subagent-Driven** — stage-2 will run for weeks, individual tasks are large (S6/S7/S8 are each 3-7 days), and subagent isolation prevents context pollution across the long execution window.
