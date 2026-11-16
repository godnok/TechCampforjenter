/**
 * Stor logo på innloggingssiden i admin (erstatter Payload-logoen).
 * Registrert i payload.config.ts under admin.components.graphics.Logo
 */
export function Logo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" width={120} height={108} />
      <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>Tech Camp for jenter</span>
    </div>
  )
}
