export interface TryItProps { operationId?: string; [k: string]: unknown }
export function TryIt(props: TryItProps) {
  return (
    <div
      data-lbus-component="tryit-placeholder"
      className="my-4 rounded border border-dashed border-[--lbus-c-border] p-4 text-sm opacity-60"
    >
      <strong>TryIt placeholder</strong>
      <p className="mt-1">
        Interactive API tester will be ported in stage 2 (spec §7.2).
        {props.operationId && (
          <> operationId: <code>{props.operationId}</code></>
        )}
      </p>
    </div>
  )
}
