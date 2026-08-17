import React from 'react'

/** T12 placeholder — interactive API try-it panel */
export function TryIt({ [Symbol.toStringTag as never]: _, ...props }: { [k: string]: unknown }) {
  return (
    <div data-lbus-component="try-it" style={{ display: 'none' }} aria-hidden="true">
      {/* TryIt — implemented in T12 */}
    </div>
  )
}
