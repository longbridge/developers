export interface PricingProps { [k: string]: unknown }
export function Pricing(_props: PricingProps) {
  return (
    <div
      data-lbus-component="pricing-placeholder"
      className="my-4 rounded border border-dashed border-[--lbus-c-border] p-4 text-sm opacity-60"
    >
      <strong>Pricing placeholder</strong>
      <p className="mt-1">
        Pricing placeholder — market/region pricing tables land in stage 2 composite port.
      </p>
    </div>
  )
}
