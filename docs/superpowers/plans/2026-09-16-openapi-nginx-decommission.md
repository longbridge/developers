# Plan: openapi 站点下线 nginx，改由阿里云 CDN + 专用 OSS 桶承载

状态：**执行中**（S0/S1 已落工作区，S2+ 等桶）。决策记录见 §11，进度见 §12。

涉及 7 个加速域名、4 个产物仓库、6 条流水线、2 套 CI、1 个 nginx 仓库。

---

## 0. 现状与目标

```
今天:  client → traefik → websites-nginx → 阿里云CDN(assets.lbkrs.com/wbrks/lbctrl) → OSS(lb-assets 共享桶)
目标:  client → 阿里云CDN → OSS(openapi 专用桶，桶根即站点根)
```

nginx 的上游本身就是 CDN，这次是砍掉中间两跳，把改写/重定向/响应头职责下沉到 CDN 加速域名配置。

**待迁移域名与目标桶**

| 域名 | 环境 | 目标桶 | 特殊性 |
|---|---|---|---|
| open.longbridge.com | release | `lb-openapi` | 主站点 |
| open.longbridge.cn | release | `lb-openapi-cn` | 裁剪版内容（`region.config.ts`），catch-all 302 → .com |
| open.longbridge.xyz | canary | `lb-openapi-canary` | — |
| open.longportapp.com | release | `lp-openapi` | 带 X-Robots-Tag noindex |
| open.longportapp.cn | release | 同上 | 别名域名 |
| open.wbrks.com | release | 同上 | 别名域名 |
| open.longbridgeapp.com | release | — | 整域 301 → open.longportapp.com |

桶命名依据现有惯例推导（`lb-assets` / `lb-assets-canary`：prod 无后缀、环境走后缀；组织前缀 `lb-` 既是惯例也保证 OSS 全局唯一）。`lp-` 前缀无先例，SRE 可能倾向 `longport-openapi`——桶名事后改不了，需先确认。

**内部直取域名**（绕开重写规则取原始对象，见 §2 回环陷阱）

| 域名 | 桶 | 用途 |
|---|---|---|
| `assets-openapi.lbkrs.com` | `lb-openapi` | longbridge.com 主站取 `skill/install.md` |
| `assets-openapi-canary.lbkrs.com` | `lb-openapi-canary` | longbridge.xyz 主站同上 |
| `assets-openapi-cn.lbkrs.com` | `lb-openapi-cn` | longbridge.cn 主站同上 |

`lp-openapi` **不需要**——已验证 `websites-nginx/config/sites/longportapp.com/` 无任何 `skill_install` 路由。

**桶内布局（桶根 = 站点根，key 与 URL 1:1）**

```
lb-openapi/
├── index.html
├── docs/legal/user-data-authorization-sg/index.html
├── docs/getting-started.md                      ← .md 端点，供 crawler
├── sdk/index.html   pricing/index.html   skill/index.html
├── skill/install.md                             ← 主站 /skill-install.md 的数据源
├── skill/*.zip                                  ← 31 个，pack-skills.yml 独立上传
├── dashboard/index.html  oauth2/authorize/confirm/index.html   ← private SPA
├── longbridge/longbridge-terminal/install(.ps1)
├── zh-CN/…  zh-HK/…
├── _docs/   ← 文档站 hash 资源      _app/  ← private SPA hash 资源
├── assets/  ← 迁移带过来的退役区，观察期后整目录删除
└── llms.txt  llms-full.txt  robots.txt  sitemap-index.xml  sitemap-0.xml
```

**关键机制**：桶开启 OSS 静态网站托管的「子目录首页 + 文件 404 规则 = Index」。`/dashboard` 这类不带尾斜杠的请求，对象不存在时 OSS 自动返回 `dashboard/index.html`，200 且地址栏不变。CDN 侧因此不需要任何内容改写规则。

---

## 1. Assumptions

| # | 假设 | 证据 | 状态 |
|---|---|---|---|
| 1 | 链路为 client→traefik→nginx→阿里云CDN→OSS | runtime @响应头含 `via: ens-cache*`/`x-oss-*`，`X-Frame-Options`/`X-Robots-Tag` 由 nginx 注入 | verified |
| 2 | `lb-assets` 桶为公共读 | runtime @OSS 直连 200；对照 `lb-assets-hk` → 403 | verified |
| 3 | 阿里云 CDN「访问URL重写」break=内部改写、Redirect=302/303/307，支持 PCRE 与 `$1`，单域名上限 50 条 | 阿里云文档 120538 | verified (doc) |
| 4 | SPA 的 `error_page 404 → index fallback` 是死代码 | code @`_common.conf` 无 `proxy_intercept_errors`；runtime @`/dashboard/<不存在>` → OSS 404 XML | verified |
| 5 | `longbridge.json` 的 sub_filter 是空操作 | runtime @两份内容均不含 `open.longbridge.com` 串 | verified |
| 6 | invite-code 注入在主站已可用；跨域 301 保留 query | runtime @`longbridge.com/skill-install.md?invite-code=PROBE123` 注入成功 | verified |
| 7 | 显式 `.md` 路径可替代 Accept 协商 | runtime @三站 `/docs/getting-started.md` → 200 `text/markdown` | verified |
| 8 | private SPA 的非 HTML 产物已双写进文档桶 | code @`tool/ci/apps/openapi.js`；runtime @桶内 `vp-icons.css`/`hashmap.json` 200 | verified |
| 9 | longportapp 前缀上 `sitemap.xml` 已被 SPA 覆盖 | runtime @首条为 `/account` | verified |
| 10 | 桶内 robots.txt 与 nginx 本地 robots.txt 冲突 | runtime @线上 6 条 Disallow；桶内 `Allow: /` + 错域名 Sitemap | verified |
| 11 | llms.txt 318 处链接指向错误域名 | runtime @`grep -c`=318 | verified |
| 12 | longbridge.com 主站依赖 openapi 的 OSS 前缀 | code @`longbridge.com/index.conf` 168/228/287/333/432/498 | verified |
| 13 | open.* 未使用限流 / GeoIP / WAF | code @两站点目录 `rg` 零命中 | verified |
| 14 | `lb-assets` 为多方共用桶（terminal / portai / longportapp.com / whale） | code @nginx 前缀枚举 | verified |
| 15 | astro `build.format:'directory'` 可直接产 `foo/index.html` | Astro 配置项 | verified (doc) |
| 16 | vitepress **无** directory-index 输出模式，需后处理脚本 | code @`vitepress/dist/node/chunk-*.js`：`cleanUrl.replace(/\.md$/, cleanUrls ? '' : '.html')`——`cleanUrls` 只决定链接带不带 `.html`，产物形态恒为扁平 | **verified** |
| 17 | 公网 open.* 前是否已有 CDN/WAF 层 | 本机 DNS 被 VPN 劫持 | **known risk** → SRE |
| 18 | 是否存在依赖 `Accept: text/markdown` 的真实消费方 | 仓库内只有 nginx 配置与设计文档提及 | **known risk** → 砍除前公告 |
| 19 | 各加速域名证书、`.cn` 备案、CDN 配额 | — | **known risk** → SRE |
| 20 | `/skill/*.zip`（31 个）由 `pack-skills.yml` 独立上传，不在任何站点构建产物中 | code @该 workflow；runtime @Pages 同路径为兜底页 | verified |
| 21 | `docs/public/**`（11 个）astro 已不产出，线上靠桶内 2026-08-28 残留 | code @未设 `publicDir`；runtime @Pages 兜底页指纹 + Last-Modified 对照 | verified |
| 22 | 其中 `longbridge-terminal/install(.ps1)` 被 10 处文档引用；8 个 svg 零引用 | code @`rg` 复核 | verified |
| 23 | `~* \.md$` / `~* \.zip$` 是 longbridge 侧的**按扩展名通配**规则，longportapp 侧没有 | code @`_release.conf:71,77`；runtime @longportapp `/skill/longbridge.zip` → 404 | verified |
| 24 | 往三个前缀写入的流水线共 6 条（5 活跃 + 1 遗留） | code @本地 52 clone `rg --hidden`；**仅覆盖本地 clone** | verified（范围受限） |
| 25 | OSS 静态网站托管「文件404规则=Index」对不带尾斜杠路径返回 200 且地址栏不变 | 阿里云 OSS 文档 | verified (doc) |
| 26 | CDN 私有 Bucket 回源与 OSS 默认首页互斥 → **新桶必须公共读** | 阿里云文档 + 社区整理 | verified (doc) |
| 27 | 阿里云 CDN 重写正则是否支持负向先行断言（`.cn` catch-all 302 需排除 `/docs` `/skill`） | — | **to measure**（建桶时） |
| 28 | `cross-env A=1 cmd1 && cmd2` 中 A **不会**传给 cmd2 | runtime @直接实测：`cmd1: yes` / `cmd2: undefined` | verified |
| 29 | 因 #28，`build:release`/`build:canary` 的 `astro build` 从未拿到 `VITE_API_BASE_URL`/`VITE_SITE_HOSTNAME`/`NODE_OPTIONS`；`build:cn` 因有 `sh -c` 包裹而正常 | runtime @对照实验：cn 桶 llms.txt 318×`open.longbridge.cn`（对） vs .com 桶 318×`open.longportapp.com`（错） | verified |
| 30 | llms.txt 的真实产出方是 `src/pages/llms.txt.ts`，`scripts/generate-llms.ts` 未被任何 CI 调用 | code @`rg "build:llms" .github/workflows/` 零命中 | verified |
| 31 | `_cn.conf:15` include 的是 **`.com`** 的 `_llms.conf`，线上 `open.longbridge.cn/llms.txt` 服务的是 .com 桶那份错的 | code @`_cn.conf:15`；runtime @两桶内容对比 | verified |
| 32 | longport-developers 的 llms.txt 本就输出 `.md` 链接（199 条中 198 条） | runtime @桶内统计 | verified |
| 33 | 其中 `/skill/**.md`、`**/index.md` 类链接线上 404（`open.longportapp.com/_llms.conf:18` 只覆盖 `/docs`），但桶内对象存在 | runtime @线上 404、OSS 直连 200 | verified |

> **完整性声明**：nginx 的按扩展名通配规则（#23）意味着配置无法反映桶内实际内容——skill zip 就是这样漏掉的。产物清单的唯一权威来源是 `ossutil ls -r` 列桶，见 §10。

---

## 2. 两条「CDN 做不了」的规则如何消化

**invite-code 注入** → 301 到主站。`longbridge.com` 主站 nginx 不在下线范围内，且已在跑同一份 `_skill_install.conf`，实测注入正常、301 保留 query。

**Accept: text/markdown 协商** → 砍掉，改显式 `.md` 路径（三站实测可用），并让 `llms.txt` 输出 `.md` 后缀链接。

### ⚠️ 主站取数的回环陷阱

主站需从 openapi 侧取原始 markdown。切到专用桶后**不能** `proxy_pass https://open.longbridge.com/skill/install.md`——该路径在 openapi 的 CDN 上有一条 301 回主站的规则，会形成无限重定向。解法是走 §0 的内部直取域名：

```nginx
set $skill_install_host "assets-openapi.lbkrs.com";
set $skill_install_base "";                      # 桶根即站点根
```

`_skill_install.conf` 会拼成 `/skill/install.md` 与 `/{locale}/skill/install.md`，与桶内布局一致。

---

## 3. CDN 规则清单（open.longbridge.com release）

源站：`lb-openapi`（静态网站托管 endpoint）。**桶根即站点根，无需任何前缀或目录索引改写。**

| 序 | 匹配（正则） | 目标 | 模式 |
|---|---|---|---|
| 1 | `^/(en\|zh-HK\|zh-CN)/skill-install\.md$` | `https://longbridge.com/$1/skill-install.md` | 301 |
| 2 | `^/skill-install\.md$` | `https://longbridge.com/skill-install.md` | 301 |
| 3 | `^/(en\|zh-HK\|zh-CN)/skill/install\.md$` | `https://longbridge.com/$1/skill-install.md` | 301 |
| 4 | `^/skill/install\.md$` | `https://longbridge.com/skill-install.md` | 301 |
| 5 | `^/en$` | `/` | 302 |
| 6 | `^/en/(.*)$` | `/$1` | 302 |
| 7 | `^/(.+)/$` | `/$1` | 302 |
| 8 | `^/longbridge/longbridge-terminal/longbridge\.json$` | `https://assets.lbkrs.com/github/release/longbridge-terminal/longbridge.json` | 302 |
| 9 | `^/longbridge/longbridge-terminal/releases/latest$` | `https://assets.lbkrs.com/github/release/longbridge-terminal/latest` | 302 |
| 10 | `^/github/release/longbridge-terminal/(.*)$` | `https://assets.lbkrs.com/github/release/longbridge-terminal/$1` | 302 |

**10 条**（沿用共享桶方案需 14 条）。8/9/10 是跨桶兜底，切流前拉访问日志确认无消费方即可删，最少降到 7 条。

**其余一切交给 OSS**：`/docs/legal/xxx` → 子目录首页；`/skill/longbridge.zip`、`/docs/getting-started.md`、`/_docs/*.js`、`/longbridge/longbridge-terminal/install` 都是对象直取。

**响应头**：longbridge 侧 `X-Frame-Options: SAMEORIGIN`；longportapp 侧 `X-Robots-Tag: noindex, nofollow`；**验证域名**额外加 `X-Robots-Tag: noindex, nofollow` 防收录。

**规则 7 与 OSS 的配合**：先 302 掉尾斜杠，再由「文件404规则=Index」处理无尾斜杠路径。`/` 本身不匹配规则 7（要求 `/` 前至少一字符），走 OSS 默认首页。

**各域名差异**：canary / cn / longportapp 换对应桶；longportapp 系无 terminal 规则；`.cn` 末位加 catch-all 302 → `https://open.longbridge.com$uri`，需排除 `/docs` `/skill`（依赖假设 #27，若不支持负向先行断言则改为正向列举）。

---

## 4. Change list

### S0 数据正确性（已完成，见 §12）
### S1 产物形态统一（已完成，见 §12）

### S2 建桶与上传目标切换

- SRE 建 4 个桶，**公共读**（假设 #26），开启静态网站托管：默认首页 `index.html`、子目录首页开启、文件 404 规则 = **Index**
- 每桶配加速域名（对外站点域名；longbridge 系另配内部直取域名）
- 发只写单桶的 AK，替换现有 `PROD_ALIYUN_ACCESS_KEY_ID`（当前可写整个 `lb-assets`）
- 6 条流水线增加向新桶上传（**保留旧前缀双写**）：
  - `openapi-website/.github/workflows/{release,canary,pack-skills}.yml`
  - `longport-developers/.github/workflows/{release,canary}.yml`
  - `openapi-website-private(gitlab)/tool/ci/apps/{openapi,longport}.js` 的 `uploadIndexFileToOSS`——同时去掉 `--exclude "*.html"`，并 exclude 根级 `index.html`/`sitemap.xml`/`404.html`
  - `longbridge-web/tool/ci/apps/openapi.js`——**遗留发布方（2025-08 停更），摘除 job 而非迁移**
  - 两个 gitlab 仓改完执行 `make gen:ci`
- `refresh_cdn` 目标改为新桶加速域名（当前只刷 `assets.wbrks.com/...`）
- **`--delete` 白名单**：拿到 §10 对账结果前**不得启用**。已知需排除 `/skill/*.zip`（31 个）

**切流前：按路径迁移旧资源**（不做全量复制）

| 旧路径 | 处置 | 理由 |
|---|---|---|
| `assets/**` | **迁**（原样复制到新桶同名路径） | 内容哈希资源。切流瞬间浏览器与 CDN 里仍存旧 HTML，引用旧 hash，不迁必掉样式 |
| `skill/*.zip` | 不迁 | `pack-skills.yml` 改目标后自写；迁了可能旧版覆盖新版 |
| `longbridge-terminal/**` | 不迁 | S0 已搬回源码，新桶由构建产出 |
| 页面 HTML 与其目录 | 不迁 | 构建产出；形态由扁平改目录索引，迁旧的会打架 |
| `llms.txt` `llms-full.txt` `robots.txt` `sitemap*.xml` | 不迁 | 构建产出，且 S0 正在修内容，迁旧等于把错误数据带进新桶 |
| `hashmap.json` `vp-icons.css` `404.html` | 不迁 | private SPA 产物（`vp-icons.css` 实为 0 字节，`hashmap.json` 已被覆盖成错的） |
| 其余无主对象 | 不迁，列清单 | 由 §10 对账 + 访问日志决定 301 还是弃 |

```bash
ossutil cp oss://lb-assets/github/release/open.longbridge.com/new-docs/raw/assets/ \
           oss://lb-openapi/assets/ -r -u -j 10 \
           -e oss-cn-hangzhou.aliyuncs.com -i "$OSS_AK" -k "$OSS_SK"
```

**连带后果**：不迁页面 HTML 意味着已下线页面的旧 URL 切流后变 404，不再无限期服务旧内容。若有需保留的入口，走 301 清单而非复制旧 HTML。

### S3 验证域名

- `open-canary.longbridge.xyz`（longbridge 侧）+ longportapp 侧同类域名
- longportapp 侧风险更高：两个 vitepress 写同一个桶，`hashmap.json`/`sitemap.xml` 已在互相覆盖

### S4 主站解耦

- `websites-nginx/config/sites/longbridge.com/index.conf` 168/228/287/333/432/498——`$skill_install_host` 改为内部直取域名、`$skill_install_base` 改为空串

### S5 切流后清理

- 删 `websites-nginx/config/sites/open.longbridge.com/`（8 文件）、`open.longportapp.com/`（7 文件）
- 停止向 `lb-assets` 旧前缀双写
- 观察期后删新桶内的 `assets/` 退役区

---

## 5. Scope Lock

**✅ 可触碰**
- `openapi-website/`：`astro.config.ts`、`package.json`、`src/pages/{robots,llms,llms-full}.txt.ts`、`scripts/copy-routes.ts`（删）、`docs/public/**`、`public/**`、`packages/ui/src/SDK.tsx`、`.github/workflows/{release,canary,pack-skills}.yml`
- `longport-developers/`：`docs/.vitepress/config.mts`、`package.json`、`script/to-directory-index.ts`（新增）、`docs/public/robots.txt`（新增）、`.github/workflows/{release,canary}.yml`
- `openapi-website-private/`：两个 `packages/*/.vitepress/config.mts` 与 `package.json`、`scripts/to-directory-index.ts`（新增）
- `openapi-website-private(gitlab)/`：`tool/ci/apps/*.js`、`_auto_generate_do_not_edit.yml`
- `longbridge-web/`：**仅** `tool/ci/apps/openapi.js` 及生成物中的 openapi job
- `websites-nginx/`：**仅** `longbridge.com/index.conf` 那 6 行 `$skill_install_*`（S4）+ `open.longbridge.com/`、`open.longportapp.com/` 两目录（S5）

**🚫 不碰**
- `websites-nginx/config/sites/` 下其余站点目录、任何共享 include、`nginx.conf`、`Dockerfile`、`.gitlab-ci.yml`
- `lb-assets` 桶的任何 bucket 级配置（静态网站托管只开在新桶）
- `longbridge-web` 除 openapi job 外的一切
- 三个项目的任何业务/文档内容文件
- `longbridge-terminal` 仓库（`install`/`install.ps1` 是 openapi 自己的源码；`latest`/`longbridge.json` 用 302 兜底）

**⛔ 兼容红线**
- 全部现有 URL 保持可达且状态码语义不变（含 `.cn`、`open.wbrks.com`、`open.longportapp.cn`）
- `longbridge.com` 主站 `/skill-install.md`（含 invite-code 注入）不得中断——S4 完成前旧前缀必须双写
- 主站取数**不得**指向 openapi 对外域名（§2 回环陷阱）
- `/auth`、`/account` 的 robots Disallow 不得丢失
- `lb-assets` 其他租户（terminal / portai / longportapp.com / whale）行为不变
- 官方安装命令 `curl -sSL …/longbridge/longbridge-terminal/install | sh` 不得中断
- `/skill/*.zip` 31 个不得被 `--delete` 清掉
- **切流窗口内哈希资源不得断**：旧 HTML（浏览器缓存、CDN 缓存、已打开的 SPA 会话）引用的 `assets/**` 必须在新桶可取，直到观察期确认无引用

**✳️ 已批准的行为变更**（2026-09-16）
- `open.longportapp.com/**/*.zip` 的 404 成因从「规则不存在」变为「对象不存在」。状态码相同语义不同，冒烟表需显式标注。前置确认 longportapp 桶内确无 `*.zip` 对象。
- 迁移后按 key 直取会**顺手修好一批既有死链**：llms.txt 里 `/skill/**.md`、`**/index.md` 条目当前 404（`_llms.conf` 只覆盖 `/docs`），桶内对象其实存在，迁移后变 200。属修复非回归，冒烟表标注预期从 404 改为 200。

---

## 6. Acceptance + 验证方式

| 验收项 | 验证方式 |
|---|---|
| URL 基线一致 | 迁移前后各跑全量冒烟表，逐条比对 status / content-type / body sha256 |
| 三语文档页 | `/docs/getting-started` 及 zh-CN / zh-HK 200 |
| 多级路径 | `/docs/legal/user-data-authorization-sg` 200（验证 OSS 子目录首页） |
| SPA 页面 | `/dashboard`、`/dashboard/tokens`、`/oauth2/authorize/confirm`、`/connect` 200 + 真实浏览器可交互 |
| 登录页 | `/login`、`/tfa`、`/binding` 正常渲染 |
| 重定向 | `/docs/` → 302 `/docs`；`/en/docs` → 302 `/docs`；`/en` → 302 `/` |
| invite-code | `/skill-install.md?invite-code=X` → 301 到主站，最终正文含 `longbridge init X` |
| **主站未回环** | `longbridge.com/skill-install.md` 直接 200，无重定向链 |
| markdown | `/docs/getting-started.md` → 200 `text/markdown` |
| skill zip | `/skill/longbridge.zip` 及其余 30 个 200 `application/zip` |
| 安装命令 | `/longbridge/longbridge-terminal/install`、`install.ps1` 200 且内容为脚本；`longbridge.json`、`releases/latest` 经 302 后可取 |
| 根级文件 | `/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`、`/llms.txt` 全部 200（**净增收益，现为 404**） |
| llms 链接 | llms.txt 内链接全部带 `.md` 且逐条 200 |
| 响应头 | `X-Frame-Options` / `X-Robots-Tag` 按域名生效 |
| robots | 6 条 Disallow 存在 |
| 其他租户 | `assets.lbkrs.com` 上 terminal / portai 抽样 200 |
| 行为变更 | 按 §5 ✳️ 两条逐项核对 |

**冒烟表**：来源 = sitemap 全量 URL + llms.txt 全部链接 + nginx 配置中显式出现的每条路径 + §10 列桶结果，落成 `url,status,content-type,size,sha256` 的 CSV。唯一客观验收依据。

---

## 7. Simplest alternative check

| 设计点 | 最简版本 | 取舍 |
|---|---|---|
| 目录索引 vs 扁平 `.html` | 扁平 + CDN 一条「无扩展名 → +.html」 | **拒绝**：`/longbridge/longbridge-terminal/install` 这类无扩展名裸文件会被改成 `install.html`；根级文件 404 也不解决 |
| 目录索引靠 OSS 静态网站托管 vs CDN 改写 | — | **采纳静态网站托管**。专用桶后 bucket 级配置不外溢，规则 14 → 10 |
| 专用桶 vs 沿用 lb-assets | 沿用共享桶 | **拒绝**：共享桶下静态网站托管开不了、`--delete` 不敢开、凭证收不拢 |
| 桶粒度：一个大桶带前缀 vs 按内容集×环境分桶 | 一个桶 | **拒绝**：带前缀拿不到「桶根即站点根」，CDN 又要加回改写规则 |
| 旧资源迁移 | 旧前缀整体 `cp -r` | **拒绝**：会把垃圾、错误的 robots/llms、扁平 HTML 一并带进新桶，`--delete` 从此永远开不了。改按路径迁移，实际只有 `assets/**` 一条 |
| S1 提前合 main + 双形态产出过渡 | 让 copy-routes 同时产出扁平与目录两种形态 | **拒绝**（用户决策「改就改彻底」）：有独立验证域名后不需要权宜之计 |
| invite-code | 上边缘计算 | **拒绝**：301 到主站零成本零损失 |
| Accept 协商 | 保留 | **拒绝**：CDN 原生不支持按请求头改写；显式 `.md` 已可用 |
| terminal 跨桶 | 把 terminal 产物同步进新桶 | **拒绝**：引入对第三个仓库 CI 的耦合；302 即可 |
| 主站取数 | 直连 openapi 对外域名 | **拒绝**：回环（§2）。改配内部直取域名 |
| SPA 404 fallback | 补成真实现 | **本次不做**：现为死代码，补上属行为变更，单独立项 |
| `longbridge-web` 遗留 job | 一起迁到新桶 | **拒绝**：2025-08 停更，迁移等于延长寿命。直接摘除 |

---

## 8. 执行顺序与回滚

```
基线冒烟表 ──→ S0 数据正确性 ──→ S1 产物形态 ──→ S2 建桶/双写/按路径迁移 ──→ S3 验证域名
                                                          │
                                        §10 列桶对账 ─────┤
                                                          ↓
                                   open-canary.longbridge.xyz 全量验证
                                                          ↓
                                   验证通过 → 合并 main → 逐域名切流
                                                          ↓
                          观察 N 天 ──→ S4 主站解耦 ──→ 停双写 ──→ S5 删 nginx ──→ 清 assets/ 退役区
```

**全部走分支，验证通过才合 main。**

**切流顺序**：`open.longbridge.xyz`（canary）→ `open.wbrks.com`（流量最小）→ `open.longportapp.cn` → `open.longportapp.com` → `open.longbridge.cn` → `open.longbridge.com`（最后）。`open.longbridgeapp.com` 纯 301，随时可切。

**回滚**：切流前 nginx 配置与 `lb-assets` 旧前缀双写完整保留，回滚 = DNS 切回 traefik。S4/S5 必须在观察期之后。

**退役区清理**：`assets/**` 在 S1 后不再有任何流水线写入，是纯退役区。顺序必须是「按路径迁移 → 观察 → 一次性清理 → 再谈 `--delete`」，不可跳步。

**并行发布风险**：合桶后 5 条流水线写同一棵目录树，`deploy`/`refresh_cdn` 都是 `when: manual`。需约定发布时序并划路径责任区。

---

## 9. 交给 SRE 的问题

1. 公网 open.* 域名前是否已有 CDN / WAF 层？（假设 #17）
2. 4 个新桶的审批与命名规范。**region 必须为 hangzhou**——与 `lb-assets` 同区才能服务端复制迁移 `assets/**`
3. 桶名 `lb-openapi` / `lb-openapi-canary` / `lb-openapi-cn` / `lp-openapi` 是否可用（OSS 桶名全局唯一，需查占用）；`lp-` 前缀无先例，是否改用 `longport-openapi`
4. 3 个内部直取域名（`assets-openapi[-canary|-cn].lbkrs.com`）是否可行
5. 单桶写权限 AK 的发放
6. HTML 现状 `Cache-Control: no-cache`，迁移后是否改短 TTL + 发布主动刷新？
7. sit 环境是否需要独立桶
8. 验证域名 `open-canary.longbridge.xyz` 及 longportapp 侧同类域名

---

## 10. 产物清单对账（`--delete` 与完整性的前置条件）

**为什么必须做**：nginx 的按扩展名通配规则（#23）让配置无法反映桶内实际内容。skill zip 就是这样漏掉的——31 个 zip 挂在线上，配置里一个字没提。

**三步**

1. **列桶（唯一权威，需 AK）**

```bash
export OSS_AK=...   # 走环境变量，不要写进命令历史或提交
export OSS_SK=...

for p in release/open.longbridge.com release/open.longbridge.cn release/open.longportapp.com \
         canary/open.longbridge.com  canary/open.longportapp.com \
         sit/open.longbridge.com     sit/open.longportapp.com ; do
  ossutil ls -r "oss://lb-assets/github/$p/new-docs/raw/" \
    -e oss-cn-hangzhou.aliyuncs.com -i "$OSS_AK" -k "$OSS_SK" \
    > "inv-$(echo $p | tr / -).txt"
done

ossutil ls -r oss://whale-assets/web-brand/release-openapi/ -e oss-cn-hongkong.aliyuncs.com -i "$HK_AK" -k "$HK_SK" > inv-spa-lb.txt
ossutil ls -r oss://whale-assets/web/release-openapi/       -e oss-cn-hongkong.aliyuncs.com -i "$HK_AK" -k "$HK_SK" > inv-spa-lp.txt
```

2. **产物清单**：每条流水线加一步导出 dist 列表作为 artifact

```bash
find dist -type f | sed 's|^dist/||' | sort > dist-manifest.txt
```

3. **对账**：`桶清单 − Σ(各流水线产物清单) = 无主对象`。无主对象拉 CDN 离线日志判活——有访问的保留或 301，无访问的删。

**快速首轮**（只需第 1 步）：`ossutil ls -r` 输出带 LastModifiedTime，按修改时间聚类。停在更早日期的簇即僵尸候选；有独立流水线的（如 skill zip）会单独成簇。

**已知写入方（6 条，仅覆盖本地 clone）**

| 仓库 | CI | 前缀 | 状态 |
|---|---|---|---|
| `longbridge/developers` | GH Actions `release.yml` `canary.yml` | `open.longbridge.com` + `open.longbridge.cn` | 活跃 |
| 同上 | GH Actions `pack-skills.yml` | `open.longbridge.com/**/skill/` | 活跃，独立触发 |
| `longportapp/developers` | GH Actions `release.yml` `canary.yml` | `open.longportapp.com` | 活跃 |
| `openapi-website-private` · `packages/openapi` | GitLab CI | `open.longbridge.com`（非 HTML） | 活跃 |
| `openapi-website-private` · `packages/longport` | GitLab CI | `open.longportapp.com`（非 HTML） | 活跃 |
| `longbridge-web` · `packages/openapi` | GitLab CI | `open.longportapp.com`（非 HTML） | **2025-08 停更，job 仍可触发** |

组织级补扫：
- GitLab：`GITLAB_HOST=gitlab.longbridge-inc.com glab api "search?scope=blobs&search=open.longbridge.com/new-docs"`
- GitHub：`gh search code "open.longbridge.com/new-docs" --owner longbridge --owner longportapp`

---

## 11. 决策记录

| 日期 | 决策 | 理由 |
|---|---|---|
| 2026-09-16 | 边缘层用**阿里云 CDN 原生规则** | 7 个域名（含 `.cn`）一套覆盖，运维归属不变，无新产品审批 |
| 2026-09-16 | invite-code 改为 **301 到主站** | 主站 nginx 不下线且已跑同一份配置，实测注入正常、301 保留 query |
| 2026-09-16 | 砍掉 `Accept: text/markdown` 协商，改**显式 `.md` 路径** | CDN 原生不支持按请求头改写；显式路径三站实测可用 |
| 2026-09-16 | longportapp 侧 `.zip` 行为统一，**接受变更** | 见 §5 ✳️ |
| 2026-09-16 | **建 openapi 专用桶**，按内容集 × 环境分 4 个 | 解锁静态网站托管（规则 14→10、桶根即站点根）、`--delete` 可用、凭证收缩；无需迁存量 |
| 2026-09-16 | `longbridge-terminal` 仓库**不改动** | `install`/`install.ps1` 是 openapi 自己的源码；`latest`/`longbridge.json` 用 302 兜底 |
| 2026-09-16 | `longbridge-web` 的 openapi job **摘除而非迁移** | 2025-08 停更的遗留发布方 |
| 2026-09-16 | 旧资源**按路径迁移**，非全量复制；实际只迁 `assets/**` | 只保真正会断的哈希资源；垃圾与错误数据不进新桶 |
| 2026-09-16 | **改就改彻底**，不做双形态过渡；**全部走分支，验证通过才合 main** | 有独立验证域名 `open-canary.longbridge.xyz` 兜底 |
| 2026-09-20 | canary 先纯 OSS 跑通（后被下条取代） | 快速验证产物形态，不等 CDN |
| 2026-09-20 | **最终架构定为 CDN + OSS**：CDN 绑域名，OSS 只存资源；canary 与生产都走这套 | 同时解决三件纯 OSS 做不到的事：`X-Frame-Options`（OAuth 授权页点击劫持面）、尾斜杠收敛、全球延迟（实测直连 OSS 首字节比经 CDN 慢 55–76%，且 OSS 是单 region） |
| 2026-09-20 | CDN 回源走**路线 B**：源站填 OSS 标准 endpoint + 开私有 Bucket 回源，桶保持私有 | 多 2 条目录索引改写规则，换来桶不可绕过 CDN + 回源全程 HTTPS；不继承 `lb-assets` 公共读的历史包袱 |

---

## 12. 实施进度

分支：三个仓库均为 `feat/nginx_decommission`，基线 `origin/main`。

### ✅ 已完成（工作区，未提交）

**openapi-website**（19 文件，+22 / −633）
- `package.json` — `build:release`/`build:canary` 补 `sh -c` 包裹 + `VITE_SITE_HOSTNAME`。**补包裹是关键**（假设 #28/#29），只加变量不会生效
- `src/pages/robots.txt.ts` — 补 6 条 Disallow，与 nginx 版逐行对齐
- `src/pages/llms.txt.ts`、`llms-full.txt.ts` — 链接加 `.md` 后缀
- `docs/public/longbridge-terminal/` → `public/longbridge/longbridge-terminal/`（key 与 URL 1:1）
- 删 `docs/public/`（8 个零引用 svg，删前 scoped `rg` 逐个返回零）
- `astro.config.ts` — `format:'directory'` + `assets:'_docs'`
- `public/assets/sdk.svg` → `public/_docs/sdk.svg`，同步改 `packages/ui/src/SDK.tsx:23`
- 删 `scripts/copy-routes.ts` + package.json 三处调用 + `build:copy-routes`

**longport-developers**（+5 / −2，新增 2 文件）
- `docs/.vitepress/config.mts` — `assetsDir: '_lpdocs'`
- 新增 `script/to-directory-index.ts`
- `package.json` — `build:canary`/`build:release` 末尾接转换脚本（排在 `build:llms` 之后，避免它把新建目录当 section）
- 新增 `docs/public/robots.txt`（本仓原本没有任何 robots 产物）
- llms `.md` 链接：**无需改动**（假设 #32）

**openapi-website-private**（+8 / −2，新增 1 文件）
- 新增 `scripts/to-directory-index.ts`（两个包共用）
- `packages/openapi` — `assetsDir:'_app'`，`postbuild` 接转换脚本（排在 `build:sdk` 之后，它也输出到同一 dist）
- `packages/longport` — `assetsDir:'_lpapp'`，同上

### 验证情况

- `to-directory-index.ts` 用合成产物测过：根 `index.html` 与 `zh-CN/index.html` 保留、`404.html` 留在根、`dashboard.html` 与 `dashboard/tokens.html` 正确合并、非 HTML 不动、二次运行幂等
- `oxlint` 扫改动文件：干净
- `package.json` × 3：JSON 合法，diff 无整文件重排
- **未跑真实 build**：`openapi-website/CLAUDE.md` 禁止 AI 会话执行 build；另两个仓库属重型任务。三处 build 需人工在终端各跑一次

### 待验证（人工跑 build 时确认）

1. astro `format:'directory'` 下，`src/pages/[...slug].md.ts` 产出的 `.md` 端点是否仍为 `docs/x.md` 而非 `docs/x.md/index.html`
2. 三个 vitepress 项目 `assetsDir` 改名后，产物 HTML 引用的资源路径是否同步更新
3. `to-directory-index.ts` 在真实 dist 上的转换数量与预期一致

### ⏸ 未开始（等桶）

S2 建桶与上传目标切换、S3 验证域名打通、S4 主站解耦、S5 删 nginx 目录。

---

## 13. Canary 验证环境（纯 OSS，无 CDN）

2026-09-20 决策：**canary 先用纯 OSS 跑通，CDN 相关的缺口后面再想办法**。生产架构（§3 的 CDN 规则）保持待定。

- 桶 `lb-openapi-canary`，region **oss-cn-hongkong**（非方案原定的 hangzhou；canary 不需要迁移 `assets/**`，无影响）
- 域名 `open-canary.longbridge.xyz` **直接绑桶**，前面无 CDN（实测响应头 `Server: AliyunOSS`，无 `via`/`eagleid`/`x-cache`）

### OSS RoutingRule 能力边界（已查实）

| 能力 | 结论 |
|---|---|
| 匹配条件 | `KeyPrefixEquals` / `KeySuffixEquals` / `HttpErrorCodeReturnedEquals` / `IncludeHeaders`（≤10） |
| 通配符与正则 | **不支持**，大小写敏感 |
| 重定向 | `External` / `AliCDN` 支持 301/302/307；`ReplaceKeyWith` 支持 `${key}`；`ReplaceKeyPrefixWith` + `EnableReplacePrefix` 可裁前缀；`PassQueryString` 可保留 query |
| 规则上限 | **20 条**，按 RuleNumber 升序匹配，命中即停 |
| 生效范围 | 仅对**绑定的自定义域名**生效，标准 OSS endpoint 无效 |
| 自定义响应头 | **不支持** |

### 纯 OSS 相对 CDN 方案丢失的三项

1. **`X-Frame-Options: SAMEORIGIN`** —— OSS 注入不了任意响应头。该域名下有 `/dashboard`、`/auth`、`/oauth2/authorize/confirm` 等登录态页面，缺此头存在点击劫持面。HTML `<meta>` 替代不了（CSP `frame-ancestors` 在 meta 中无效）。**生产前必须解决**
2. **尾斜杠不收敛** —— `/docs` 与 `/docs/` 都 200 且同内容（RoutingRule 只能整体替换或裁前缀，无法裁尾部字符）。astro 的 canonical 可缓解 SEO 影响
3. **无边缘缓存** —— 全球请求直打单 region OSS。现状链路里 nginx 上游就是 CDN，等于退一档

`X-Robots-Tag`（longportapp 全站 noindex）可用 robots.txt + HTML meta 替代，不算丢失。

### 待人工完成（控制台）

**第一步 — 先让页面出得来**

1. 桶读写权限 → **公共读**（当前私有，匿名 403 `Anonymous user has no right to access this bucket`）
2. 静态网站托管：
   - 默认首页 `index.html`
   - **子目录首页：开启**
   - **文件 404 规则：Index**（返回子目录首页内容、200、地址栏不变；不要选 Redirect 或 NoSuchKey）

**第二步 — 补 RoutingRule**（先跑通再加）

| # | Condition | Redirect |
|---|---|---|
| 1 | `KeyPrefixEquals: en/` | External 302，`EnableReplacePrefix: true`，`ReplaceKeyPrefixWith: ""`，`PassQueryString: true` |
| 2 | `KeyPrefixEquals: en`（精确匹配根） | External 302，`ReplaceKeyWith: ""` |

`/skill-install.md` 的 301 和 terminal 跨桶 302 在 canary 阶段**不配**——前者会跳出验证环境到生产主站，后者与验证目标无关。

**第三步 — CI secret**

GitHub 仓库 `longbridge/developers` 加两个 secret：`FE_LB_OPENAPI_ACCESS_KEY_ID` / `FE_LB_OPENAPI_ACCESS_KEY_SECRET`。新桶在 hongkong 且与 `lb-assets` 不同，现有 `FE_LB_ASSET_*` 未必有权限；若确认覆盖，直接填相同值即可。

### 已知的验证环境差异（不是回归）

- `/skill/*.zip` 31 个**不在 canary 桶里** —— 由 `pack-skills.yml` 独立上传，尚未接新桶。验证时该路径 404 属预期
- private SPA 的 `/auth` `/dashboard` `/oauth2/**` 也不在桶里 —— 其 CI（GitLab 侧）尚未接新桶，S2 才做

### CI

新增 `.github/workflows/canary-oss.yml`：push 本分支或手动触发 → 构建（`VITE_SITE_HOSTNAME=https://open-canary.longbridge.xyz`）→ 产物形态自检 → 传 `oss://lb-openapi-canary/` 桶根。

**刻意不复用 `canary.yml`**：那条的上传目标是 `lb-assets/github/canary/open.longbridge.com/...`，本分支产物是目录索引形态，而旧 nginx 取扁平 key 且全链路无 `--delete`——传进去不报错，而是让现有 `open.longbridge.xyz` 静默冻结在上一次构建。

---

## 14. CDN + OSS 落地配置（2026-09-20 定稿，取代 §3 与 §13 的纯 OSS 形态）

架构：**CDN 绑域名，OSS 只存资源**。canary 与生产同一套。

### 14.1 OSS 桶

| 项 | 值 |
|---|---|
| 读写权限 | **私有**（不改） |
| 静态网站托管 | **不开** —— 私有回源带签名，默认首页不触发，开了是摆设 |
| 自定义域名绑定 | **解绑** —— 域名归 CDN，同一域名不能同时绑两处 |

### 14.2 CDN 加速域名

| 项 | 值 |
|---|---|
| 加速域名 | canary：`open-canary.longbridge.xyz`；生产：7 个域名各一个 |
| 业务类型 | 图片小文件 |
| 源站类型 | **OSS 域名** |
| 源站地址 | `<bucket>.oss-cn-<region>.aliyuncs.com`（canary：`lb-openapi-canary.oss-cn-hongkong.aliyuncs.com`） |
| 端口 | 443 |
| 回源 HOST | **源站域名**（不是加速域名——OSS 靠 Host 路由到桶，填错全 404） |
| 私有 Bucket 回源 | **开启**（需 RAM 授权） |
| 过滤参数 | **关闭**（query 要留给 `?invite-code=` 的 301） |
| 缓存 | 遵循源站（ossutil 上传时已按类型分组设好 Cache-Control） |

### 14.3 访问URL重写（12 条，顺序即优先级）

| 序 | 模式 | 匹配 | 目标 | canary |
|---|---|---|---|---|
| 1 | 301 | `^/(en\|zh-HK\|zh-CN)/skill-install\.md$` | `https://longbridge.com/$1/skill-install.md` | 不配 |
| 2 | 301 | `^/skill-install\.md$` | `https://longbridge.com/skill-install.md` | 不配 |
| 3 | 301 | `^/(en\|zh-HK\|zh-CN)/skill/install\.md$` | `https://longbridge.com/$1/skill-install.md` | 不配 |
| 4 | 301 | `^/skill/install\.md$` | `https://longbridge.com/skill-install.md` | 不配 |
| 5 | 302 | `^/longbridge/longbridge-terminal/longbridge\.json$` | `https://assets.lbkrs.com/github/release/longbridge-terminal/longbridge.json` | 可配 |
| 6 | 302 | `^/longbridge/longbridge-terminal/releases/latest$` | `https://assets.lbkrs.com/github/release/longbridge-terminal/latest` | 可配 |
| 7 | 302 | `^/github/release/longbridge-terminal/(.*)$` | `https://assets.lbkrs.com/github/release/longbridge-terminal/$1` | 可配 |
| 8 | 302 | `^/en$` | `/` | **必配** |
| 9 | 302 | `^/en/(.*)$` | `/$1` | **必配** |
| 10 | 302 | `^/(.+)/$` | `/$1` | **必配** |
| 11 | **break** | `^/$` | `/index.html` | **必配** |
| 12 | **break** | `^/([^.]+)$` | `/$1/index.html` | **必配** |

**顺序的两个要害**
- **1/3 必须早于 9**：`/en/skill-install.md` 同时匹配 1 和 9，先命中 9 会丢 locale
- **规则 12 用 `[^.]+`（路径完全不含点）是刻意的**：`/_docs/app.abc.js`、`/docs/x.md`、`/skill/x.zip` 天然不匹配，直接对象直取。比"先放一条有扩展名的空操作规则去阻断"更稳，不依赖"命中即停"语义

前 10 条是 Redirect 型（返回响应即终止），11/12 是 break 型（内部改写）。`/` 经 11 变 `/index.html`（含点），不会再被 12 命中。

canary 阶段 1–4 不配：那 4 条会把验证跳出到生产主站。

### 14.4 响应头

| 域名 | 头 |
|---|---|
| longbridge 系 | `X-Frame-Options: SAMEORIGIN` |
| longportapp 系 | `X-Robots-Tag: noindex, nofollow` |
| canary 验证域名 | `X-Robots-Tag: noindex, nofollow`（防收录） |

### 14.5 不切 DNS 的验证方法

CDN 建好后拿到 CNAME，解析出节点 IP：

```bash
IP=$(dig +short <cdn-cname>.w.kunlunsl.com | head -1)
curl --resolve open-canary.longbridge.xyz:443:$IP \
     -sS -o /dev/null -D - https://open-canary.longbridge.xyz/docs/getting-started
```

Host 与 SNI 都正确，线上 DNS 不受影响。12 条规则可全部这样验完再切 DNS。生产切流同理——旧 nginx 仍在服务时就能验完整条 CDN 链路。

### 14.6 待控制台确认的两点

1. **多条重写规则是"命中即停"还是"逐条累积"**。文档只说"由上而下顺序执行"。规则 12 已设计成不依赖该语义，但 1/3 与 9 的相对顺序仍依赖——配好后用 `/en/skill-install.md` 打一发即可判定
2. **跨域 301 的目标里 `$1` 捕获组是否生效**（规则 1/3/7）。不生效就拆成按 locale 写死的固定目标，多 2 条，仍在 50 条上限内

### 14.7 性能实测（决策依据）

同一对象、同一桶，经 CDN vs 直连 OSS，各 6 次：

| 对象 | CDN 首字节 | OSS 直连首字节 | 差距 |
|---|---|---|---|
| `sdk.svg` 23KB | ~117ms | ~206ms | +76% |
| 真实 JS 16KB | 125ms | 206ms | +65% |
| zip 392KB（总计） | 175ms | 272ms | +55% |

差距主要在 TLS 握手（63ms vs 146ms）。测量点单一且在亚太，**对全球用户不具代表性**——OSS 单 region，CDN 全球边缘，欧美用户差距会更大。
