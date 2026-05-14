# Design System Inspired by Longbridge Singapore

## 1. Visual Theme & Atmosphere

Longbridge's design system embodies a **modern fintech aesthetic** with clean, professional lines and a forward-thinking digital-first approach. The visual language balances sophistication with accessibility, combining a deep navy foundation with vibrant cyan accents that evoke innovation, trust, and energy in financial markets. The design prioritizes clarity and efficiency, using ample whitespace and a restrained color palette to reduce cognitive load while maintaining visual interest through strategic use of gradients and layered depth effects. The overall atmosphere is professional yet approachable—designed for serious investors who appreciate cutting-edge technology and seamless user experiences.

**Key Characteristics**
- Clean, minimalist aesthetic with strategic use of negative space
- Deep navy (`#0F1729`) as the dominant dark anchor paired with cyan (`#00B8B8`) for dynamic accents
- Modern sans-serif typography with clear hierarchy and generous spacing
- Subtle elevation and glassmorphic effects for contemporary depth
- High contrast for accessibility and readability
- Playful yet professional tone through icon illustration and gradient overlays
- Mobile-first responsive design optimized for trading workflows

## 2. Color Palette & Roles

### Primary
- **Longbridge Navy** (`#0F1729`): Primary background and text color for main UI surface; used across headers, navigation, and high-emphasis content
- **Longbridge Dark** (`#0A0E19`): Darker variant for enhanced depth; used in overlay backgrounds and secondary surfaces
- **Pure Black** (`#000000`): Maximum contrast for critical text and borders; used sparingly for headings and high-priority CTAs

### Accent Colors
- **Cyan Accent** (`#00B8B8`): Primary highlight and call-to-action indicator; draws attention to key market data, interactive elements, and feature highlights
- **Sky Blue** (`#2A99FE`): Secondary accent for alternative actions and interactive states; used in charts, links, and supplementary CTAs

### Interactive
- **Error/Danger** (`#FF3A3A`): Loss indicators, error states, and critical warnings; primarily used for negative market movements and validation errors
- **Warning Bright** (`#FF9D3A`): Medium-priority warnings and cautionary states; used for important notifications and attention-grabbing alerts
- **Warning Medium** (`#FFBD3A`): Alternative warning tone for less critical alerts; used in secondary warning contexts
- **Warning Light** (`#FFE13A`): Softest warning state for background highlights and low-priority notifications

### Neutral Scale
- **Gray 900** (`#111827`): Dense text and borders; used for secondary headings and emphasized body copy
- **Gray 600** (`#374151`): Medium-contrast text for supplementary information; used in descriptions and helper text
- **Gray 500** (`#9CA3AF`): Light text for disabled states and tertiary information; used in form labels and placeholder text
- **Gray 300** (`#D1D5DB`): Subtle dividers and border lines; used for section separators and form field borders
- **Gray 200** (`#E5E7EB`): Light background tint and border; heavily used for input fields, dividers, and subtle surface variations
- **Gray 100** (`#EAEBEC`): Barely perceptible background tint; used for very subtle backgrounds and hover states
- **Off-White** (`#F8F9FA`): Near-white background for secondary sections and light surfaces
- **Pure White** (`#FFFFFF`): Clean background and card surfaces; maximum contrast baseline

### Surface & Borders
- **Light Border** (`#C7CACC`): Subtle borders for form elements and container outlines
- **Border Medium** (`#82888D`): Medium-weight borders for input fields and card separators

## 3. Typography Rules

### Font Family
**Primary:** `Cera Pro` with fallback `serif` — used for display and heading hierarchy; conveys premium, confident brand personality  
**Secondary:** `ui-sans-serif` (system font stack including `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, sans-serif) — used for body copy, buttons, and navigation; ensures optimal performance and platform consistency  
**Tertiary:** `SF Pro Display` — used for large interactive elements and input fields; refined appearance on Apple devices

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|-----------------|-------|
| Display 1 (H1) | Cera Pro | 48px | 700 | 48px | 0px | Page hero and major section headings; maximum impact and presence |
| Heading 2 (H2) | ui-sans-serif | 48px | 600 | 48px | 0px | Large section headers; slightly less weight than Display for subordinate emphasis |
| Heading 3 (H3) | SF Pro Display | 24px | 700 | 32px | 0px | Subsection headers and card titles; strong visual hierarchy |
| Heading 4 (H4) | SF Pro Display | 18px | 700 | 28px | 0px | Minor section headers and prominent labels; maintains hierarchy depth |
| Body Large | ui-sans-serif | 16px | 400 | 24px | 0px | Primary body copy for lists and main content blocks |
| Body Regular | ui-sans-serif | 14px | 400 | 20px | 0px | Default body copy for paragraphs and descriptions; most common text role |
| Button Text | ui-sans-serif | 16px | 500 | 20px | 0px | Call-to-action and interactive buttons; medium weight for emphasis |
| Small/Caption | ui-sans-serif | 14px | 400 | 20px | 0px | Captions, helper text, and fine print; reduced size for secondary information |
| Input Label | SF Pro Display | 20px | 400 | 28px | 0px | Large input fields and text entry areas; optimized for touch targets |
| Code | Monospace (default system) | 12px | 400 | 16px | 0.5px | Code snippets and technical references; ensures proper character spacing |

### Principles
- **Contrast First:** Every text element maintains sufficient contrast against its background to meet WCAG AA standards (minimum 4.5:1 for body, 3:1 for large text)
- **Weight as Hierarchy:** Font weight differentiates importance—bold (700) for headlines, medium (600) for secondary headers, regular (400) for body copy
- **Generous Line Height:** Line heights exceed font size by 25–67% to maximize readability and reduce eye strain, especially critical for financial data
- **Serif + Sans Blend:** Premium Cera Pro headings paired with accessible system sans-serif creates visual distinction while maintaining performance
- **Mobile Optimization:** All font sizes remain readable at 14px minimum; input fields use larger 20px for comfortable touch interaction
- **Color Integration:** Font color closely follows semantic hierarchy—navy (`#0F1729`) for primary content, grays for secondary, cyan (`#00B8B8`) for interactive elements

## 4. Component Stylings

### Buttons

**Primary Button (Full Width CTA)**
- **Background:** `#000000` (solid black)
- **Text Color:** `#FFFFFF` (pure white)
- **Font Size:** `16px`
- **Font Weight:** `500`
- **Font Family:** `ui-sans-serif`
- **Padding:** `12px 24px`
- **Border Radius:** `9999px` (fully rounded/pill shape)
- **Border:** None (`1px solid transparent`)
- **Box Shadow:** `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.07) 0px 4px 16px 0px`
- **Height:** `40px`
- **Line Height:** `20px`
- **Hover State:** Reduce opacity to `0.85`; increase shadow to `rgba(0, 0, 0, 0.12) 0px 6px 20px 0px`
- **Active State:** Reduce opacity to `0.75`; maintain shadow
- **Disabled State:** Opacity `0.5`; cursor not-allowed

**Secondary Button (Outline)**
- **Background:** `rgba(210, 210, 210, 0.6)` (translucent light gray)
- **Text Color:** `#0F1729` (navy)
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Font Family:** `ui-sans-serif`
- **Padding:** `8px 16px`
- **Border Radius:** `30px`
- **Border:** `1px solid rgba(0, 0, 0, 0.1)` (subtle dark border)
- **Box Shadow:** `rgba(0, 0, 0, 0.07) 0px 4px 16px 0px`
- **Height:** `40px`
- **Line Height:** `24px`
- **Hover State:** Background `rgba(210, 210, 210, 0.8)`; shadow `rgba(0, 0, 0, 0.1) 0px 6px 20px 0px`
- **Active State:** Background `rgba(210, 210, 210, 1)`
- **Disabled State:** Opacity `0.5`

**Icon Button (Navigation)**
- **Background:** `rgba(210, 210, 210, 0.6)`
- **Text Color:** `#0F1729`
- **Font Size:** `16px` or `14px` (depends on context)
- **Font Weight:** `400` or `500`
- **Font Family:** `ui-sans-serif`
- **Padding:** `0px` (icon-only, no text padding)
- **Border Radius:** `30px` (rounded pill)
- **Border:** `1px solid rgba(0, 0, 0, 0.1)`
- **Box Shadow:** `rgba(0, 0, 0, 0.07) 0px 4px 16px 0px`
- **Width & Height:** `40px` (square/circular)
- **Hover State:** Background `rgba(210, 210, 210, 0.8)`
- **Active State:** Background `rgba(0, 0, 0, 0.1)`

### Cards & Containers

**Feature Card (Product Showcase)**
- **Background:** Linear gradient from `#0A0E19` to `#1A2847` with opacity-layered cyan (`rgba(0, 184, 184, 0.1)`)
- **Text Color:** `#FFFFFF` (white headings), `#E5E7EB` (body)
- **Padding:** `24px` to `32px`
- **Border Radius:** `16px` to `24px`
- **Border:** `1px solid rgba(0, 184, 184, 0.2)` (subtle cyan border)
- **Box Shadow:** `rgba(0, 0, 0, 0.2) 0px 8px 32px 0px`
- **Hover State:** Border opacity increases to `0.3`; shadow becomes `rgba(0, 184, 184, 0.15) 0px 12px 40px 0px`

**Standard Card**
- **Background:** `#FFFFFF` (pure white)
- **Text Color:** `#0F1729` (navy)
- **Padding:** `16px` to `24px`
- **Border Radius:** `12px`
- **Border:** `1px solid #E5E7EB` (light gray)
- **Box Shadow:** `rgba(0, 0, 0, 0.05) 0px 2px 8px 0px`
- **Hover State:** Shadow `rgba(0, 0, 0, 0.1) 0px 4px 16px 0px`

### Inputs & Forms

**Text Input Field**
- **Background:** `rgba(0, 0, 0, 0)` (transparent) or `#F8F9FA` on white backgrounds
- **Text Color:** `#FFFFFF` (white text on dark backgrounds) or `#0F1729` on light backgrounds
- **Font Size:** `20px`
- **Font Weight:** `400`
- **Font Family:** `SF Pro Display`
- **Padding:** `12px 16px`
- **Border Radius:** `8px`
- **Border:** `1px solid #E5E7EB` (light gray) or `rgba(229, 231, 235, 0.3)` (transparent variant)
- **Box Shadow:** None (or `inset rgba(0, 0, 0, 0.02) 0px 1px 3px 0px` for subtle depth)
- **Height:** `60px` (generous for touch interaction)
- **Line Height:** `28px`
- **Focus State:** Border `1px solid #00B8B8` (cyan); box shadow `inset rgba(0, 184, 184, 0.1) 0px 0px 0px 3px`
- **Placeholder Text:** Color `#9CA3AF` (gray 500); opacity `0.7`
- **Disabled State:** Background `#EAEBEC`; color `#9CA3AF`; cursor not-allowed

**Checkbox/Radio Input**
- **Size:** `20px × 20px`
- **Border:** `2px solid #E5E7EB`
- **Border Radius:** `4px` (checkbox) or `50%` (radio)
- **Background (unchecked):** `#FFFFFF`
- **Background (checked):** `#00B8B8` (cyan)
- **Checkmark/Dot Color:** `#FFFFFF`
- **Focus State:** Box shadow `0px 0px 0px 3px rgba(0, 184, 184, 0.2)`

### Navigation

**Header Navigation Menu**
- **Background:** `rgba(0, 0, 0, 0)` (transparent) or `#FFFFFF` with subtle border-bottom
- **Text Color:** `#0F1729` (navy)
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Font Family:** `ui-sans-serif`
- **Height:** `40px` to `64px` (including padding)
- **Padding:** `0px 16px` (horizontal), `12px 0px` (vertical)
- **Border Radius:** `0px` (linear navigation)
- **Border:** `1px solid #E5E7EB` (subtle bottom border on scroll)
- **Box Shadow:** None (or `rgba(0, 0, 0, 0.04) 0px 2px 8px 0px` on scroll)
- **Link Hover State:** Text color `#00B8B8` (cyan); underline appears
- **Active Link:** Text color `#00B8B8`; underline `2px solid #00B8B8`
- **Dropdown Trigger:** Icon rotates `180deg` on open

**Mobile Navigation (Hamburger Menu)**
- **Icon Size:** `24px × 24px`
- **Icon Color:** `#0F1729` (navy)
- **Menu Background:** `#FFFFFF`
- **Menu Item Padding:** `16px 20px`
- **Menu Item Height:** `48px`
- **Divider:** `1px solid #E5E7EB`
- **Hover State:** Background `#F8F9FA`

### Links

**Text Link (Body)**
- **Color:** `#2A99FE` (sky blue) or `#00B8B8` (cyan for primary)
- **Text Decoration:** None (underline on hover)
- **Font Size:** `14px` to `16px`
- **Font Weight:** `400`
- **Hover State:** Text decoration `underline`; opacity `0.8`
- **Visited State:** Color `#8B5CF6` (purple) if applicable
- **Active State:** Color intensifies; underline remains

**Navigation Link (Header)**
- **Color:** `#0F1729` (navy, default)
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Padding:** `8px 0px`
- **Hover State:** Color `#00B8B8` (cyan); underline `1px solid #00B8B8`
- **Active State:** Color `#00B8B8`; underline persistent

### Badge & Status Indicators

**Badge (Success/Active)**
- **Background:** `rgba(0, 184, 184, 0.1)` (cyan tint)
- **Text Color:** `#00B8B8` (cyan)
- **Font Size:** `12px`
- **Font Weight:** `600`
- **Padding:** `4px 8px`
- **Border Radius:** `9999px` (fully rounded)
- **Border:** `1px solid #00B8B8`

**Badge (Error)**
- **Background:** `rgba(255, 58, 58, 0.1)` (red tint)
- **Text Color:** `#FF3A3A` (error red)
- **Font Size:** `12px`
- **Font Weight:** `600`
- **Padding:** `4px 8px`
- **Border Radius:** `9999px`
- **Border:** `1px solid #FF3A3A`

**Badge (Warning)**
- **Background:** `rgba(255, 157, 58, 0.1)` (orange tint)
- **Text Color:** `#FF9D3A` (warning orange)
- **Font Size:** `12px`
- **Font Weight:** `600`
- **Padding:** `4px 8px`
- **Border Radius:** `9999px`
- **Border:** `1px solid #FF9D3A`

## 5. Layout Principles

### Spacing System
The design system uses an **8px base unit** with a modular scale to maintain visual rhythm and consistency across all components.

- **Micro:** `4px` — Tightest spacing between icons and text; gap within compact button groups
- **XS:** `8px` — Padding in buttons and form fields; gap between inline elements
- **Small:** `12px` — Gap in form field groups; spacing around small badges
- **Base:** `16px` — Standard padding for cards and containers; margin between sections
- **Medium:** `20px` — Margin between major content blocks; padding on modal dialogs
- **Large:** `24px` — Padding for primary sections; margin between page regions
- **XL:** `32px` — Generous padding on hero sections; margin between major layout sections
- **2XL:** `40px` — Spacing around page containers; margin above footer
- **3XL:** `48px` — Large whitespace between feature sections
- **4XL:** `56px` — Section break spacing on desktop
- **5XL:** `60px` — Maximum breathing room between major content zones

### Grid & Container
- **Max Width:** `1200px` to `1440px` for desktop content containers (varies by page section)
- **Column Strategy:** 12-column grid system; cards and content blocks span 1–4 columns
- **Gutter Width:** `24px` horizontal spacing between columns
- **Container Padding:** `16px` (mobile), `24px` (tablet), `32px` (desktop) on all sides
- **Section Patterns:**
  - Hero sections: Full width with centered content within `1200px` max-width container
  - Feature grids: Responsive 1–4 column layout using CSS Grid with auto-fit
  - Feature cards: 4 columns on desktop, 2 on tablet, 1 on mobile
  - Stacked content: Full width with internal max-width constraints

### Whitespace Philosophy
The design system prioritizes **generous whitespace** to reduce cognitive load and draw focus to critical information. Every major section is surrounded by at least `32px` vertical spacing, with `48px` typical between page regions. Within cards, padding scales from `16px` (compact) to `32px` (expansive), ensuring content never feels cramped. Text lines benefit from `1.4–1.5x` font-size line heights, creating airy, scannable paragraphs. Horizontal spacing uses the same restraint—buttons rarely sit closer than `12px` apart, and form fields always maintain `16px` minimum gap to their labels.

### Border Radius Scale
- **None:** `0px` — Linear elements like dividers and underlines
- **Small:** `4px` — Subtle corner softening on input fields and small containers
- **Medium:** `8px` — Standard radius for cards, modals, and standard containers
- **Large:** `12px` — Prominent radius for feature cards and call-to-action sections
- **XL:** `16px` to `24px` — Large container cards and hero backgrounds
- **Full:** `9999px` — Buttons, badges, and circular icon containers; creates pill-shaped appearance
- **Alternate:** `30px` — Secondary button radius; creates distinct rounded appearance between primary and secondary CTAs
- **Alternative 2:** `23px` — Tertiary button variant; subtle variation in rounding

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| **Flat (Level 0)** | No shadow; solid background | Base surfaces, dividers, input fields in neutral states |
| **Raised (Level 1)** | `rgba(0, 0, 0, 0.04) 0px 2px 8px 0px` | Standard cards, buttons at rest, subtle elevation |
| **Floating (Level 2)** | `rgba(0, 0, 0, 0.07) 0px 4px 16px 0px` | Interactive buttons, secondary cards, hover states |
| **Elevated (Level 3)** | `rgba(0, 0, 0, 0.12) 0px 8px 24px 0px` | Modal overlays, dropdown menus, emphasized components |
| **Peak (Level 4)** | `rgba(0, 0, 0, 0.16) 0px 12px 32px 0px` | Floating action buttons, top-layer modals, critical alerts |
| **Inset Shadow** | `inset rgba(0, 0, 0, 0.04) 0px 2px 4px 0px` | Pressed button states, sunken text inputs |
| **Glow (Feature Cards)** | `rgba(0, 184, 184, 0.15) 0px 8px 32px 0px` (cyan glow) | Feature showcase cards, premium card variants; draws attention through color-specific shadow |

**Shadow Philosophy:**
Longbridge's shadow system uses **layered, soft shadows** that increase in blur radius and distance with elevation, creating a subtle sense of height and interaction feedback. Shadows are predominantly neutral (`rgba(0, 0, 0, ...)`) for standard elevation, but critical interactive elements like feature cards use **cyan-tinted shadows** (`rgba(0, 184, 184, ...)`) to reinforce brand identity and draw focus. Inset shadows are reserved for **pressed/active states**, creating tactile feedback without raising elevation. The system avoids harsh, high-contrast shadows—all blur radii exceed `8px` to create smooth, diffused light falloff.

## 7. Do's and Don'ts

### Do
- **Use cyan (`#00B8B8`) strategically** for interactive elements, links, and primary CTAs to create visual focus and guide user attention
- **Maintain minimum `40px` height** for all interactive elements (buttons, inputs) to ensure comfortable touch targets on mobile devices
- **Apply generous spacing (`24px` minimum)** between sections to create breathing room and improve content scanability
- **Leverage the navy (`#0F1729`) and white contrast** for maximum readability and accessible text; ensure 4.5:1 contrast ratio on all body copy
- **Use system fonts** (`ui-sans-serif`) for body and navigation to prioritize performance and platform consistency
- **Combine icons with text** in buttons and navigation for clarity; avoid icon-only CTAs for critical actions without accompanying labels
- **Apply subtle hover states** (shadow elevation + opacity changes) to provide clear interactive feedback
- **Use error, warning, and success** colors (`#FF3A3A`, `#FF9D3A`, `#00B8B8`) exclusively for semantic purposes—never decorative
- **Stack content vertically on mobile** and use responsive typography (scale down heading sizes on small screens)
- **Include loading states** and disabled states with reduced opacity (`0.5`) and cursor changes (`not-allowed`)

### Don't
- **Don't use more than 2–3 accent colors** in a single view; restrict to cyan (`#00B8B8`) and sky blue (`#2A99FE`) to maintain visual coherence
- **Don't create buttons smaller than `40px` height** or with padding less than `8px`; minimize touch target confusion
- **Don't apply shadows stronger than Level 2** (`rgba(0, 0, 0, 0.07)`) to standard components; reserve Level 3+ for modals and critical overlays
- **Don't use light gray text** (`#9CA3AF` or lighter) for primary body copy; reserve for disabled states, captions, and placeholder text only
- **Don't mix font families** within a single component; stick to `ui-sans-serif` for navigation/buttons and `SF Pro Display` for large inputs
- **Don't apply rounded corners** (`border-radius > 0`) to linear navigation elements; maintain `0px` radius for horizontal menu bars
- **Don't use cyan or error colors** in text links unless specifically indicating interactive state or error condition
- **Don't exceed `1440px` container max-width**; keep content scannable and prevent excessive line lengths
- **Don't override button padding** arbitrarily; maintain `8px–16px` horizontal padding scale for consistency
- **Don't animate non-interactive elements**; reserve transitions (200–300ms) for buttons, links, and form fields only
- **Don't use background gradients** on static text or small components; reserve gradient overlays for feature cards and hero sections only

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| **Mobile** | `0px – 640px` | Single-column layout; `16px` container padding; font sizes reduce by 1–2px; button height remains `40px`; navigation collapses to hamburger menu |
| **Tablet** | `641px – 1024px` | Two-column grid; `24px` container padding; feature cards display 2-up; font sizes remain stable; navigation remains horizontal with limited dropdown expansion |
| **Desktop** | `1025px – 1440px` | Full 4-column grid or 3-column where applicable; `32px` container padding; all interactive elements at full size; navigation fully expanded; modals centered and constrained to `600px` max-width |
| **Large Desktop** | `1441px+` | Max-width container (`1440px`) applied; center-aligned content; additional spacing around page edges |

### Touch Targets
- **Minimum Size:** `40px × 40px` for all interactive elements (buttons, icon buttons, form fields)
- **Minimum Spacing:** `12px` between adjacent interactive elements; `16px` preferred for comfortable thumb navigation
- **Label Spacing:** Form labels must sit `8px` above input fields; labels must be at least `14px` font size for readability
- **Link Tap Area:** Text links should include `8px` padding above/below to create comfortable tap zones
- **Scrollable Lists:** List items must be minimum `44px` height; `56px` preferred for trading data and financial lists

### Collapsing Strategy
- **Hero Headings:** H1 size reduces from `48px` (desktop) → `36px` (tablet) → `28px` (mobile); maintain `1:1` line height
- **Body Copy:** Remains `14px–16px` across all breakpoints for optimal readability; never reduce below `12px`
- **Buttons:** Height remains fixed at `40px` across all breakpoints; width adapts from fixed (`120px+`) on desktop to full-width on mobile with `16px` margins
- **Navigation:** Desktop horizontal menu (`ui-sans-serif`, `16px`, full width) → Tablet compact menu (reduced padding, limited dropdown) → Mobile hamburger menu (full-screen overlay, stacked items)
- **Feature Cards Grid:** Desktop 4-column (using CSS Grid `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`) → Tablet 2-column → Mobile single column (full width with `16px` margins)
- **Spacing Collapse:** `32px` margins reduce to `24px` (tablet) and `16px` (mobile); maintain `8px` base unit consistency
- **Form Fields:** Input height remains `60px` but width adapts from constrained (`400px` max) on desktop to full-width minus `32px` on mobile
- **Modal Width:** Constrained to `600px` on desktop and tablet; full-width minus `16px` margins on mobile (max `100vw - 32px`)

## 9. Implemented CSS Token Layer (`--lb-*`)

All design decisions are encoded as CSS custom properties in `docs/.vitepress/theme/style/css-var.scss`. These tokens take precedence and should be referenced in all component styles.

### Light Mode (`:root`)

```scss
/* Buttons */
--lb-btn-primary-bg: #000000;
--lb-btn-primary-color: #ffffff;
--lb-btn-primary-radius: 9999px;
--lb-btn-primary-h: 36px;
--lb-btn-primary-fs: 14px;
--lb-btn-primary-fw: 500;
--lb-btn-secondary-bg: rgba(210, 210, 210, 0.6);
--lb-btn-secondary-color: #374151;
--lb-btn-secondary-radius: 30px;

/* Cards */
--lb-card-border: #e5e7eb;
--lb-card-radius: 12px;
--lb-card-shadow-1: rgba(0, 0, 0, 0.04) 0px 2px 8px;
--lb-card-shadow-2: rgba(0, 0, 0, 0.09) 0px 8px 24px;

/* Badge */
--lb-badge-fs: 12px;
--lb-badge-fw: 600;
--lb-badge-lh: 1;
--lb-badge-py: 4px;
--lb-badge-px: 8px;
--lb-badge-radius: 9999px;
```

### Dark Mode (`.dark`)

```scss
--lb-btn-primary-bg: #ffffff;
--lb-btn-primary-color: #000000;
--lb-btn-secondary-bg: rgba(80, 80, 80, 0.5);
--lb-btn-secondary-color: #d1d5db;
--lb-card-border: rgba(255, 255, 255, 0.1);
```

### Component-Level Implementation Notes

**Navigation Logo**
- Light: `https://assets.wbrks.com/uploads/e76f6d93-.../longbridge-developers-light.png`
- Dark: `https://assets.wbrks.com/uploads/37a18fa4-.../longbridge-developers-dark.png`
- Width: `145px` via CSS (`.VPNavBarTitle .logo { width: 145px; height: auto; }` in `custom.scss`)
- `siteTitle: false` in VitePress config to hide the text beside the logo

**Hero CTA Buttons** (`NewHomePage/HeroSection.vue`)
- Primary: black pill (`--lb-btn-primary-*`), hover opacity `0.82`
- Secondary: gray pill (`--lb-btn-secondary-*`), hover gap widens from `0.375rem` to `0.625rem`

**GetStarted Cards** (`NewHomePage/GetStarted.vue`)
- Icon wrap: `40×40px`, `border-radius: 10px`, per-card color via inline CSS vars `--icon-color / --icon-bg / --icon-bg-dark`
- Dark mode icon bg: `color-mix(in srgb, iconColor 15%, var(--vp-c-bg-soft))`
- Hover: `box-shadow: var(--lb-card-shadow-2)` + `translateY(-3px)` — **no border color change**

**OpenAPI SDK Bento Cards** (`NewHomePage/ProductOpenAPI.vue`)
- Background: `var(--vp-c-bg)` — **no gray soft background**
- Hover: lift + shadow only — **no border color change**

**Skill Page Badge** (`Skill.vue`)
- Filled pill: `background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent)`; text `var(--vp-c-brand-1)`
- Uses `--lb-badge-*` tokens

**Skill Chat Window Border**
- Uses `--lb-card-border` (light: `#e5e7eb`, dark: `rgba(255,255,255,0.1)`)

**Footer Spacing**
- Homepage (`NewHomePage/Footer.vue`): `padding: 1.25rem 0 2.5rem` — extra bottom breathing room
- Doc pages (`HomePage/Footer.vue`): `pt-4 pb-8 mt-6` — tighter top margin, generous bottom padding
- `LayoutInner.vue` page-bottom slot: Footer skipped for `new-home-page` pageClass to avoid double footer

**Pricing Badge**
- `text-[12px] font-semibold px-2 py-1 rounded-full leading-none whitespace-nowrap`

## 10. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA:** Black (`#000000`) with white text
- **Secondary CTA:** Light Gray (`#D2D2D2`) with Navy text (`#0F1729`)
- **Accent & Focus:** Cyan (`#00B8B8`) — used for highlights, links, and interactive states
- **Background (Dark):** Navy (`#0F1729`) — primary dark surface
- **Background (Light):** White (`#FFFFFF`) — primary light surface
- **Body Text:** Navy (`#0F1729`) on light backgrounds; White (`#FFFFFF`) on dark backgrounds
- **Error State:** Red (`#FF3A3A`) — validation errors, negative market movement
- **Warning State:** Orange (`#FF9D3A` or `#FFBD3A`) — alerts and cautionary content
- **Heading Text:** Navy (`#0F1729`) or White (`#FFFFFF`) depending on background
- **Disabled/Inactive:** Gray (`#9CA3AF`) text; opacity `0.5`
- **Border:** Light Gray (`#E5E7EB`) — standard; Navy (`#0F1729`) at `0.1` opacity for subtle borders

### Iteration Guide

1. **Always use `#0F1729` (Navy) as the primary text color on light backgrounds and `#FFFFFF` (White) on dark backgrounds.** This ensures maximum contrast and readability across all surfaces.

2. **Apply `#00B8B8` (Cyan) exclusively to interactive elements—links, focused inputs, primary buttons on secondary surfaces, and status indicators.** Never use cyan for decorative purposes.

3. **Set minimum touch target size to `40px × 40px` and maintain `12px` spacing between adjacent interactive elements.** Verify this applies to all buttons, icon buttons, form fields, and link hit areas.

4. **Use `ui-sans-serif` for navigation, buttons, and body copy; `SF Pro Display` for large input fields (`20px`); `Cera Pro` for headings only.** Font consistency is critical for performance and brand recognition.

5. **Apply `24px` to `32px` vertical spacing between major sections; `16px` within card components; `8px` between tightly-grouped elements.** Never drop below `8px` base unit spacing.

6. **Set button padding to `8px 16px` for standard buttons, adjust to `12px 24px` for prominent CTAs, and use `0px` padding for icon-only buttons.** Maintain `40px` height across all button variants.

7. **Use `border-radius: 9999px` for pill-shaped buttons and badges; `30px` for secondary buttons; `8px–12px` for cards; `0px` for linear navigation elements.** Radius communicates component type and hierarchy.

8. **Apply shadow elevation according to component type: Level 0 (none) for flat surfaces, Level 1 (`0px 2px 8px`) for standard cards, Level 2 (`0px 4px 16px`) for interactive states.** Use cyan-tinted shadows (`rgba(0, 184, 184, ...)`) only for feature showcase cards.

9. **Restrict headline sizes to: `48px` (H1), `48px` (H2), `24px` (H3), `18px` (H4) on desktop; reduce by 10–20% on tablet and mobile, never below `14px` for any heading.** Maintain proportional line heights (`1:1` for headings, `1.4–1.5x` for body).

10. **Test all components at `40px` minimum interactive height and verify `4.5:1` contrast ratio on body text.** Validate focus states include visible outlines or color changes; never remove outline on keyboard navigation.

11. **Use responsive breakpoints: mobile (`≤640px`), tablet (`641–1024px`), desktop (`1025–1440px`).** Stack layouts vertically on mobile, enable 2-column on tablet, use full 4-column grid on desktop.

12. **Implement loading, disabled, and error states for all form fields and buttons.** Disabled state: opacity `0.5`, cursor `not-allowed`; Error state: border `1px solid #FF3A3A`, text color `#FF3A3A`.