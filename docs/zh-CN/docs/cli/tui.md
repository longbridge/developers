---
title: 'tui'
sidebar_label: 'TUI'
sidebar_position: 99
sidebar_icon: square-terminal
---

# longbridge tui

启动交互式全屏终端界面（TUI）——实时交易看板，包含自选股管理、实时 K 线图表、持仓视图和股票搜索。支持 Vim 风格快捷键。

## 基本用法

```bash
longbridge tui
```

<a href="https://asciinema.org/a/785102" target="_blank">
  <img src="https://asciinema.org/a/785102.svg" alt="longbridge tui demo" />
</a>

## 示例

### 实时监控自选股

TUI 打开后展示自选股列表，实时显示价格、涨跌幅和成交量。使用 `j`/`k` 或方向键在股票间导航。

### 查看 K 线图表

在任意标的上按 `Enter` 进入股票详情页，显示实时 K 线图。使用 `1m`、`5m`、`1h`、`1d` 快捷键切换时间周期。

### 搜索并添加标的

按 `/` 打开搜索浮层，输入名称或代码即可查找并添加到自选股。

## 注意事项

- 需要有效的 `longbridge auth login` 登录会话
- TUI 与 CLI 命令共用同一个 token
- 按 `q` 或 `Ctrl+C` 退出
