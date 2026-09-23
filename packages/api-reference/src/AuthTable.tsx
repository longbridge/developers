/**
 * AuthTable — the Authorization section's header table. Reads the selected auth
 * mode from EnvContext and lists the required headers accordingly: the full HMAC
 * signing set (Signed) or the single Bearer header (OAuth). Rendered as a child
 * of ApiReference so it lives inside <EnvProvider>.
 */
import type { Locale } from '@longbridge/openapi-utils'
import { useEnv } from './EnvContext'

const L = {
  name: { en: 'Name', 'zh-CN': '名称', 'zh-HK': '名稱' },
  type: { en: 'Type', 'zh-CN': '类型', 'zh-HK': '類型' },
  required: { en: 'Required', 'zh-CN': '必填', 'zh-HK': '必填' },
  description: { en: 'Description', 'zh-CN': '说明', 'zh-HK': '說明' },
  authToken: {
    en: 'The account Access Token from the [OpenAPI dashboard](https://open.longbridge.com/dashboard/tokens) — passed as the raw token (no `Bearer` prefix) and included in the signature calculation.',
    'zh-CN': '[OpenAPI 后台](https://open.longbridge.com/dashboard/tokens) 上的账户 Access Token，作为原始 token 传入 (不带 `Bearer` 前缀)，并参与签名计算。',
    'zh-HK': '[OpenAPI 後台](https://open.longbridge.com/dashboard/tokens) 上的賬戶 Access Token，作為原始 token 傳入 (不帶 `Bearer` 前綴)，並參與簽名計算。',
  },
  apiKey: {
    en: 'Your App Key.',
    'zh-CN': '你的 App Key。',
    'zh-HK': '你的 App Key。',
  },
  timestamp: {
    en: 'Request timestamp in **seconds** (Unix epoch).',
    'zh-CN': '请求时间戳，单位**秒**(Unix 时间)。',
    'zh-HK': '請求時間戳，單位**秒**(Unix 時間)。',
  },
  signature: {
    en: 'HMAC-SHA256 signature. Format: `HMAC-SHA256 SignedHeaders=authorization;x-api-key;x-timestamp, Signature=<sig>`.',
    'zh-CN': 'HMAC-SHA256 签名。格式:`HMAC-SHA256 SignedHeaders=authorization;x-api-key;x-timestamp, Signature=<sig>`。',
    'zh-HK': 'HMAC-SHA256 簽名。格式:`HMAC-SHA256 SignedHeaders=authorization;x-api-key;x-timestamp, Signature=<sig>`。',
  },
  bearer: {
    en: 'The access token obtained after completing the OAuth 2.0 authorization flow (the OAuth token endpoint), sent as `Authorization: Bearer <access_token>`. No signature required.',
    'zh-CN': '完成 OAuth 2.0 授权流程 (OAuth token 端点) 后获取的 access token，通过 `Authorization: Bearer <access_token>` 发送，无需签名。',
    'zh-HK': '完成 OAuth 2.0 授權流程 (OAuth token 端點) 後獲取的 access token，通過 `Authorization: Bearer <access_token>` 發送，無需簽名。',
  },
  signNote: {
    en: 'Signed mode: every request is signed with your App Key/Secret. Header set:',
    'zh-CN': '签名方式：每个请求用 App Key / Secret 签名。请求头如下：',
    'zh-HK': '簽名方式：每個請求用 App Key / Secret 簽名。請求頭如下：',
  },
  oauthNote: {
    en: 'OAuth mode: obtain an access token via the OAuth 2.0 flow, then pass it directly as a Bearer credential (no signing).',
    'zh-CN': 'OAuth 方式：先通过 OAuth 2.0 流程获取 access token，再用 Bearer 方式直接携带 (无需签名)。',
    'zh-HK': 'OAuth 方式：先通過 OAuth 2.0 流程獲取 access token，再用 Bearer 方式直接攜帶 (無需簽名)。',
  },
  oauthDoc: {
    en: 'How to get an OAuth token → Getting Started',
    'zh-CN': '如何获取 OAuth token → 快速开始',
    'zh-HK': '如何獲取 OAuth token → 快速開始',
  },
} as const

// Stable ASCII anchor of the "OAuth 2.0 (Recommended)" heading in Getting
// Started (defined via `{#oauth-2-0}` in getting-started.mdx, all locales).
const OAUTH_ANCHOR = 'oauth-2-0'
// autocorrect-enable

// Render `[text](url)` links, `**bold**` and inline `` `code` `` in descriptions.
function rich(text: string): string {
  return text
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

interface Row {
  name: string
  desc: string
}

export function AuthTable({ locale }: { locale: Locale }) {
  const { authMode } = useEnv()

  const rows: Row[] =
    authMode === 'oauth'
      ? [{ name: 'Authorization', desc: L.bearer[locale] }]
      : [
          { name: 'Authorization', desc: L.authToken[locale] },
          { name: 'X-Api-Key', desc: L.apiKey[locale] },
          { name: 'X-Timestamp', desc: L.timestamp[locale] },
          { name: 'X-Api-Signature', desc: L.signature[locale] },
        ]

  const prefix = locale === 'en' ? '' : `/${locale}`
  return (
    <>
      <p className="api-auth-note">
        {(authMode === 'oauth' ? L.oauthNote : L.signNote)[locale]}
        {authMode === 'oauth' && (
          <>
            {' '}
            <a
              href={`${prefix}/docs/getting-started#${OAUTH_ANCHOR}`}
              className="api-auth-link"
              data-astro-reload>
              {L.oauthDoc[locale]}
            </a>
          </>
        )}
      </p>
      <table className="api-fields">
        <thead>
          <tr>
            <th>{L.name[locale]}</th>
            <th>{L.type[locale]}</th>
            <th>{L.required[locale]}</th>
            <th>{L.description[locale]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td>
                <code>{r.name}</code>
              </td>
              <td>string · header</td>
              <td>{L.required[locale]}</td>
              <td dangerouslySetInnerHTML={{ __html: rich(r.desc) }} />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
