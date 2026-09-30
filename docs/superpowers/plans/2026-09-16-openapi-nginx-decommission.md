# Plan: openapi 站点下线 nginx（边缘分两轨）

状态：**执行中**。2026-09-30 边缘架构拆分为两轨（见 §11 D7、§15）：

| 轨 | 域名 | 边缘 | 存储 |
|---|---|---|---|
| **CF 轨** | open.longbridge.com、open.longportapp.com（及其别名） | Cloudflare Pages | Pages 自带 |
| **阿里云轨** | open.longbridge.cn | 阿里云 CDN | 新建专用 OSS 桶 |

S0/S1 已落工作区且对两轨都有效。决策记录见 §11，进度见 §12。

涉及 7 个加速域名、4 个产物仓库、6 条流水线、2 套 CI、1 个 nginx 仓库。

---

## 0. 现状与目标

```
今天:   client → traefik → websites-nginx → 阿里云CDN(assets.lbkrs.com/wbrks/lbctrl) → OSS(lb-assets 共享桶)

目标（2026-09-30 拆分）:
  .com / .longportapp.com →  client → Cloudflare Pages
  .cn                     →  client → 阿里云CDN → OSS(openapi 专用桶，桶根即站点根)
```

nginx 的上游本身就是 CDN（`_release.conf:21-22` 的 `$oss_upstream_host`/`$oss_assets_host` 指向
`assets.wbrks.com`/`assets.lbkrs.com`，不是 OSS endpoint），所以现状实为三层。

- **CF 轨**砍掉 traefik/nginx 与阿里云 CDN 两层，改写/重定向职责下沉到仓库内的 `_redirects` 与 Pages Functions。
- **阿里云轨**砍掉 traefik/nginx 一层，职责下沉到 CDN 加速域名配置（§14 原样适用）。

**待迁移域名与目标桶**

| 域名 | 环境 | 边缘 | 目标 | 特殊性 |
|---|---|---|---|---|
| open.longbridge.com | release | **CF Pages** | project `longbridge-developers` | 主站点 |
| open.longbridge.xyz | canary | **CF Pages** | canary project（新建） | 验证域名 |
| open.longportapp.com | release | **CF Pages** | project 待建 | 带 X-Robots-Tag noindex |
| open.longportapp.cn | release | **CF Pages** | 同上 | 别名域名 |
| open.wbrks.com | release | **CF Pages** | 同上 | 别名域名 |
| open.longbridgeapp.com | release | — | — | 整域 301 → open.longportapp.com |
| open.longbridge.cn | release | **阿里云 CDN** | 桶 `lb-openapi-cn` | 裁剪版内容（`region.config.ts`），catch-all 302 → .com |
| （验证）open-canary.longbridge.xyz | canary | **阿里云 CDN** | 桶 `lb-openapi-canary` | 转为 .cn 轨的验证环境 |

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

> **2026-09-30 分轨后**：S2/S3 拆成两条。下文原文对应 **`.cn` 轨**（建桶 + 阿里云 CDN）；
> `.com` / `.longportapp.com` 的对应工作见 §15.3 缺口表与 §15.6 运维清单。

### S2 建桶与上传目标切换（`.cn` 轨）

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

### S4 主站解耦（2026-09-30 改写：按轨分流）

`longbridge.com/index.conf` 共 6 处 `$skill_install_*`，**其中 5 处是 `.com`、1 处是 `.cn`**，改法不同
（下表行号为 `set` 语句实测所在行；原文记的 168/228/287/333/432/498 是 location 块起始行）：

| 行 | 现值 `$skill_install_base` | 轨 | 改为 |
|---|---|---|---|
| 182–183 | `…/open.longbridge.com/new-docs/raw` | CF | host=`longbridge-developers.pages.dev`，base=`""` |
| 243–244 | 同上 | CF | 同上 |
| **303–304** | `…/open.longbridge.cn/new-docs/raw` ← **`.cn`** | **阿里云** | host=`assets-openapi-cn.lbkrs.com`，base=`""` |
| 350–351 | `…/open.longbridge.com/new-docs/raw` | CF | host=`longbridge-developers.pages.dev`，base=`""` |
| 518–519 | 同上 | CF | 同上 |
| 588–589 | 同上 | CF | 同上 |

另 `open.longbridge.com/_cn.conf:56-57` 一处，属 `.cn` 轨，同 303–304 处理。

**为什么 CF 轨必须做 S4（新增约束）**：`.com` 走 Pages 后**不会有新 OSS 桶**，主站若继续从
`lb-assets` 旧前缀取数，S5 的「停止双写」就永远做不了，会留一条只为喂主站的僵尸发布线。
改指 Pages 后双写才能真正停。

**可行性已验证**：`longbridge-developers.pages.dev/skill/install.md` 与线上
`longbridge.com/skill-install.md` 均为 200 `text/markdown`、**同为 10177 字节**；
且 Pages 上无 301 规则，不存在 §2 的回环。

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
| 2026-09-20 | **最终架构定为 CDN + OSS**：CDN 绑域名，OSS 只存资源；canary 与生产都走这套 | 同时解决三件纯 OSS 做不到的事：`X-Frame-Options`（OAuth 授权页点击劫持面）、尾斜杠收敛、全球延迟（实测直连 OSS 首字节比经 CDN 慢 55–76%，且 OSS 是单 region）<br>**⚠️ 2026-09-30 更正**：`X-Frame-Options` 这条依据不成立——实测现网 `open.longbridge.com` 响应头里**根本没有**该头（`_common.conf:1` 虽有 `add_header`，但 nginx 的 `add_header` 不向子 location 继承，被覆盖了）。结论仍成立，但只剩后两条理由。 |
| 2026-09-20 | CDN 回源走**路线 B**：源站填 OSS 标准 endpoint + 开私有 Bucket 回源，桶保持私有 | 多 2 条目录索引改写规则，换来桶不可绕过 CDN + 回源全程 HTTPS；不继承 `lb-assets` 公共读的历史包袱 |
| **2026-09-30** | **边缘拆两轨**：`.com` / `.longportapp.com` 走 **Cloudflare Pages**，`.cn` 保持**阿里云 CDN + 新建专用桶** | `.cn` 面向大陆，Cloudflare 免费/Pro 版大陆访问质量不可控（要用 CF 中国网络需企业版 + 京东云 + 备案）。`.com` 侧则本就有 CF Pages 双发（2026-04-02 起），产物现成，且 Pages 原生解决目录索引、URL 规范化、`.md` MIME、证书 |
| **2026-09-30** | 主站取数（§4 S4）**5 处改指 `longbridge-developers.pages.dev`、1 处（`.cn`）指新桶内部直取域名** | 不改则 S5「停止双写」永远做不了，会留一条只为喂主站的僵尸发布线。已验证 Pages 上那份与线上同为 10177 字节，且无 301 回环 |
| **2026-09-30** | skill zip 走**方案 (a)**：clone+打包并入文档构建，不单独 deploy | Pages 每次部署是全量不可变快照，**不能增量加文件**；`pack-skills.yml` 单独 deploy 会把整站覆盖成只剩 zip |
| **2026-09-30** | private 的 SPA 由**其 GitHub 主仓自建 Actions** 发独立 Pages project | 实测 GitHub 仓 138 commits / HEAD 09-16 且无 `.github/workflows/`，GitLab 仓仅 25 commits / 只有 `tool/ci`。走 GitHub 可让 GitLab 一行不动，`whale-assets`（App 内嵌）/ SDK 两条线零影响 |
| **2026-09-30** | **`build.format` 改为环境变量驱动，默认回到 `'file'`**；仅 `.cn` 的 OSS 静态托管流水线设 `BUILD_FORMAT=directory`。修正 S1（`d8b2cce6`）把 `'directory'` 定为全局默认的决定 | 预览实测：`'directory'` 下 Pages 把规范 URL 变成**带尾斜杠**，`/docs/getting-started` 反被 308 到 `/docs/getting-started/`，而 canonical 仍写无尾斜杠——自相矛盾。`'file'` 则与现网 nginx 逐条一致。详见 §15.9 |
| **2026-09-30** | CF 轨的 SPA 合站用 **Pages Functions**，**不用** Worker 路由 | 约束推导：`longbridge.com`/`longportapp.com`/`longbridge.xyz` 的 DNS 均托管在 **AWS Route 53**（实测 NS 为 `*.awsdns-*`）。Cloudflare **Worker Routes 要求 zone 托管在 Cloudflare**；Pages 自定义域名与 Pages Functions 则不要求。除非迁 DNS，否则 Worker 方案不可行 |

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

### CI 验证结果（2026-09-21，run 35592818282）

`Build canary` 与 `Sanity check dist shape` 两步均通过，三个原「待人工跑 build 确认」的点一次性验掉：

| 断言 | 结论 |
|---|---|
| `dist/docs/getting-started/index.html` 存在 | `format:'directory'` 生效 |
| `dist/docs/getting-started.html` 不存在 | 扁平形态已彻底消除，`copy-routes.ts` 删除无副作用 |
| `dist/_docs/` 存在 | `assets:'_docs'` 命名空间隔离生效 |
| `dist/docs/getting-started.md` 存在 | **`.md` 端点未被目录化**（原假设仅靠推断） |
| `dist/longbridge/longbridge-terminal/install` 存在 | 搬迁生效，`.gitignore` 未锚定的坑已修 |

`Upload to Aliyun OSS` 步失败，写权限预检报 `AccessDenied / because of bucket acl`——
现有 `FE_LB_ASSET_*`（配 `lb-assets` 杭州）对 `lb-openapi-canary` 无权限，符合预期。

### ⚠️ 凭证现状与待收缩项（2026-09-23）

运维已放权，采用**与 `whale-assets` 相同的那把 AK/SK**。这解开了当前阻塞，但留下一个待办：

该 AK 可写整个 `whale-assets`——全公司 web 应用产物（含 private SPA、session 包等）都在里面。
把它放进文档站仓库的 GitHub Secret，爆炸半径超出本项目需要。

**生产切流前应收缩为按桶授权**，策略见 §14.8。这与方案 §11 的「凭证收缩」决策一致，
只是 canary 阶段先用共享 AK 打通链路。

### 仍待验证（需真实上传后）

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

新增 `.github/workflows/canary-aliyun.yml`：push 本分支或手动触发 → 构建（`VITE_SITE_HOSTNAME=https://open-canary.longbridge.xyz`）→ 产物形态自检 → 传 `oss://lb-openapi-canary/` 桶根。

**刻意不复用 `canary.yml`**：那条的上传目标是 `lb-assets/github/canary/open.longbridge.com/...`，本分支产物是目录索引形态，而旧 nginx 取扁平 key 且全链路无 `--delete`——传进去不报错，而是让现有 `open.longbridge.xyz` 静默冻结在上一次构建。

---

## 14. CDN + OSS 落地配置（2026-09-20 定稿，取代 §3 与 §13 的纯 OSS 形态）

> **适用范围收窄（2026-09-30）**：本节自即日起**只适用于 `.cn` 轨**。
> `.com` / `.longportapp.com` 改走 Cloudflare Pages，见 §15。桶、加速域名、改写规则、RAM 策略按 `.cn` 单轨重新核算。

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

### 14.8 按桶授权的 RAM 策略（生产用）

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "oss:PutObject",
        "oss:GetObject",
        "oss:DeleteObject",
        "oss:ListObjects",
        "oss:AbortMultipartUpload"
      ],
      "Resource": [
        "acs:oss:*:*:<bucket>",
        "acs:oss:*:*:<bucket>/*"
      ]
    }
  ]
}
```

两条 Resource 缺一不可：不带 `/*` 的是桶本身（`ListObjects` 需要），带 `/*` 的是桶内对象。
`DeleteObject` 供预检清理与后续 `--delete` 全量同步；`AbortMultipartUpload` 防大文件中断后残留碎片计费。

---

## 15. Cloudflare Pages 轨（`.com` / `.longportapp.com`，2026-09-30 新增）

### 15.1 已验证的现状

| # | 事实 | 证据 |
|---|---|---|
| C1 | CF Pages 部署步骤 2026-04-02 加入，project `longbridge-developers` | code @`git log -S'cloudflare/wrangler-action'` → `8d4dc396` |
| C2 | **只有 `release.yml` 推 Pages**，canary 不推 | code @`rg 'wrangler-action' .github/workflows/` 仅 1 处 |
| C3 | `longbridge-developers.pages.dev` 活着且内容是当前文档站 | runtime @HTTP 200，`server: cloudflare`、`cf-ray: …-HKG` |
| C4 | **没有任何域名指向它** —— 发了半年没接流量 | runtime @`open.longbridge.com` 响应头有 `eagleid`/`via: ens-cache*`/`x-oss-cdn-auth`，**无 `cf-ray`** |
| C5 | 三个域名 DNS 均在 **AWS Route 53** | runtime @`dig NS` → `ns-*.awsdns-*` |
| C6 | 仓库内**没有** `404.astro` / `_redirects` / `_headers` / `_routes.json` | code @`fd` 零命中；`ls src/pages` |

C4 的含义：**切换风险低**。产物已在 Pages 上持续更新半年，只差接流量与补缺口。

### 15.2 CF Pages 实测行为 vs 现网 nginx

| 路径 | CF Pages | 现网 nginx | 结论 |
|---|---|---|---|
| `/docs/getting-started` | 200 html | 200 html | ✅ 一致 |
| `/docs/getting-started/` | **308 → 去尾斜杠** | 302 | ✅ 原生规范化 |
| `/docs/getting-started.html` | **308 → 去扩展名** | — | ✅ 白送 |
| `/docs/getting-started.md` | 200 `text/markdown` | 200 `text/markdown` | ✅ 自动按扩展名给 MIME |
| `/en/docs/getting-started` | 200 | 302 去 `/en` | ⚠️ 行为不同，需 `_redirects` 补 |
| `/sitemap-index.xml` | **200** | **404** | ✅ 顺手修好既有缺陷 |
| `/skill/longbridge.zip` | 200 但 **HTML** | 200 `application/zip` | ❌ 产物缺失 |
| `/longbridge/longbridge-terminal/install` | 200 但 **HTML** | 200 `octet-stream` | ❌ 产物路径不对（S1 已修，未合 main） |
| `/dashboard`、`/auth` | 200 但 **HTML** | SPA | ❌ SPA 不在 Pages |
| 任意不存在路径 | **200 + 首页 HTML** | 404 | ❌ 严重 |

最后一行根因 = C6：产物里没有 `404.html` 时，Pages 退化为 SPA 行为，把 `index.html` 以 **200** 返回。会让搜索引擎把大量不存在的 URL 当重复首页索引。

### 15.3 待补缺口（按优先级）

| # | 缺口 | 处置 | 状态 |
|---|---|---|---|
| G1 | 不存在路径返回 200 | 新增 `src/pages/404.astro`。Astro 对 `/404` 有特判，`format:'directory'` 下仍产根部 `404.html`（`astro/dist/core/build/common.js` 的 `STATUS_CODE_PAGES`） | **工作区已改，待 CI 验** |
| G2 | zip 不在 Pages 上 | 改 `prebuild-skills.ts`，产出清单对齐 `pack-skills.yml`，见 §15.7 | **工作区已改，本地实测 14/15 逐字节一致** |
| G3 | `install` / `install.ps1` 路径 | **S1 已修**（`public/longbridge/longbridge-terminal/`） | 已在分支上 |
| G4 | `/en` 前缀 302 等 nginx 重定向 | 新增 `public/_redirects`，但**只放 `/en` 裸前缀一条**；`/en/*` 通配与 install.md 的 301 必须进 Functions，理由见下 | **部分完成** |
| G5 | SPA 8 个前缀 | Pages Functions 转发，见 §15.11 | **已做，本地验证通过**——等凭证可见性确认 |
| G8 | nginx 下线后 `/skill/install.md`、`/skill-install.md` 两条路由消失 | Function 接管，见 §15.10 | **已做，本地端到端验证通过** |
| G6 | longport-developers 同样缺 Pages 部署 | 新增 `wrangler pages deploy` 步骤 + project | longport-developers |
| G7 | `X-Robots-Tag: noindex`（longportapp 侧） | `_headers` | longport-developers |

#### G4 为什么大部分规则进不了 `_redirects`

官方文档两条约束（已查实）：

> 「The order of your redirects matter. **the top-most redirect is applied**」
> 「**Redirects are always followed, regardless of whether or not an asset matches the incoming request.**」
> 「Domain-level redirects ❌」「Proxying will only support relative URLs on your site. **You cannot proxy external domains.**」
> 上限 2,000 静态 / 100 动态

推论：

1. **重定向优先于静态文件** → `/en/*` 的通配 302 会劫持真实存在的 `/en/**.md`。
   这些端点成规模：`src/pages/[locale]/[...slug].md.ts` 给每篇文档 × 每个 locale 各生成一个，
   实测 `/en/docs/getting-started.md` 200 / 52783 B、`/en/docs/cli.md` 200 / 1761 B。
   其中 `/en/skill/install.md` 正是主站取数路径（§4 S4），被劫持后 nginx 的
   `proxy_pass` **不跟随重定向**，会把 302 原样吐给浏览器。
2. **源不支持 hostname** → `/skill/install.md` → `longbridge.com` 的 301 会在 `*.pages.dev`
   上一并生效，而主站正要从 pages.dev 取它 —— §2 的回环陷阱在 CF 上的新形态。

这两类都要按 hostname / 扩展名判断，归 Functions。

### 15.4 SPA 合站：Pages Functions

`open.longbridge.com` 背后是两个来源，nginx 按路径拼成一站：

| 路径 | 来源 | 发布方 | 现落点 |
|---|---|---|---|
| `auth` `sso` `account` `log-out` `scope` `oauth2` `dashboard` `connect`（+ 可选 `en\|zh-HK\|zh-CN` 前缀 + 子路径） | **SPA** | private 仓库 / GitLab | `lb-assets/web-brand/release-openapi/` |
| 其余全部 | **文档** | public 仓库 / GitHub | `lb-assets/github/release/open.longbridge.com/new-docs/raw/` |

CF Pages 一个 project 只接一份产物，`_redirects` 只能重定向和站内改写、**不能代理外部来源**。可行解：

- **选定方案**：public 仓库加 `functions/`，命中上述前缀时 `fetch()` SPA 来源，其余走 Pages 静态资源。GitLab 侧零改动。
- 备选（需迁 DNS，已排除）：Worker 绑 `open.longbridge.com/*` 做路由层 —— 见 §11 D7 第二条。
- 已否决：构建时合并产物 —— 会让 SPA 更新必须等文档发布，耦合两个团队的发布节奏。

**SPA 来源已定（2026-09-30）：private 仓库自建 GitHub Actions → 独立 Pages project → 文档仓 Functions 转发。GitLab 一行不动。**

关键事实（实测）：

```
openapi-website-private        (GitHub)  138 commits  HEAD 2026-09-16  完整代码
openapi-website-private(gitlab)(GitLab)   25 commits  HEAD 2026-07-20  只有 tool/ci 配置
```

GitHub 是**代码主仓**，GitLab 只是 CI 配置仓，且 GitHub 主仓**尚无 `.github/workflows/`**。因此：

- 不必给 GitLab 配 `CLOUDFLARE_API_TOKEN`
- `whale-assets`（App 内嵌 webview）、`lb-assets/openapi-sdk`、`web-brand` 三条线完全不受影响
- 构建命令现成，且 `postbuild` 已挂 S1 的 `to-directory-index.ts`，产物形态已对齐：

```bash
bun run build:release           # → packages/openapi/.vitepress/dist
bun run build:longport:release  # → packages/longport/.vitepress/dist
```

被此取代的两个备选：回源 `assets.lbkrs.com`（每请求回一次杭州）、GitLab deploy job 加 wrangler（要给 GitLab 发凭证）。

> **不整体迁移 GitLab CI**：那条流水线有 33 个 job、三条产品线（openapi / longport / openapi-sdk），产出含 `whale-assets/**`（App 内嵌 webview）与 `lb-assets/openapi-sdk/**`。整体迁移会把 App 内嵌与 SDK 发布拖进本次改造，验证面从「两个文档站」扩大到「App 内嵌 + SDK + 文档站」，出问题无法归因。若要退役 GitLab，应单独立项。

### 15.5 canary 验证路径（不需要动 DNS）

> **已查实（2026-09-30）**：`wrangler pages deploy <dir>` **会自动编译并部署同目录级的
> `functions/`**，不需要额外跑 `wrangler pages functions build`。官方文档对此表述含糊、
> `pages deploy --help` 也没有相关 flag，是用一次真实部署确认的：预览上
> `/en/docs/getting-started` 返回 302，说明 Function 已生效。
>
> 同一次部署还印证了 Function 里**不需要**强制 https：线上重定向目标本就是
> `https://…`，本地 `wrangler pages dev` 显示的 `http://` 只是 dev 形态。

CF Pages 分支预览自带域名。对当前分支跑一次：

```bash
wrangler pages deploy dist --project-name=longbridge-developers --branch=feat/nginx_decommission
```

即得 `feat-nginx-decommission.longbridge-developers.pages.dev`，不影响生产，零运维介入。
待缺口补齐后再考虑把 `open-canary.longbridge.xyz` 指过来（见 15.6）。

### 15.6 待运维/控制台完成（CF 轨）

1. 新建 canary Pages project，production branch 设为验证分支
2. Pages → Custom domains 添加域名；因 zone 在 Route 53，CF 会给出 CNAME 目标 `<project>.pages.dev`
3. 在 **Route 53** 改记录：`open-canary.longbridge.xyz` 从 `…w.cdngslb.com`（阿里云 CDN）改指 `<project>.pages.dev`
4. CF 自动 HTTP 验证签发证书 —— 顺带解决当前 `https://open-canary.longbridge.xyz` 握手失败（阿里云 CDN 侧未配证书）
5. 该域名从阿里云 CDN 解绑
6. `longportapp` 侧新建 Pages project

### 15.7 skill zip 在 Pages 上的处置（方案 a）

体积不是问题：实测 `longbridge.zip` = **37,521 字节**、`Content-Type: application/zip`；
CF Pages 单文件上限 **25 MiB**、单部署 **20,000 文件**，差三个数量级。MIME 由扩展名自动给，无需 `_headers`。

问题在形态。`pack-skills.yml` 是独立流水线：

```yaml
on:
  repository_dispatch: { types: [skill-updated] }    # skills 仓更新时被通知
run: |
  git clone github.com/longbridge/skills.git skills-repo   # zip 来自外部仓库，不是本仓 skills/
  zip -r dist/skill/longbridge-all.zip .
  for dir in */; do zip -r dist/skill/${dir%/}.zip "$dir"; done
```

它只产 `dist/skill/*.zip`。而 **Pages 每次部署是全量不可变快照**，单独 `wrangler pages deploy dist`
会把整站覆盖成只剩 zip。

**实现上比预想简单**：`src/integrations/prebuild-skills.ts` **本就在** `astro:build:done`
clone skills 仓并打 zip 进 `dist/skill/`，只是产出清单和 `pack-skills.yml` 不一致 ——
它只产 `skills.zip`（仓库根整包），缺 `longbridge-all.zip` 与每技能一个。改这个集成即可，
不必动 workflow。

实测线上清单与本地新实现的对账（clone 真实 skills 仓跑 zip）：

| | 线上 | 新实现 |
|---|---|---|
| `longbridge-all.zip` | 392,074 | **392,074** ✅ |
| 13 个 `longbridge*.zip` | 8,512 – 53,327 | **逐字节一致** ✅ |
| `skills.zip` | 858,239 | 434,568 ⚠️ 见下 |

**顺带修掉一个既有缺陷**：`skills.zip` 线上那份含**整个 `.git`**（45 个条目，其中
386 KB 的 packfile，占该包 45%）——`prebuild-skills.ts:80` 的 `zip -r "$ZIP" .` 没排除。
原始设计里有这个排除（`plans/2026-08-17-astro-migration-stage-1.md:2960` 写的是
`zip -r … -x '.git/*'`），实现时丢了。修复后 858 KB → 435 KB。

**待查的线上异常**：`open.longbridge.com/skill/longbridge-market-data.zip` 返回 **405 / 2,657 B**
（同目录其它 zip 都是 200）。本地能正常产出 24,191 B。疑似 CDN/WAF 对该路径的拦截，
迁移后应复测。

- 代价：skill 更新需等一次完整文档构建（~17 min）
- 备选 (c)：Pages Functions 代理 `/skill/*.zip` 回 OSS —— 更新即时，但每次下载从 CF 边缘回一次杭州
- 取 (a) 的理由：zip 更新频率低；一个发布者、一份真相，优于多挂一条代理路径

### 15.8 阿里云轨受到的影响

`.cn` 仍按 §14 执行，**新建专用桶不变**。已完成的 `lb-openapi-canary` + CDN 绑定 + 私有回源验证转为 `.cn` 轨的验证环境，不浪费。

仍阻塞：该桶的写权限。

已查实的部分：GitHub Actions 用的 AK 属于 RAM 用户 **`lb-assets-github`**（STS
`GetCallerIdentity` 实测），它对 `lb-openapi-canary` 是 `AccessDenied`，对 `lb-assets`
也只有对象级权限（`stat` 同样 403，说明策略里只有 `…/lb-assets/*` 没有桶级 ARN）。

**未查实**：运维实际把桶加进了哪个用户/策略。只知道加完之后 `lb-assets-github` 仍被拒，
且运维在其登录的账号里搜不到 `lb-assets-github`——账号归属尚未比对（§15.8 末）。

待运维在 `lb-assets-github` 的策略里补：

```json
"acs:oss:*:*:lb-openapi-canary",
"acs:oss:*:*:lb-openapi-canary/*"
```

> 注：现有策略对 `lb-assets` 只授了对象级 `…/*`、没授桶级，所以 `ossutil stat oss://lb-assets` 也是 403。两行都补上才好排查。

---

## 16. 跨项目消费方对账（2026-09-30）

切 Cloudflare 前，对本地 52 个 clone 做了一次全量扫描，回答「多个项目在用 openapi 的资源，切 CF 是否满足」。
方法：先按 `new-docs/raw` / `web-brand/*-openapi`（**消费 OSS 对象**）与 `open.longbridge.(com|cn)` /
`open.longportapp.com`（**消费 HTTP 域名**）分两类，再从第二类里剔除纯内容链接，只看程序化消费。

> 范围限制同假设 #24：仅覆盖本地 clone，不代表公司全部仓库。

### 16.1 结论一览

| # | 发现 | 对 CF 切换的影响 |
|---|---|---|
| E1 | **主站 `longbridge.com` 消费的是 OSS 对象前缀，不是 `open.*` 域名** | 切 CF 零影响；但衍生出 S4 新约束（见 §4 S4） |
| E2 | **CORS 已满足**，无需额外配置 | 无需动作 |
| E3 | **现网本就没有 `X-Frame-Options`** 等安全头 | CF 不输出不算回归；§11 相应依据已更正 |
| E4 | 其余 20 个仓库**全是链接引用**，无浏览器端跨域 fetch | 无需动作，URL 可达即可 |

### 16.2 E1 证据

```nginx
# longbridge.com/index.conf 共 6 处
set $skill_install_host "assets.lbkrs.com";                                              # CDN → lb-assets
set $skill_install_base "/github/${deploy_env_prefix}/open.longbridge.com/new-docs/raw"; # OSS 前缀
```

走的是 CDN→OSS 取对象，**不经过 `open.longbridge.com` 域名**。三点实测：

| URL | 结果 |
|---|---|
| `longbridge.com/skill-install.md` | 200 `text/markdown` **10177 B** ← 现网在跑 |
| `open.longbridge.com/skill/install.md` | **301** ← §2 回环陷阱，主站不能从这取 |
| `longbridge-developers.pages.dev/skill/install.md` | 200 `text/markdown` **10177 B** ← 字节数一致 |

### 16.3 E2 / E3 证据

```
现网 open.longbridge.com :  access-control-allow-origin: *
CF Pages                 :  access-control-allow-origin: *
                            x-content-type-options: nosniff        ← 还多给一个
```

现网 `/docs/getting-started` 的完整响应头里**无** `X-Frame-Options`、CSP、HSTS、`X-Robots-Tag`，
只有 `content-type` / `vary` / `set-cookie` / `access-control-allow-origin` 与一堆 CDN/OSS 的头。
若要补安全头，CF Pages 用 `_headers` 一行即可——比现在 nginx 配了却不生效强。

### 16.4 E4 清单（节选）

```
longbridge-hk/utils/constant.js:18      export const OPENAPI_DOMAIN = 'https://open.longbridge.com'
docs/.../HomeNavbar.vue:35              { label: 'Skill', href: 'https://open.longbridge.com/skill' }
whale-apidocs/.../Footer.astro:31       <a href="https://open.longportapp.com">OpenAPI</a>
whale-docs-cf/scripts/lib/nav-convert.test.ts   （测试夹具里的 href）
longbridge-hk/pages/trading-platforms.vue:113   window.open(`https://open.longbridge.com/${locale}?app_id=…`)
```

全部为 `href` / `window.open` / nav 配置，用户点击跳转。命中路径在 Pages 上实测均 200；
查询参数（如 `?app_id=longbridge`）对静态文件服务无影响。

---

## 15.9 尾斜杠：`build.format` 必须按轨区分（2026-09-30 预览实测）

S1（`d8b2cce6`）把 `build.format` 全局改成 `'directory'`，是为 OSS 静态网站托管准备的。
CF 预览部署后实测发现，这个值在 Cloudflare Pages 上会**反转 URL 规范形式**：

| | `/docs/getting-started` | `/docs/getting-started/` |
|---|---|---|
| 现网 nginx | **200** | 302 去尾斜杠 |
| 生产 Pages（`format:'file'`） | **200** | 308 去尾斜杠 |
| 预览 Pages（`format:'directory'`） | **308 加尾斜杠** | 200 |

`/pricing`、`/sdk` 同样。并且 canonical 自相矛盾：

```html
<link rel="canonical" href="https://…/docs/getting-started">   <!-- 无尾斜杠 -->
```
而该 URL 本身 308 到带尾斜杠版本——搜索引擎拿到的 canonical 指向一个永久重定向地址。

**机制**：Pages 把 URL 规范化到与产物一致的形态。`'file'` 产 `foo.html` → 规范 URL `/foo`；
`'directory'` 产 `foo/index.html` → 规范 URL `/foo/`。**无法用 `_redirects` 覆盖**——
自定义规则与 Pages 内建规范化会互相打架。

**处置**：`astro.config.ts` 改为

```ts
const BUILD_FORMAT = process.env['BUILD_FORMAT'] === 'directory' ? 'directory' : 'file'
build: { format: BUILD_FORMAT, assets: '_docs' }
```

| 轨 | 值 | 设在哪 |
|---|---|---|
| CF（`.com` / `.longportapp.com`） | `'file'`（默认） | 无需设置 |
| 阿里云（`.cn`，将来由 OSS 静态托管承载） | `'directory'` | `canary-aliyun.yml` 已显式设 `BUILD_FORMAT: directory` |

**注意 `.cn` 今天也应该是 `'file'`**：它仍走 nginx，由 nginx 给 URL 补 `.html`。
`'directory'` 只在那个 OSS 桶真正接管后才需要，而该桶连写权限都还没下来。

`assets: '_docs'` 与 format 无关，两轨都保留。

---

## 15.10 install.md 两条路由如何接管（2026-09-30，本地端到端验证）

### 背景：nginx 下线会同时带走两条路由

`_skill_install.conf` 是**共享 include**，被 9 处引用：`open.longbridge.com/{_release,_canary,_cn}.conf`
各一处（**随 openapi 一起下线**），`longbridge.com/index.conf` 六处（**主站，不下线**）。

所以 openapi 侧今天这两条路由，nginx 一删就没了：

| 路径 | 今天 | 提供者 |
|---|---|---|
| `/skill/install.md`（旧，真实流量带邀请码） | **301** → `longbridge.com/skill-install.md`，保留 query | openapi nginx |
| `/skill-install.md`（新） | **200 + 注入** | openapi nginx（include 的副产物） |

真实用法（用户提供的提示词原文）：

```
Please follow this guide to install Longbridge AI Toolkit:
https://open.longbridge.com/skill/install.md?invite-code=ARWGVW
```

### 决策：注入留在主站，Function 只做转发

**不在项目里实现注入。** 理由：主站 nginx 不在下线范围内、注入器仍然存在；且注入点是一份
AI agent 会照着执行 shell 命令的 markdown，把用户输入拼进去这件事不宜有两套实现。

两条路径各按**今天的形态**对接主站，零行为变化：

| 路径 | 处置 | 为什么不是另一种 |
|---|---|---|
| `/skill/install.md` | **301 到主站**（保留 query） | 今天就是 301 |
| `/skill-install.md` | **反向代理到主站**，原样返回 | 今天是 200；改 301 会让状态码变化，改静态文件会丢注入 |

被否决的两个备选：

- **Function 自己注入**：预览环境验不了（pages.dev 必须是原文出口，否则主站回源会双重注入），
  且需要给邀请码做字符集校验——`searchParams.get()` 返回已解码值，换行/反引号能进到指令文档里。
  nginx 取的是未解码的 `$args`，天然无此问题。
- **构建产物新增 `/skill-install.md` 静态文件**：能拿到 200，但静态文件无法按 query 注入，
  带邀请码访问会**静默丢归属**。

### 不会回环

主站回源取的是**斜杠**那条 `pages.dev/skill/install.md`，而 `pages.dev` 不在站点表里、直出原文，
链路终止。前提是 S4 把 `$skill_install_host` 指向 `pages.dev` 而**不是**公网域名——指向公网域名
会命中 301 形成无限重定向（§2 回环陷阱）。

### 本地实测（`wrangler pages dev` + 合成 dist，对着真实主站）

| 请求（Host: open.longbridge.com） | 码 | 注入 | set-cookie | Cache-Control |
|---|---|---|---|---|
| `/skill-install.md?invite-code=ARWGVW` | 200 | **5 处** | 0 | `no-store` |
| `/skill-install.md?invite-code=3333` | 200 | **5 处** | 0 | `no-store` |
| `/zh-CN/skill-install.md?invite-code=ARWGVW` | 200 | **5 处** | 0 | `no-store` |
| `/skill-install.md`（无码） | 200 | 0 | 0 | `no-store` |
| `/skill/install.md?invite-code=ARWGVW` | 301 → `longbridge.com/skill-install.md?invite-code=ARWGVW` | — | — | — |

原文出口（`pages.dev` / `open.longportapp.com`）：斜杠路径 200 原文，不跳不代理。

注入 5 处与现网 `longbridge.com/skill-install.md` 一致。主站会下发阿里云 WAF 的 `acw_tc`
cookie，代理层已剥离，不落到 `open.*` 域；注入结果因邀请码而异，故 `no-store`。
实测不同邀请码之间不串（`AAA111` 的响应里无 `BBB222`，反之亦然）。

### 站点表为什么是显式枚举

`INSTALL_MAIN_SITE` 只列 `open.longbridge.com` / `open.longbridge.xyz`，不用「去掉 `open.` 前缀」
这类推导，两处实测反例：

1. **`open.longportapp.com` 根本不跳**。其 nginx 注释原文：「与仓库路径对齐，不做 URL 迁移，
   **无 invite-code 处理**」。实测 `/skill/install.md` → 200、`/skill-install.md` → 404、
   `longportapp.com/skill-install.md` → 302 去别处。推导规则会把它 301 到错地址。
2. `open-canary.longbridge.xyz` 这类形态前缀匹配不到，会在「以为验过了」的情况下静默失效。

`open.longbridge.cn` 同样 301（→ `longbridge.cn`），但 `.cn` 走阿里云轨、不经过 Function，故不列。

### 降级与已知形态

主站不可用时降级为本站原文（内容正确，仅无注入），并带 `x-install-md-degraded` 响应头，
避免静默。

`pages.dev/skill-install.md` 返回 **404**（产物无此文件、pages.dev 不做代理）。这是预期的：
没有任何消费方访问它，主站回源走的是斜杠那条。

### `.cn` 轨待定

阿里云 CDN 的改写规则**不能按 query 分支**，也没有边缘计算，所以 `.cn` 上这两条路径只能：
永远 301 到 `longbridge.cn/skill-install.md`（保注入、失去无参时的 200），或永远静态 200
（保状态码、带邀请码时静默丢归属）。属 §14 的决策，尚未定。

---

## 15.11 SPA 合站落地（G5，2026-09-30）

### 两侧改动

**private 仓（`longbridge/openapi-website-private`，代码在 GitHub）**

- 新增 `.github/workflows/canary-cloudflare.yml`：照搬 GitLab 跑通的路径（yarn 装依赖 →
  先构建 `packages/utils` → `build:canary`），部署到独立 Pages project
  `longbridge-openapi-app`。**GitLab 一行不动**，`whale-assets`（App 内嵌）与 openapi-sdk
  两条线零影响。
- 构建期只需 `PROXY=canary`。已查实 `PUBLIC_PATH` 是 CI 遗留变量，**代码里无人消费**
  （`rg` 零命中），`base: '/'`，所以资源是根相对的。
- `wrangler pages project create … || true` 自建 project，省掉一次人工操作。

**docs 仓 Function**

```ts
const SPA_PREFIXES = ['auth','sso','account','log-out','scope','oauth2','dashboard','connect']
// /{locale?}/{prefix}{/seg}*  →  <origin>/{locale?/}{path}.html
// /_app/*                     →  <origin>/_app/*
```

`SPA_ORIGIN` 表**包含预览域名** —— 与 `INSTALL_MAIN_SITE` 不同，SPA 转发没有回环风险
（主站只回源 install 那两条路径，不碰 SPA 前缀），所以预览环境也启用，让这套转发在绑正式
域名之前就能完整验证。

### 顺手拆掉一个雷（同 §15.9 同类）

S1 给 private 仓加的 `postbuild` **无条件**跑 `to-directory-index.ts`，把 `dashboard.html`
转成 `dashboard/index.html`。而 nginx 的 SPA 规则取的是：

```nginx
set $openapi_try "/web-brand/${deploy_env_prefix}-openapi/$path.html";
```

**一旦合入，GitLab 那条线的产物就和 nginx 对不上，`/dashboard` 全线 404。**
已改为按 `BUILD_FORMAT` 开关、默认跳过，与 docs 仓 `astro.config.ts` 的同名变量一致。
两向都验过：不设变量保留 `foo.html`，设 `directory` 转成 `foo/index.html`。

### 为什么资源也必须转发

实测线上 `/dashboard` 的 HTML 引用的是**根相对**路径 `/assets/app.CUwW24Yy.js`，而这些资源
带 `x-oss-*` 头、走的是**文档前缀** `new-docs/raw/assets/` —— 这正是「四个项目共用 `/assets/`」
的来源。`.com` 文档迁到 Pages 后 `dist/assets/` 是空的（S1 已把文档资源挪到 `/_docs/`），
所以只转发 HTML 会让 SPA 资源全部 404。S1 给 private 仓设的 `assetsDir: '_app'` 正是为此
准备的命名空间。

### 本地实测（临时把测试 host 指向线上 CDN，布局相同；验完已撤）

| 请求 | 结果 | 对照线上 |
|---|---|---|
| `/dashboard` | 200 · `User Account Center \| Longbridge Developers` | 标题一致 |
| `/zh-CN/dashboard` | 200 · `个人中心 \| Longbridge Developers` | locale 映射正确 |
| `/auth` / `/connect` | 200 | ✅ |
| `/oauth2/authorize` | **404** | **与线上一致** |
| `/docs/getting-started.html` | 308 | 不在前缀内，不转发 |
| `/dashboard`（`open.longportapp.com`） | 404 | 未配来源，不转发 |

**不实现 nginx 的 SPA 兜底**：`error_page 404 → index.html` 是死代码（`_common.conf` 无
`proxy_intercept_errors`，假设 #4），实测 `/oauth2/authorize` 线上就是 404。实现它会把
404 变成 200，属行为变化。

### 待确认

`CLOUDFLARE_API_TOKEN` 是**组织级** secret（这也解释了为何 docs 仓 Settings 页只显示
`REVIEWDOG_TOKEN`、运行时却能解析）。组织 secret 有可见性设置，若为「Selected
repositories」需把 private 仓加进列表。workflow 第一步用表达式比较检查（值不进 shell），
缺了会直接报错说明，推一次即知。
