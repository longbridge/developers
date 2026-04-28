---
title: 'executive'
sidebar_label: 'executive'
sidebar_position: 9
---

# longbridge executive

查看公司高管和核心管理人員——姓名、職位和職責。

## 基本用法

```bash
longbridge executive AAPL.US
```

```
| name                | title                                           |
|---------------------|-------------------------------------------------|
| Timothy D. Cook     | CEO & Director                                  |
| Arthur D. Levinson  | Independent Non-Executive Chairman of the Board |
| Kevan Parekh        | Senior VP & CFO                                 |
| Sabih Khan          | Senior VP & Chief Operating Officer             |
| Deirdre O'Brien     | Senior Vice President of Retail & People        |
...
```

## 示例

### 查看高管列表

```bash
longbridge executive AAPL.US
longbridge executive 700.HK
```

展示管理團隊的姓名和職位資訊。

### JSON 輸出

```bash
longbridge executive TSLA.US --format json
```
