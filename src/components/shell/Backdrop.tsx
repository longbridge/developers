interface Props {
  visible?: boolean
  onClick?: () => void
}

export default function Backdrop({ visible = false, onClick }: Props) {
  if (!visible) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 z-20 lg:hidden"
      data-lbus-component="backdrop"
      aria-hidden="true"
      onClick={onClick}
    />
  )
}
