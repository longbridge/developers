---
title: 'filing'
sidebar_label: 'filing'
sidebar_position: 2
---

# longbridge filing

Browse regulatory filings and disclosure documents for a symbol. For US-listed stocks, this includes [SEC EDGAR](https://www.sec.gov/cgi-bin/browse-edgar) filings such as [Form 4](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=4&dateb=&owner=include&count=40) insider transactions, [8-K](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=8-K&dateb=&owner=include&count=40) current reports, and [10-K](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=10-K&dateb=&owner=include&count=40) annual reports. HK-listed stocks return exchange disclosure filings from the [Hong Kong Stock Exchange](https://www.hkexnews.hk/).

## Basic Usage

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

## Examples

### View recent filings

```bash
longbridge filing TSLA.US
# Output as JSON for scripting
longbridge filing TSLA.US --format json
```

Lists the most recent filings for the symbol with titles, form types, and publication dates. The `file_urls` field in JSON output contains direct download links to the filing documents.

### Read a full filing

```bash
# Use the id from the filing list to read the full document
longbridge filing detail 633214836329945345
```

Returns the full text content of the filing. Useful for extracting specific disclosures or feeding to an AI model for analysis.
