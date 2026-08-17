export interface NewHomePageProps { [k: string]: unknown }
export function NewHomePage(_props: NewHomePageProps) {
  return (
    <div
      data-lbus-component="newhomepage-placeholder"
      className="my-4 rounded border border-dashed border-[--lbus-c-border] p-4 text-sm opacity-60"
    >
      <strong>NewHomePage placeholder</strong>
      <p className="mt-1">
        NewHomePage placeholder — 16-section homepage arrives with stage 2 packages/homepage (spec §11).
      </p>
    </div>
  )
}
