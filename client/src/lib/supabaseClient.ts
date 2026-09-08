import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/**
 * Client Supabase — base partagée entre tous les visiteurs (contrairement au reste
 * de l'app, qui vit dans le localStorage de chaque appareil). Utilisé uniquement
 * pour les fonctions du "Réseau Pro" (volet B2B) pour l'instant.
 *
 * `null` si les variables d'environnement ne sont pas configurées (ex. build local
 * sans .env) : les fonctions qui en dépendent échouent alors proprement plutôt que
 * de planter au chargement de l'app.
 */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase non configuré : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis (voir .env.example).',
    );
  }
  return supabase;
}
