export interface ApiReferenceProps { [k: string]: unknown }
export function ApiReference(_props: ApiReferenceProps) {
  return (
    <div
      data-lbus-component="apireference-placeholder"
      className="my-4 rounded border border-dashed border-[--lbus-c-border] p-4 text-sm opacity-60"
    >
      <strong>ApiReference placeholder</strong>
      <p className="mt-1">
        ApiReference placeholder — CSR OpenAPI viewer arrives in stage 2 packages/api-reference (spec §7.1).
      </p>
    </div>
  )
}
