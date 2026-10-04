/**
 * Accès administrateur.
 *
 * Le mode invité intégral ne connaît aucun compte : la seule identité de la plateforme
 * est un code d'accès, vérifié côté base par la fonction `idea_verify_admin` (code haché,
 * voir `docs/sql/003a_securite_espace_pro_gardiennes.sql`). Il n'est jamais inscrit dans
 * le site publié : `VITE_ADMIN_PASSCODE` n'est lu qu'en développement local sans Supabase.
 */
export const DEV_ADMIN_PASSCODE: string | null = import.meta.env.DEV
  ? import.meta.env.VITE_ADMIN_PASSCODE?.trim() || null
  : null;

/** Code administrateur de la session en cours (onglet), pour les appels protégés. */
export const ADMIN_SESSION_KEY = 'idea-chartrons-admin-credential';
