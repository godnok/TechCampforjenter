/**
 * Liten logo i admin-menyen (erstatter Payload-ikonet).
 * Registrert i payload.config.ts under admin.components.graphics.Icon
 */
export function Icon() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.png" alt="Tech Camp" width={28} height={25} />
}
