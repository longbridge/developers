---
title: '安装'
sidebar_label: '安装'
sidebar_position: 2
sidebar_icon: arrow-down-to-line
---

# 安装

安装 CLI 并完成 Longbridge 账户鉴权。

源码与发布版本：[longbridge/longbridge-terminal](https://github.com/longbridge/longbridge-terminal){target="_blank"}

## 安装

<Tabs groupId="cli-install">
  <TabItem value="homebrew" label="macOS (Homebrew)" default>

```bash
brew install --cask longbridge/tap/longbridge-terminal
```

  </TabItem>
  <TabItem value="script" label="Linux / macOS（脚本）">

```bash
curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
```

  </TabItem>
  <TabItem value="scoop" label="Windows (Scoop)">

```powershell
scoop install https://open.longbridge.com/longbridge/longbridge-terminal/longbridge.json
```

  </TabItem>
  <TabItem value="powershell" label="Windows (PowerShell)">

```powershell
iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex
```

  </TabItem>
</Tabs>

## auth

管理鉴权——登录、登出和查看 Token 状态。

### auth login

通过 OAuth 2.0 设备授权流完成鉴权，适用于任何环境，包括 SSH 和无界面服务器。

```bash
longbridge auth login
```

运行 `auth login` 后会打印一个 URL 和短码。在任意浏览器中打开该 URL，输入短码并授权。Token 保存至 `~/.longbridge/openapi/tokens/<client_id>`，后续所有命令自动复用。

### auth logout

清除已存储的 OAuth Token。下次执行命令或启动 TUI 时将重新触发鉴权。

```bash
longbridge auth logout
```

### auth status

本地检查 Token 状态，无需网络。显示过期时间、登录时间、账户信息和当前行情权限。

```bash
longbridge auth status
longbridge auth status --format json
```

## check

验证 Token 有效性与 API 连通性。显示 Token 状态、缓存区域，以及全球和 CN 两端 API 的延迟。无需活跃市场交易时段。

```bash
longbridge check
longbridge check --format json
```

## update

下载并运行官方安装脚本，将当前二进制文件替换为最新版本。

```bash
longbridge update
```
