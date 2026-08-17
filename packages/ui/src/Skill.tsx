import React from 'react'

/**
 * Skill — AI Skill landing page component.
 *
 * The full implementation is a 4000-line multi-locale marketing page in the
 * legacy VitePress theme. This T11 stub renders a visually consistent
 * placeholder so MDX pages that include <Skill /> compile and display a
 * recognisable block. The real implementation lands in T12 / a dedicated
 * Skill package.
 */
export interface SkillProps {
  /** Optional locale override. Detected from Astro context at runtime. */
  locale?: string
  [k: string]: unknown
}

export function Skill({ locale, ...rest }: SkillProps) {
  return (
    <div
      data-lbus-component="skill"
      style={{
        border: '1px dashed var(--vp-c-divider)',
        borderRadius: '0.75rem',
        padding: '2rem',
        margin: '2rem 0',
        textAlign: 'center',
        color: 'var(--vp-c-text-2)',
        fontSize: '0.875rem',
      }}>
      <p style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem' }}>
        Longbridge AI Skill
      </p>
      <p style={{ margin: 0, opacity: 0.7 }}>
        Full skill landing page — implementation in T12.
        {locale ? ` (locale: ${locale})` : ''}
      </p>
    </div>
  )
}
