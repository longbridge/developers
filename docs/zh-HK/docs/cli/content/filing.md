---
title: 'filing'
sidebar_label: 'filing'
sidebar_position: 2
---

# longbridge filing

瀏覽標的的監管申報文件和披露文件。美股支持 [SEC EDGAR](https://www.sec.gov/cgi-bin/browse-edgar) 申報文件，包括 [Form 4](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=4&dateb=&owner=include&count=40) 內幕交易、[8-K](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=8-K&dateb=&owner=include&count=40) 當期報告及 [10-K](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=10-K&dateb=&owner=include&count=40) 年報。港股返回[香港聯合交易所](https://www.hkexnews.hk/)的交易所披露文件。

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

### 查看最新申報文件

```bash
longbridge filing TSLA.US
# 以 JSON 格式輸出（便於腳本處理）
longbridge filing TSLA.US --format json
```

列出該標的最新申報文件，包含標題、表格類型及發布日期。JSON 輸出中的 `file_urls` 字段包含申報文件的直接下載鏈接。

### 閱讀完整申報內容

```bash
# 使用申報列表中的 id 讀取完整文件
longbridge filing detail 633214836329945345
```

返回申報文件的完整文本內容。適用於提取特定披露資訊，或將內容傳入 AI 模型進行分析。
