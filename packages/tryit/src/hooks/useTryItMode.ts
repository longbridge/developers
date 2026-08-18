/**
 * useTryItMode — detects ?mode=try-it in the URL
 * React equivalent of legacy composables/useTryItMode.ts
 */

import { useState, useEffect } from 'react'

export function useTryItMode() {
  const [showTryIt, setShowTryIt] = useState(false)

  useEffect(() => {
    const check = () => {
      const params = new URLSearchParams(window.location.search)
      setShowTryIt(params.get('mode') === 'try-it')
    }

    check()
    window.addEventListener('popstate', check)
    return () => window.removeEventListener('popstate', check)
  }, [])

  const enter = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('mode', 'try-it')
    window.history.pushState({}, '', url.toString())
    setShowTryIt(true)
  }

  const leave = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete('mode')
    window.history.pushState({}, '', url.toString())
    setShowTryIt(false)
  }

  return { showTryIt, enter, leave }
}
