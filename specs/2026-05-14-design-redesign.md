# Design Redesign Spec — 2026-05-14

## 目标

按 DESIGN.md 规范对首页（Homepage）、Skill 页、Pricing 页进行设计优化，建立 `--lb-*` CSS 变量层，统一按钮、卡片、徽标、section 背景节奏，同时保留产品卡片和数据层级的多色系统。

**范围约定：**
- 字体保持 Inter，不引入 Cera Pro / Geist
- Light / Dark 双模式全部适配
- 多色保留：CoreFeatures 产品卡片、Skill 场景卡片、Pricing 数据权限 badge 各自保留差异色
- 结构型元素（按钮、Hero 背景、section 背景、卡片边框、阴影）按 DESIGN.md 统一

---

## 1. CSS 变量层（`css-var.scss`）

在现有 `:root` / `.dark` 块末尾追加 `--lb-*` token，不删改现有变量。

### 1.1 按钮 token

```scss
/* Primary Button */
--lb-btn-primary-bg:        #000000;
--lb-btn-primary-bg-dark:   #ffffff;
--lb-btn-primary-text:      #ffffff;
--lb-btn-primary-text-dark: #000000;
--lb-btn-primary-radius:    9999px;
--lb-btn-primary-h:         36px;
--lb-btn-primary-px:        20px;
--lb-btn-primary-fs:        14px;
--lb-btn-primary-fw:        500;

/* Secondary Button */
--lb-btn-secondary-bg:        rgba(210, 210, 210, 0.6);
--lb-btn-secondary-bg-dark:   rgba(255, 255, 255, 0.10);
--lb-btn-secondary-text:      #0f1729;
--lb-btn-secondary-text-dark: rgba(255, 255, 255, 0.85);
--lb-btn-secondary-border:    rgba(0, 0, 0, 0.10);
--lb-btn-secondary-border-dark: rgba(255, 255, 255, 0.15);
--lb-btn-secondary-radius:    30px;
--lb-btn-secondary-h:         36px;
```

### 1.2 卡片 token

```scss
--lb-card-bg:         #ffffff;
--lb-card-border:     #e5e7eb;
--lb-card-radius:     12px;
--lb-card-shadow-1:   rgba(0,0,0,0.04) 0px 2px 8px;   /* static */
--lb-card-shadow-2:   rgba(0,0,0,0.09) 0px 8px 24px;  /* hover */
--lb-card-bg-dark:    rgba(255,255,255,0.04);
--lb-card-border-dark: rgba(255,255,255,0.09);
```

### 1.3 Badge token

```scss
--lb-badge-fs:      12px;
--lb-badge-fw:      600;
--lb-badge-lh:      1;
--lb-badge-px:      8px;
--lb-badge-py:      4px;
--lb-badge-radius:  9999px;
```

### 1.4 Section 背景 token

```scss
--lb-section-bg:    var(--vp-c-bg);       /* #ffffff / dark equiv */
--lb-section-bg-alt: var(--vp-c-bg-soft); /* #f8f9fa / dark equiv */
```

---

## 2. 首页 Hero（`HeroSection.vue`）

### 2.1 主按钮（替换 ShimmerButton）

| 属性 | 值 |
|------|-----|
| background | `var(--lb-btn-primary-bg)` — `#000` |
| color | `#ffffff` |
| border-radius | `9999px` |
| height | `36px` |
| padding | `10px 20px` |
| font-size | `14px` |
| font-weight | `500` |
| box-shadow | `rgba(0,0,0,0.07) 0px 4px 16px` |
| hover | opacity `0.85`，shadow 加深 |
| dark | background `#ffffff`，color `#000` |

移除 `ShimmerButton` 组件及 `shimmer-*` props，改为原生 `<a>` + 直接样式。

### 2.2 次按钮（替换青色边框）

| 属性 | 值 |
|------|-----|
| background | `rgba(210,210,210,0.6)` |
| color | `#0f1729` |
| border | `1px solid rgba(0,0,0,0.1)` |
| border-radius | `30px` |
| height | `36px` |
| font-size | `14px` |
| hover | background `rgba(210,210,210,0.8)` |
| dark | background `rgba(255,255,255,0.10)`，color `rgba(255,255,255,0.85)` |

移除 `.hero-cta-secondary` 的 `var(--brand-100)` 颜色和 `border-color` 逻辑。

---

## 3. 快速开始（`GetStarted.vue`）

### 3.1 图标容器

每张卡片顶部新增 40×40px icon wrap：

```css
.gs-card-icon-wrap {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
```

三张卡片分别对应颜色：

| 卡片 | icon-wrap bg | icon color |
|------|-------------|------------|
| 认证（auth） | `rgba(0,184,184,0.10)` | `#00b8b8` |
| API Reference | `rgba(42,153,254,0.10)` | `#2a99fe` |
| CLI 指南 | `rgba(252,82,0,0.10)` | `#fc5200` |

Dark 下：透明度略高（`0.12`），颜色维持。

### 3.2 卡片 hover

**只做阴影加深 + 上浮，不改变边框颜色：**

```css
.gs-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--lb-card-shadow-2);
  /* border-color 不变，保持 #e5e7eb */
}
```

### 3.3 描述文字

`.gs-card-desc` 颜色从 `var(--vp-c-text-3)` 改为 `var(--vp-c-text-2)`（提高可读性）。

### 3.4 链接文字

`.gs-card-link` 始终可见（灰色 `var(--vp-c-text-3)`），hover → `var(--brand-color)`，移除 `align-self: flex-end`，改为在 card 内部底部自然排列。

---

## 4. Pricing 页（`Pricing.vue`）

### 4.1 产品卡片边框

所有三张 tier 卡片统一使用 `border: 1px solid var(--lb-card-border)`（`#E5E7EB`），移除现有 HK LV2 / OPRA 的蓝色 border-color 覆盖逻辑。

### 4.2 Badge 规范

Tier badge 使用 LEVEL_COLORS（来自 `QuotePermissionData.ts`），不改变颜色数据，只统一 badge 形状：

```css
.tier-badge {
  display: inline-flex; align-items: center;
  font-size: var(--lb-badge-fs);       /* 12px */
  font-weight: var(--lb-badge-fw);     /* 600 */
  line-height: var(--lb-badge-lh);     /* 1 */
  padding: var(--lb-badge-py) var(--lb-badge-px); /* 4px 8px */
  border-radius: var(--lb-badge-radius); /* 9999px */
}
```

颜色取值规则（按 LEVEL_COLORS 原始值）：

| Tier | bg | color | border |
|------|-----|-------|--------|
| lv1（US） | `rgba(59,130,246,0.10)` | `#2563eb` | `#3b82f6` |
| lv2（HK） | `rgba(249,115,22,0.10)` | `#ea580c` | `#f97316` |
| opra | `rgba(168,85,247,0.10)` | `#9333ea` | `#a855f7` |

### 4.3 卡片 hover

```css
.pricing-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--lb-card-shadow-2);
  /* border 不变 */
}
```

---

## 5. Section 背景节奏（首页）

各 section 奇偶交替，以 `var(--lb-section-bg)` / `var(--lb-section-bg-alt)` 区分：

| Section | bg token |
|---------|---------|
| Hero | `--lb-section-bg`（白） |
| PlatformStats | `--lb-section-bg-alt`（#F8F9FA） |
| ArchSection | `--lb-section-bg` |
| CoreFeatures | `--lb-section-bg-alt` |
| Product CLI/Skill/MCP/OpenAPI | `--lb-section-bg` |
| CapSection | `--lb-section-bg-alt` |
| GetStarted | `--lb-section-bg-alt` |

Dark 下 `--vp-c-bg` / `--vp-c-bg-soft` 已有适当对应，无需新增 dark 变量。

---

## 6. Skill 页 Hero（`Skill.vue`）

### 6.1 顶部 Badge

在 `.skill-hero` 内容顶部新增 badge，位于 `.skill-title` 之前：

```html
<div class="skill-hero-badge">Longbridge Developers · Skill</div>
```

```css
.skill-hero-badge {
  display: inline-flex; align-items: center;
  font-size: 12px; font-weight: 600; line-height: 1;
  padding: 4px 10px; border-radius: 9999px;
  border: 1px solid var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 8%, transparent);
  color: var(--brand-color);
  margin-bottom: 20px;
}
```

### 6.2 cmd block

`.skill-cmd-block--prominent` 背景 / 边框对齐 Standard Card：

```css
background: var(--lb-section-bg-alt);
border: 1px solid var(--lb-card-border);
border-radius: 10px;
```

---

## 7. 不改动项

以下内容明确保留，不纳入本次改动范围：

- `CoreFeaturesSection.vue` 产品卡片的 per-product accent 色（skill/cli/mcp/sdk/paper/llm）
- `Skill.vue` 场景卡片的 per-scenario 色（monitor/research/trade/chart/portfolio/coding）
- `HeroSection.vue` FlickeringGrid 背景动效和 ColourfulText 动态产品名
- `font.css` Inter 字体加载，不修改
- 首页整体布局结构和 section 内容

---

## 涉及文件

| 文件 | 改动类型 |
|------|---------|
| `docs/.vitepress/theme/style/css-var.scss` | 追加 `--lb-*` token |
| `docs/.vitepress/theme/components/NewHomePage/HeroSection.vue` | 按钮替换 |
| `docs/.vitepress/theme/components/NewHomePage/GetStarted.vue` | 图标、hover、文字 |
| `docs/.vitepress/theme/components/NewHomePage/*.vue`（各 section） | bg token 规范化 |
| `docs/.vitepress/theme/components/Pricing.vue` | badge 形状、卡片 border |
| `docs/.vitepress/theme/components/Skill.vue` | Hero badge、cmd block |
