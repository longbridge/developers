import { useState, useEffect } from 'react'
import { t } from '../../lib/i18n'
import type { Locale } from '../../lib/i18n'

interface LoginState {
  loggedIn: boolean
  avatar?: string
  name?: string
}

interface Props {
  locale: Locale
}

declare global {
  interface Window {
    __lbLoginState?: LoginState
  }
}

/**
 * Reads window.__lbLoginState (deferred platform injection).
 * Returns null while the state is undefined (loading), to avoid
 * a layout shift between the unauthenticated and authenticated states.
 */
export default function UserAvatar({ locale }: Props) {
  const [loginState, setLoginState] = useState<LoginState | undefined>(undefined)

  useEffect(() => {
    // Read whatever is already available
    if (window.__lbLoginState !== undefined) {
      setLoginState(window.__lbLoginState)
    }

    function onLoginChange() {
      setLoginState(window.__lbLoginState)
    }
    window.addEventListener('lb:login-change', onLoginChange)
    return () => window.removeEventListener('lb:login-change', onLoginChange)
  }, [])

  // Undefined means the platform hasn't injected state yet → render nothing
  if (loginState === undefined) return null

  if (!loginState.loggedIn) {
    return (
      <a className="text-sm text-[color:var(--lb-brand)] no-underline hover:underline" href="/login">
        {t(locale, 'nav.getStarted')}
      </a>
    )
  }

  const initials = (loginState.name ?? 'U').charAt(0).toUpperCase()

  return (
    <div className="inline-flex" data-lbus-component="user-avatar">
      <a href="/dashboard" aria-label={t(locale, 'nav.dashboard')}>
        {loginState.avatar ? (
          <img
            src={loginState.avatar}
            alt={loginState.name ?? 'User'}
            width={28}
            height={28}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <span className="w-7 h-7 rounded-full bg-[var(--lb-bg-2)] text-[color:var(--lbus-c-text)] text-xs inline-flex items-center justify-center font-medium" aria-hidden="true">
            {initials}
          </span>
        )}
      </a>
    </div>
  )
}
