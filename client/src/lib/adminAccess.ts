import { DEV_ADMIN_PASSCODE } from '../config/admin';
import { supabase } from './supabaseClient';

/**
 * Vérifie le code administrateur côté base (fonction `idea_verify_admin`, code haché).
 * Le code n'est plus inscrit dans le site publié. Sans Supabase configuré, seul un
 * code de développement local (`VITE_ADMIN_PASSCODE`, en `npm run dev`) est accepté.
 */
export async function verifyAdminPasscode(code: string): Promise<boolean> {
  const trimmed = code.trim();
  if (!trimmed) return false;
  if (supabase) {
    const { data, error } = await supabase.rpc('idea_verify_admin', { p_code: trimmed });
    if (error) throw error;
    return data === true;
  }
  return DEV_ADMIN_PASSCODE !== null && trimmed === DEV_ADMIN_PASSCODE;
}
