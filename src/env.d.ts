/// <reference types="astro/client" />

declare module 'remark-heading-id' {
  // Upstream ships no .d.ts. Keep untyped — signature is a remark plugin
  // factory, consumed only by astro.config.ts markdown.processor.
  const remarkHeadingId: any
  export default remarkHeadingId
}
