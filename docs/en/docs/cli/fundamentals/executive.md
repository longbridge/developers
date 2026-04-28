---
title: 'executive'
sidebar_label: 'executive'
sidebar_position: 9
---

# longbridge executive

View a company's executives and key personnel — names, titles, and roles.

## Basic Usage

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

## Examples

### List executives

```bash
longbridge executive AAPL.US
longbridge executive 700.HK
```

Displays the executive team with their names and titles.

### JSON output

```bash
longbridge executive TSLA.US --format json
```
