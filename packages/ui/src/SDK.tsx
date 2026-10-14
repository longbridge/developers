import React from 'react'

export interface SDKProps {
  description?: string
  children?: React.ReactNode
}

export function SDK({ description, children }: SDKProps) {
  return (
    <div
      data-lbus-component="sdk"
      className="border-b border-[color:var(--lb-stroke)] text-center mb-10"
    >
      <div className="flex flex-col md:flex-row max-w-4xl items-center gap-6 justify-between text-center md:text-left mx-auto px-6 md:px-0 py-10">
        <div className="gap-4">
          <p className="font-bold text-2xl text-[color:var(--lbus-c-text)]">SDK</p>
          {description && (
            <p className="text-lg text-[color:var(--lb-fg-2)]">{description}</p>
          )}
          {children && <div>{children}</div>}
        </div>
        <div>
          <img className="h-[244px]" src="/assets/sdk.svg" alt="" />
        </div>
      </div>
    </div>
  )
}
