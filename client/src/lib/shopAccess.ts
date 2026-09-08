import { requireSupabase } from './supabaseClient';

export interface ShopAccessSession {
  shopId: string;
  shopName: string;
}

/** Vérifie un code d'accès Espace Pro et renvoie le commerce correspondant, ou null si le code est invalide. */
export async function verifyShopAccess(code: string): Promise<ShopAccessSession | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc('verify_shop_access', { p_code: code.trim() });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return null;
  return { shopId: row.shop_id as string, shopName: row.shop_name as string };
}

/**
 * Attribue le code d'accès initial d'un commerce, une seule fois : côté base, la fonction
 * refuse silencieusement si ce commerce a déjà un code (elle renvoie null), pour empêcher
 * qu'un tiers l'écrase et prenne la main sur la fiche d'un commerce existant.
 */
export async function claimShopAccessCode(shopId: string, shopName: string): Promise<string | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc('claim_shop_access_code', {
    p_shop_id: shopId,
    p_shop_name: shopName,
  });
  if (error) throw error;
  return (data as string | null) ?? null;
}
