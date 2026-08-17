interface Props {
  visible?: boolean
  onClick?: () => void
}

export default function Backdrop({ visible = false, onClick }: Props) {
  if (!visible) return null

  return (
    <div
      className="backdrop"
      data-lbus-component="backdrop"
      aria-hidden="true"
      onClick={onClick}
    />
  )
}
