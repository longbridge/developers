---
title: 'security-list'
sidebar_label: 'security-list'
sidebar_position: 12
---

# longbridge security-list

List US securities that are eligible for overnight trading on Longbridge.

## Basic Usage

```bash
longbridge security-list
```

```
| Symbol   | Name                       |
|----------|----------------------------|
| GDS.US   | GDS                        |
| ZK.US    | ZEEKR Intelligent Tech     |
| ALTM.US  | Arcadium Lithium           |
| HE.US    | Hawaiian Electric Inds     |
| WB.US    | Weibo                      |
...
```

## Examples

### View overnight-eligible US securities

```bash
# Default (US market)
longbridge security-list
# Explicit market
longbridge security-list US
# JSON output for validating eligibility before placing trades
longbridge security-list US --format json
```

Returns the full list of US symbols currently eligible for overnight trading sessions on Longbridge. Use `--format json` to get a machine-readable list for automating eligibility checks.

## Notes

Only the US market is supported (Longbridge API limitation). This list changes as eligibility is updated — check it before submitting overnight orders rather than relying on a cached copy.
