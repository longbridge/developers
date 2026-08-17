export interface McpToolsProps { [k: string]: unknown }
export function McpTools(_props: McpToolsProps) {
  return (
    <div
      data-lbus-component="mcptools-placeholder"
      className="my-4 rounded border border-dashed border-[--lbus-c-border] p-4 text-sm opacity-60"
    >
      <strong>McpTools placeholder</strong>
      <p className="mt-1">
        McpTools placeholder — dynamic MCP tool catalog will be wired in stage 2 (spec §7).
      </p>
    </div>
  )
}
