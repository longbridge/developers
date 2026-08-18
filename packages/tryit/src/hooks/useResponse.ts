/**
 * useResponse — manages API response state and loading indicator
 */

import { useState } from 'react'
import type { ApiResponse } from '../clients/http-client'

export function useResponse() {
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const reset = () => {
    setResult(null)
    setIsLoading(false)
  }

  return { result, setResult, isLoading, setIsLoading, reset }
}
