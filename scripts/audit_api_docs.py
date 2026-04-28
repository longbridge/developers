#!/usr/bin/env python3
import re
import json
import requests
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
LOCALES = ['en', 'zh-CN', 'zh-HK']

METHOD_RE = re.compile(r'HTTP Method</td><td>\s*([^<\n]+)', re.I)
URL_RE = re.compile(r'HTTP URL</td><td>\s*([^<\n]+)', re.I)
TITLE_RE = re.compile(r'^title:\s*(.+)$', re.M)


def collect(locale):
    rows = []
    for p in (DOCS / locale / 'docs').rglob('*.md'):
        txt = p.read_text(encoding='utf-8')
        m = METHOD_RE.search(txt)
        u = URL_RE.search(txt)
        if not (m and u):
            continue
        title = (TITLE_RE.search(txt).group(1).strip().strip('"\'') if TITLE_RE.search(txt) else p.stem)
        rows.append({
            'locale': locale,
            'method': m.group(1).strip().upper(),
            'path': u.group(1).strip(),
            'title': title,
            'file': str(p.relative_to(ROOT)).replace('\\', '/'),
        })
    return rows


def check_endpoint(base, method, path):
    url = base.rstrip('/') + path
    try:
        r = requests.request(method, url, timeout=5)
        return {'status': r.status_code, 'code': None, 'message': None}
    except Exception as e:
        return {'status': None, 'error': str(e)}


def main():
    all_rows = []
    for lc in LOCALES:
        all_rows.extend(collect(lc))

    by_key = defaultdict(list)
    for r in all_rows:
        by_key[(r['method'], r['path'])].append(r)

    keys = sorted(by_key.keys())

    # locale parity
    missing = []
    for k in keys:
        exists = {x['locale'] for x in by_key[k]}
        for lc in LOCALES:
            if lc not in exists:
                missing.append({'method': k[0], 'path': k[1], 'missing_locale': lc})

    # runtime existence check (non-404 means route exists)
    runtime = []
    for method, path in keys:
        prod = check_endpoint('https://openapi.longbridge.com', method, path)
        test = check_endpoint('https://openapi.longbridge.com', method, path)
        runtime.append({
            'method': method,
            'path': path,
            'prod_status': prod.get('status'),
            'test_status': test.get('status')
        })

    out = {
        'total_unique_http_apis': len(keys),
        'apis': runtime,
        'locale_missing': missing,
    }

    out_dir = ROOT / 'openapi' / 'audit'
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / 'api-audit.json').write_text(json.dumps(out, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')

    md = []
    md.append('# API Docs Audit')
    md.append('')
    md.append(f'- Total unique HTTP APIs in docs: **{len(keys)}**')
    md.append(f'- Locale parity gaps: **{len(missing)}**')
    md.append('')
    md.append('## Runtime route check (non-404 = endpoint exists)')
    md.append('')
    md.append('| Method | Path | openapi.longbridge.com | openapi.longbridge.com |')
    md.append('| --- | --- | --- | --- |')
    for r in runtime:
        md.append(f"| `{r['method']}` | `{r['path']}` | `{r['prod_status']}` | `{r['test_status']}` |")
    md.append('')
    if missing:
        md.append('## Locale parity gaps')
        md.append('')
        md.append('| Method | Path | Missing Locale |')
        md.append('| --- | --- | --- |')
        for m in missing:
            md.append(f"| `{m['method']}` | `{m['path']}` | `{m['missing_locale']}` |")
    else:
        md.append('## Locale parity gaps')
        md.append('')
        md.append('No locale gaps found for currently documented HTTP APIs.')

    (out_dir / 'api-audit.md').write_text('\n'.join(md) + '\n', encoding='utf-8')
    print('wrote', out_dir / 'api-audit.json')
    print('wrote', out_dir / 'api-audit.md')


if __name__ == '__main__':
    main()
