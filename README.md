# Longbridge Developers

**https://open.longbridge.com**

Longbridge Developers is the official developer platform for Longbridge — providing programmatic access to real-time market data, trading, account management, and AI integrations across HK, US, and CN markets.

---

## Repository structure

```
/
├── docs/                        # Site content and VitePress config
│   ├── .vitepress/              # Theme, components, markdown plugins, locale configs
│   ├── en/                      # English content (root locale)
│   ├── zh-CN/                   # Simplified Chinese content
│   └── zh-HK/                   # Traditional Chinese content
├── openapi/                     # Submodule: OpenAPI spec + SDK source (openapi, Python, Rust, etc.)
├── openapi-go/                  # Submodule: Go SDK
├── longbridge-terminal/         # Submodule: CLI binary source (longbridge)
├── skills/longbridge/           # AI Skill — knowledge base for AI agents
├── scripts/                     # Build scripts (llms.txt generation, markdown normalization)
├── openapi.yaml                 # Canonical API specification (source of truth for API Reference)
└── CONTRIBUTING.md              # Contribution guidelines for AI agents and humans
```

---

## What you can build

- Automated trading strategies and order management
- Real-time quote dashboards and data pipelines
- Portfolio trackers and risk monitoring tools
- AI agents with live market data and trading capabilities

## Access methods

| Method                                                       | Best for                                             |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| [SDK](https://open.longbridge.com/sdk)                       | Python, Rust, Node.js, Go, Java, C++ apps            |
| [HTTP / WebSocket API](https://open.longbridge.com/docs/api) | Any language, custom integrations                    |
| [CLI](https://open.longbridge.com/docs/cli) (`longbridge`)   | Terminal workflows, scripting, AI tool-calling       |
| [MCP](https://open.longbridge.com/docs/mcp)                  | AI coding assistants (Cursor, Claude, ChatGPT, etc.) |
| [Skill](https://open.longbridge.com/skill)                   | Give any AI direct knowledge of Longbridge APIs      |

## Quick start

### 1. Open a Longbridge account

Download the [Longbridge App](https://longbridge.com/download) and complete account onboarding.

### 2. Enable OpenAPI access

Log in to [open.longbridge.com](https://open.longbridge.com), complete developer verification, and obtain your API token.

### 3. Choose your integration

**CLI — fastest way to get started:**

```bash
brew install --cask longbridge/tap/longbridge-terminal
longbridge auth login
longbridge quote TSLA.US NVDA.US 700.HK
```

**Python SDK:**

```bash
pip install longbridge
```

**MCP for AI assistants** — add to your MCP client config:

```json
{
  "mcpServers": {
    "longbridge": {
      "url": "https://openapi.longbridge.com/mcp"
    }
  }
}
```

**AI Skill** — give your AI full knowledge of Longbridge APIs:

```bash
npx skills add longbridge/developers -g -y
```

## Market coverage

| Market        | Instruments                                      |
| ------------- | ------------------------------------------------ |
| Hong Kong     | Equities, ETFs, Warrants, CBBCs, Hang Seng Index |
| United States | Stocks, ETFs, OPRA Options, Nasdaq Index         |
| China A-share | Stocks, ETFs, Index                              |

## Documentation

- **Getting Started** — https://open.longbridge.com/docs/getting-started
- **API Reference** — https://open.longbridge.com/docs/api
- **SDK Reference** — https://open.longbridge.com/sdk
- **CLI Reference** — https://open.longbridge.com/docs/cli
- **MCP Setup** — https://open.longbridge.com/docs/mcp
- **LLM / AI Integration** — https://open.longbridge.com/docs/llm
- **Changelog** — https://open.longbridge.com/docs/changelog

## LLM-friendly docs

All documentation pages are available as Markdown by appending `.md` to any URL:

```
https://open.longbridge.com/docs/getting-started.md
https://open.longbridge.com/docs/quote/pull/static.md
```

A machine-readable index is available at:

```
https://open.longbridge.com/llms.txt
```

## Pricing

OpenAPI access is free for Longbridge Integrated Account holders. No additional fees for activating or using the API. Standard brokerage transaction fees apply to trades.

## Contributing

### Local development setup

```bash
git clone --recurse-submodules https://github.com/longbridge/developers.git
cd developers
bun install
bun run dev
```

If you already cloned without `--recurse-submodules`:

```bash
git submodule update --init --recursive
bun run dev
```

The dev server starts at `http://localhost:5173` and connects to the canary API. Use `bun run dev:prod` to connect to the production API instead.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full contribution guidelines.
