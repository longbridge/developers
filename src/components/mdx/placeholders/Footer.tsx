export interface FooterProps { [k: string]: unknown }
export function Footer(_props: FooterProps) {
  // sdk.mdx uses <Footer /> under vitepress home layout to render the
  // page-level CTA/footer. Stage-1 skeleton didn't port it. Placeholder
  // here lets build pass; real port lands in stage-2 composite work.
  return (
    <div
      data-lbus-component="footer-placeholder"
      className="my-4 rounded border border-dashed border-[--lbus-c-border] p-4 text-sm opacity-60"
    >
      <strong>Footer placeholder</strong>
      <p className="mt-1">
        Footer placeholder — page-level footer/CTA lands in stage-2 composite port.
      </p>
    </div>
  )
}
