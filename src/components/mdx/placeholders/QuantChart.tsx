export interface QuantChartProps {
  type?: string
  [k: string]: unknown
}
export function QuantChart(props: QuantChartProps) {
  return (
    <div
      data-lbus-component="quantchart-placeholder"
      data-quantchart-type={props.type}
      className="my-4 rounded border border-dashed border-[--lbus-c-border] p-4 text-sm opacity-60"
    >
      <strong>QuantChart placeholder</strong>
      <p className="mt-1">
        QuantChart ({props.type ?? 'unspecified'}) placeholder — technical indicator chart lands in stage 2 composite port.
      </p>
    </div>
  )
}
