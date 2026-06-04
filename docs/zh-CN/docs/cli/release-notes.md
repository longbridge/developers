---
title: 'Release Notes'
sidebar_label: 'Release Notes'
sidebar_position: 100
sidebar_icon: newspaper
---

# Release Notes

### [v0.22.4](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.22.4)

- **`constituent` 支持 ETF** — ETF 标的现返回资产分布数据（持仓 / 地区 / 资产类别 / 行业四组表格）；指数标的行为完全不变
- **美股 ETF 完整持仓（SEC N-PORT）** — 美股 ETF 默认从 SEC EDGAR N-PORT 文件获取完整持仓组合（权重、股数、市值，如 `IVV.US` 全部 500+ 只持仓）；SEC 数据不可用时回退到平台资产分布摘要

### [v0.22.3](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.22.3)

- **`quote` 新增美股隔夜时段数据** — `quote <SYMBOL> --format json` 现会输出 `overnight_quote`，与 `pre_market_quote`、`post_market_quote` 并列；此前隔夜字段始终为 `null`，会影响 AI 工作流中的盘后判断
- **持仓类命令显示账户类型 banner** — `positions`、`fund-positions`、`assets`、`portfolio` 现会在表格前打印一行账户标识（`Live A/C (real account)` / `Demo A/C (simulated account)`），便于直接区分数据所属账户；`--format json` 输出保持不变

### [v0.22.2](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.22.2)

- **JSON 时间戳统一为 RFC 3339** — 时序与历史类命令（`kline`、`kline-history`、`trades`、`intraday`、`capital-flow`、`capital-dist`、`market-temp`、`topics`）及账户盈亏流水现输出 ISO 8601 / RFC 3339 日期时间，不再使用原始 Unix 时间戳
- **`market-temp --history` 默认区间** — 省略 `--start` 时默认取结束日期前 30 天（此前默认为当天），单次 `--history` 即可返回整月数据

### [v0.22.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.22.0)

- **新增 `shareholder --top`** — 前 20 大股东（机构、个人、内部人）多报告期持股对比；`--object-id <id>` 查看单一股东持仓历史及交易明细
- **扩展 `short-positions`** — 新增港股支持（`.HK` 自动路由至港交所沽空持仓数据）
- **新增 `short-trades`** — 每日沽空成交量（美股：FINRA/纳斯达克；港股：港交所披露数据）
- **新增 `compare`** — 多股估值对比（PE/PB/PS/市值/收盘价），不传对比股票时服务端自动选取同行业标的
- **新增 `top-movers`** — 价格波动超近 20 日标准差的异动股票，附关联新闻解读；支持 `--market`、`--sort time|change|hot` 筛选
- **新增 `screener` 命令组** — 股票筛选工具：`strategies`（推荐/我的策略）、`search --strategy-id <id>` 或 `--filter key:min:max` 执行筛选、`indicators` 查看可用指标
- **新增 `rank`** — 人气排行榜；不带 `--key` 列出所有分类，`--key <key>` 获取对应排行（如 `ib_hot_all-us`）
- MCP 服务同步新增相同工具

### [v0.21.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.21.0)

- **新增 `business-segments`** — 按业务分部拆解营收，支持当期数据或历史趋势对比
- **新增 `industry-rank`** — 按市场（US/HK/CN/SG）和指标对行业排名；Counter ID 可直接传给 `industry-peers`
- **新增 `industry-peers`** — 行业子板块树形结构，展示各节点的股票数、当日涨跌和年初至今涨跌
- **新增 `financial-report snapshot`** — AI 财报摘要，含超/低预期分析和同行即将发布财报日期
- **新增 `institution-rating --views`** — 逐月展示机构评级分布变化趋势

### [v0.20.3](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.20.3)

- **Breaking：移除 `analyst-estimates` 命令** — 该命令已下线；EPS 和营收预测数据请改用 `consensus`
- **修复：港股代码前导零** — `00700.HK`、`09988.HK` 等格式现在可正确解析为 `700.HK`、`9988.HK`；`operating` 命令说明更新，明确仅支持港股
- **修复：`ipo detail`** — 自动从代码后缀识别市场（如 `SUJA.US` → 美股，`700.HK` → 港股），不再需要 `--market` 参数；找不到 IPO 数据时提示更友好；缴款截止日期改为 RFC 3339 格式

### [v0.20.2](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.20.2)

- **修复：`institution-rating --history` 输出格式** — 改为表格布局，列顺序更合理；时间戳格式化为 `YYYY-MM-DD`；目标价保留 2 位小数；`evaluate_history` 仅展示最近 20 条记录
- **修复：IPO 日期显示** — `ipo listed`、`ipo wait-listing`、`ipo calendar`、`ipo us-wait-listing` 现在正确显示日期（如 `2026-05-11`），不再出现 1970 年的错误日期

### [v0.20.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.20.0)

- **`ipo` 命令组** — 完整 IPO 工具：港股支持 `subscriptions`（在招）、`wait-listing`（暗盘）、`listed`（近期上市）、`calendar`（日历）、`detail`（详情）、`orders`（订单）、`profit-loss`（盈亏）；美股支持 `us-subscriptions`、`us-wait-listing`、`us-listed`
- **`financial-statement`** — 完整逐行财务报表（利润表/资产负债表/现金流量表），含层级结构与 YoY 对比；支持 `--kind IS/BS/CF/ALL` 和 `--report af/saf/qf/cumul`
- **`financial-report --latest`** — 新增 `--latest` 参数，快速获取最新财报关键指标摘要（营收、净利润、EPS、ROE、总资产）
- **`valuation-rank`** — 每日 PE/PB/PS 行业百分位排名，以 `排名/总数` 形式展示，支持自定义日期范围
- **`institution-rating --history` / `--industry-rank`** — 新增参数：`--history` 查看评级及目标价随时间的变化；`--industry-rank` 查看行业内所有股票的分析师覆盖排名
- **`news search` / `topic search`** — 按关键词搜索资讯和社区话题
- **`bank-cards`** — 查看账户绑定的银行卡列表
- **`withdrawals`** / **`deposits`** — 查看出入金历史记录，支持按状态和货币筛选
- **`portfolio short-margin`** — 融券保证金逐仓明细
- **修复：模拟盘账户渠道识别** — `auth status` 及行情商城二维码链接现在能正确识别模拟盘账户（`lb_papertrading`）的账户渠道，从 Access Token JWT 动态解析，不再硬编码

### [v0.19.2](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.19.2)

- **`finance-calendar` 重构** — 改为子命令结构（`report`、`dividend`、`split`、`ipo`、`macrodata`、`closed`）；新增 `--filter watchlist|positions` 按自选股或持仓筛选事件
- **`quote`** — 新增「涨跌幅」列，显示相较上一收盘价的变动幅度
- **`corp-action`** — 默认返回 30 条，加 `--all` 获取全部记录
- **`update --force`** — 跳过版本检查强制重装；权限不足时自动通过 `sudo` 重试
- **TUI** — 支持鼠标操作；个股详情页新增折线图 / K 线图切换

### [v0.19.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.19.0)

- **TUI：历史订单 Tab** — 在订单页面按 `Tab` 切换今日 / 历史两个视图；历史模式默认获取最近 30 天；按 `f` 打开日期范围筛选弹窗
- **TUI：撤单与改单** — 在今日订单列表按 `c` 撤单、`m` 改单，提交前有确认步骤
- **`auth status` 行情套餐** — 以表格形式展示已订阅的行情套餐（市场、套餐名称、有效期），并输出二维码供 Longbridge App 扫码进入行情商城
- **`calc-index` 字段别名** — 常用字段支持短别名：`iv`、`oi`、`vol`、`mktcap`、`exp`、`strike`；`--help` 将字段分为通用和期权两组展示
- **`quant run` 命令** — 服务端执行量化指标脚本，基于历史 K 线数据计算；支持 `--script` 内联或 stdin 管道传入；结果以 JSON 格式输出
- **`update` Release Notes** — `longbridge update` 完成后仅显示最近 10 条更新记录；binary 位于 `/usr/local/bin` 时会提示使用 `sudo`

### [v0.18.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.18.0)

- **TUI：订单页面** — 交互式订单列表，支持快捷键操作和下单对话框，无需离开终端即可完成交易
- **`dividend --page` / `--year`** — 支持翻页浏览大量分红历史记录，并按年份过滤；每页获取 50 条记录（原为 30 条）

### [v0.17.4](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.4)

- **`--limit` 别名** — 所有接受 `--count` 参数的命令现在也支持 `--limit` 作为别名，提升 AI agent 工具调用兼容性
- **修复：Unix 自更新 ETXTBUSY** — `longbridge update` 在 Unix 上不再因"Text file busy"报错；更新流程改为先写入临时文件再原子重命名，不再直接写入正在运行的二进制文件

### [v0.17.3](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.3)

- **修复：Token 刷新卡死** — 当访问令牌过期且网络不稳定时，CLI 不再等待 5 分钟才报错，现在立即失败并给出明确提示，同时保留 Token 文件供下次重试
- **`auth status` 准确性改进** — 现在显示三种状态：`valid`（绿色）、`refresh pending`（黄色，访问令牌已过期但刷新令牌有效，下次命令自动刷新无需操作）、`expired`（红色，需重新登录）；之前 `refresh pending` 状态被错误显示为 `expired`
- **修复：`--auth-code` 登录** — 在没有 Token 文件时，浏览器 OAuth 流程现在可以正常触发
- **修复：Windows 浏览器启动** — 包含 `&` 参数的 OAuth URL 不再在 Windows 上被截断；改用 `open` crate 实现跨平台浏览器调用

### [v0.17.1](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.1)

- **`completion` 命令** — 生成 bash、zsh、fish、elvish、powershell 的 Tab 补全脚本；将输出重定向到对应文件并重载 shell 即可启用（如 `longbridge completion zsh > ~/.zfunc/_longbridge`）
- 所有 HTTP 及 WebSocket 请求统一设置 `User-Agent: longbridge-cli/<version>`
- 每次 API 调用新增 `x-cli-cmd` 请求头，标识当前执行的子命令

### [v0.17.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.0)

- **`dca` 命令** — 定投完整生命周期管理：创建、更新、暂停、恢复、停止、查看交易历史、统计概览、检查标的是否支持定投、计算下次交易日；港股及新加坡账户创建计划前须同意条款与条件（`--agree-terms` 可跳过交互提示）
- **`sharelist` 命令** — 社区股票列表：查看自己创建和订阅的列表、浏览热门列表（`popular`）、创建/删除列表，以及添加/移除/排序成分股
- **`short-positions`** — 美股做空数据：空头比例、空头股数、日均成交量、平仓天数及收盘价；FINRA 每两周更新；`--count` 1–100
- **`option volume`** — 实时认购/认沽成交量快照（含 P/C 比）；`daily` 子命令查看历史每日成交量及持仓量
- **`option chain`** — 不带 `--date` 时只返回到期日列表；加 `--date` 才返回对应到期日的行权价
- **`profit-analysis`** — 汇总命令新增 `--start`/`--end` 日期范围筛选；Simple Yield 和 TWR 改为百分比格式；"Stock P&L Breakdown" 重命名为 "P&L Breakdown"（包含基金和货币基金）

### v0.16.3

- **`auth` 子命令组** — `longbridge auth login`、`auth logout`、`auth status`；`auth status` 本地检查 Token 有效性、过期时间、账户信息和行情权限，无需网络
- **`alert enable` / `alert disable`** — 切换股价提醒的启用状态，无需删除重建
- **修复：美股指数 symbol** — `.DJI.US`、`.VIX.US` 等美股指数 symbol 现已正确解析；美股指数需要前置点号（如 `.DJI.US`，而非 `DJI.US`）
- **"你是否想查询…" 提示** — 当查询无返回数据时，CLI 会给出 symbol 格式建议：缺少市场后缀 → `TSLA.US` / `700.HK`；缺少前置点号 → `.DJI.US`

### v0.16.1

**改进**

- `option quote` — 完整输出 OptionQuote API 全部字段（新增 `timestamp`、`trade_status`、`open_interest`、`historical_volatility`、`contract_multiplier`、`contract_size`、`direction`、`underlying_symbol`）；JSON 输出使用正确的类型值
- `calc-index` — Theta、Vega、Rho 值已标准化（÷100）为标准的每股单位；自动检测期权合约并切换为 Greeks 默认字段
- `capital` — 改进命令参数处理
- `market-status` — 修复 `trade_status` 映射错误（105 = 午盘交易）；JSON 输出改为人类可读的市场和状态标签
- 参数标准化：`--adjust none/forward`（原 `no_adjust/forward_adjust`）、`--tif day/gtc/gtd`（原 `Day/GoodTilCanceled/GoodTilDate`）、`--format table` 作为默认名称（别名：`pretty`）、`finance-calendar --start/--end`（原 `--date/--end-date`）、`statement --start-date` 支持 `YYYY-MM-DD` 格式
- TUI：修复自选列表排序跳动问题，优化滚动条显示

### [v0.16.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.16.0)

新增 21 个命令，覆盖公司基本面、行情数据和账户功能。

**新增：公司与基本面**

- `company` — 公司概览（成立日期、员工数、IPO 价格、地址等）
- `executive` — 公司高管与核心人员
- `industry-valuation` — 行业估值对比（PE/PB/EPS/股息率）；`dist` 子命令查看行业百分位排名
- `operating` — 经营评述：财务指标表 + 管理层评论
- `corp-action` — 公司行动（拆股、分红、配股等）
- `invest-relation` — 投资关系（子公司/母公司结构）

**新增：行情与市场**

- `constituent` — 指数/ETF 成分股，支持排序 + 涨跌统计
- `market-status` — 各交易所开市/休市状态
- `broker-holding` — 港股券商持仓（大户/明细/每日变动）
- `ah-premium` — AH 溢价率 K 线与分时数据（仅限 A+H 双重上市股票）
- `trade-stats` — 成交统计（按价格区间分布的成交量）
- `anomaly` — 行情异动 / 市场异常波动

**新增：账户**

- `alert` — 股价提醒（查看/添加/删除）
- `profit-analysis` — 盈亏总览 + 逐只股票分析；`detail` 查看单只股票盈亏明细与交易流水；`by-market` 按市场筛选

**增强**

- `update` — 跨平台自更新，新增 Windows 支持和 CDN 加速；`--release-notes` 查看更新日志；版本变更后首次运行自动显示
- `intraday --date` — 支持查询历史日期的分时数据
- TUI：按 `/` 搜索自选股，或直接输入 symbol 快速跳转到任意股票
- 支持 `BROWSER` 环境变量自定义登录时使用的浏览器

### [v0.15.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.15.0)

- **新增：`portfolio` 命令** — 显示总盈亏、各市场资产分布（美股/港股/A 股/新加坡/现金）、持仓明细和现金余额
- **新增：`investors` 命令** — 基于 SEC 13F 的活跃基金经理排行榜；通过 CIK 查看任意投资者的持仓及实时价格
- **新增：`insider-trades`** — 任意标的的 SEC Form 4 内部人交易历史
- **新增：`watchlist pin/unpin`** — 将证券置顶到自选股分组顶部
- **增强：`assets`** — 从 `balance` 更名；现在显示完整资产概览：净资产、购买力、保证金、风险等级及各币种现金明细

### [v0.14.2](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.14.2)

- **新增：`--lang` 全局参数** — 为所有命令设置内容语言（`zh-CN`、`zh-HK`、`en`）；未设置时依次回退到系统 `LANG` 环境变量，最终默认 `en`

### [v0.14.1](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.14.1)

- **新增：中国区登录** — `longbridge auth login` 现在支持中国区路由
- **新增：`-v` 参数** — 无需输入完整命令即可查看版本号

### [v0.14.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.14.0)

- **新增：设备授权登录** — `longbridge auth login` 改用 OAuth 设备流程；显示 URL 和授权码，可在任意设备上完成授权，支持 SSH 和无头环境；移除了 `--headless` 参数
- **新增：订单增强** — 新增追踪止损和 AO 订单类型；订单命令新增 `--expire-date`、`--outside-rth`、`--remark` 参数
- **修复：Linux 段错误** — 预编译 Linux 二进制文件改用 musl，修复在部分发行版上的崩溃问题

### [v0.13.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.13.0)

- **新增：基本面与分析命令** — `financial-report`、`valuation`、`forecast-eps`、`consensus`、`institution-rating`、`shareholder`、`fund-holder`、`dividend`、`finance-calendar`、`exchange-rate`
- **破坏性变更：命令重构** — 19 个独立命令合并为子命令树（例如 `news-detail` → `news detail`、`kline-history` → `kline history`、`warrant-list` → `warrant list`）
- **支持中国区** — 设置 `LONGBRIDGE_REGION=cn` 以通过中国区端点路由

### [v0.12.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.12.0)

- **新增：`statement` 命令** — 列出并导出日/月账户结单
- **TUI** — 修复 `q` 退出；在自选股内新增资讯列表和详情视图

---

完整更新日志：[github.com/longbridge/longbridge-terminal/releases](https://github.com/longbridge/longbridge-terminal/releases)
