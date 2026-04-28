---
title: 'filing'
sidebar_label: 'filing'
sidebar_position: 2
---

# longbridge filing

浏览标的的监管申报文件和披露文件。美股支持 [SEC EDGAR](https://www.sec.gov/cgi-bin/browse-edgar) 申报文件，包括 [Form 4](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=4&dateb=&owner=include&count=40) 内幕交易、[8-K](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=8-K&dateb=&owner=include&count=40) 当期报告及 [10-K](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=10-K&dateb=&owner=include&count=40) 年报。港股返回[香港联合交易所](https://www.hkexnews.hk/)的交易所披露文件。

## 基本用法

```bash
longbridge filing TSLA.US
```

```
| id                 | title                                 | file_name                  | files | publish_at           |
|--------------------|---------------------------------------|----------------------------|-------|----------------------|
| 633214836329945345 | Tesla | 4 - Tesla, Inc. (Issuer)      | 4 - Tesla, Inc. (Issuer)   | 1     | 2026-04-03T00:08:52Z |
| 633048285147044097 | Tesla | 8-K - Tesla, Inc. (Filer)     | 8-K - Tesla, Inc. (Filer)  | 2     | 2026-04-02T13:07:13Z |
| 632835137097963777 | Tesla | 4 - Tesla, Inc. (Issuer)      | 4 - Tesla, Inc. (Issuer)   | 1     | 2026-04-01T23:00:13Z |
...
```

## 示例

### 查看最新申报文件

```bash
longbridge filing TSLA.US
# 以 JSON 格式输出（便于脚本处理）
longbridge filing TSLA.US --format json
```

列出该标的最新申报文件，包含标题、表格类型及发布日期。JSON 输出中的 `file_urls` 字段包含申报文件的直接下载链接。

### 阅读完整申报内容

```bash
# 使用申报列表中的 id 读取完整文件
longbridge filing detail 633214836329945345
```

返回申报文件的完整文本内容。适用于提取特定披露信息，或将内容传入 AI 模型进行分析。
