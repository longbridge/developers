# 任务：将 openapi commit 523035611 新增的 SDK 接口同步到 openapi-go（Go SDK）

## 背景

openapi 仓库 commit `523035611c811e35a5f3ce8f0bd1f52f80723a4f` 新增了以下 Context（已在 Rust / Python / Node.js / Java / C / C++ 中实现），现在需要同步实现到 **Go SDK**（`openapi-go` 仓库）。

**新增 Context：**
- `FundamentalContext` — 财务报告、评级、分红、估值、公司概况、高管、股东、基金持仓、公司行动
- `MarketContext` — 市场状态、经纪商持仓、A/H 溢价、成交统计、异动、指数成分
- `CalendarContext` — 财经日历（财报/分红/拆股/IPO/宏观）
- `PortfolioContext` — 汇率、盈亏分析（汇总/明细/按市场/资金流）
- `AlertContext` — 价格提醒管理（增删改查）
- `DCAContext` — 定期投资计划管理（完整 CRUD + 历史记录）
- `SharelistContext` — 社区自选列表管理（完整 CRUD）

**现有 Context 扩展：**
- `QuoteContext` 新增：`short_positions`、`option_volume`、`option_volume_daily`、`update_pinned`
- `ContentContext` 新增：`topic_detail`、`list_topic_replies`、`create_topic_reply`

---

## 参考实现

**主要参考**：openapi 仓库（子模块路径 `openapi/`）中 commit `523035611` 的 Rust 实现：
- 各 context 的 API 路径、请求参数、响应结构从 `openapi/rust/src/<context>/context.rs` 读取
- 响应类型定义从 `openapi/rust/src/<context>/types.rs` 读取
- Python 类型注解（`openapi/python/pysrc/longbridge/openapi.pyi`）可辅助理解字段含义

**不要参考其他语言的实现来推断 API 路径**，以 Rust 实现为准。

---

## Go SDK 现有代码模式

模块名：`github.com/longbridge/openapi-go`

每个 Context 是独立的 Go package，结构如下：

```
<context-name>/
  context.go      # 公开的 Context struct 及方法
  core.go         # HTTP 调用实现（内部）
  types.go        # Go 类型定义（枚举、struct）
  options.go      # NewFromCfg / NewFromEnv 构造函数及 Options
  jsontypes/
    types.go      # JSON 反序列化用的内部类型
```

### context.go 模式

```go
package <name>

import (
    "context"
    "github.com/longbridge/openapi-go/config"
)

// XxxContext is a client for interacting with Longbridge Xxx OpenAPI.
type XxxContext struct {
    opts *Options
    core *core
}

// NewFromCfg creates a XxxContext from config.
func NewFromCfg(cfg *config.Config) (*XxxContext, error) { ... }

// NewFromEnv creates a XxxContext from environment variables.
func NewFromEnv() (*XxxContext, error) { ... }

// MethodName does something.
// Reference: https://open.longbridge.com/en/docs/<path>
//
// Example:
//
//	ctx, _ := <name>.NewFromEnv()
//	result, err := ctx.MethodName(context.Background(), ...)
func (c *XxxContext) MethodName(ctx context.Context, ...) (*ReturnType, error) {
    return c.core.MethodName(ctx, ...)
}
```

### core.go HTTP 调用模式

参考 `quote/core.go` 中 REST 方法的写法，使用 `opts.httpClient` 发起 GET/POST 请求，
响应用 `jsontypes` 中的内部类型反序列化后转换为公开类型返回。

### types.go 规范

- 整数枚举用 `type XxxType int32`，字符串枚举用 `type XxxType string`
- 货币/价格字段用 `github.com/shopspring/decimal`（`decimal.Decimal` 或 `*decimal.Decimal`）
- 时间字段用 `time.Time` 或 `*time.Time`
- 可选字段用指针类型

---

## 执行步骤

1. 读取 `openapi/rust/src/<context>/context.rs`，列出所有 `pub async fn` 方法、路径、请求参数
2. 读取 `openapi/rust/src/<context>/types.rs`，了解所有请求/响应类型
3. 参照现有 `openapi-go/quote/` 或 `openapi-go/trade/` 的完整结构
4. 为每个新 Context 创建对应 package 目录，实现全套文件
5. 为 `quote/` 和 `content/` 的扩展方法，在现有文件中追加
6. 确保所有公开 struct/方法都有 godoc 注释，方法注释包含 `// Reference: <url>`

---

## 注意事项

- 方法名遵循 Go 规范：PascalCase（如 Rust 的 `financial_report` → Go 的 `FinancialReport`）
- 不要直接暴露 JSON tag 或内部类型，`jsontypes/` 仅用于反序列化
- 每个新 package 必须提供 `NewFromCfg` 和 `NewFromEnv` 两个构造函数
- 不改动现有文件中已有的方法，只追加新方法
- `go.mod` 不需要修改，依赖项已满足
