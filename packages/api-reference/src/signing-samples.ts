/**
 * signing-samples.ts — client-side generators for HMAC-signed request examples.
 *
 * The Longbridge gateway does not accept a bare `Authorization: Bearer <token>`;
 * every request must carry `X-Api-Key`, `X-Timestamp` and an `X-Api-Signature`
 * computed as (verified against the staging gateway):
 *
 *   ts            = unix seconds
 *   signedHeaders = "authorization;x-api-key;x-timestamp"
 *   signedValues  = "authorization:<token>\nx-api-key:<key>\nx-timestamp:<ts>\n"
 *   canonical     = "<METHOD>|<path>|<query>|<signedValues>|<signedHeaders>|"
 *                   + (body ? sha1_hex(body) : "")
 *   payload       = "HMAC-SHA256|" + sha1_hex(canonical)
 *   signature     = hex(hmac_sha256(<secret>, payload))
 *   X-Api-Signature: HMAC-SHA256 SignedHeaders=<signedHeaders>, Signature=<signature>
 *
 * These generators emit that algorithm inline so a copy-pasted sample works
 * without an SDK. Compiled-language users (Java/Rust/C++/Go) should use the SDK,
 * which signs internally — so only the HTTP-native languages are generated here.
 */
import type { CodeBlock } from './openapi-loader'

const hasBodyMethod = (m: string) => m === 'POST' || m === 'PUT' || m === 'PATCH'

function curlSample(method: string, path: string, base: string, withBody: boolean): string {
  const bodyLines = withBody
    ? `BODY='{}'                        # request body (compact JSON, no spaces)\n`
    : `BODY=''\n`
  const bodyHash = withBody
    ? `[ -n "$BODY" ] && CANON="$CANON$(printf '%s' "$BODY" | openssl dgst -sha1 | awk '{print $2}')"\n`
    : ''
  const contentType = withBody ? `  --header 'Content-Type: application/json' \\\n` : ''
  const dataFlag = withBody ? `  --data "$BODY"` : ''
  return (
    `# Requires: bash, openssl, awk\n` +
    `APP_KEY='<app_key>'\nAPP_SECRET='<app_secret>'\nACCESS_TOKEN='<access_token>'\n` +
    `QUERY=''                          # e.g. symbol=DOGEUSD.BKKT\n` +
    bodyLines +
    `TS=$(date +%s)\n` +
    `SIGNED_HEADERS='authorization;x-api-key;x-timestamp'\n` +
    `SIGNED_VALUES=$(printf 'authorization:%s\\nx-api-key:%s\\nx-timestamp:%s\\n' "$ACCESS_TOKEN" "$APP_KEY" "$TS")\n` +
    `CANON="${method}|${path}|$QUERY|$SIGNED_VALUES|$SIGNED_HEADERS|"\n` +
    bodyHash +
    `PAYLOAD="HMAC-SHA256|$(printf '%s' "$CANON" | openssl dgst -sha1 | awk '{print $2}')"\n` +
    `SIG=$(printf '%s' "$PAYLOAD" | openssl dgst -sha256 -hmac "$APP_SECRET" | awk '{print $2}')\n\n` +
    `curl --request ${method} \\\n` +
    `  --url "${base}${path}$([ -n "$QUERY" ] && echo "?$QUERY")" \\\n` +
    `  --header "Authorization: $ACCESS_TOKEN" \\\n` +
    `  --header "X-Api-Key: $APP_KEY" \\\n` +
    `  --header "X-Timestamp: $TS" \\\n` +
    contentType +
    `  --header "X-Api-Signature: HMAC-SHA256 SignedHeaders=$SIGNED_HEADERS, Signature=$SIG"` +
    (dataFlag ? ` \\\n${dataFlag}` : '')
  )
}

function pythonSample(method: string, path: string, base: string, withBody: boolean): string {
  return (
    `import hashlib, hmac, time, json, requests\n\n` +
    `APP_KEY = "<app_key>"\nAPP_SECRET = "<app_secret>"\nACCESS_TOKEN = "<access_token>"\n` +
    `BASE = "${base}"\n` +
    `method, path = "${method}", "${path}"\n` +
    `query = ""            # e.g. "symbol=DOGEUSD.BKKT"\n` +
    (withBody ? `body = {}             # request payload\n` : `body = None\n`) +
    `\n` +
    `def sha1_hex(s): return hashlib.sha1(s.encode()).hexdigest()\n\n` +
    `ts = str(int(time.time()))\n` +
    `body_str = json.dumps(body, separators=(",", ":")) if body is not None else ""\n` +
    `signed_headers = "authorization;x-api-key;x-timestamp"\n` +
    `signed_values = f"authorization:{ACCESS_TOKEN}\\nx-api-key:{APP_KEY}\\nx-timestamp:{ts}\\n"\n` +
    `canonical = f"{method}|{path}|{query}|{signed_values}|{signed_headers}|"\n` +
    `if body_str:\n    canonical += sha1_hex(body_str)\n` +
    `payload = "HMAC-SHA256|" + sha1_hex(canonical)\n` +
    `sig = hmac.new(APP_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()\n\n` +
    `headers = {\n` +
    `    "Authorization": ACCESS_TOKEN,\n` +
    `    "X-Api-Key": APP_KEY,\n` +
    `    "X-Timestamp": ts,\n` +
    `    "X-Api-Signature": f"HMAC-SHA256 SignedHeaders={signed_headers}, Signature={sig}",\n` +
    `}\n` +
    (withBody ? `if body_str:\n    headers["Content-Type"] = "application/json"\n` : ``) +
    `url = BASE + path + (f"?{query}" if query else "")\n` +
    `resp = requests.request(method, url, headers=headers` +
    (withBody ? `, data=body_str or None` : ``) +
    `)\n` +
    `print(resp.json())`
  )
}

function nodeSample(method: string, path: string, base: string, withBody: boolean): string {
  return (
    `const crypto = require("crypto")\n\n` +
    `const APP_KEY = "<app_key>"\nconst APP_SECRET = "<app_secret>"\nconst ACCESS_TOKEN = "<access_token>"\n` +
    `const BASE = "${base}"\n` +
    `const method = "${method}", path = "${path}"\n` +
    `const query = ""            // e.g. "symbol=DOGEUSD.BKKT"\n` +
    (withBody ? `const body = {}             // request payload\n` : `const body = null\n`) +
    `\n` +
    `const sha1Hex = (s) => crypto.createHash("sha1").update(s).digest("hex")\n` +
    `const ts = String(Math.floor(Date.now() / 1000))\n` +
    `const bodyStr = body != null ? JSON.stringify(body) : ""\n` +
    `const signedHeaders = "authorization;x-api-key;x-timestamp"\n` +
    `const signedValues = ` + '`authorization:${ACCESS_TOKEN}\\nx-api-key:${APP_KEY}\\nx-timestamp:${ts}\\n`' + `\n` +
    `let canonical = ` + '`${method}|${path}|${query}|${signedValues}|${signedHeaders}|`' + `\n` +
    `if (bodyStr) canonical += sha1Hex(bodyStr)\n` +
    `const payload = "HMAC-SHA256|" + sha1Hex(canonical)\n` +
    `const sig = crypto.createHmac("sha256", APP_SECRET).update(payload).digest("hex")\n\n` +
    `const headers = {\n` +
    `  "Authorization": ACCESS_TOKEN,\n` +
    `  "X-Api-Key": APP_KEY,\n` +
    `  "X-Timestamp": ts,\n` +
    '  "X-Api-Signature": `HMAC-SHA256 SignedHeaders=${signedHeaders}, Signature=${sig}`,\n' +
    (withBody ? `  ...(bodyStr ? { "Content-Type": "application/json" } : {}),\n` : ``) +
    `}\n` +
    'const url = BASE + path + (query ? `?${query}` : "")\n' +
    `fetch(url, { method, headers` +
    (withBody ? `, body: bodyStr || undefined` : ``) +
    ` })\n` +
    `  .then((r) => r.json())\n` +
    `  .then(console.log)`
  )
}

/** Signed request samples (cURL / Python / Node.js) for an endpoint. */
export function signedCodeBlocks(method: string, path: string, base: string): CodeBlock[] {
  const m = method.toUpperCase()
  const withBody = hasBodyMethod(m)
  return [
    { lang: 'shell', label: 'cURL', code: curlSample(m, path, base, withBody) },
    { lang: 'python', label: 'Python', code: pythonSample(m, path, base, withBody) },
    { lang: 'javascript', label: 'Node.js', code: nodeSample(m, path, base, withBody) },
  ]
}

// ── OAuth (Bearer) samples — same language set as the signed ones ──────────────

function curlOauth(method: string, path: string, base: string, withBody: boolean): string {
  const q = `?<query>` // shown as a placeholder; users replace or drop it
  return (
    `curl --request ${method} \\\n` +
    `  --url '${base}${path}${withBody ? '' : q}' \\\n` +
    `  --header 'Authorization: Bearer <access_token>'` +
    (withBody
      ? ` \\\n  --header 'Content-Type: application/json' \\\n  --data '{}'`
      : '')
  )
}

function pythonOauth(method: string, path: string, base: string, withBody: boolean): string {
  const lower = method.toLowerCase()
  if (withBody) {
    return (
      `import requests\n\n` +
      `resp = requests.${lower === 'delete' ? 'delete' : lower}(\n` +
      `    "${base}${path}",\n` +
      `    headers={"Authorization": "Bearer <access_token>", "Content-Type": "application/json"},\n` +
      `    json={},\n` +
      `)\n` +
      `print(resp.json())`
    )
  }
  return (
    `import requests\n\n` +
    `resp = requests.${lower}(\n` +
    `    "${base}${path}",\n` +
    `    headers={"Authorization": "Bearer <access_token>"},\n` +
    `    params={},\n` +
    `)\n` +
    `print(resp.json())`
  )
}

function nodeOauth(method: string, path: string, base: string, withBody: boolean): string {
  return (
    `const headers = {\n` +
    `  "Authorization": "Bearer <access_token>",\n` +
    (withBody ? `  "Content-Type": "application/json",\n` : ``) +
    `}\n` +
    `fetch("${base}${path}", {\n` +
    `  method: "${method}",\n` +
    `  headers,\n` +
    (withBody ? `  body: JSON.stringify({}),\n` : ``) +
    `})\n` +
    `  .then((r) => r.json())\n` +
    `  .then(console.log)`
  )
}

/** OAuth (Bearer) request samples — same language set as signedCodeBlocks. */
export function oauthCodeBlocks(method: string, path: string, base: string): CodeBlock[] {
  const m = method.toUpperCase()
  const withBody = hasBodyMethod(m)
  return [
    { lang: 'shell', label: 'cURL', code: curlOauth(m, path, base, withBody) },
    { lang: 'python', label: 'Python', code: pythonOauth(m, path, base, withBody) },
    { lang: 'javascript', label: 'Node.js', code: nodeOauth(m, path, base, withBody) },
  ]
}
