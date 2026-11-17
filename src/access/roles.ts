import type { Access, FieldAccess } from 'payload'

/**
 * Rollene i admin:
 *  admin               – Administrator: alt
 *  registrationManager – Påmeldingsansvarlig: påmeldinger og ventelister
 *  editor              – Redaktør: nettsideinnhold og sponsorhenvendelser
 */
export type Role = 'admin' | 'registrationManager' | 'editor'

/**
 * Har brukeren en av disse rollene? Ingen bruker eller ingen rolle = nei.
 *
 * Tar imot «unknown» fordi Payload sender brukeren som ulike typer:
 * på serveren som User (med role), men i admin-menyen (hidden) som ClientUser,
 * som ikke kjenner til role-feltet. Vi sjekker derfor selv at role finnes og er tekst.
 */
export function hasRole(user: unknown, ...roles: Role[]): boolean {
  if (!user || typeof user !== 'object' || !('role' in user)) return false
  const role = (user as { role?: unknown }).role
  return typeof role === 'string' && roles.includes(role as Role)
}

// ---------- Tilgangsregler for collections og globals ----------

/** Bare administrator */
export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin')

/** Administrator ser alle brukere – andre bare seg selv (f.eks. for å bytte passord) */
export const isAdminOrSelf: Access = ({ req }) => {
  if (hasRole(req.user, 'admin')) return true
  if (req.user) return { id: { equals: req.user.id } } // «where»-filter: bare egen bruker
  return false
}

/** Påmeldinger og ventelister: administrator og påmeldingsansvarlig */
export const canManageRegistrations: Access = ({ req }) =>
  hasRole(req.user, 'admin', 'registrationManager')

/** Nettsideinnhold og sponsorhenvendelser: administrator og redaktør */
export const canEditContent: Access = ({ req }) => hasRole(req.user, 'admin', 'editor')

// ---------- Tilgangsregel for enkeltfelt ----------

/** Bare administrator kan sette/endre feltet (brukes på «Rolle») */
export const isAdminField: FieldAccess = ({ req }) => hasRole(req.user, 'admin')
