export function Spacer({ size }: { size?: number }) {
  return <div style={{ paddingTop: size ?? 16 }} />
}

export function Divider({ size }: { size?: number }) {
  const space = size ? size / 2 : 16
  return (
    <div style={{ paddingTop: space, paddingBottom: space }}>
      <hr />
    </div>
  )
}
