---
title: 'etf-docs'
sidebar_label: 'etf-docs'
sidebar_position: 21
---

# longbridge etf-docs

List regulatory documents for a US ETF — prospectus, fact sheets, and other filings.

:::warning Longbridge US Accounts
This command is only available for US data-center accounts.
:::

## Basic Usage

```bash
longbridge etf-docs IVV.US
```

```
Name
----
iShares Core S&P 500 ETF Prospectus
iShares Core S&P 500 ETF Statement of Additional Information
iShares Core S&P 500 ETF Annual Report
...
```

## Examples

### List ETF documents

<CliCommand>
longbridge etf-docs IVV.US
longbridge etf-docs SPY.US
</CliCommand>

### Limit number of results

```bash
longbridge etf-docs IVV.US --limit 5
```

## Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `--limit` | Maximum number of documents to return | 10 |
