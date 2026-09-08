/**
 * Accès Espace Pro (commerçants).
 *
 * Chaque commerce dispose de son propre code d'accès, généré et vérifié côté base
 * (Supabase) — voir `lib/shopAccess.ts`. La session (quel commerce est connecté) est
 * mémorisée ici, côté navigateur, pour la durée de l'onglet.
 */
export const PRO_SESSION_KEY = 'idea-chartrons-pro-session';
