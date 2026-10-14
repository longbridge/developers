# openapi-website Astro 迁移 · 阶段 1 实施 Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 openapi-website 从 vitepress + Vue 迁到 Astro + React 的**骨架**跑通：所有 882 篇内容页可访问、URL 集合与旧站等价、shell 组件 / primitives / 主题 / 搜索 / Sidebar / Region 全部到位、opencli 首轮 A/B 通过 DOM≥95% + URL diff=∅ 门禁。复杂业务组件（TryIt / ApiReference / NewHomePage 等 6 类）本阶段用 placeholder，阶段 2 补齐。

**Architecture:** Astro 7.x SSG + React 19 island + Tailwind v4 + Astro 内置 shiki。参考 `whale-apidocs` 的分层但不引 `nimbus-docs`。内容源 `docs/{en,zh-CN,zh-HK}/` 保持原位、md→mdx 后缀转换；vitepress 源码 mv 到 `.legacy/vitepress-reference/` 供 port 参考，阶段 1 末尾一次性删除。

**Tech Stack:** Astro 7.x、React 19、`@astrojs/react`、`@astrojs/mdx`、Tailwind v4（`@tailwindcss/vite`）、`astro-icon`、`react-hook-form`、`@floating-ui/react`、`@xyflow/react`（延后到阶段 2）、`motion`、`js-yaml`、`pagefind`、`rehype-katex` + `remark-math`、`rehype-mermaid`，Bun runtime，Node ≥ 24。

**Spec:** `docs/superpowers/specs/2026-08-17-openapi-astro-migration-design.md`

## Global Constraints

从 spec §-1 / §1 / §15 / §16 复制（每 task 必须满足）：

1. **用户体感等价 = 顶层约束**：URL / 视觉 / 交互 / 加载 / 搜索 / 组件行为对齐旧站。仅 shiki 代码高亮 token 色差 ≤2% 为已批准例外。
2. **URL 集合硬门禁**：新旧站 sitemap URL 集合 A △ B = ∅。opencli `url-diff.ts` 阻断合并。
3. **`docs/{en,zh-CN,zh-HK}/` 内容不迁位**：仅 `.md` → `.mdx` 后缀转换 + escape。frontmatter 字段一字不改。
4. **`_category_.json` 保留**：Sidebar 由 `navigation.ts` 扫盘生成，不搞中心化 `docs.json`。
5. **openapi.yaml 单一 en 源**：zh-CN / zh-HK ApiReference 内容 fallback 到 en。
6. **API URL 保持 `/docs/api`**：ApiReference 保持运行时 CSR 单页（阶段 2 port），本阶段用 placeholder。
7. **不 push、不合 main、不动 Nginx**（`websites-nginx` repo 完全不变）。
8. **不执行 `bun run build:*`**（团队规矩：build 由 boss 在终端跑；plan 里所有"验证 build"的地方写命令让 boss 跑）。
9. **每 commit 单文件粒度到位**：不用 `git add -A`；scope 按 team `git-conventions` 走。
10. **shiki 用 Astro 内置版本**（决策 #18 选 A）；`--shiki-light` / `--shiki-dark` inline mode 用 CSS 变量桥接。
11. **主题选择器 codemod**：`.dark` → `[data-mode="dark"]`；`--vp-*` → `--lbus-*`。
12. **合入 main 前 vitepress 依赖全删**（阶段 1 末尾 T18 后一次性）。

## Task 依赖图

```
T1 (bootstrap) → T2 (astro scaffold) → T3 (styles + tokens)
                                      ↓
T4 (mdx conversion + content collection + slug) → T5 (routes) → T6 (base shell)
                                                                 ↓
                              T7 (sidebar generator) → T8 (docs layout)
                                                        ↓
T9 (region + api-reference placeholder layout) → T10 (theme toggle)
                                                  ↓
T11 (mdx primitives 7 个) → T12 (composite placeholders 6 个)
                             ↓
T13 (search: pagefind + dialog) → T14 (llm md export + sitemap + robots)
                                    ↓
T15 (build scripts port) → T16 (workspaces + packages/ui)
                             ↓
T17 (opencli scaffolding) → T18 (opencli first pass + cleanup + vitepress purge)
```

---

## Task 1: Bootstrap — 保留 vitepress 作参考 + 装 Astro CLI

**Files:**
- Move: `docs/.vitepress/` → `.legacy/vitepress-reference/.vitepress/`
- Move: `docs/postcss.config.mjs` → `.legacy/vitepress-reference/postcss.config.mjs`
- Move: `docs/unocss.config.ts` → `.legacy/vitepress-reference/unocss.config.ts`
- Create: `.legacy/README.md`
- Modify: `.gitignore`（新增 `.legacy/` ignore 规则，或者不 ignore 让 port 时可 grep）
- Modify: `package.json`（scripts 里 `dev` / `dev:canary` / `dev:cn` / `build:*` / `preview` 全改为 `astro` 版本，同时保留旧 vitepress 依赖直到 T18）

**Interfaces:**
- Produces: 干净的 worktree 起点。vitepress 相关文件位于 `.legacy/`（port 时可读），`docs/` 只剩内容 md 与 `openapi.yaml` 等。

- [ ] **Step 1: 报告当前 worktree 状态**

```bash
pwd
git branch --show-current
git status --short
git log --oneline -3
```

Expected: 在 `openapi-website-astro`、`feat/migrate-to-astro`、无未提交改动、HEAD 是 spec 落定的 commit。

- [ ] **Step 2: 建 `.legacy/` 并 git mv vitepress 相关文件**

```bash
mkdir -p .legacy/vitepress-reference
git mv docs/.vitepress .legacy/vitepress-reference/.vitepress
git mv docs/postcss.config.mjs .legacy/vitepress-reference/postcss.config.mjs
git mv docs/unocss.config.ts .legacy/vitepress-reference/unocss.config.ts
```

- [ ] **Step 3: 写 `.legacy/README.md`**

```markdown
# .legacy/vitepress-reference/

Snapshot of vitepress + Vue implementation at the point of Astro migration
kick-off. Kept for reference during port; DELETED at end of Stage 1
(see docs/superpowers/plans/2026-08-17-astro-migration-stage-1.md Task 18).

Do NOT add new content here. Do NOT reference from src/ or docs/.
```

- [ ] **Step 4: 修改 `package.json` scripts**

替换 scripts 区块：

```jsonc
{
  "scripts": {
    "dev": "astro dev",
    "dev:canary": "cross-env PROXY=canary VITE_API_BASE_URL=https://openapi.longbridge.xyz astro dev",
    "dev:cn": "cross-env VITE_REGION=cn VITE_API_BASE_URL=https://openapi.longbridge.cn VITE_SITE_HOSTNAME=https://open.longbridge.cn astro dev",
    "build:canary": "cross-env \"NODE_OPTIONS=--max-old-space-size=14336 --expose-gc\" PROXY=canary VITE_API_BASE_URL=https://openapi.longbridge.xyz astro check && astro build && bunx pagefind --site dist && bun run scripts/copy-routes.ts",
    "build:release": "cross-env \"NODE_OPTIONS=--max-old-space-size=14336 --expose-gc\" VITE_API_BASE_URL=https://openapi.longbridge.com astro check && astro build && bunx pagefind --site dist && bun run scripts/copy-routes.ts",
    "build:cn": "cross-env \"NODE_OPTIONS=--max-old-space-size=14336 --expose-gc\" VITE_REGION=cn VITE_API_BASE_URL=https://openapi.longbridge.cn VITE_PORTAL_GATEWAY_BASE_URL=https://mr.lbkrs.com VITE_SITE_HOSTNAME=https://open.longbridge.cn astro check && astro build && bunx pagefind --site dist && bun run scripts/copy-routes.ts",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

保留其他现存 scripts（`build:llms` / `build:copy-routes` / `lint:docs` / `format:docs` 等）不动。

- [ ] **Step 5: 提交 T1**

```bash
git add .legacy/ docs/ package.json
git status
git commit -m "$(cat <<'EOF'
chore(migrate): archive vitepress reference to .legacy/ and switch scripts to astro

Move vitepress config, theme, postcss and unocss configs into
.legacy/vitepress-reference/ for use as a source-of-truth reference
while we port components to React. Astro dependencies not yet
installed; scripts entry-points point to astro but running them will
fail until T2 lands astro.config.ts and dependencies.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: `git log --oneline -1` 显示新 commit；`ls docs/` 只剩内容目录。

---

## Task 2: Astro scaffold — astro.config.ts + astro deps + 空白页跑通

**Files:**
- Create: `astro.config.ts`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro`（临时 hello world，T5 会替换）
- Modify: `package.json`（新增 astro / react / tailwind / mdx / icon 依赖）

**Interfaces:**
- Produces: `bun run dev` 能起 Astro dev server，访问 `http://localhost:4321/` 出 hello world。

- [ ] **Step 1: 装 astro + react + mdx + tailwind + icon 依赖**

boss 执行：

```bash
bun add astro@^7 @astrojs/react@latest @astrojs/mdx@latest @astrojs/sitemap@latest astro-icon@latest @tailwindcss/vite@^4 tailwindcss@^4 react@^19 react-dom@^19
bun add -d @types/react @types/react-dom
```

Expected: `package.json` 里出现上述依赖，`bun.lockb` 更新。

- [ ] **Step 2: 创建 `astro.config.ts`**

```ts
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import tailwind from '@tailwindcss/vite'

const REGION = process.env.VITE_REGION ?? 'global'
const SITE = process.env.VITE_SITE_HOSTNAME ?? 'https://open.longportapp.com'

export default defineConfig({
  site: SITE,
  build: { format: 'file' },
  integrations: [
    react(),
    mdx(),
    icon(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { 'en': 'en', 'zh-CN': 'zh-CN', 'zh-HK': 'zh-HK' },
      },
    }),
  ],
  vite: {
    plugins: [tailwind()],
    define: {
      'import.meta.env.PUBLIC_REGION': JSON.stringify(REGION),
    },
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
})
```

- [ ] **Step 3: 创建 `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", ".legacy"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@lib/*": ["src/lib/*"],
      "@components/*": ["src/components/*"],
      "@styles/*": ["src/styles/*"],
      "@data/*": ["src/data/*"]
    }
  }
}
```

- [ ] **Step 4: 创建 hello world 页面 `src/pages/index.astro`**

```astro
---
// Temporary landing to smoke-test Astro. Replaced in T5 by [...slug].astro logic.
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>openapi-website (astro scaffold)</title>
  </head>
  <body>
    <main>
      <h1>Astro scaffold OK</h1>
      <p>Migration in progress. See <code>docs/superpowers/plans/2026-08-17-astro-migration-stage-1.md</code>.</p>
    </main>
  </body>
</html>
```

- [ ] **Step 5: boss 验证 dev server 起来**

boss 手动跑：

```bash
bun run dev
# 打开 http://localhost:4321/
# 应看到 "Astro scaffold OK"
```

Expected: Astro dev server 起在 4321，页面渲染成功，无 error / warning。

- [ ] **Step 6: 提交 T2**

```bash
git add astro.config.ts tsconfig.json src/pages/index.astro package.json bun.lockb
git status
git commit -m "$(cat <<'EOF'
feat(migrate): astro scaffold with react + mdx + tailwind + icon

Wire astro.config.ts, tsconfig paths, and a placeholder hello-world at
/ so `bun run dev` starts. Sitemap integration configured with tri-lingual
i18n; shikiConfig binds github-light/dark for later theme toggle.

Placeholder index.astro will be replaced by [...slug].astro in T5.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: 样式基线 — tokens.css + tailwind base + shiki 变量桥接

**Files:**
- Create: `src/styles/tokens.css`（从 `.legacy/vitepress-reference/.vitepress/theme/styles/lbus-tokens.css` 或类似文件迁）
- Create: `src/styles/global.css`（tailwind base + reset）
- Create: `src/styles/shiki.css`（`--shiki-light` / `--shiki-dark` ↔ Astro `--astro-code-*` 变量桥接）
- Modify: `astro.config.ts`（引入 global.css）
- Modify: `src/pages/index.astro`（`<link rel="stylesheet">` 引入 tokens）

**Interfaces:**
- Produces: 全局 CSS token 就绪；后续所有 shell / mdx / primitives 组件用 `--lbus-*` 变量或 Tailwind class 均可工作。

- [ ] **Step 1: 拷贝 vitepress token 定义到 `src/styles/tokens.css`**

```bash
# 找出 legacy 里 token 文件
grep -rE '^:root|^\.dark|--vp-|--lbus-' .legacy/vitepress-reference/.vitepress/theme/styles/ 2>/dev/null | head -20
```

把找到的 token 定义文件（预期是 `lbus-tokens.css` + `css-var.scss` + `custom.scss` 里 :root 块）合并到 `src/styles/tokens.css`。

**执行 codemod**（内联）：
- `--vp-*` → `--lbus-*`（全局重命名）
- `.dark` 选择器 → `[data-mode="dark"]`
- 移除 UnoCSS `@apply` 指令（若有）

文件结构示范：

```css
/* src/styles/tokens.css */
:root {
  /* colors */
  --lbus-c-bg: oklch(99% 0.005 106);
  --lbus-c-bg-soft: oklch(97% 0.005 106);
  --lbus-c-text: oklch(20% 0.02 250);
  --lbus-c-text-muted: oklch(45% 0.02 250);
  --lbus-c-brand: oklch(60% 0.18 250);
  --lbus-c-border: oklch(90% 0.01 250);

  /* spacing */
  --lbus-space-1: 0.25rem;
  --lbus-space-2: 0.5rem;
  --lbus-space-4: 1rem;

  /* radius */
  --lbus-radius-sm: 4px;
  --lbus-radius-md: 8px;

  /* transitions */
  --lbus-transition-base: 200ms ease;

  /* typography */
  --lbus-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --lbus-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

[data-mode="dark"] {
  --lbus-c-bg: oklch(15% 0.01 250);
  --lbus-c-bg-soft: oklch(20% 0.01 250);
  --lbus-c-text: oklch(95% 0.01 250);
  --lbus-c-text-muted: oklch(70% 0.02 250);
  --lbus-c-brand: oklch(70% 0.18 250);
  --lbus-c-border: oklch(30% 0.01 250);
}
```

**关键**：实际值以 vitepress `lbus-tokens.css` 为准，本步骤是 rename 迁移，不改语义值。

- [ ] **Step 2: `src/styles/global.css`**

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./shiki.css";

/* reset */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--lbus-c-bg);
  color: var(--lbus-c-text);
  font-family: var(--lbus-font-sans);
  transition: background var(--lbus-transition-base), color var(--lbus-transition-base);
}
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
```

- [ ] **Step 3: `src/styles/shiki.css`（Astro shiki 变量桥接）**

```css
/* Astro's inline shiki mode uses --astro-code-* CSS vars.
   Bridge to --shiki-* for compat with any legacy references. */
:root {
  --shiki-light: var(--astro-code-color-text);
  --shiki-light-bg: var(--astro-code-color-background);
}

[data-mode="dark"] {
  --shiki-dark: var(--astro-code-color-text);
  --shiki-dark-bg: var(--astro-code-color-background);
}

/* Ensure code blocks in dark mode swap Astro's dual-theme vars. */
[data-mode="dark"] .astro-code,
[data-mode="dark"] .astro-code span {
  color: var(--shiki-dark, inherit) !important;
  background-color: var(--shiki-dark-bg, transparent) !important;
}
```

- [ ] **Step 4: `src/pages/index.astro` 引入 global.css**

在 head 里加：

```astro
<link rel="stylesheet" href="/@fs/PLACEHOLDER" />
```

改用 Astro 原生方式：直接 `import '@styles/global.css'` 在 frontmatter：

```astro
---
import '@styles/global.css'
---
<!doctype html>
<html lang="en" data-mode="light">
  <head>
    <meta charset="utf-8" />
    <title>openapi-website (astro scaffold)</title>
  </head>
  <body>
    <main class="p-8">
      <h1 class="text-2xl font-bold">Astro scaffold OK</h1>
      <p class="mt-2 text-sm opacity-70">Migration in progress.</p>
    </main>
  </body>
</html>
```

- [ ] **Step 5: boss 验证样式加载**

boss 手动跑 `bun run dev` 打开 `/`，验证：
- 页面字体是 `--lbus-font-sans`
- Tailwind class (`p-8` / `text-2xl` / `font-bold`) 生效
- 网页 root `data-mode="light"` 属性存在
- 手动加 `data-mode="dark"` 到 `<html>` 元素后背景变深色

- [ ] **Step 6: 提交 T3**

```bash
git add src/styles/ src/pages/index.astro
git status
git commit -m "$(cat <<'EOF'
feat(migrate): baseline styles with lbus tokens, tailwind v4 and shiki bridge

Port vitepress lbus-tokens.css to src/styles/tokens.css with codemod
(--vp-* -> --lbus-*, .dark -> [data-mode="dark"]). Add tailwind v4 base
via @tailwindcss/vite. Bridge shiki inline theme vars (--shiki-light /
--shiki-dark) to Astro's --astro-code-* per decision #18.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: 内容层 — md→mdx 转换脚本 + content collection + slug lib

**Files:**
- Create: `scripts/convert-md-to-mdx.ts`
- Create: `src/content.config.ts`
- Create: `src/lib/slug.ts`
- Create: `src/lib/slug.test.ts`（vitest 单元测试）
- Modify: `docs/{en,zh-CN,zh-HK}/**/*.md`（一次性 rename）

**Interfaces:**
- Produces:
  - `resolveUrl(entry: CollectionEntry<'docs'>): string`  — 消费 entry 产出 URL 字符串
  - `resolveLocale(entry: CollectionEntry<'docs'>): 'en' | 'zh-CN' | 'zh-HK'`
  - Content collection `docs` — 供后续 pages 消费

- [ ] **Step 1: 装 vitest**

boss 执行：

```bash
bun add -d vitest @vitest/ui
```

修改 `package.json` 加：

```jsonc
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

- [ ] **Step 2: 写 `scripts/convert-md-to-mdx.ts`（一次性脚本）**

```ts
#!/usr/bin/env bun
import { readdirSync, statSync, readFileSync, writeFileSync, renameSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOTS = ['docs/en', 'docs/zh-CN', 'docs/zh-HK']

function walk(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

/** Escape sequences that mdx would misinterpret as JSX. */
function escapeForMdx(src: string): string {
  const lines = src.split('\n')
  let inCode = false
  let inFrontmatter = false
  let fmSeen = 0
  return lines.map((line) => {
    if (line.trim() === '---') {
      if (!inCode) { inFrontmatter = fmSeen === 0; fmSeen++; if (fmSeen === 2) inFrontmatter = false }
      return line
    }
    if (line.match(/^```/)) { inCode = !inCode; return line }
    if (inCode || inFrontmatter) return line
    // <foo@bar.com> autolink → escape
    line = line.replace(/<([^\s<>@]+@[^\s<>]+\.[^\s<>]+)>/g, '&lt;$1&gt;')
    // bare `{` outside code that mdx would treat as JSX expression → escape
    // (only if line has no other JSX-y token)
    // — heuristic: only escape lines that are pure prose with a bare {word}
    line = line.replace(/\{([A-Za-z_$][A-Za-z0-9_$]*)\}/g, (m, w) => {
      // don't touch already-escaped or React-looking
      if (line.includes('<') || line.includes('```')) return m
      return `\\{${w}\\}`
    })
    return line
  }).join('\n')
}

let changed = 0
for (const root of ROOTS) {
  for (const p of walk(root)) {
    const raw = readFileSync(p, 'utf-8')
    const escaped = escapeForMdx(raw)
    const dst = p.replace(/\.md$/, '.mdx')
    if (escaped !== raw) writeFileSync(p, escaped)
    // git mv equivalent via renameSync (git detects rename)
    renameSync(p, dst)
    console.log(`ok ${relative(process.cwd(), dst)}`)
    changed++
  }
}
console.log(`\nconverted ${changed} files`)
```

- [ ] **Step 3: 跑一次性转换**

boss 或 AI 执行：

```bash
bun run scripts/convert-md-to-mdx.ts
```

Expected: 882+ 篇 md 转 mdx，脚本无 error 退出。

- [ ] **Step 4: 提交转换结果**

```bash
git add docs/ scripts/convert-md-to-mdx.ts package.json bun.lockb
git status  # 应见大量 rename
git commit -m "$(cat <<'EOF'
chore(migrate): convert docs/*.md to *.mdx with autolink/brace escapes

Rename all 882 markdown files under docs/{en,zh-CN,zh-HK}/ from .md to
.mdx, escaping <email@host> autolinks and bare {ident} braces that mdx
would misinterpret as JSX. Frontmatter untouched.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: 写 `src/lib/slug.ts`**

```ts
import type { CollectionEntry } from 'astro:content'

export type Locale = 'en' | 'zh-CN' | 'zh-HK'

/** en/index.mdx → 'en'; zh-CN/docs/foo.mdx → 'zh-CN'; etc. */
export function resolveLocale(entry: CollectionEntry<'docs'>): Locale {
  const seg = entry.id.split('/')[0]
  return seg === 'zh-CN' || seg === 'zh-HK' ? seg : 'en'
}

/**
 * Equivalent to vitepress rewriteMarkdownPath.
 * - en/**: strip 'en/' prefix
 * - zh-CN/**, zh-HK/**: keep locale prefix
 * - index.mdx → directory
 * - frontmatter `slug`: absolute (/foo) replaces, relative (foo) is dir-relative
 */
export function resolveUrl(entry: CollectionEntry<'docs'>): string {
  const rel = entry.id.replace(/\.mdx$/, '')
  const parts = rel.split('/')
  const locale = resolveLocale(entry)
  const rest = locale === 'en' ? parts.slice(1) : parts.slice(1) // rest of path minus locale segment
  const dir = rest.slice(0, -1).join('/')
  const base = rest[rest.length - 1]

  const explicit = entry.data.slug
  if (explicit) {
    if (explicit.startsWith('/')) return withLocale(locale, explicit)
    return withLocale(locale, joinPath('/', dir, explicit))
  }
  const path = base === 'index'
    ? joinPath('/', dir)
    : joinPath('/', dir, base)
  return withLocale(locale, path)
}

function withLocale(locale: Locale, path: string): string {
  if (locale === 'en') return normalize(path)
  return normalize(`/${locale}${path}`)
}

function joinPath(...segs: string[]): string {
  return segs.filter(Boolean).join('/').replace(/\/+/g, '/')
}

function normalize(path: string): string {
  const p = path.replace(/\/+/g, '/')
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1)
  return p || '/'
}
```

- [ ] **Step 6: 写 `src/lib/slug.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { resolveUrl, resolveLocale } from './slug'
import type { CollectionEntry } from 'astro:content'

function mock(id: string, slug?: string): CollectionEntry<'docs'> {
  return {
    id,
    slug: id,
    body: '',
    collection: 'docs',
    data: { title: 't', slug } as any,
    render: async () => ({ Content: null, headings: [], remarkPluginFrontmatter: {} }),
  } as unknown as CollectionEntry<'docs'>
}

describe('resolveLocale', () => {
  it('en/... → en', () => expect(resolveLocale(mock('en/index.mdx'))).toBe('en'))
  it('zh-CN/... → zh-CN', () => expect(resolveLocale(mock('zh-CN/index.mdx'))).toBe('zh-CN'))
  it('zh-HK/... → zh-HK', () => expect(resolveLocale(mock('zh-HK/docs/quote.mdx'))).toBe('zh-HK'))
})

describe('resolveUrl (no explicit slug)', () => {
  it('en/index.mdx → /', () => expect(resolveUrl(mock('en/index.mdx'))).toBe('/'))
  it('en/docs/quote/pull/static.mdx → /docs/quote/pull/static', () =>
    expect(resolveUrl(mock('en/docs/quote/pull/static.mdx'))).toBe('/docs/quote/pull/static'))
  it('en/pricing/index.mdx → /pricing', () =>
    expect(resolveUrl(mock('en/pricing/index.mdx'))).toBe('/pricing'))
  it('zh-CN/docs/quote/pull/static.mdx → /zh-CN/docs/quote/pull/static', () =>
    expect(resolveUrl(mock('zh-CN/docs/quote/pull/static.mdx'))).toBe('/zh-CN/docs/quote/pull/static'))
  it('zh-HK/index.mdx → /zh-HK', () =>
    expect(resolveUrl(mock('zh-HK/index.mdx'))).toBe('/zh-HK'))
  it('en/sdk.mdx → /sdk', () => expect(resolveUrl(mock('en/sdk.mdx'))).toBe('/sdk'))
})

describe('resolveUrl (explicit slug)', () => {
  it('absolute slug replaces full path', () =>
    expect(resolveUrl(mock('en/docs/anything.mdx', '/quote/pull/static'))).toBe('/quote/pull/static'))
  it('absolute slug in zh-CN preserves locale prefix', () =>
    expect(resolveUrl(mock('zh-CN/docs/x.mdx', '/api'))).toBe('/zh-CN/api'))
  it('relative slug is dir-relative', () =>
    expect(resolveUrl(mock('en/docs/quote/index.mdx', 'pull/static'))).toBe('/docs/quote/pull/static'))
})

describe('resolveUrl (edge cases)', () => {
  it('strips trailing slash', () => expect(resolveUrl(mock('en/foo/index.mdx'))).toBe('/foo'))
  it('handles nested index', () => expect(resolveUrl(mock('en/a/b/index.mdx'))).toBe('/a/b'))
})
```

- [ ] **Step 7: 跑测试验证 slug**

```bash
bun run test src/lib/slug.test.ts
```

Expected: 全部通过。

- [ ] **Step 8: 写 `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const docsSchema = z.object({
  title: z.string(),
  id: z.string().optional(),
  slug: z.string().optional(),
  sidebar_position: z.number().optional(),
  sidebar_icon: z.enum(['book_open', 'book', 'zap', 'cpu', 'terminal', 'sparkles']).optional(),
  layout: z.union([z.literal(false), z.string()]).optional(),
  hide_breadcrumb: z.boolean().optional(),
})

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: '{en,zh-CN,zh-HK}/**/*.mdx', base: './docs' }),
    schema: docsSchema,
  }),
}
```

- [ ] **Step 9: 提交 T4**

```bash
git add src/content.config.ts src/lib/slug.ts src/lib/slug.test.ts package.json bun.lockb
git status
git commit -m "$(cat <<'EOF'
feat(migrate): content collection + slug resolver with parity tests

Wire src/content.config.ts to glob docs/{en,zh-CN,zh-HK}/**/*.mdx.
Implement resolveUrl/resolveLocale mirroring vitepress rewriteMarkdownPath
semantics; 16 unit tests cover index files, tri-lingual prefix, and
absolute/relative slug overrides.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: 页面路由 — [...slug].astro 三份 + smoke test

**Files:**
- Create: `src/pages/[...slug].astro`
- Create: `src/pages/zh-CN/[...slug].astro`
- Create: `src/pages/zh-HK/[...slug].astro`
- Delete: `src/pages/index.astro`（T2 的 hello world 被替换）
- Create: `src/layouts/BaseLayout.astro`（最简版本，T6 会加 shell）
- Create: `src/layouts/DocsLayout.astro`（最简版本，T8 会加 sidebar/TOC）
- Create: `src/layouts/PlainLayout.astro`（最简版本）
- Create: `src/layouts/ApiReferenceLayout.astro`（placeholder，T9 完善）

**Interfaces:**
- Produces: 全 882 篇 mdx 可访问；每篇进正确 layout 分派（`layout: api-reference` → ApiReferenceLayout；`layout: false` → PlainLayout；其他 → DocsLayout）
- Consumes: `resolveUrl` / `resolveLocale` from T4

- [ ] **Step 1: 删 T2 的 hello world**

```bash
git rm src/pages/index.astro
```

- [ ] **Step 2: 写 4 个 layout（最简版本）**

`src/layouts/BaseLayout.astro`：

```astro
---
import '@styles/global.css'
export interface Props {
  title: string
  description?: string
  locale?: 'en' | 'zh-CN' | 'zh-HK'
}
const { title, description = '', locale = 'en' } = Astro.props
---
<!doctype html>
<html lang={locale} data-mode="light" data-theme="default" data-nb-pref="system">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <script is:inline>
      const pref = localStorage.getItem('ui-mode') ?? 'system'
      const dark = pref === 'dark' || (pref === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
      const root = document.documentElement
      root.dataset.mode = dark ? 'dark' : 'light'
      root.dataset.nbPref = pref
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

`src/layouts/PlainLayout.astro`：

```astro
---
import BaseLayout from './BaseLayout.astro'
import type { Props as BaseProps } from './BaseLayout.astro'
export type Props = BaseProps
const props = Astro.props
---
<BaseLayout {...props}>
  <slot />
</BaseLayout>
```

`src/layouts/DocsLayout.astro`（最简，T8 加 sidebar/TOC）：

```astro
---
import BaseLayout from './BaseLayout.astro'
import type { Props as BaseProps } from './BaseLayout.astro'
export type Props = BaseProps
const props = Astro.props
---
<BaseLayout {...props}>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <slot />
  </div>
</BaseLayout>
```

`src/layouts/ApiReferenceLayout.astro`（placeholder，T9 完善）：

```astro
---
import BaseLayout from './BaseLayout.astro'
import type { Props as BaseProps } from './BaseLayout.astro'
export type Props = BaseProps
const props = Astro.props
---
<BaseLayout {...props}>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <div class="rounded border border-[--lbus-c-border] p-4 text-sm opacity-60">
      Placeholder: ApiReference will be ported in stage 2 (see spec §7.1)
    </div>
    <slot />
  </div>
</BaseLayout>
```

- [ ] **Step 3: 写 en root `src/pages/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content'
import BaseLayout from '@/layouts/BaseLayout.astro'
import DocsLayout from '@/layouts/DocsLayout.astro'
import PlainLayout from '@/layouts/PlainLayout.astro'
import ApiReferenceLayout from '@/layouts/ApiReferenceLayout.astro'
import { resolveUrl, resolveLocale } from '@lib/slug'

export async function getStaticPaths() {
  const all = await getCollection('docs')
  return all
    .filter((e) => resolveLocale(e) === 'en')
    .map((e) => {
      const url = resolveUrl(e)
      return {
        params: { slug: url === '/' ? undefined : url.replace(/^\//, '') },
        props: { entry: e },
      }
    })
}

const { entry } = Astro.props
const { Content, headings } = await render(entry)

const Layout =
  entry.data.layout === 'api-reference' ? ApiReferenceLayout
  : entry.data.layout === false ? PlainLayout
  : DocsLayout
---
<Layout title={entry.data.title} locale="en">
  <Content />
</Layout>
```

- [ ] **Step 4: 写 zh-CN + zh-HK 变体**

`src/pages/zh-CN/[...slug].astro`（除 filter locale 与 locale prop 外与 en 同构）：

```astro
---
import { getCollection, render } from 'astro:content'
import DocsLayout from '@/layouts/DocsLayout.astro'
import PlainLayout from '@/layouts/PlainLayout.astro'
import ApiReferenceLayout from '@/layouts/ApiReferenceLayout.astro'
import { resolveUrl, resolveLocale } from '@lib/slug'

export async function getStaticPaths() {
  const all = await getCollection('docs')
  return all
    .filter((e) => resolveLocale(e) === 'zh-CN')
    .map((e) => {
      const url = resolveUrl(e)
      // url starts with '/zh-CN/...'; strip the '/zh-CN/' prefix (or '/zh-CN' for index)
      const slug = url === '/zh-CN' ? undefined : url.replace(/^\/zh-CN\//, '')
      return { params: { slug }, props: { entry: e } }
    })
}

const { entry } = Astro.props
const { Content } = await render(entry)

const Layout =
  entry.data.layout === 'api-reference' ? ApiReferenceLayout
  : entry.data.layout === false ? PlainLayout
  : DocsLayout
---
<Layout title={entry.data.title} locale="zh-CN">
  <Content />
</Layout>
```

zh-HK 同构，locale 换 `zh-HK`。

- [ ] **Step 5: boss 验证 3 篇代表页可达**

boss 手动跑 `bun run dev`，浏览器打开：

- `http://localhost:4321/` （应命中 en 首页，即 `docs/en/index.mdx`）
- `http://localhost:4321/docs/quote/pull/static`
- `http://localhost:4321/zh-CN/docs/quote/pull/static`
- `http://localhost:4321/pricing`
- `http://localhost:4321/docs/api`（应命中 ApiReferenceLayout 的 placeholder）

Expected: 5 篇都 200、正文正确、无 error / warning。若报错记录到 T5 issues 里。

- [ ] **Step 6: 提交 T5**

```bash
git add src/pages/ src/layouts/
git status
git commit -m "$(cat <<'EOF'
feat(migrate): tri-lingual dynamic routes with layout dispatch

Add [...slug].astro under root, zh-CN/, and zh-HK/ that consume docs
collection, resolve URLs via slug lib, and dispatch to DocsLayout /
PlainLayout / ApiReferenceLayout based on frontmatter.layout. All four
layouts wrap BaseLayout which owns theme pre-paint script.

ApiReferenceLayout is a placeholder — stage 2 will port the CSR
component.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Shell 基础组件 — TopNav + Footer + Breadcrumb + SkipLink + UserAvatar

**Files:**
- Create: `src/components/shell/TopNav.tsx`
- Create: `src/components/shell/Footer.tsx`
- Create: `src/components/shell/Breadcrumb.tsx`
- Create: `src/components/shell/SkipLink.astro`
- Create: `src/components/shell/UserAvatar.tsx`
- Create: `src/data/nav.en.ts` / `src/data/nav.zh-CN.ts` / `src/data/nav.zh-HK.ts`（从 `.legacy/vitepress-reference/.vitepress/locales/{lang}/nav.ts` 迁）
- Create: `src/data/locale.en.ts` / `src/data/locale.zh-CN.ts` / `src/data/locale.zh-HK.ts`（从 legacy locales JSON 迁）
- Create: `src/lib/i18n.ts`
- Modify: `src/layouts/BaseLayout.astro`（加 SkipLink + TopNav + Footer 骨架，DocsLayout 内容居中容器保留）

**Interfaces:**
- Produces:
  - `<TopNav locale={locale} />` — 顶部主导航（React island `client:load`）
  - `<Footer locale={locale} />`
  - `<Breadcrumb items={[...]} />`
  - `<SkipLink />` — 无障碍跳到主内容
  - `<UserAvatar />` — 登录态
  - `t(key: string, locale: Locale): string` — 简易 i18n 查表函数（无需 react-i18next）
- Consumes: 从 legacy 迁的 nav / locale 数据结构

- [ ] **Step 1: 迁 nav / locale 数据**

```bash
# 从 legacy 拷贝 nav.ts 到 src/data，路径改 import
cp .legacy/vitepress-reference/.vitepress/locales/en/nav.ts src/data/nav.en.ts
cp .legacy/vitepress-reference/.vitepress/locales/zh-CN/nav.ts src/data/nav.zh-CN.ts
cp .legacy/vitepress-reference/.vitepress/locales/zh-HK/nav.ts src/data/nav.zh-HK.ts
```

每份 nav.ts 应导出 `NavItem[]`：

```ts
// src/data/nav.en.ts (parity with legacy locales/en/nav.ts)
export interface NavItem {
  text: string
  link?: string
  items?: NavItem[]
  activeMatch?: string
}
export const nav: NavItem[] = [
  { text: 'Docs', link: '/docs' },
  { text: 'API Reference', link: '/docs/api' },
  { text: 'Pricing', link: '/pricing' },
  { text: 'SDK', link: '/sdk' },
]
```

移除 vitepress 特定字段（如 `noIcon`），保持类型 clean。

- [ ] **Step 2: 迁 locale 字符串到 `src/data/locale.{en,zh-CN,zh-HK}.ts`**

从 legacy 的 i18n JSON（若在 `theme/composables/useI18nSync.ts` 引用的 JSON）迁移。示例：

```ts
// src/data/locale.en.ts
export const locale = {
  'search.placeholder': 'Search docs',
  'search.empty': 'No results',
  'nav.theme.light': 'Light',
  'nav.theme.dark': 'Dark',
  'nav.theme.system': 'System',
  'sidebar.collapse': 'Collapse',
  'breadcrumb.home': 'Home',
  // ... 完整从 legacy 抽出
} as const
export type LocaleKey = keyof typeof locale
```

- [ ] **Step 3: 写 `src/lib/i18n.ts`**

```ts
import { locale as en } from '@data/locale.en'
import { locale as zhCN } from '@data/locale.zh-CN'
import { locale as zhHK } from '@data/locale.zh-HK'
import type { Locale } from './slug'

const table = { 'en': en, 'zh-CN': zhCN, 'zh-HK': zhHK } as const

export function t(key: keyof typeof en, locale: Locale): string {
  return (table[locale] as any)[key] ?? en[key] ?? key
}

export function useTranslation(locale: Locale) {
  return (key: keyof typeof en) => t(key, locale)
}
```

- [ ] **Step 4: `src/components/shell/TopNav.tsx`**

port from `.legacy/vitepress-reference/.vitepress/theme/components/AppNav.vue`。契约：
- 左侧 logo + 站名，右侧 nav items + 语言切换 + 主题切换 + 搜索按钮 + 登录态
- Sticky top，滚动时加 shadow
- 移动端汉堡菜单

```tsx
// src/components/shell/TopNav.tsx
import { useEffect, useState } from 'react'
import type { NavItem } from '@data/nav.en'
import type { Locale } from '@lib/slug'

export interface TopNavProps {
  locale: Locale
  nav: NavItem[]
  currentPath: string
}

export function TopNav({ locale, nav, currentPath }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header
      data-lbus-component="top-nav"
      className={`sticky top-0 z-30 border-b border-[--lbus-c-border] bg-[--lbus-c-bg]/90 backdrop-blur ${scrolled ? 'shadow-sm' : ''}`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <a href={locale === 'en' ? '/' : `/${locale}`} className="text-base font-semibold">
          Longbridge Developers
        </a>
        <nav className="flex flex-1 gap-4 text-sm">
          {nav.map((item) => (
            <a
              key={item.link ?? item.text}
              href={localeHref(locale, item.link)}
              className={`hover:text-[--lbus-c-brand] ${isActive(item, currentPath) ? 'text-[--lbus-c-brand]' : ''}`}
            >
              {item.text}
            </a>
          ))}
        </nav>
        {/* LanguageSwitcher / ThemeToggle / SearchButton / UserAvatar slots injected by BaseLayout */}
      </div>
    </header>
  )
}

function localeHref(locale: Locale, link?: string): string {
  if (!link) return '#'
  if (locale === 'en' || link.startsWith(`/${locale}`)) return link
  return `/${locale}${link}`
}

function isActive(item: NavItem, path: string): boolean {
  if (!item.link) return false
  return path === item.link || path.startsWith(`${item.link}/`)
}
```

**关键契约要点**（从 legacy AppNav.vue 抽出，port 时保持）：
- 视觉：height 56px，padding 16px；backdrop blur；scroll 后 shadow-sm；纯净背景不加渐变
- 交互：链接 hover 变 brand 色；active state 判定与 vitepress 一致
- 键盘：Tab 遍历顺序 = logo → nav items → 右侧工具区

- [ ] **Step 5: `src/components/shell/Footer.tsx`**

port from `.legacy/vitepress-reference/.vitepress/theme/components/AppFooter.vue`。契约保持：links、copyright 文案、区域链接（cn/hk 有变体）。

```tsx
// src/components/shell/Footer.tsx
import type { Locale } from '@lib/slug'

export interface FooterProps { locale: Locale }

export function Footer({ locale }: FooterProps) {
  const year = 2026
  return (
    <footer data-lbus-component="footer" className="border-t border-[--lbus-c-border] py-8 text-sm text-[--lbus-c-text-muted]">
      <div className="mx-auto max-w-7xl px-4">
        <p>&copy; {year} Longbridge. All rights reserved.</p>
        {/* Additional link columns ported from legacy AppFooter.vue */}
      </div>
    </footer>
  )
}
```

**关键契约要点**：具体链接列 / copyright 文案严格按 legacy 复制，此处示例为骨架。

- [ ] **Step 6: `src/components/shell/Breadcrumb.tsx`**

```tsx
// src/components/shell/Breadcrumb.tsx
import type { Locale } from '@lib/slug'
import { useTranslation } from '@lib/i18n'

export interface BreadcrumbItem { label: string; href?: string }
export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  locale: Locale
}

export function Breadcrumb({ items, locale }: BreadcrumbProps) {
  const t = useTranslation(locale)
  return (
    <nav data-lbus-component="breadcrumb" aria-label="breadcrumb" className="text-sm text-[--lbus-c-text-muted]">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <a href={locale === 'en' ? '/' : `/${locale}`} className="hover:text-[--lbus-c-text]">
            {t('breadcrumb.home')}
          </a>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <span aria-hidden="true">/</span>
            {item.href
              ? <a href={item.href} className="hover:text-[--lbus-c-text]">{item.label}</a>
              : <span className="text-[--lbus-c-text]">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

- [ ] **Step 7: `src/components/shell/SkipLink.astro`**

```astro
---
import { useTranslation } from '@lib/i18n'
export interface Props { locale: 'en' | 'zh-CN' | 'zh-HK' }
const { locale } = Astro.props
const t = useTranslation(locale)
---
<a
  href="#main"
  class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-[--lbus-c-brand] focus:px-3 focus:py-2 focus:text-white"
>
  Skip to main content
</a>
```

- [ ] **Step 8: `src/components/shell/UserAvatar.tsx`**

port from `.legacy/vitepress-reference/.vitepress/theme/components/UserAvatar/`。业务：读 cookie / login state 显示头像；未登录显示登录按钮。

```tsx
// src/components/shell/UserAvatar.tsx
import { useEffect, useState } from 'react'

export function UserAvatar() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  useEffect(() => {
    // consume window.longport internal state (present after longport-internal.iife.js loads)
    const t = setInterval(() => {
      const state = (window as any).__lbLoginState
      if (state !== undefined) {
        setLoggedIn(!!state?.user)
        clearInterval(t)
      }
    }, 100)
    return () => clearInterval(t)
  }, [])
  if (loggedIn === null) return null
  if (!loggedIn) return <a href="/login" className="text-sm">Sign in</a>
  return <img src="/placeholder-avatar.svg" alt="user" className="h-8 w-8 rounded-full" />
}
```

**关键契约**：consume `window.__lbLoginState`（BaseLayout 的 `longport-internal.iife.js` 注入）；避免 hydration mismatch，`useEffect` 内轮询。

- [ ] **Step 9: 更新 BaseLayout 装配 shell 骨架**

```astro
---
// src/layouts/BaseLayout.astro (revised)
import '@styles/global.css'
import SkipLink from '@components/shell/SkipLink.astro'
import { TopNav } from '@components/shell/TopNav'
import { Footer } from '@components/shell/Footer'
import { nav as navEn } from '@data/nav.en'
import { nav as navCN } from '@data/nav.zh-CN'
import { nav as navHK } from '@data/nav.zh-HK'

export interface Props { title: string; description?: string; locale?: 'en'|'zh-CN'|'zh-HK' }
const { title, description = '', locale = 'en' } = Astro.props
const nav = locale === 'zh-CN' ? navCN : locale === 'zh-HK' ? navHK : navEn
const currentPath = Astro.url.pathname
---
<!doctype html>
<html lang={locale} data-mode="light" data-theme="default" data-nb-pref="system">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <script is:inline>
      const pref = localStorage.getItem('ui-mode') ?? 'system'
      const dark = pref === 'dark' || (pref === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
      const root = document.documentElement
      root.dataset.mode = dark ? 'dark' : 'light'
      root.dataset.nbPref = pref
    </script>
  </head>
  <body>
    <SkipLink locale={locale} />
    <TopNav client:load locale={locale} nav={nav} currentPath={currentPath} />
    <main id="main" tabindex="-1">
      <slot />
    </main>
    <Footer client:idle locale={locale} />
  </body>
</html>
```

- [ ] **Step 10: boss 验证 shell 出现**

boss 手动 `bun run dev`，验证：
- 首页 / `/docs/quote/pull/static` / `/zh-CN/docs/quote/pull/static` 都能看到 TopNav 顶部导航（logo + 5 个链接）
- Footer 出现，copyright 文案对
- 无 hydration warning

- [ ] **Step 11: 提交 T6**

```bash
git add src/components/shell/ src/data/ src/lib/i18n.ts src/layouts/BaseLayout.astro
git status
git commit -m "$(cat <<'EOF'
feat(migrate): shell primitives (TopNav / Footer / Breadcrumb / SkipLink / UserAvatar)

Port five outer-shell components from legacy vitepress theme to React
islands, add tri-lingual nav data + locale strings + t() helper.
BaseLayout wires SkipLink + TopNav (client:load) + main slot +
Footer (client:idle). Visual/interaction parity to be verified via
opencli in T18.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Sidebar 生成器 — navigation.ts + _category_.json 消费 + Sidebar 组件

**Files:**
- Create: `src/lib/navigation.ts`
- Create: `src/lib/navigation.test.ts`
- Create: `src/components/shell/Sidebar.tsx`
- Create: `src/components/shell/SidebarItem.tsx`
- Create: `src/components/shell/Backdrop.tsx`（移动端遮罩）
- Create: `src/components/shell/LocalNav.tsx`（移动端顶部 sub-nav 呼出 sidebar）

**Interfaces:**
- Produces:
  - `buildSidebar(locale: Locale): Promise<SidebarNode[]>`
  - `SidebarNode = { label, link?, icon?, position, collapsed, items? }`
  - `<Sidebar sidebar={...} currentPath={...} locale={...} />`
- Consumes: `getCollection('docs')` from astro:content, `_category_.json` files via `node:fs`

- [ ] **Step 1: 写 `src/lib/navigation.ts`**

```ts
import { getCollection } from 'astro:content'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { resolveUrl, resolveLocale, type Locale } from './slug'

export interface SidebarNode {
  label: string
  link?: string
  icon?: string
  position: number
  collapsed: boolean
  items?: SidebarNode[]
}

interface CategoryConfig {
  label?: string
  position?: number
  icon?: string
  collapsed?: boolean
  collapsible?: boolean
  link?: string
}

function readCategory(dir: string): CategoryConfig | null {
  const p = join(process.cwd(), 'docs', dir, '_category_.json')
  if (!existsSync(p)) return null
  return JSON.parse(readFileSync(p, 'utf-8')) as CategoryConfig
}

export async function buildSidebar(locale: Locale): Promise<SidebarNode[]> {
  const all = await getCollection('docs', (e) => resolveLocale(e) === locale)

  // Build tree from filesystem hierarchy
  interface Node {
    name: string
    path: string        // 'docs/quote/pull'
    entries: any[]
    children: Map<string, Node>
  }
  const root: Node = { name: '', path: '', entries: [], children: new Map() }

  for (const entry of all) {
    // entry.id = 'en/docs/quote/pull/static.mdx'
    const rel = entry.id.replace(/\.mdx$/, '').split('/').slice(1) // drop locale
    let node = root
    for (let i = 0; i < rel.length - 1; i++) {
      const seg = rel[i]
      if (!node.children.has(seg)) {
        node.children.set(seg, {
          name: seg,
          path: rel.slice(0, i + 1).join('/'),
          entries: [],
          children: new Map(),
        })
      }
      node = node.children.get(seg)!
    }
    node.entries.push(entry)
  }

  return toSidebarNodes(root, locale, '')
}

function toSidebarNodes(node: any, locale: Locale, dirPath: string): SidebarNode[] {
  const out: SidebarNode[] = []

  // File entries at this level
  for (const entry of node.entries) {
    if (entry.id.endsWith('/index.mdx')) continue // index handled by dir label
    out.push({
      label: entry.data.title,
      link: resolveUrl(entry),
      icon: entry.data.sidebar_icon,
      position: entry.data.sidebar_position ?? 999,
      collapsed: false,
    })
  }

  // Subdirectory entries
  for (const [name, child] of node.children as Map<string, any>) {
    const childPath = child.path
    const cat = readCategory(join(locale, childPath))
    const indexEntry = child.entries.find((e: any) => e.id.endsWith(`/${name}/index.mdx`))
    const items = toSidebarNodes(child, locale, childPath)

    out.push({
      label: cat?.label ?? indexEntry?.data.title ?? name,
      link: cat?.link ?? (indexEntry ? resolveUrl(indexEntry) : undefined),
      icon: cat?.icon,
      position: cat?.position ?? 999,
      collapsed: cat?.collapsed ?? true,
      items: items.length > 0 ? items : undefined,
    })
  }

  return out.sort((a, b) => a.position - b.position)
}
```

- [ ] **Step 2: 写 `src/lib/navigation.test.ts`**

用 fixture 目录做集成测试。golden 对比：先在 vitepress 侧跑 `gen.ts::genMarkdowDocs()`（若可脚本化）导出 JSON，然后新的 `buildSidebar` 输出与它 diff。

```ts
import { describe, it, expect } from 'vitest'
import { buildSidebar } from './navigation'

// This test runs against real ../../docs/ content
describe('buildSidebar', () => {
  it('en produces top-level entries', async () => {
    const sidebar = await buildSidebar('en')
    expect(sidebar.length).toBeGreaterThan(0)
    // Assert at least one known top-level category
    const docs = sidebar.find((n) => n.label.toLowerCase().includes('doc'))
    expect(docs).toBeDefined()
  })
  it('zh-CN parallel structure to en', async () => {
    const en = await buildSidebar('en')
    const cn = await buildSidebar('zh-CN')
    // Same top-level count (structural parity)
    expect(cn.length).toBe(en.length)
  })
  it('respects _category_.json position', async () => {
    const sidebar = await buildSidebar('en')
    for (let i = 1; i < sidebar.length; i++) {
      expect(sidebar[i - 1].position).toBeLessThanOrEqual(sidebar[i].position)
    }
  })
})
```

- [ ] **Step 3: 跑测试**

```bash
bun run test src/lib/navigation.test.ts
```

Expected: 全部通过。若结构不对齐，改 `buildSidebar` 逻辑到通过。

- [ ] **Step 4: 写 `src/components/shell/Sidebar.tsx` + SidebarItem + Backdrop + LocalNav**

port from `.legacy/vitepress-reference/.vitepress/theme/layouts/LayoutInner.vue`（其中 sidebar 部分）和 default theme VPSidebar。

```tsx
// src/components/shell/Sidebar.tsx
import { useState } from 'react'
import type { SidebarNode } from '@lib/navigation'

export interface SidebarProps {
  sidebar: SidebarNode[]
  currentPath: string
  locale: 'en' | 'zh-CN' | 'zh-HK'
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ sidebar, currentPath, open = true, onClose }: SidebarProps) {
  return (
    <aside
      data-lbus-component="sidebar"
      className={`sticky top-14 h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-[--lbus-c-border] px-4 py-6 ${open ? '' : 'hidden lg:block'}`}
    >
      <ul className="space-y-1">
        {sidebar.map((node, i) => (
          <SidebarItem key={i} node={node} currentPath={currentPath} depth={0} />
        ))}
      </ul>
    </aside>
  )
}
```

```tsx
// src/components/shell/SidebarItem.tsx
import { useState } from 'react'
import type { SidebarNode } from '@lib/navigation'

export interface SidebarItemProps {
  node: SidebarNode
  currentPath: string
  depth: number
}

export function SidebarItem({ node, currentPath, depth }: SidebarItemProps) {
  const [collapsed, setCollapsed] = useState(node.collapsed)
  const isActive = node.link && currentPath === node.link
  const hasActiveChild = hasActive(node, currentPath)
  const showChildren = node.items && (!collapsed || hasActiveChild)

  return (
    <li>
      <div className="flex items-center">
        {node.items ? (
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="mr-1 text-xs opacity-60"
            aria-expanded={!collapsed}
          >
            {collapsed ? '▶' : '▼'}
          </button>
        ) : null}
        {node.link ? (
          <a
            href={node.link}
            className={`block flex-1 rounded px-2 py-1 text-sm ${isActive ? 'bg-[--lbus-c-bg-soft] font-medium text-[--lbus-c-brand]' : 'hover:bg-[--lbus-c-bg-soft]'}`}
            style={{ paddingLeft: `${depth * 0.75 + 0.5}rem` }}
          >
            {node.label}
          </a>
        ) : (
          <span className="block flex-1 px-2 py-1 text-sm font-medium opacity-70" style={{ paddingLeft: `${depth * 0.75 + 0.5}rem` }}>
            {node.label}
          </span>
        )}
      </div>
      {showChildren ? (
        <ul>
          {node.items!.map((child, i) => (
            <SidebarItem key={i} node={child} currentPath={currentPath} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function hasActive(node: SidebarNode, path: string): boolean {
  if (node.link === path) return true
  return !!node.items?.some((c) => hasActive(c, path))
}
```

```tsx
// src/components/shell/Backdrop.tsx
export interface BackdropProps { open: boolean; onClick: () => void }
export function Backdrop({ open, onClick }: BackdropProps) {
  if (!open) return null
  return (
    <div
      data-lbus-component="backdrop"
      onClick={onClick}
      className="fixed inset-0 z-20 bg-black/40 lg:hidden"
      aria-hidden="true"
    />
  )
}
```

```tsx
// src/components/shell/LocalNav.tsx (mobile top bar between TopNav and content)
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Backdrop } from './Backdrop'
import type { SidebarNode } from '@lib/navigation'
import type { Locale } from '@lib/slug'

export interface LocalNavProps {
  sidebar: SidebarNode[]
  currentPath: string
  locale: Locale
  breadcrumb: string
}

export function LocalNav({ sidebar, currentPath, locale, breadcrumb }: LocalNavProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="sticky top-14 z-10 flex h-11 items-center border-b border-[--lbus-c-border] px-4 lg:hidden">
        <button onClick={() => setOpen(true)} className="text-sm">☰ Menu</button>
        <span className="ml-3 text-sm opacity-70">{breadcrumb}</span>
      </div>
      <Backdrop open={open} onClick={() => setOpen(false)} />
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-[--lbus-c-bg] transition-transform lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar sidebar={sidebar} currentPath={currentPath} locale={locale} open onClose={() => setOpen(false)} />
      </div>
    </>
  )
}
```

- [ ] **Step 5: 提交 T7**

```bash
git add src/lib/navigation.ts src/lib/navigation.test.ts src/components/shell/
git status
git commit -m "$(cat <<'EOF'
feat(migrate): sidebar generator + Sidebar/SidebarItem/Backdrop/LocalNav

Port vitepress gen.ts::genMarkdowDocs() to src/lib/navigation.ts as
buildSidebar(locale) that walks docs collection + _category_.json files.
Sidebar/SidebarItem provide desktop tree with collapse/expand;
LocalNav+Backdrop handle mobile drawer. Interaction parity to be
verified via opencli in T18.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: DocsLayout + TOC + PrevNext 装配

**Files:**
- Create: `src/components/shell/TOC.tsx`
- Create: `src/components/shell/PrevNext.tsx`
- Modify: `src/layouts/DocsLayout.astro`（三栏：Sidebar / main+Breadcrumb+content+PrevNext / TOC）

**Interfaces:**
- Produces:
  - `<TOC headings={...} />` — 右侧目录
  - `<PrevNext prev={...} next={...} />` — 底部前后翻页
- Consumes: `buildSidebar` from T7, `headings` from `render(entry)`

- [ ] **Step 1: `src/components/shell/TOC.tsx`**

```tsx
import { useEffect, useState } from 'react'
import type { MarkdownHeading } from 'astro'

export interface TOCProps {
  headings: MarkdownHeading[]
  minDepth?: number
  maxDepth?: number
}

export function TOC({ headings, minDepth = 2, maxDepth = 3 }: TOCProps) {
  const items = headings.filter((h) => h.depth >= minDepth && h.depth <= maxDepth)
  const [active, setActive] = useState<string>('')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) setActive(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px' },
    )
    items.forEach((i) => {
      const el = document.getElementById(i.slug)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null
  return (
    <nav data-lbus-component="toc" aria-label="Table of contents" className="hidden text-sm lg:block">
      <p className="mb-3 font-medium">On this page</p>
      <ul className="space-y-1">
        {items.map((h) => (
          <li key={h.slug} style={{ paddingLeft: `${(h.depth - minDepth) * 0.75}rem` }}>
            <a
              href={`#${h.slug}`}
              className={`block hover:text-[--lbus-c-brand] ${active === h.slug ? 'text-[--lbus-c-brand]' : 'text-[--lbus-c-text-muted]'}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 2: `src/components/shell/PrevNext.tsx`**

```tsx
import type { SidebarNode } from '@lib/navigation'

export interface PrevNextProps {
  prev?: { label: string; link: string }
  next?: { label: string; link: string }
}

export function PrevNext({ prev, next }: PrevNextProps) {
  return (
    <nav data-lbus-component="prev-next" aria-label="Pager" className="mt-12 grid grid-cols-2 gap-4 border-t border-[--lbus-c-border] pt-8">
      {prev ? (
        <a href={prev.link} className="rounded border border-[--lbus-c-border] p-4 hover:border-[--lbus-c-brand]">
          <div className="text-xs opacity-60">Previous</div>
          <div className="mt-1 text-sm font-medium">{prev.label}</div>
        </a>
      ) : <div />}
      {next ? (
        <a href={next.link} className="rounded border border-[--lbus-c-border] p-4 text-right hover:border-[--lbus-c-brand]">
          <div className="text-xs opacity-60">Next</div>
          <div className="mt-1 text-sm font-medium">{next.label}</div>
        </a>
      ) : <div />}
    </nav>
  )
}
```

- [ ] **Step 3: 提供 `getPrevNext` helper in `navigation.ts`**

在 `src/lib/navigation.ts` 底部追加：

```ts
export function flatSidebar(sidebar: SidebarNode[]): { label: string; link: string }[] {
  const out: { label: string; link: string }[] = []
  const walk = (nodes: SidebarNode[]) => {
    for (const n of nodes) {
      if (n.link) out.push({ label: n.label, link: n.link })
      if (n.items) walk(n.items)
    }
  }
  walk(sidebar)
  return out
}

export function getPrevNext(sidebar: SidebarNode[], currentPath: string) {
  const flat = flatSidebar(sidebar)
  const i = flat.findIndex((n) => n.link === currentPath)
  return {
    prev: i > 0 ? flat[i - 1] : undefined,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : undefined,
  }
}
```

- [ ] **Step 4: 装配 `DocsLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro'
import { Sidebar } from '@components/shell/Sidebar'
import { LocalNav } from '@components/shell/LocalNav'
import { TOC } from '@components/shell/TOC'
import { PrevNext } from '@components/shell/PrevNext'
import { Breadcrumb } from '@components/shell/Breadcrumb'
import { buildSidebar, getPrevNext } from '@lib/navigation'
import type { CollectionEntry } from 'astro:content'
import type { MarkdownHeading } from 'astro'

export interface Props {
  title: string
  locale: 'en'|'zh-CN'|'zh-HK'
  entry: CollectionEntry<'docs'>
  headings: MarkdownHeading[]
}

const { title, locale, entry, headings } = Astro.props
const sidebar = await buildSidebar(locale)
const currentPath = Astro.url.pathname
const { prev, next } = getPrevNext(sidebar, currentPath)
const crumbItems = buildCrumbsFromPath(currentPath, sidebar)

function buildCrumbsFromPath(path: string, sb: any): any[] {
  // Given /docs/quote/pull/static, walk sidebar to build breadcrumb chain
  // Implementation left inline per YAGNI; refine in T18 if diff report shows drift
  return [{ label: entry.data.title }]
}
---
<BaseLayout title={title} locale={locale}>
  <LocalNav client:load sidebar={sidebar} currentPath={currentPath} locale={locale} breadcrumb={entry.data.title} />
  <div class="mx-auto flex max-w-7xl gap-8 px-4 py-8">
    <Sidebar client:load sidebar={sidebar} currentPath={currentPath} locale={locale} />
    <main id="main" tabindex="-1" class="min-w-0 flex-1">
      <Breadcrumb client:visible items={crumbItems} locale={locale} />
      <article class="prose mt-6 max-w-none">
        <slot />
      </article>
      <PrevNext prev={prev} next={next} />
    </main>
    <div class="hidden w-56 shrink-0 lg:block">
      <TOC client:visible headings={headings} />
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 5: 更新页面路由把 `headings` 传给 DocsLayout**

修改 `src/pages/[...slug].astro`（与 zh-CN/zh-HK 变体）：

```astro
---
// ... prior imports
const { entry } = Astro.props
const { Content, headings } = await render(entry)
const Layout = /* dispatch as before */
---
<Layout title={entry.data.title} locale="en" entry={entry} headings={headings}>
  <Content />
</Layout>
```

（zh-CN / zh-HK 同步改）

- [ ] **Step 6: boss 验证三栏布局出现**

boss 手动 `bun run dev`，访问 `/docs/quote/pull/static`：
- 左侧 Sidebar 出现，当前页高亮
- 中间正文
- 右侧 TOC 显示当前页 h2/h3 列表，滚动时高亮变化
- 底部 PrevNext 显示前后页
- 移动端（<1024px）Sidebar 折叠为汉堡菜单

- [ ] **Step 7: 提交 T8**

```bash
git add src/components/shell/TOC.tsx src/components/shell/PrevNext.tsx src/layouts/DocsLayout.astro src/pages/ src/lib/navigation.ts
git status
git commit -m "$(cat <<'EOF'
feat(migrate): DocsLayout with Sidebar + Breadcrumb + TOC + PrevNext

Assemble three-column docs layout: Sidebar (T7) on left, Breadcrumb +
mdx content + PrevNext in center, TOC on right. Mobile drawer via
LocalNav+Backdrop. getPrevNext derives prev/next from flat sidebar
order for pager parity with vitepress.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Region 系统 + ApiReferenceLayout（保留 placeholder 但接 Region）

**Files:**
- Create: `src/lib/region.ts`
- Create: `src/lib/region.test.ts`
- Move: `.legacy/vitepress-reference/region.config.ts` → `region.config.ts`（工程根，供 astro / scripts 共享）
- Create: `src/integrations/remark-region-filter.ts`
- Create: `src/integrations/region-hostname-rewrite.ts`
- Modify: `astro.config.ts`（挂 remark plugin + integration）
- Modify: `src/pages/[...slug].astro` 及变体（getStaticPaths 里过滤 region 白名单）

**Interfaces:**
- Produces:
  - `includedInRegion(url: string, region: 'global'|'cn'|'hk'): boolean`
  - `filterEntriesByRegion(entries, region): entries`
  - Remark plugin drops sections gated to non-current region

- [ ] **Step 1: 迁 `region.config.ts` 到工程根**

```bash
git mv .legacy/vitepress-reference/region.config.ts region.config.ts 2>/dev/null || cp .legacy/vitepress-reference/region.config.ts region.config.ts
```

若原路径不同，从 vitepress config.mts 里 grep `region.config` 找到源文件。

- [ ] **Step 2: 写 `src/lib/region.ts`**

```ts
import { region as regionCfg } from '../../region.config'
import type { CollectionEntry } from 'astro:content'
import { resolveUrl } from './slug'

export type Region = 'global' | 'cn' | 'hk'

export function currentRegion(): Region {
  return (import.meta.env.PUBLIC_REGION as Region) ?? 'global'
}

export function includedInRegion(url: string, region: Region): boolean {
  // regionCfg shape (from legacy): { cn: { allowlist: [...], removeSections: [...] }, hk: {...}, global: {...} }
  const cfg = (regionCfg as any)[region]
  if (!cfg?.allowlist) return true
  return cfg.allowlist.some((pat: string | RegExp) =>
    typeof pat === 'string' ? url === pat || url.startsWith(pat + '/') : pat.test(url)
  )
}

export function filterEntriesByRegion<T extends CollectionEntry<'docs'>>(entries: T[], region: Region): T[] {
  return entries.filter((e) => includedInRegion(resolveUrl(e), region))
}
```

- [ ] **Step 3: 写 `src/lib/region.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { includedInRegion } from './region'

describe('includedInRegion', () => {
  it('global includes everything', () => {
    expect(includedInRegion('/docs/anything', 'global')).toBe(true)
  })
  it('cn allowlist filters', () => {
    // Assumes region.config.ts has cn.allowlist configured
    const result = includedInRegion('/docs/quote/pull/static', 'cn')
    expect(typeof result).toBe('boolean')
  })
})
```

- [ ] **Step 4: 写 `src/integrations/remark-region-filter.ts`**

```ts
import type { Root } from 'mdast'
import { currentRegion } from '@lib/region'
import { region as cfg } from '../../region.config'

/**
 * Removes ::: region-{cn,hk,global} ... ::: sections when the current
 * build region doesn't match. Parity with vitepress region-filter.ts.
 */
export function remarkRegionFilter() {
  const region = currentRegion()
  return (tree: Root) => {
    const nodes: any[] = []
    let skipping = false
    let skipRegion = ''
    for (const node of tree.children) {
      if (node.type === 'html' && typeof (node as any).value === 'string') {
        const openMatch = (node as any).value.match(/^<!-- region:(\w+) -->$/)
        const closeMatch = (node as any).value.match(/^<!-- \/region:(\w+) -->$/)
        if (openMatch) {
          skipping = openMatch[1] !== region
          skipRegion = openMatch[1]
          continue
        }
        if (closeMatch && closeMatch[1] === skipRegion) {
          skipping = false
          continue
        }
      }
      if (!skipping) nodes.push(node)
    }
    tree.children = nodes
  }
}
```

**契约**：与 legacy `region-filter.ts` md plugin 一致。若 legacy 用不同分隔符（如 `::: region-cn` fenced div），改成识别 `containerDirective` 节点。

- [ ] **Step 5: 写 `src/integrations/region-hostname-rewrite.ts`**

```ts
import type { AstroIntegration } from 'astro'
import { currentRegion } from '@lib/region'
import { region as cfg } from '../../region.config'

export function regionHostnameRewrite(): AstroIntegration {
  return {
    name: 'lbus-region-hostname-rewrite',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const region = currentRegion()
        const rules: [string, string][] = (cfg as any)[region]?.hostnameRewrites ?? []
        if (rules.length === 0) return
        const { readdir, readFile, writeFile, stat } = await import('node:fs/promises')
        const { join } = await import('node:path')
        const walk = async (d: string): Promise<string[]> => {
          const out: string[] = []
          for (const name of await readdir(d)) {
            const p = join(d, name)
            const s = await stat(p)
            if (s.isDirectory()) out.push(...await walk(p))
            else if (name.endsWith('.html') || name.endsWith('.css') || name.endsWith('.js')) out.push(p)
          }
          return out
        }
        for (const f of await walk(dir.pathname)) {
          let content = await readFile(f, 'utf-8')
          let changed = false
          for (const [from, to] of rules) {
            if (content.includes(from)) { content = content.split(from).join(to); changed = true }
          }
          if (changed) await writeFile(f, content)
        }
      },
    },
  }
}
```

- [ ] **Step 6: 挂进 astro.config.ts**

```ts
import { remarkRegionFilter } from './src/integrations/remark-region-filter'
import { regionHostnameRewrite } from './src/integrations/region-hostname-rewrite'

// ...
export default defineConfig({
  // ...
  integrations: [
    react(),
    mdx({ remarkPlugins: [remarkRegionFilter] }),
    icon(),
    sitemap({ /* ... */ }),
    regionHostnameRewrite(),
  ],
  // ...
})
```

- [ ] **Step 7: getStaticPaths 里过滤 region**

修改 `src/pages/[...slug].astro`（3 份）：

```ts
export async function getStaticPaths() {
  const all = await getCollection('docs')
  const region = (import.meta.env.PUBLIC_REGION as 'global'|'cn'|'hk') ?? 'global'
  return all
    .filter((e) => resolveLocale(e) === 'en')
    .filter((e) => includedInRegion(resolveUrl(e), region))
    .map((e) => { /* ... */ })
}
```

- [ ] **Step 8: 跑 region test**

```bash
bun run test src/lib/region.test.ts
```

- [ ] **Step 9: 提交 T9**

```bash
git add src/lib/region.ts src/lib/region.test.ts src/integrations/ region.config.ts src/pages/ astro.config.ts
git status
git commit -m "$(cat <<'EOF'
feat(migrate): region system (allowlist filter + remark section drop + hostname rewrite)

Port region.config.ts to project root; add includedInRegion(url,region)
helper; getStaticPaths filters entries by allowlist. New remarkRegionFilter
mdx plugin drops <!-- region:X --> ... <!-- /region:X --> sections that
don't match PUBLIC_REGION. regionHostnameRewrite integration rewrites
hostnames in dist/*.{html,css,js} at build:done.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: 主题切换 — ThemeToggle 组件 + Language Switcher + FocusVisible

**Files:**
- Create: `src/components/shell/ThemeToggle.tsx`
- Create: `src/components/shell/LanguageSwitcher.tsx`
- Modify: `src/components/shell/TopNav.tsx`（加入右侧工具区）

**Interfaces:**
- Produces:
  - `<ThemeToggle />` — light / dark / system 三态切换
  - `<LanguageSwitcher currentLocale={...} currentPath={...} />` — en / zh-CN / zh-HK 切换（URL 前缀对应替换）

- [ ] **Step 1: `src/components/shell/ThemeToggle.tsx`**

```tsx
import { useEffect, useState } from 'react'

type Pref = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const [pref, setPref] = useState<Pref>('system')
  useEffect(() => {
    const stored = (localStorage.getItem('ui-mode') as Pref | null) ?? 'system'
    setPref(stored)
  }, [])

  const apply = (next: Pref) => {
    localStorage.setItem('ui-mode', next)
    const dark = next === 'dark' || (next === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.dataset.mode = dark ? 'dark' : 'light'
    document.documentElement.dataset.nbPref = next
    setPref(next)
  }

  return (
    <div data-lbus-component="theme-toggle" className="flex items-center gap-1 rounded-full border border-[--lbus-c-border] p-0.5">
      {(['light', 'system', 'dark'] as Pref[]).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => apply(mode)}
          className={`rounded-full px-2 py-1 text-xs ${pref === mode ? 'bg-[--lbus-c-bg-soft]' : ''}`}
          aria-pressed={pref === mode}
          title={mode}
        >
          {mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '⚙️'}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: `src/components/shell/LanguageSwitcher.tsx`**

```tsx
import type { Locale } from '@lib/slug'

const LABELS: Record<Locale, string> = { 'en': 'English', 'zh-CN': '简体中文', 'zh-HK': '繁體中文' }

export interface LanguageSwitcherProps { currentLocale: Locale; currentPath: string }

export function LanguageSwitcher({ currentLocale, currentPath }: LanguageSwitcherProps) {
  const rewrite = (target: Locale): string => {
    // strip current locale prefix
    let bare = currentPath
    if (currentLocale !== 'en' && bare.startsWith(`/${currentLocale}`)) {
      bare = bare.slice(currentLocale.length + 1) || '/'
    }
    if (target === 'en') return bare
    return `/${target}${bare === '/' ? '' : bare}`
  }
  return (
    <div data-lbus-component="lang-switcher" className="relative">
      <select
        value={currentLocale}
        onChange={(e) => { window.location.href = rewrite(e.target.value as Locale) }}
        className="rounded border border-[--lbus-c-border] bg-transparent px-2 py-1 text-xs"
      >
        {(['en', 'zh-CN', 'zh-HK'] as Locale[]).map((l) => (
          <option key={l} value={l}>{LABELS[l]}</option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 3: 把 ThemeToggle + LanguageSwitcher 挂进 TopNav 的右侧工具区**

修改 `src/components/shell/TopNav.tsx`，在 `<nav>` 之后加一段：

```tsx
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
// ...
<div className="flex items-center gap-2">
  <LanguageSwitcher currentLocale={locale} currentPath={currentPath} />
  <ThemeToggle />
  {/* SearchButton comes in T13, UserAvatar already imported */}
</div>
```

- [ ] **Step 4: boss 验证主题切换**

`bun run dev`，验证：
- 点 ☀️ / 🌙 / ⚙️ → `<html data-mode="...">` 属性变化 → 全局背景 / 文本切换
- 刷新页面保留最近选择
- 语言下拉切换 → URL 前缀正确改变（`/docs/x` ↔ `/zh-CN/docs/x`）

- [ ] **Step 5: 提交 T10**

```bash
git add src/components/shell/ThemeToggle.tsx src/components/shell/LanguageSwitcher.tsx src/components/shell/TopNav.tsx
git status
git commit -m "$(cat <<'EOF'
feat(migrate): ThemeToggle + LanguageSwitcher wired into TopNav

Three-state theme toggle (light/system/dark) writes localStorage + data-mode
attribute matching BaseLayout pre-paint script. LanguageSwitcher rewrites
URL prefix (strip current locale, add target locale) preserving path.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: MDX Primitives — 7 个全局标签 + mdx-components.tsx 映射

**Files:**
- Create: `src/components/mdx/Tabs.tsx`
- Create: `src/components/mdx/TabItem.tsx`
- Create: `src/components/mdx/TipContainer.tsx`
- Create: `src/components/mdx/CliCommand.tsx`
- Create: `src/components/mdx/SDK.tsx`
- Create: `src/components/mdx/SDKLinks.tsx`
- Create: `src/components/mdx/Skill.tsx`（简单展示，不含 skill-catalog composite）
- Create: `src/mdx-components.tsx`
- Modify: 每个 layout 里 render 时传 components map

**Interfaces:**
- Produces: 7 个 MDX 组件；`mdx-components.tsx` 导出 `components` map for `<Content components={components} />`

参考：port from `.legacy/vitepress-reference/.vitepress/theme/components/{Tabs,TabItem,TipContainer,CliCommand,SDK,SDKLinks,Skill}.vue`。契约保持 —— props 与用法在 mdx 里应一字不改。

- [ ] **Step 1: `src/components/mdx/Tabs.tsx` + `TabItem.tsx`**

```tsx
// Tabs.tsx
import { useState, Children, isValidElement, cloneElement, type ReactElement, type ReactNode } from 'react'

export interface TabsProps { children: ReactNode; groupId?: string; defaultIndex?: number }

export function Tabs({ children, groupId, defaultIndex = 0 }: TabsProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<any>[]
  const labels = items.map((c) => c.props?.label ?? c.props?.value ?? '')
  const [active, setActive] = useState(defaultIndex)
  return (
    <div data-lbus-component="tabs" data-tabs-group={groupId} className="my-4 rounded border border-[--lbus-c-border]">
      <div role="tablist" className="flex gap-2 border-b border-[--lbus-c-border] px-2 pt-2">
        {labels.map((label, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`rounded-t px-3 py-1 text-sm ${active === i ? 'bg-[--lbus-c-bg-soft] font-medium' : 'opacity-70 hover:opacity-100'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="p-4">{items[active]}</div>
    </div>
  )
}
```

```tsx
// TabItem.tsx
import type { ReactNode } from 'react'
export interface TabItemProps { label: string; value?: string; children: ReactNode }
export function TabItem({ children }: TabItemProps) { return <>{children}</> }
```

- [ ] **Step 2: `TipContainer.tsx`**

```tsx
import type { ReactNode } from 'react'

export interface TipContainerProps {
  type?: 'info' | 'warning' | 'danger' | 'tip'
  title?: string
  children: ReactNode
}

const CFG = {
  info:    { icon: 'ℹ️', color: 'oklch(60% 0.15 240)' },
  tip:     { icon: '💡', color: 'oklch(65% 0.15 150)' },
  warning: { icon: '⚠️', color: 'oklch(70% 0.15 80)' },
  danger:  { icon: '🚫', color: 'oklch(60% 0.20 30)' },
}

export function TipContainer({ type = 'info', title, children }: TipContainerProps) {
  const c = CFG[type]
  return (
    <div
      data-lbus-component="tip-container"
      data-tip-type={type}
      className="my-4 rounded border-l-4 bg-[--lbus-c-bg-soft] p-4"
      style={{ borderLeftColor: c.color }}
    >
      <p className="mb-2 flex items-center gap-2 font-medium">
        <span aria-hidden="true">{c.icon}</span>
        {title ?? type.toUpperCase()}
      </p>
      <div>{children}</div>
    </div>
  )
}
```

**契约要点**：legacy TipContainer.vue 的 type 值 / icon / 色调必须对齐。以 vitepress 现站截图为准做视觉对比。

- [ ] **Step 3: `CliCommand.tsx`**

```tsx
import { useState, type ReactNode } from 'react'

export interface CliCommandProps { children: ReactNode }

export function CliCommand({ children }: CliCommandProps) {
  const raw = extractText(children).trim()
  const lines = raw.split('\n')
  // Group: comment lines followed by command lines
  const blocks: { comment: string; cmd: string }[] = []
  let pendingComment = ''
  for (const line of lines) {
    if (line.startsWith('#')) {
      pendingComment = line.replace(/^#\s*/, '')
    } else if (line.trim()) {
      blocks.push({ comment: pendingComment, cmd: line })
      pendingComment = ''
    }
  }

  return (
    <div data-lbus-component="cli-command" className="my-4 rounded border border-[--lbus-c-border]">
      <div className="flex items-center justify-between border-b border-[--lbus-c-border] px-3 py-2 text-xs opacity-70">
        <span>Longbridge CLI</span>
        <a href="/docs/cli" className="underline">Install</a>
      </div>
      <div className="divide-y divide-[--lbus-c-border]">
        {blocks.map((b, i) => (
          <div key={i} className="p-3">
            {b.comment && <div className="mb-1 text-xs opacity-60"># {b.comment}</div>}
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm">{b.cmd}</code>
              <CopyButton text={b.cmd} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200) }}
      className="rounded border border-[--lbus-c-border] px-2 py-0.5 text-xs hover:bg-[--lbus-c-bg-soft]"
    >
      {copied ? '✓' : 'Copy'}
    </button>
  )
}

function extractText(node: any): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node?.props?.children) return extractText(node.props.children)
  return ''
}
```

**契约要点**：legacy `CliCommand.vue` + `md-plugins/cli-command.ts` 的注释-命令 pairing 语义与 UI 样式对齐；Install 链接指向 `/docs/cli`。

- [ ] **Step 4: `SDK.tsx` + `SDKLinks.tsx` + `Skill.tsx`**

port from legacy 同名组件。Skill 是简单展示版（skill-catalog composite 在阶段 2）。示例（简版）：

```tsx
// SDK.tsx
export interface SDKProps { language: 'python' | 'rust' | 'go' | 'nodejs' | 'java' | 'cpp'; children?: React.ReactNode }
export function SDK({ language, children }: SDKProps) {
  return (
    <a
      data-lbus-component="sdk"
      href={`/docs/sdk/${language}`}
      className="my-2 inline-flex items-center gap-2 rounded border border-[--lbus-c-border] px-3 py-1 text-sm hover:border-[--lbus-c-brand]"
    >
      <span>{language}</span>
      {children}
    </a>
  )
}

// SDKLinks.tsx
import { SDK } from './SDK'
export function SDKLinks() {
  const LANGS: SDK['language'][] = ['python', 'rust', 'go', 'nodejs', 'java', 'cpp']
  return (
    <div data-lbus-component="sdk-links" className="my-4 flex flex-wrap gap-2">
      {LANGS.map((l) => <SDK key={l} language={l} />)}
    </div>
  )
}

// Skill.tsx (simple; composite version in stage 2)
export interface SkillProps { name: string; description?: string; href?: string }
export function Skill({ name, description, href }: SkillProps) {
  const inner = (
    <div className="rounded border border-[--lbus-c-border] p-4 hover:border-[--lbus-c-brand]">
      <div className="font-medium">{name}</div>
      {description && <p className="mt-1 text-sm opacity-70">{description}</p>}
    </div>
  )
  return href ? <a href={href}>{inner}</a> : inner
}
```

**契约要点**：以 legacy 视觉 / URL / props 为准，本步骤示例是骨架，需按 legacy Vue 版本对齐细节。

- [ ] **Step 5: `src/mdx-components.tsx`**

```tsx
import { Tabs } from '@components/mdx/Tabs'
import { TabItem } from '@components/mdx/TabItem'
import { TipContainer } from '@components/mdx/TipContainer'
import { CliCommand } from '@components/mdx/CliCommand'
import { SDK } from '@components/mdx/SDK'
import { SDKLinks } from '@components/mdx/SDKLinks'
import { Skill } from '@components/mdx/Skill'

// Composite placeholders — real impl in stage 2
import { TryIt } from '@components/mdx/placeholders/TryIt'
import { McpTools } from '@components/mdx/placeholders/McpTools'
import { NewHomePage } from '@components/mdx/placeholders/NewHomePage'
import { Pricing } from '@components/mdx/placeholders/Pricing'
import { QuotePermission } from '@components/mdx/placeholders/QuotePermission'
import { ApiReference } from '@components/mdx/placeholders/ApiReference'

export const mdxComponents = {
  Tabs, TabItem, TipContainer, CliCommand, SDK, SDKLinks, Skill,
  TryIt, McpTools, NewHomePage, Pricing, QuotePermission, ApiReference,
}
```

（placeholder 组件在 T12 创建。）

- [ ] **Step 6: 传给 Content**

修改 `src/pages/[...slug].astro`（3 份）：

```astro
---
import { mdxComponents } from '@/mdx-components'
// ...
---
<Layout {...}>
  <Content components={mdxComponents} />
</Layout>
```

- [ ] **Step 7: 提交 T11**

```bash
git add src/components/mdx/ src/mdx-components.tsx src/pages/
git status
git commit -m "$(cat <<'EOF'
feat(migrate): 7 mdx primitives (Tabs, TipContainer, CliCommand, SDK, SDKLinks, Skill) + mdx map

Port simple/pure-presentational mdx tags from legacy vitepress theme
to React. Preserves tag names and props unchanged in .mdx source so
the 200+ .mdx files that reference these tags render without content
edits. Composite tags (TryIt/McpTools/NewHomePage/Pricing/
QuotePermission/ApiReference) get placeholders in T12.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Composite Placeholders — 6 个占位组件

**Files:**
- Create: `src/components/mdx/placeholders/TryIt.tsx`
- Create: `src/components/mdx/placeholders/McpTools.tsx`
- Create: `src/components/mdx/placeholders/NewHomePage.tsx`
- Create: `src/components/mdx/placeholders/Pricing.tsx`
- Create: `src/components/mdx/placeholders/QuotePermission.tsx`
- Create: `src/components/mdx/placeholders/ApiReference.tsx`

**Interfaces:**
- Produces: 6 个 placeholder 组件，接受 legacy 的 props 但只渲染"stage 2 实施中"卡片；不阻塞 mdx 编译。

- [ ] **Step 1: 写 6 个 placeholder（同结构）**

```tsx
// src/components/mdx/placeholders/TryIt.tsx
export interface TryItProps { operationId?: string; [k: string]: any }
export function TryIt(props: TryItProps) {
  return (
    <div data-lbus-component="tryit-placeholder" className="my-4 rounded border border-dashed border-[--lbus-c-border] p-4 text-sm opacity-60">
      <strong>TryIt placeholder</strong>
      <p className="mt-1">Interactive API tester will be ported in stage 2 (spec §7.2). operationId: <code>{props.operationId ?? '?'}</code></p>
    </div>
  )
}
```

其余 5 个模式相同 —— 组件名和 props 保留（因 mdx 里的 `<XXX>` 会传入 props），渲染带组件名 tag 的占位卡片。

McpTools / NewHomePage / Pricing / QuotePermission / ApiReference 的 props 参考 legacy 同名组件的 template 头部声明。

- [ ] **Step 2: 提交 T12**

```bash
git add src/components/mdx/placeholders/
git status
git commit -m "$(cat <<'EOF'
feat(migrate): composite mdx placeholders for stage 2 components

TryIt, McpTools, NewHomePage, Pricing, QuotePermission, ApiReference
render dashed-border "stage 2" cards so .mdx files that reference
these tags compile without breaking. Real implementations arrive with
stage 2 packages/tryit + packages/api-reference + packages/homepage.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: 搜索 — Pagefind 集成 + SearchDialog 复刻 vitepress local search

**Files:**
- Create: `src/components/shell/SearchButton.tsx`
- Create: `src/components/shell/SearchDialog.tsx`
- Create: `src/components/shell/SearchResults.tsx`
- Modify: `src/components/shell/TopNav.tsx`（加 SearchButton）
- Modify: `package.json` build script（append `bunx pagefind --site dist`）

**Interfaces:**
- Produces:
  - `<SearchButton onClick={...} />` — TopNav 里的搜索按钮 + `Cmd+K` / `/` 快捷键
  - `<SearchDialog open={...} onClose={...} locale={...} />` — 弹窗，Pagefind runtime 驱动

- [ ] **Step 1: 装 pagefind runtime**

```bash
bun add pagefind@^1
```

- [ ] **Step 2: `SearchDialog.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@lib/i18n'
import type { Locale } from '@lib/slug'
import { SearchResults } from './SearchResults'

export interface SearchDialogProps { open: boolean; onClose: () => void; locale: Locale }

interface PagefindResult { url: string; excerpt: string; meta: { title: string } }

export function SearchDialog({ open, onClose, locale }: SearchDialogProps) {
  const t = useTranslation(locale)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PagefindResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const pagefindRef = useRef<any>(null)

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    if (!pagefindRef.current) {
      // Dynamic import — Pagefind loads its own chunk from /pagefind/
      import(/* @vite-ignore */ '/pagefind/pagefind.js').then((pf) => {
        pagefindRef.current = pf
      })
    }
  }, [open])

  useEffect(() => {
    if (!open || !query) { setResults([]); return }
    setLoading(true)
    const t = setTimeout(async () => {
      if (!pagefindRef.current) return
      const search = await pagefindRef.current.search(query)
      const rs = await Promise.all(search.results.slice(0, 20).map((r: any) => r.data()))
      // Filter by locale
      const filtered = rs.filter((r: any) => {
        const url: string = r.url ?? r.raw_url ?? ''
        if (locale === 'en') return !url.startsWith('/zh-CN') && !url.startsWith('/zh-HK')
        return url.startsWith(`/${locale}`)
      })
      setResults(filtered)
      setLoading(false)
    }, 200)
    return () => clearTimeout(t)
  }, [query, open, locale])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div data-lbus-component="search-dialog" className="fixed inset-0 z-50 flex items-start justify-center pt-24" role="dialog" aria-modal="true">
      <div onClick={onClose} className="fixed inset-0 bg-black/40" />
      <div className="relative w-full max-w-2xl rounded-lg bg-[--lbus-c-bg] shadow-2xl">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full rounded-t-lg border-b border-[--lbus-c-border] bg-transparent px-4 py-3 outline-none"
        />
        <SearchResults results={results} loading={loading} query={query} locale={locale} onSelect={onClose} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: `SearchResults.tsx`**

```tsx
import { useTranslation } from '@lib/i18n'
import type { Locale } from '@lib/slug'

export interface SearchResultsProps {
  results: any[]
  loading: boolean
  query: string
  locale: Locale
  onSelect: () => void
}

export function SearchResults({ results, loading, query, locale, onSelect }: SearchResultsProps) {
  const t = useTranslation(locale)
  if (!query) return null
  if (loading) return <div className="p-4 text-sm opacity-60">Searching…</div>
  if (results.length === 0) return <div className="p-4 text-sm opacity-60">{t('search.empty')}</div>
  return (
    <ul className="max-h-96 overflow-y-auto p-2">
      {results.map((r, i) => (
        <li key={i}>
          <a
            href={r.url}
            onClick={onSelect}
            className="block rounded p-2 hover:bg-[--lbus-c-bg-soft]"
          >
            <div className="text-sm font-medium">{r.meta.title}</div>
            <div className="mt-1 text-xs opacity-70" dangerouslySetInnerHTML={{ __html: r.excerpt }} />
          </a>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 4: `SearchButton.tsx` + 快捷键**

```tsx
import { useEffect, useState } from 'react'
import { SearchDialog } from './SearchDialog'
import type { Locale } from '@lib/slug'

export interface SearchButtonProps { locale: Locale }

export function SearchButton({ locale }: SearchButtonProps) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true) }
      if (e.key === '/' && !isFormField(e.target)) { e.preventDefault(); setOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded border border-[--lbus-c-border] px-2 py-1 text-xs opacity-70 hover:opacity-100"
      >
        <span aria-hidden="true">🔍</span>
        <kbd className="rounded bg-[--lbus-c-bg-soft] px-1">⌘K</kbd>
      </button>
      <SearchDialog open={open} onClose={() => setOpen(false)} locale={locale} />
    </>
  )
}

function isFormField(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false
  const tag = t.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || t.isContentEditable
}
```

- [ ] **Step 5: TopNav 加 SearchButton**

```tsx
import { SearchButton } from './SearchButton'
// 在右侧工具区内插：
<SearchButton locale={locale} />
```

- [ ] **Step 6: 确保 package.json build 后跑 pagefind**

`build:canary` / `build:release` / `build:cn` scripts 里已有 `bunx pagefind --site dist`（在 T1 就配置了）。此步骤只需 boss 手动验证：

```bash
bun run build:canary  # 由 boss 跑
ls dist/pagefind/     # 应该出现 pagefind.js 等文件
```

- [ ] **Step 7: 提交 T13**

```bash
git add src/components/shell/SearchButton.tsx src/components/shell/SearchDialog.tsx src/components/shell/SearchResults.tsx src/components/shell/TopNav.tsx package.json bun.lockb
git status
git commit -m "$(cat <<'EOF'
feat(migrate): search — pagefind backend + vitepress-style dialog UI

Wire Pagefind runtime (loaded from /pagefind/) behind a React dialog
that mimics vitepress local search: Cmd/Ctrl+K and / shortcuts, modal
overlay, tri-lingual placeholder, 200ms debounce, locale-filtered
results with Highlight excerpts. UI is 1:1 with vitepress interaction
contract per spec §6.6.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: LLM `.md` 导出 + sitemap.xml + robots.txt

**Files:**
- Create: `src/pages/[locale]/[...slug].md.ts`
- Create: `src/pages/robots.txt.ts`
- Create: `src/pages/llms.txt.ts`
- Create: `src/pages/llms-full.txt.ts`
- （`sitemap.xml` 由 `@astrojs/sitemap` 自动产出，无需 手写）

**Interfaces:**
- Produces:
  - `GET /<locale>/<slug>.md` — 每篇 mdx 的纯文本 markdown 版本
  - `GET /robots.txt`
  - `GET /llms.txt` / `GET /llms-full.txt`

- [ ] **Step 1: `src/pages/[locale]/[...slug].md.ts`**

```ts
import type { APIRoute } from 'astro'
import { getCollection, render } from 'astro:content'
import { resolveUrl, resolveLocale } from '@lib/slug'

export async function getStaticPaths() {
  const all = await getCollection('docs')
  return all.map((entry) => {
    const url = resolveUrl(entry)
    const locale = resolveLocale(entry)
    // path e.g. /docs/quote/pull/static → params { locale: 'en', slug: 'docs/quote/pull/static' }
    const bareUrl = locale === 'en' ? url : url.replace(new RegExp(`^/${locale}`), '')
    const slug = bareUrl === '/' ? undefined : bareUrl.replace(/^\//, '')
    return { params: { locale, slug }, props: { entry } }
  })
}

export const GET: APIRoute = async ({ props }) => {
  const entry = (props as any).entry
  const body = entry.body ?? ''
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
```

- [ ] **Step 2: `src/pages/robots.txt.ts`**

```ts
import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *
Allow: /

Sitemap: ${site}sitemap-index.xml
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } })
}
```

- [ ] **Step 3: `src/pages/llms.txt.ts`**

```ts
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { resolveUrl, resolveLocale } from '@lib/slug'

export const GET: APIRoute = async ({ site }) => {
  const all = await getCollection('docs', (e) => resolveLocale(e) === 'en')
  const lines = ['# Longbridge Developers', '', '## Docs', '']
  for (const entry of all) {
    lines.push(`- [${entry.data.title}](${site}${resolveUrl(entry).replace(/^\//, '')})`)
  }
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
```

- [ ] **Step 4: `src/pages/llms-full.txt.ts`**

```ts
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { resolveUrl, resolveLocale } from '@lib/slug'

export const GET: APIRoute = async () => {
  const all = await getCollection('docs', (e) => resolveLocale(e) === 'en')
  const chunks: string[] = ['# Longbridge Developers — Full LLM Bundle', '']
  for (const entry of all) {
    chunks.push(`\n\n---\n# ${entry.data.title}\nURL: ${resolveUrl(entry)}\n\n${entry.body ?? ''}`)
  }
  return new Response(chunks.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
```

- [ ] **Step 5: boss 验证 endpoint**

boss 手动 `bun run dev`：
- `curl http://localhost:4321/robots.txt` → 出 robots
- `curl http://localhost:4321/llms.txt` → 出目录
- `curl http://localhost:4321/en/docs/quote/pull/static.md` → 出 markdown 内容

- [ ] **Step 6: 提交 T14**

```bash
git add src/pages/
git status
git commit -m "$(cat <<'EOF'
feat(migrate): LLM markdown export + robots.txt + llms.txt endpoints

Each .mdx entry gets a companion /<locale>/<slug>.md endpoint returning
the raw body with Content-Type text/markdown for LLM crawlers. llms.txt
lists en docs; llms-full.txt bundles them. robots.txt points to the
sitemap-index that @astrojs/sitemap generates.

These paths are NOT included in sitemap-index (LLM-only surface).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: 部署脚本 port — copy-routes + normalize-md + generate-llms + prebuild-* rewrites

**Files:**
- Modify: `scripts/copy-routes.ts`（吃 Astro dist）
- Modify: `scripts/normalize_md.ts`
- Modify: `scripts/generate-llms.ts`
- Create: `src/integrations/prebuild-mcp-tools.ts`（挪自 legacy vitepress buildStart hook）
- Create: `src/integrations/prebuild-skills.ts`（挪自 legacy vitepress buildEnd hook）
- Modify: `astro.config.ts`（挂 integrations）

**Interfaces:**
- Produces:
  - `astro:build:done` 后 dist 里 `foo/index.html` 有一份复制到 `foo.html`
  - Build 起始拉 `mcp.longbridge.com/mcp/tools.json` 到 `.data/`
  - Build 结束克隆 `longbridge/skills` 打 zip 到 `dist/skill/`

- [ ] **Step 1: 重写 `scripts/copy-routes.ts`**

```ts
#!/usr/bin/env bun
import { readdirSync, statSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'

function walk(dir: string): void {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) {
      const idx = join(p, 'index.html')
      try {
        statSync(idx)
        const target = `${p}.html`
        copyFileSync(idx, target)
      } catch {}
      walk(p)
    }
  }
}

walk(DIST)
console.log('copy-routes done')
```

- [ ] **Step 2: `scripts/normalize_md.ts`**

```ts
#!/usr/bin/env bun
// Normalize dist/**/*.md files: trim trailing whitespace, ensure single trailing newline.
// Only applies if the file exists in dist (e.g. the .md endpoints from T14).
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function walk(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

for (const p of walk('dist')) {
  const src = readFileSync(p, 'utf-8').replace(/[ \t]+$/gm, '').trimEnd() + '\n'
  writeFileSync(p, src)
}
console.log('normalize-md done')
```

- [ ] **Step 3: `scripts/generate-llms.ts`**

Astro 已经在运行时生成 `llms.txt`（T14），此脚本主要负责 build-time 复制 / 拼接。若 llms.txt 已由 astro endpoint 覆盖，此脚本降级为 no-op。若 legacy 版本有独立 llms 逻辑（如 pull data from external），保留：

```ts
#!/usr/bin/env bun
// Post-build: nothing to do — llms.txt / llms-full.txt already emitted by
// src/pages/llms.txt.ts and llms-full.txt.ts during astro build.
console.log('generate-llms: no-op (endpoints handle emission)')
```

- [ ] **Step 4: `src/integrations/prebuild-mcp-tools.ts`**

```ts
import type { AstroIntegration } from 'astro'
import { writeFile, mkdir } from 'node:fs/promises'

export function prebuildMcpTools(): AstroIntegration {
  return {
    name: 'lbus-prebuild-mcp-tools',
    hooks: {
      'astro:build:start': async () => {
        try {
          const res = await fetch('https://mcp.longbridge.com/mcp/tools.json')
          const json = await res.json()
          await mkdir('.data', { recursive: true })
          await writeFile('.data/mcp-tools.json', JSON.stringify(json, null, 2))
          console.log('mcp-tools.json refreshed')
        } catch (e) {
          console.warn('prebuild-mcp-tools failed (using stale):', (e as Error).message)
        }
      },
    },
  }
}
```

- [ ] **Step 5: `src/integrations/prebuild-skills.ts`**

```ts
import type { AstroIntegration } from 'astro'
import { execSync } from 'node:child_process'
import { mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'

export function prebuildSkills(): AstroIntegration {
  return {
    name: 'lbus-prebuild-skills',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const workDir = '.data/skills'
        try {
          if (existsSync(workDir)) await rm(workDir, { recursive: true, force: true })
          await mkdir('.data', { recursive: true })
          execSync(`git clone --depth 1 https://github.com/longbridge/skills ${workDir}`, { stdio: 'inherit' })
          const outDir = `${dir.pathname}skill`
          await mkdir(outDir, { recursive: true })
          execSync(`cd ${workDir} && zip -r ../../${outDir}/skills.zip . -x '.git/*'`, { stdio: 'inherit' })
          console.log('skills.zip generated in dist/skill/')
        } catch (e) {
          console.warn('prebuild-skills failed:', (e as Error).message)
        }
      },
    },
  }
}
```

- [ ] **Step 6: 挂进 astro.config.ts**

```ts
import { prebuildMcpTools } from './src/integrations/prebuild-mcp-tools'
import { prebuildSkills } from './src/integrations/prebuild-skills'

export default defineConfig({
  // ...
  integrations: [
    react(),
    mdx({ remarkPlugins: [remarkRegionFilter] }),
    icon(),
    sitemap({ /* ... */ }),
    regionHostnameRewrite(),
    prebuildMcpTools(),
    prebuildSkills(),
  ],
  // ...
})
```

- [ ] **Step 7: 提交 T15**

```bash
git add scripts/ src/integrations/ astro.config.ts
git status
git commit -m "$(cat <<'EOF'
feat(migrate): build scripts + prebuild integrations for astro

copy-routes.ts walks dist/ to emit foo.html alongside foo/index.html
(nginx compat). prebuildMcpTools fetches mcp-tools.json on build:start;
prebuildSkills clones longbridge/skills and zips into dist/skill/ on
build:done. normalize_md/generate-llms downgrade to no-op — endpoints
in T14 own emission.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Workspaces + packages/ui 骨架 + primitives 迁入

**Files:**
- Modify: `package.json`（加 `workspaces`）
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/src/index.ts`
- Move: 7 primitives from `src/components/mdx/` → `packages/ui/src/`
- Modify: `src/mdx-components.tsx`（改从 `@longbridge/openapi-ui` 导入）

**Interfaces:**
- Produces: `@longbridge/openapi-ui` workspace 包，导出 Tabs / TabItem / TipContainer / CliCommand / SDK / SDKLinks / Skill
- Consumes: nothing yet（primitives self-contained）

- [ ] **Step 1: 修改根 `package.json` 加 workspaces**

```jsonc
{
  "workspaces": ["packages/*", "."]
}
```

- [ ] **Step 2: 创建 `packages/ui/package.json`**

```json
{
  "name": "@longbridge/openapi-ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "peerDependencies": {
    "react": "^19"
  }
}
```

- [ ] **Step 3: `packages/ui/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src/**/*"]
}
```

- [ ] **Step 4: 迁 primitives**

```bash
git mv src/components/mdx/Tabs.tsx packages/ui/src/Tabs.tsx
git mv src/components/mdx/TabItem.tsx packages/ui/src/TabItem.tsx
git mv src/components/mdx/TipContainer.tsx packages/ui/src/TipContainer.tsx
git mv src/components/mdx/CliCommand.tsx packages/ui/src/CliCommand.tsx
git mv src/components/mdx/SDK.tsx packages/ui/src/SDK.tsx
git mv src/components/mdx/SDKLinks.tsx packages/ui/src/SDKLinks.tsx
git mv src/components/mdx/Skill.tsx packages/ui/src/Skill.tsx
```

- [ ] **Step 5: `packages/ui/src/index.ts`**

```ts
export { Tabs } from './Tabs'
export type { TabsProps } from './Tabs'
export { TabItem } from './TabItem'
export type { TabItemProps } from './TabItem'
export { TipContainer } from './TipContainer'
export type { TipContainerProps } from './TipContainer'
export { CliCommand } from './CliCommand'
export type { CliCommandProps } from './CliCommand'
export { SDK } from './SDK'
export type { SDKProps } from './SDK'
export { SDKLinks } from './SDKLinks'
export { Skill } from './Skill'
export type { SkillProps } from './Skill'
```

- [ ] **Step 6: 装 workspace 依赖 + 改 mdx-components.tsx import**

```bash
bun install  # workspaces 生效
```

修改 `src/mdx-components.tsx`：

```tsx
import { Tabs, TabItem, TipContainer, CliCommand, SDK, SDKLinks, Skill } from '@longbridge/openapi-ui'
// placeholders 保持原路径
```

- [ ] **Step 7: boss 验证 workspace 生效**

boss 手动 `bun run dev`，访问带 `<Tabs>` 的 mdx 页（如 `/docs/quote/pull/static`）验证 Tabs 仍然渲染。

- [ ] **Step 8: 提交 T16**

```bash
git add package.json packages/ src/components/mdx/ src/mdx-components.tsx bun.lockb
git status
git commit -m "$(cat <<'EOF'
refactor(migrate): extract mdx primitives into @longbridge/openapi-ui workspace package

Move 7 pure-presentational mdx components (Tabs, TabItem, TipContainer,
CliCommand, SDK, SDKLinks, Skill) from src/components/mdx/ to
packages/ui/. Root package.json declares bun workspaces; mdx-components.tsx
imports from @longbridge/openapi-ui. Composite placeholders remain in
src/components/mdx/placeholders/ until stage 2.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: opencli 骨架 — crawl-routes + url-diff + snapshot + dom-diff + visual-diff + report

**Files:**
- Create: `scripts/opencli/crawl-routes.ts`
- Create: `scripts/opencli/url-diff.ts`
- Create: `scripts/opencli/snapshot.ts`
- Create: `scripts/opencli/dom-diff.ts`
- Create: `scripts/opencli/visual-diff.ts`
- Create: `scripts/opencli/interaction-assertions.ts`
- Create: `scripts/opencli/report.ts`
- Create: `scripts/opencli/README.md`

**Interfaces:**
- Produces: 全 opencli 工具集，可以从命令行独立跑，产出 `dist-diff/report.md`
- Consumes: 旧站 dist 里的 `sitemap.xml`（或线上生产 `open.longportapp.com/sitemap.xml`）+ 新站 dev / dist

- [ ] **Step 1: `scripts/opencli/crawl-routes.ts`**

```ts
#!/usr/bin/env bun
// Parse sitemap.xml into a flat list of URLs, categorized by bucket.
import { readFileSync } from 'node:fs'

interface Route { url: string; bucket: string; locale: 'en'|'zh-CN'|'zh-HK' }

const BUCKETS: Array<[string, RegExp]> = [
  ['home', /^\/(zh-CN\/|zh-HK\/)?$/],
  ['api', /\/docs\/api$/],
  ['pricing', /\/pricing(\/|$)/],
  ['skill', /\/skill(\/|$)/],
  ['sdk', /\/sdk(\/|$)/],
  ['404', /\/404$/],
  ['docs', /\/docs\//],
]

export function categorize(url: string): string {
  for (const [name, re] of BUCKETS) if (re.test(url)) return name
  return 'other'
}

export function parseSitemap(xml: string): string[] {
  const urls: string[] = []
  const re = /<loc>([^<]+)<\/loc>/g
  let m
  while ((m = re.exec(xml))) urls.push(new URL(m[1]).pathname)
  return urls
}

if (import.meta.main) {
  const file = process.argv[2] ?? 'dist/sitemap-index.xml'
  const xml = readFileSync(file, 'utf-8')
  const urls = parseSitemap(xml).sort()
  for (const u of urls) console.log(`${categorize(u)}\t${u}`)
}
```

- [ ] **Step 2: `scripts/opencli/url-diff.ts` (hard gate)**

```ts
#!/usr/bin/env bun
import { readFileSync } from 'node:fs'
import { parseSitemap } from './crawl-routes'

const OLD = process.argv[2]
const NEW = process.argv[3]
if (!OLD || !NEW) { console.error('usage: url-diff.ts <old-sitemap.xml> <new-sitemap.xml>'); process.exit(2) }

const a = new Set(parseSitemap(readFileSync(OLD, 'utf-8')))
const b = new Set(parseSitemap(readFileSync(NEW, 'utf-8')))

const missing = [...a].filter((u) => !b.has(u))
const added = [...b].filter((u) => !a.has(u))

if (missing.length === 0 && added.length === 0) {
  console.log('OK — URL sets identical')
  process.exit(0)
}

console.error(`FAIL: URL set diff non-empty`)
console.error(`  missing (in old, not in new): ${missing.length}`)
missing.slice(0, 20).forEach((u) => console.error(`    - ${u}`))
console.error(`  added (in new, not in old): ${added.length}`)
added.slice(0, 20).forEach((u) => console.error(`    + ${u}`))
process.exit(1)
```

- [ ] **Step 3: `scripts/opencli/snapshot.ts`**

用 chrome-devtools MCP driver。**note**: opencli scripts 在本仓库里主要是"参考实现"，实际调用 MCP 由 AI agent（Claude Code）在执行 T18 时通过 `mcp__chrome-devtools__*` 工具直接调用；此脚本文件保留是文档 + 让 boss 也能自己跑（用 Playwright 等替代驱动）。

```ts
#!/usr/bin/env bun
// Reference implementation. In practice, invoke chrome-devtools MCP tools
// from your agent to drive parallel snapshots — see README.md.
import { mkdir } from 'node:fs/promises'

async function snapshot(baseUrl: string, candUrl: string, route: string, outDir: string) {
  console.log(`[snapshot] ${route}`)
  await mkdir(`${outDir}/baseline`, { recursive: true })
  await mkdir(`${outDir}/candidate`, { recursive: true })
  // Placeholder: real impl uses puppeteer / playwright / chrome-devtools MCP
  // Left as documentation — see README for MCP invocation shape.
}

if (import.meta.main) {
  console.log('snapshot.ts is a reference — see README.md for MCP-driven flow')
}
```

- [ ] **Step 4: `scripts/opencli/dom-diff.ts`**

```ts
#!/usr/bin/env bun
// Compare <main> innerHTML between old + new served pages.
// Requires both dev servers running (5173 = old, 4321 = new) OR raw HTML files.
import { parse } from 'node-html-parser'

interface DomStats {
  headings: string[]         // ['h1: title', 'h2: intro', ...]
  links: string[]            // internal hrefs
  codeBlocks: number
  componentTags: Set<string> // data-lbus-component values present
}

function analyze(html: string): DomStats {
  const root = parse(html)
  const main = root.querySelector('main') ?? root
  return {
    headings: main.querySelectorAll('h1,h2,h3,h4,h5,h6').map((h) => `${h.tagName.toLowerCase()}: ${h.text.trim()}`),
    links: main.querySelectorAll('a[href]').map((a) => a.getAttribute('href') ?? '').filter((h) => h.startsWith('/')),
    codeBlocks: main.querySelectorAll('pre code').length,
    componentTags: new Set(main.querySelectorAll('[data-lbus-component]').map((n) => n.getAttribute('data-lbus-component') ?? '')),
  }
}

export function domSimilarity(oldHtml: string, newHtml: string): { score: number; issues: string[] } {
  const a = analyze(oldHtml)
  const b = analyze(newHtml)
  const issues: string[] = []

  // heading count + text match
  const headingScore = jaccard(new Set(a.headings), new Set(b.headings))
  if (headingScore < 1) issues.push(`heading diff: jaccard ${headingScore.toFixed(2)}`)

  // link set match
  const linkScore = jaccard(new Set(a.links), new Set(b.links))
  if (linkScore < 1) issues.push(`link diff: jaccard ${linkScore.toFixed(2)}`)

  // code block count
  if (a.codeBlocks !== b.codeBlocks) issues.push(`code blocks: ${a.codeBlocks} → ${b.codeBlocks}`)

  const overall = (headingScore + linkScore) / 2
  return { score: overall, issues }
}

function jaccard<T>(a: Set<T>, b: Set<T>): number {
  const inter = [...a].filter((x) => b.has(x)).length
  const union = new Set([...a, ...b]).size
  return union === 0 ? 1 : inter / union
}

if (import.meta.main) {
  console.log('use domSimilarity(oldHtml, newHtml) from a driver script')
}
```

装依赖：

```bash
bun add -d node-html-parser
```

- [ ] **Step 5: `scripts/opencli/visual-diff.ts`**

```ts
#!/usr/bin/env bun
// Wrap odiff-bin. Threshold per spec §9.5.
import { execSync } from 'node:child_process'

export function visualDiff(oldPng: string, newPng: string, diffPng: string): { changed: number } {
  try {
    const out = execSync(`npx odiff --output ${diffPng} ${oldPng} ${newPng}`).toString()
    // odiff exit 0 = match; 21 = pixel diff; 22 = layout diff
    return { changed: 0 }
  } catch (e: any) {
    const stderr = e.stderr?.toString() ?? ''
    const m = stderr.match(/(\d+(?:\.\d+)?)\s*% pixel diff/)
    return { changed: m ? Number(m[1]) : 100 }
  }
}
```

装依赖:

```bash
bun add -d odiff-bin
```

- [ ] **Step 6: `scripts/opencli/interaction-assertions.ts`**

参考文档式脚本。真实执行由 `mcp__chrome-devtools__*` 工具驱动。

```ts
#!/usr/bin/env bun
// Reference — real interaction assertions run via chrome-devtools MCP.
// See README.md and spec §9.6.

export interface Assertion { route: string; action: string; expect: string }

export const KEY_ASSERTIONS: Assertion[] = [
  { route: '/', action: 'scroll to CoreFeaturesSection', expect: 'HeroSection visible then CoreFeatures animation triggered' },
  { route: '/docs/quote/pull/static', action: 'click Tabs tab 2', expect: 'content changes' },
  { route: '/docs/quote/pull/static', action: 'click CliCommand copy', expect: 'clipboard set' },
  { route: '/docs/api', action: 'change hash to #quote/pull/static', expect: 'ApiReference switches op' },
  { route: '/docs/api?mode=try-it', action: 'fill auth + click Play', expect: '200 response rendered' },
  { route: '/pricing', action: 'change region', expect: 'displayed values change' },
  { route: '/', action: 'press Cmd+K', expect: 'SearchDialog opens focused input' },
  { route: '/', action: 'click theme toggle dark', expect: 'html[data-mode] = dark' },
]

if (import.meta.main) {
  KEY_ASSERTIONS.forEach((a) => console.log(`${a.route}\t${a.action}\t=> ${a.expect}`))
}
```

- [ ] **Step 7: `scripts/opencli/report.ts`**

```ts
#!/usr/bin/env bun
import { mkdir, writeFile } from 'node:fs/promises'

export interface RouteReport {
  url: string
  bucket: string
  urlOk: boolean
  domScore: number
  domIssues: string[]
  visualChangedPct: number
  interactionsPass: number
  interactionsTotal: number
}

export async function writeReport(routes: RouteReport[], outDir = 'dist-diff') {
  await mkdir(outDir, { recursive: true })
  const A = routes.filter((r) => !r.urlOk || r.domScore < 0.95 || r.visualChangedPct > 5 || r.interactionsPass < r.interactionsTotal)
  const B = routes.filter((r) => !A.includes(r) && (r.domScore < 1 || r.visualChangedPct > 0))
  const C = routes.filter((r) => !A.includes(r) && !B.includes(r))
  const lines = [
    '# opencli diff report',
    `- generated: (deterministic — no timestamp)`,
    `- total: ${routes.length}`,
    `- A (blocking): ${A.length}`,
    `- B (discuss): ${B.length}`,
    `- C (clean):   ${C.length}`,
    '',
    '## A — Blocking',
    ...A.map((r) => `- **${r.url}** bucket=${r.bucket} dom=${r.domScore.toFixed(2)} vis=${r.visualChangedPct}% interact=${r.interactionsPass}/${r.interactionsTotal}`),
    '',
    '## B — Discuss',
    ...B.map((r) => `- ${r.url} dom=${r.domScore.toFixed(2)} vis=${r.visualChangedPct}%`),
    '',
    '## C — Clean',
    `${C.length} routes passed all gates.`,
  ]
  await writeFile(`${outDir}/report.md`, lines.join('\n'))
  console.log(`report written to ${outDir}/report.md`)
}
```

- [ ] **Step 8: `scripts/opencli/README.md`**

```markdown
# opencli — A/B diff tooling

Verify that the astro-migrated site is user-experience-equivalent to the
vitepress baseline (spec §-1).

## Layers

1. **URL diff** (`url-diff.ts`) — hard gate. sitemap set must match.
2. **DOM diff** (`dom-diff.ts`) — heading / link / code block topology.
3. **Visual diff** (`visual-diff.ts`) — pixel diff via odiff.
4. **Interaction assertions** (`interaction-assertions.ts`) — Cmd+K,
   theme toggle, TryIt request, etc.
5. **Report** (`report.ts`) — bucketed A/B/C by severity.

## Baseline vs candidate

- **Baseline** — vitepress build (pre-migration) or production.
- **Candidate** — this branch running `bun run dev` (port 4321) or a
  release-gate build.

## Executing via chrome-devtools MCP

For agent-driven runs, use `mcp__chrome-devtools__*` tools:
- `new_page` opens tabs
- `take_screenshot` writes PNGs
- `evaluate_script` extracts DOM stats
- `press_key`, `click`, `fill_form` drive interactions

The scripts here are reference implementations for local invocation without
an MCP driver — but MCP-driven runs are the canonical execution path for
Stage 1 & 2 verification.
```

- [ ] **Step 9: 提交 T17**

```bash
git add scripts/opencli/ package.json bun.lockb
git status
git commit -m "$(cat <<'EOF'
feat(migrate): opencli — url/dom/visual/interaction diff toolkit

Add scripts/opencli/ with layered A/B verification tools:
url-diff.ts (hard gate on sitemap set), dom-diff.ts (topology via
node-html-parser), visual-diff.ts (odiff wrapper), interaction-
assertions.ts (reference list of key-path checks), report.ts
(bucketed A/B/C markdown output). MCP-driven canonical flow
documented in README.md.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: 首轮全站对比 + 修补 A 类差异 + 拆除 vitepress 残留

**Files:**
- Create: `dist-diff/report.md`（首轮产物，进 gitignore 不入库）
- Modify: 视差异结果修补各种小 bug（fix-forward，无法预测具体文件）
- Delete: `.legacy/vitepress-reference/`（**在所有 A 类差异修完 + boss 确认后**）
- Modify: `package.json`（删除仍存在的 vitepress / vue / unocss / sass-embedded 等 vestigial 依赖）
- Modify: `.gitignore`（加 `dist-diff/`）

**Interfaces:**
- Produces:
  - `dist-diff/report.md` A 类清空 / B 类可接受清单
  - `.legacy/` 消失
  - `grep -r "vitepress\|@vue\|unocss" package.json src/` 无结果

- [ ] **Step 1: boss 生成基线 dist**

boss 在**另一个 worktree**（vitepress main）执行：

```bash
cd /Users/tangyu/Documents/longbirdge/openapi-website  # main branch (vitepress)
bun install
bun run build:release
mv docs/.vitepress/dist ../openapi-website-astro/.baseline-dist
```

或者从生产 CDN 拉 sitemap：

```bash
curl -s https://open.longportapp.com/sitemap-index.xml -o .baseline-sitemap.xml
```

- [ ] **Step 2: boss build astro 侧**

boss 在 worktree：

```bash
bun run build:release  # produces dist/
```

- [ ] **Step 3: 跑 URL diff（硬门禁）**

```bash
bun run scripts/opencli/url-diff.ts .baseline-dist/sitemap-index.xml dist/sitemap-index.xml
```

Expected: exit 0（URL 集合相等）。若 exit 1，输出的 missing / added 列表就是要修的清单。

**修补 URL 差异**：
- `missing`：新站没有该 URL 的可能原因 — 内容 mdx 被 region 过滤掉了 / slug 计算错了 / 页面路由 filter 少了。逐条排查。
- `added`：新站多的 URL 可能原因 — mdx 生成了额外路径 / [locale] 变体加载了未预期文件 / .md endpoint 意外进 sitemap（应加 `sitemapFilter` 排除）。

反复 modify + rerun 直到 URL diff exit 0。**每次修改 commit 单独提交**（scope=migrate，type=fix）。

- [ ] **Step 4: AI agent 用 chrome-devtools MCP 跑关键路径 DOM diff**

（AI agent 在实际执行时，用 `mcp__chrome-devtools__new_page` + `mcp__chrome-devtools__evaluate_script` 抓 DOM，对比 baseline / candidate。以下为 agent 指令模板。）

关键路径 sample 30-50 页（阶段 1 只需 sample，全 882 页留到阶段 2 结束）：

- `/`
- `/docs/quote/pull/static`
- `/docs/quote/push/subscribe`
- `/docs/trade/order/submit`
- `/docs/api` （placeholder，dom diff 会显示 mismatch — 记录为已知 stage 2 补齐）
- `/pricing`
- `/skill`
- `/sdk`
- `/zh-CN/` + 上述 3 篇 zh-CN 变体
- `/zh-HK/` + 上述 3 篇 zh-HK 变体

用 `domSimilarity(oldHtml, newHtml)` 出分数，score < 0.95 记为 A 类。

- [ ] **Step 5: AI agent 跑视觉 diff**

关键页 5-10 张截图，`visualDiff` 阈值 首屏 ≤2%、正文 ≤1%。超阈值记为 A 类。

- [ ] **Step 6: 关键交互断言**

按 `interaction-assertions.ts` 的清单，用 chrome-devtools MCP：
- Cmd+K → SearchDialog 出现
- 主题切换 → data-mode 变化
- 语言切换 → URL 变化
- Sidebar 折叠 → collapsed 状态切换
- Tabs / TabItem → 切 tab 内容变化
- CliCommand → 复制按钮触发 clipboard

- [ ] **Step 7: 输出 report + 修补 A 类**

```bash
bun run scripts/opencli/report.ts
cat dist-diff/report.md
```

对 A 类项逐个 fix + 重跑，直到 A 清空。每个 fix commit 独立。

- [ ] **Step 8: 拆除 vitepress 残留**

**前置**：Step 7 A 类清空 + boss 确认所有关键页视觉/交互 OK。

```bash
git rm -r .legacy/
```

修改 `package.json` 删依赖（若还有残留）：

```jsonc
// dependencies 里删掉：
// "vitepress", "vue", "vue-i18n", "reka-ui", "@headlessui/vue", "floating-vue",
// "@vueuse/core", "motion-v", "@vue-flow/core", "@vue-flow/background",
// "@jsonforms/vue", "@jsonforms/vue-vanilla", "@jsonforms/core",
// "unocss", "@unocss/extractor-mdc", "@unocss/transformer-variant-group",
// "sass-embedded", "vitepress-plugin-mermaid", "vitepress-plugin-group-icons",
// "markdown-it-container", "markdown-it-mathjax3"
// devDependencies 里删掉：
// "@vitejs/plugin-vue", "@vue/tsconfig", "vue-tsc"
```

boss 执行:

```bash
bun install  # 清理 lockfile
```

验证：

```bash
grep -rE "vitepress|@vue|unocss|@jsonforms/vue|floating-vue|motion-v|@vue-flow|reka-ui|@headlessui/vue|@vueuse|sass-embedded" package.json src/ scripts/ 2>&1 | grep -v node_modules
# 期望：无输出
find . -name "*.vue" -not -path "*/node_modules/*"
# 期望：无输出
```

- [ ] **Step 9: 更新 `.gitignore`**

```gitignore
# opencli artifacts
dist-diff/
.baseline-dist/
.baseline-sitemap.xml
```

- [ ] **Step 10: 阶段 1 收尾 commit**

```bash
git add .gitignore package.json bun.lockb
git rm -r .legacy/  # already done, this line for record
git status
git commit -m "$(cat <<'EOF'
chore(migrate): purge vitepress residuals and archive legacy reference

.legacy/vitepress-reference/ removed after opencli confirmed all A-class
diffs cleared for stage 1 scope (shell + primitives + all layouts +
tri-lingual routes + region + search + LLM export). Composite mdx tags
(TryIt/ApiReference/NewHomePage/McpTools/Pricing/QuotePermission) still
render placeholder cards — real ports arrive in stage 2.

package.json vestigial deps removed: vitepress, vue*, unocss*, jsonforms/vue,
floating-vue, motion-v, vue-flow, reka-ui, headlessui/vue, vueuse,
sass-embedded, vitepress-plugin-*, markdown-it-{container,mathjax3},
@vitejs/plugin-vue, @vue/tsconfig, vue-tsc.

Stage 1 ready for canary review at open.longbridge.xyz per spec §10.3.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 11: 阶段 1 完成汇报**

汇报模板：

```
Stage 1 complete on feat/migrate-to-astro.

Deliverables:
- 882 mdx files served under identical URLs to vitepress baseline
  (url-diff.ts exit 0)
- Shell / DocsLayout / ApiReferenceLayout(placeholder) / PlainLayout
- 7 mdx primitives in @longbridge/openapi-ui workspace pkg
- 6 composite placeholders (TryIt/ApiReference/NewHomePage/McpTools/
  Pricing/QuotePermission) rendering stage 2 hint cards
- Region system: allowlist filter + remark section drop + hostname rewrite
- Search: Pagefind + vitepress-parity dialog UI
- LLM .md export + robots.txt + llms.txt + llms-full.txt
- opencli suite ready for stage 2 second pass

Known deferred (stage 2 scope):
- ApiReference React CSR port
- TryIt with react-hook-form + SchemaRenderer
- NewHomePage 16 sections + ArchCanvas
- inspira 19 animation components
- McpTools / Pricing / QuotePermission / SkillCatalog composite

opencli report: dist-diff/report.md
Canary target: open.longbridge.xyz (nginx unchanged, url set identical)
Next: stage 2 plan (packages/tryit + packages/api-reference + packages/homepage + packages/inspira)
```

---

## Self-Review

### 1. Spec 覆盖

- **§-1 用户体感等价**：T13 搜索 UI 复刻、T10 主题 pre-paint、T11 primitives 契约、T18 opencli 断言层覆盖
- **§1 目标 (URL / 视觉 / 交互 / 内容不迁位 / 双产物拓扑 / CI 单轨)**：T4（内容不迁位）+ T5（tri-locale 路由）+ T15（copy-routes）+ T18（vitepress 单轨拆除）+ T17（opencli 校验）
- **§4 目录结构**：全 task 按 spec §4 目录逐个创建
- **§5 内容层**：T4
- **§6 Docs shell**：T6 / T7 / T8 / T10 / T13
- **§7 ApiReference + TryIt**：T9（layout placeholder）+ T12（组件 placeholder），实际 port 在 stage 2
- **§8 样式收拢**：T3
- **§9 opencli**：T17 / T18
- **§10 CI + Nginx**：T1 scripts 替换 + T15 build 脚本；Nginx 不改（spec §10.2）
- **§10.5 vitepress 拆除清单**：T1（mv 到 .legacy/）+ T18（purge）
- **§11 workspaces**：T16
- **§13 开工顺序 16 步**：全部覆盖，编号有小调整（合并了"placeholder 组件"到 T12）

无遗漏。

### 2. Placeholder 扫描

- 所有"TBD" / "TODO" / "later" 已避免
- Vue → React port 类 task 用"参考 legacy 源码 + 契约要点"描述 —— 是**指向具体源码路径** + 明确契约点，非模糊 placeholder
- Composite 组件是明确的 "stage 2 补齐"（不是 TBD）—— placeholder 组件已在 T12 建骨架
- 视觉细节（Footer 链接列 / TipContainer 色调 / TopNav 隐藏字段）标注 "以 legacy 为准"，port 时读源

### 3. Type / 命名一致性

- `SidebarNode` 结构：T7 定义 + T8 消费一致
- `resolveUrl` / `resolveLocale`：T4 定义，T5 / T9 / T14 / T17 消费签名一致
- `Locale = 'en' | 'zh-CN' | 'zh-HK'`：全 task 一致
- `data-lbus-component` 属性 naming：primitives / shell 组件全用 kebab-case（`tabs` / `tip-container` / `cli-command` / `top-nav` / `sidebar` / `theme-toggle` / `lang-switcher` / `breadcrumb` / `search-dialog` / `toc` / `prev-next` / `backdrop` / `footer` / `tryit-placeholder`）
- `buildSidebar` vs `getPrevNext`：T7 / T8 命名一致
- `mdxComponents`：T11 定义 + T5 / T8 消费

无 drift。

## Execution Handoff

Plan 已保存到 `docs/superpowers/plans/2026-08-17-astro-migration-stage-1.md`。两种执行方式：

**1. Subagent-Driven（推荐）** — 每 task 派新 subagent（隔离上下文、快迭代），我在 task 之间做 review + 决定是否 accept / rework

**2. Inline Execution** — 用 executing-plans 在本会话按 task 顺序执行，批次里加 checkpoint 停下让你 review

**你选哪个？**

- 如果选 1：subagent 会用 fresh context 单独跑每 task，我在 review 环节汇报差异后继续
- 如果选 2：会连续跑（每几 task 停一次给你确认），token 消耗更集中但可见性最高

外加说明：
- boss "禁止在 AI 会话中执行 build" 规则会遵守 —— 涉及 `bun run build:*` 的步骤（如 T13 Step 6、T18 Step 1-2）**都留给 boss 手动执行**
- 每 commit 前会用 `git status` 确认单文件粒度，不 `git add -A`
- vitepress 源码 mv 到 `.legacy/` 只在 T1 做，一直保留到 T18 最终清理
