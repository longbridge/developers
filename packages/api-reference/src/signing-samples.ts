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
 * The signed samples emit that algorithm inline for all eight documented
 * languages so a copy-pasted sample works without an SDK.
 */
import type { CodeBlock } from './openapi-loader'

const hasBodyMethod = (m: string) => m === 'POST' || m === 'PUT' || m === 'PATCH'

// ── Signed (HMAC) samples ─────────────────────────────────────────────────────

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
    `# Build the canonical string in ONE printf — the newline after x-timestamp\n` +
    `# (before the final |) must be kept; a separate $(...) would strip it and the\n` +
    `# signature would be invalid.\n` +
    `CANON=$(printf '%s|%s|%s|authorization:%s\\nx-api-key:%s\\nx-timestamp:%s\\n|%s|' "${method}" "${path}" "$QUERY" "$ACCESS_TOKEN" "$APP_KEY" "$TS" "$SIGNED_HEADERS")\n` +
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

// Shared Python signing preamble (used by sync + async).
function pyPreamble(method: string, path: string, base: string, withBody: boolean): string {
  return (
    `import hashlib, hmac, time, json\n\n` +
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
    `sig = hmac.new(APP_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()\n` +
    `headers = {\n` +
    `    "Authorization": ACCESS_TOKEN,\n` +
    `    "X-Api-Key": APP_KEY,\n` +
    `    "X-Timestamp": ts,\n` +
    `    "X-Api-Signature": f"HMAC-SHA256 SignedHeaders={signed_headers}, Signature={sig}",\n` +
    (withBody ? `    **({"Content-Type": "application/json"} if body_str else {}),\n` : ``) +
    `}\n` +
    `url = BASE + path + (f"?{query}" if query else "")\n`
  )
}

function pythonSample(method: string, path: string, base: string, withBody: boolean): string {
  return (
    `import requests\n` +
    pyPreamble(method, path, base, withBody) +
    `resp = requests.request(method, url, headers=headers` +
    (withBody ? `, data=body_str or None` : ``) +
    `)\n` +
    `print(resp.json())`
  )
}

function pythonAsyncSample(method: string, path: string, base: string, withBody: boolean): string {
  return (
    `import asyncio, aiohttp\n` +
    pyPreamble(method, path, base, withBody) +
    `\n` +
    `async def main():\n` +
    `    async with aiohttp.ClientSession() as session:\n` +
    `        async with session.request(method, url, headers=headers` +
    (withBody ? `, data=body_str or None` : ``) +
    `) as resp:\n` +
    `            print(await resp.json())\n\n` +
    `asyncio.run(main())`
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

function javaSample(method: string, path: string, base: string, withBody: boolean): string {
  return (
    `import java.net.URI;\nimport java.net.http.*;\n` +
    `import java.security.MessageDigest;\nimport javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\n` +
    `import java.time.Instant;\nimport java.util.HexFormat;\n\n` +
    `class Example {\n` +
    `  static String sha1Hex(String s) throws Exception {\n` +
    `    var d = MessageDigest.getInstance("SHA-1").digest(s.getBytes("UTF-8"));\n` +
    `    return HexFormat.of().formatHex(d);\n` +
    `  }\n\n` +
    `  public static void main(String[] args) throws Exception {\n` +
    `    String appKey = "<app_key>", appSecret = "<app_secret>", accessToken = "<access_token>";\n` +
    `    String base = "${base}", method = "${method}", path = "${path}";\n` +
    `    String query = "";           // e.g. "symbol=DOGEUSD.BKKT"\n` +
    (withBody ? `    String body = "{}";          // compact JSON\n` : `    String body = "";\n`) +
    `    String ts = String.valueOf(Instant.now().getEpochSecond());\n` +
    `    String signedHeaders = "authorization;x-api-key;x-timestamp";\n` +
    `    String signedValues = "authorization:" + accessToken + "\\nx-api-key:" + appKey + "\\nx-timestamp:" + ts + "\\n";\n` +
    `    String canonical = method + "|" + path + "|" + query + "|" + signedValues + "|" + signedHeaders + "|";\n` +
    `    if (!body.isEmpty()) canonical += sha1Hex(body);\n` +
    `    String payload = "HMAC-SHA256|" + sha1Hex(canonical);\n` +
    `    Mac mac = Mac.getInstance("HmacSHA256");\n` +
    `    mac.init(new SecretKeySpec(appSecret.getBytes("UTF-8"), "HmacSHA256"));\n` +
    `    String sig = HexFormat.of().formatHex(mac.doFinal(payload.getBytes("UTF-8")));\n\n` +
    `    var builder = HttpRequest.newBuilder()\n` +
    `        .uri(URI.create(base + path + (query.isEmpty() ? "" : "?" + query)))\n` +
    `        .header("Authorization", accessToken)\n` +
    `        .header("X-Api-Key", appKey)\n` +
    `        .header("X-Timestamp", ts)\n` +
    `        .header("X-Api-Signature", "HMAC-SHA256 SignedHeaders=" + signedHeaders + ", Signature=" + sig)\n` +
    (withBody
      ? `        .header("Content-Type", "application/json")\n        .method(method, HttpRequest.BodyPublishers.ofString(body));\n`
      : `        .method(method, HttpRequest.BodyPublishers.noBody());\n`) +
    `    HttpResponse<String> resp = HttpClient.newHttpClient()\n` +
    `        .send(builder.build(), HttpResponse.BodyHandlers.ofString());\n` +
    `    System.out.println(resp.body());\n` +
    `  }\n}`
  )
}

function rustSample(method: string, path: string, base: string, withBody: boolean): string {
  // deps: reqwest (blocking), hmac, sha2, sha1, hex, chrono
  return (
    `// Cargo.toml: reqwest = { version = "0.12", features = ["blocking"] }\n` +
    `//            hmac = "0.12", sha2 = "0.10", sha1 = "0.10", hex = "0.4"\n` +
    `use hmac::{Hmac, Mac};\nuse sha2::Sha256;\nuse sha1::{Digest, Sha1};\n` +
    `use std::time::{SystemTime, UNIX_EPOCH};\n\n` +
    `fn sha1_hex(s: &str) -> String { hex::encode(Sha1::digest(s.as_bytes())) }\n\n` +
    `fn main() -> Result<(), Box<dyn std::error::Error>> {\n` +
    `    let (app_key, app_secret, access_token) = ("<app_key>", "<app_secret>", "<access_token>");\n` +
    `    let (base, method, path) = ("${base}", "${method}", "${path}");\n` +
    `    let query = "";           // e.g. "symbol=DOGEUSD.BKKT"\n` +
    (withBody ? `    let body = "{}";          // compact JSON\n` : `    let body = "";\n`) +
    `    let ts = SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs().to_string();\n` +
    `    let signed_headers = "authorization;x-api-key;x-timestamp";\n` +
    `    let signed_values = format!("authorization:{}\\nx-api-key:{}\\nx-timestamp:{}\\n", access_token, app_key, ts);\n` +
    `    let mut canonical = format!("{}|{}|{}|{}|{}|", method, path, query, signed_values, signed_headers);\n` +
    `    if !body.is_empty() { canonical.push_str(&sha1_hex(body)); }\n` +
    `    let payload = format!("HMAC-SHA256|{}", sha1_hex(&canonical));\n` +
    `    let mut mac = Hmac::<Sha256>::new_from_slice(app_secret.as_bytes())?;\n` +
    `    mac.update(payload.as_bytes());\n` +
    `    let sig = hex::encode(mac.finalize().into_bytes());\n\n` +
    `    let url = format!("{}{}{}", base, path, if query.is_empty() { String::new() } else { format!("?{}", query) });\n` +
    `    let client = reqwest::blocking::Client::new();\n` +
    `    let mut req = client.request(method.parse()?, &url)\n` +
    `        .header("Authorization", access_token)\n` +
    `        .header("X-Api-Key", app_key)\n` +
    `        .header("X-Timestamp", &ts)\n` +
    `        .header("X-Api-Signature", format!("HMAC-SHA256 SignedHeaders={}, Signature={}", signed_headers, sig));\n` +
    (withBody ? `    req = req.header("Content-Type", "application/json").body(body);\n` : ``) +
    `    let resp = req.send()?;\n` +
    `    println!("{}", resp.text()?);\n` +
    `    Ok(())\n}`
  )
}

function cppSample(method: string, path: string, base: string, withBody: boolean): string {
  // libcurl + OpenSSL
  return (
    `// Requires: libcurl, OpenSSL. Link: -lcurl -lcrypto\n` +
    `#include <curl/curl.h>\n#include <openssl/hmac.h>\n#include <openssl/sha.h>\n` +
    `#include <ctime>\n#include <string>\n#include <cstdio>\n\n` +
    `static std::string toHex(const unsigned char* d, unsigned n) {\n` +
    `  static const char* h = "0123456789abcdef"; std::string o;\n` +
    `  for (unsigned i = 0; i < n; i++) { o += h[d[i] >> 4]; o += h[d[i] & 0xf]; } return o;\n` +
    `}\n` +
    `static std::string sha1Hex(const std::string& s) {\n` +
    `  unsigned char d[SHA_DIGEST_LENGTH];\n` +
    `  SHA1((const unsigned char*)s.data(), s.size(), d);\n` +
    `  return toHex(d, SHA_DIGEST_LENGTH);\n` +
    `}\n\n` +
    `int main() {\n` +
    `  std::string appKey = "<app_key>", appSecret = "<app_secret>", accessToken = "<access_token>";\n` +
    `  std::string base = "${base}", method = "${method}", path = "${path}", query = "";\n` +
    (withBody ? `  std::string body = "{}";\n` : `  std::string body = "";\n`) +
    `  std::string ts = std::to_string((long)time(nullptr));\n` +
    `  std::string signedHeaders = "authorization;x-api-key;x-timestamp";\n` +
    `  std::string signedValues = "authorization:" + accessToken + "\\nx-api-key:" + appKey + "\\nx-timestamp:" + ts + "\\n";\n` +
    `  std::string canonical = method + "|" + path + "|" + query + "|" + signedValues + "|" + signedHeaders + "|";\n` +
    `  if (!body.empty()) canonical += sha1Hex(body);\n` +
    `  std::string payload = "HMAC-SHA256|" + sha1Hex(canonical);\n` +
    `  unsigned char mac[32]; unsigned macLen = 0;\n` +
    `  HMAC(EVP_sha256(), appSecret.data(), (int)appSecret.size(),\n` +
    `       (const unsigned char*)payload.data(), payload.size(), mac, &macLen);\n` +
    `  std::string sig = toHex(mac, macLen);\n\n` +
    `  CURL* curl = curl_easy_init();\n` +
    `  std::string url = base + path + (query.empty() ? "" : "?" + query);\n` +
    `  curl_slist* h = nullptr;\n` +
    `  h = curl_slist_append(h, ("Authorization: " + accessToken).c_str());\n` +
    `  h = curl_slist_append(h, ("X-Api-Key: " + appKey).c_str());\n` +
    `  h = curl_slist_append(h, ("X-Timestamp: " + ts).c_str());\n` +
    `  h = curl_slist_append(h, ("X-Api-Signature: HMAC-SHA256 SignedHeaders=" + signedHeaders + ", Signature=" + sig).c_str());\n` +
    (withBody ? `  h = curl_slist_append(h, "Content-Type: application/json");\n` : ``) +
    `  curl_easy_setopt(curl, CURLOPT_URL, url.c_str());\n` +
    `  curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, method.c_str());\n` +
    `  curl_easy_setopt(curl, CURLOPT_HTTPHEADER, h);\n` +
    (withBody ? `  curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());\n` : ``) +
    `  curl_easy_perform(curl);\n` +
    `  curl_easy_cleanup(curl); curl_slist_free_all(h);\n` +
    `  return 0;\n}`
  )
}

function goSample(method: string, path: string, base: string, withBody: boolean): string {
  return (
    `package main\n\n` +
    `import (\n` +
    `\t"crypto/hmac"\n\t"crypto/sha1"\n\t"crypto/sha256"\n\t"encoding/hex"\n` +
    `\t"fmt"\n\t"io"\n\t"net/http"\n\t"strconv"\n\t"strings"\n\t"time"\n)\n\n` +
    `func sha1Hex(s string) string { h := sha1.Sum([]byte(s)); return hex.EncodeToString(h[:]) }\n\n` +
    `func main() {\n` +
    `\tappKey, appSecret, accessToken := "<app_key>", "<app_secret>", "<access_token>"\n` +
    `\tbase, method, path := "${base}", "${method}", "${path}"\n` +
    `\tquery := ""           // e.g. "symbol=DOGEUSD.BKKT"\n` +
    (withBody ? `\tbody := "{}"          // compact JSON\n` : `\tbody := ""\n`) +
    `\tts := strconv.FormatInt(time.Now().Unix(), 10)\n` +
    `\tsignedHeaders := "authorization;x-api-key;x-timestamp"\n` +
    "\tsignedValues := fmt.Sprintf(\"authorization:%s\\nx-api-key:%s\\nx-timestamp:%s\\n\", accessToken, appKey, ts)\n" +
    `\tcanonical := fmt.Sprintf("%s|%s|%s|%s|%s|", method, path, query, signedValues, signedHeaders)\n` +
    `\tif body != "" {\n\t\tcanonical += sha1Hex(body)\n\t}\n` +
    `\tpayload := "HMAC-SHA256|" + sha1Hex(canonical)\n` +
    `\tmac := hmac.New(sha256.New, []byte(appSecret))\n` +
    `\tmac.Write([]byte(payload))\n` +
    `\tsig := hex.EncodeToString(mac.Sum(nil))\n\n` +
    `\turl := base + path\n\tif query != "" {\n\t\turl += "?" + query\n\t}\n` +
    (withBody
      ? `\treq, _ := http.NewRequest(method, url, strings.NewReader(body))\n\treq.Header.Set("Content-Type", "application/json")\n`
      : `\treq, _ := http.NewRequest(method, url, nil)\n\t_ = strings.NewReader\n`) +
    `\treq.Header.Set("Authorization", accessToken)\n` +
    `\treq.Header.Set("X-Api-Key", appKey)\n` +
    `\treq.Header.Set("X-Timestamp", ts)\n` +
    `\treq.Header.Set("X-Api-Signature", "HMAC-SHA256 SignedHeaders="+signedHeaders+", Signature="+sig)\n` +
    `\tresp, _ := http.DefaultClient.Do(req)\n\tdefer resp.Body.Close()\n` +
    `\tout, _ := io.ReadAll(resp.Body)\n\tfmt.Println(string(out))\n}`
  )
}

/** Signed request samples for all eight documented languages. */
export function signedCodeBlocks(method: string, path: string, base: string): CodeBlock[] {
  const m = method.toUpperCase()
  const b = hasBodyMethod(m)
  return [
    { lang: 'shell', label: 'cURL', code: curlSample(m, path, base, b) },
    { lang: 'python', label: 'Python', code: pythonSample(m, path, base, b) },
    { lang: 'python', label: 'Python (async)', code: pythonAsyncSample(m, path, base, b) },
    { lang: 'javascript', label: 'Node.js', code: nodeSample(m, path, base, b) },
    { lang: 'java', label: 'Java', code: javaSample(m, path, base, b) },
    { lang: 'rust', label: 'Rust', code: rustSample(m, path, base, b) },
    { lang: 'cpp', label: 'C++', code: cppSample(m, path, base, b) },
    { lang: 'go', label: 'Go', code: goSample(m, path, base, b) },
  ]
}
