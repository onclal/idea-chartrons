import {
  LocalRelaisRetraitStatus,
  parseSharedRelais,
  PostStatus,
  type LocalRelais,
  type RelaisSettings,
} from '@idea-chartrons/shared';
import { isAdminSession } from './adminSession';
import { ADMIN_SESSION_KEY } from '../config/admin';
import { localDb } from './localDb';
import { notifyShared, registerShared } from './sharedContent';
import { getPostOwnerToken } from './sharedPosts';
import { supabase } from './supabaseClient';

/**
 * Local Relais partagé via Supabase, voir docs/sql/007_local_relais_partage.sql.
 * Sans Supabase, ou tant que le script n'est pas exécuté, le Local Relais garde son fonctionnement local.
 */
const TIMEOUT_MS = 2500;
const PUBLIC_COLUMNS = 'id, post_id, statut, creneau_depot, creneau_retrait, date_depot, created_at, updated_at';

/** Erreur métier renvoyée par la base (créneau complet, objet pas prêt…) : à montrer, sans repli local. */
export class RelaisBookingError extends Error {}

function adminCode(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) || null;
  } catch {
    return null;
  }
}

function withTimeout<T>(promise: PromiseLike<T>): Promise<T | null> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS)),
  ]);
}

const BUSINESS_ERRORS = /invalid or full|already exists|not ready|not found|no next status/i;

/** Lit les dépôts partagés et les rend visibles localement (affichage et places des créneaux). */
export async function refreshSharedRelais(): Promise<void> {
  if (!supabase) return;
  try {
    const code = adminCode();
    const res = code
      ? await withTimeout(supabase.rpc('idea_admin_relais_list', { p_code: code }))
      : await withTimeout(supabase.from('idea_shared_relais').select(PUBLIC_COLUMNS));
    if (!res || res.error || !Array.isArray(res.data)) return;
    const list = (res.data as unknown[]).map(parseSharedRelais).filter((r): r is LocalRelais => r !== null);
    knownShared = new Set(list.map((relais) => relais.id));
    localDb.setSharedRelais(list);
  } catch {
    // Réseau ou table absente : le Local Relais garde son fonctionnement local.
  }
}

/** Identifiants des dépôts lus sur Supabase lors de la dernière lecture. */
let knownShared = new Set<string>();

function isShared(relaisId: string): boolean {
  return knownShared.has(relaisId);
}

/**
 * Réserve un créneau de dépôt partagé. Renvoie null si le partage n'est pas disponible
 * (pas de Supabase, script absent, publication non partagée) : l'appelant fait alors le dépôt localement.
 */
export async function proposeSharedDepot(data: {
  postId: string;
  deposantNom?: string | null;
  creneauDepotId: string;
}): Promise<LocalRelais | null> {
  const token = getPostOwnerToken(data.postId);
  if (!supabase || !token) return null;
  const id = `relais-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const res = await withTimeout(
    supabase.rpc('idea_relais_propose', {
      p_id: id,
      p_post_id: data.postId,
      p_deposant: data.deposantNom ?? null,
      p_creneau: data.creneauDepotId,
      p_owner_token: token,
    }),
  );
  if (!res) return null;
  if (res.error) {
    if (BUSINESS_ERRORS.test(res.error.message) && !/post not found/i.test(res.error.message)) {
      throw new RelaisBookingError(res.error.message);
    }
    return null;
  }
  const out = res.data as { id?: string; code?: string; dateDepot?: string } | null;
  if (!out?.id || !out.code) return null;
  const now = new Date().toISOString();
  const relais: LocalRelais = {
    id: out.id,
    postId: data.postId,
    deposantNom: data.deposantNom?.trim() || null,
    codeQrValidation: out.code,
    dateDepot: out.dateDepot ?? now,
    statutRetrait: LocalRelaisRetraitStatus.EnAttente,
    creneauDepotId: data.creneauDepotId,
    creneauRetraitId: null,
    createdAt: now,
    updatedAt: now,
  };
  knownShared.add(relais.id);
  localDb.saveSharedRelaisCopy(relais, PostStatus.DepotLocal);
  await refreshSharedRelais();
  return relais;
}

/** Réserve un créneau de retrait sur un dépôt partagé ; null si ce dépôt n'est pas partagé. */
export async function reserveSharedRetrait(relaisId: string, creneauId: string): Promise<LocalRelais | null> {
  if (!supabase) return null;
  const current = localDb.getRelais().find((r) => r.id === relaisId);
  if (!current || !isShared(relaisId)) return null;
  const res = await withTimeout(supabase.rpc('idea_relais_reserve', { p_id: relaisId, p_creneau: creneauId }));
  if (!res) throw new RelaisBookingError('Network error');
  if (res.error) throw new RelaisBookingError(res.error.message);
  const out = res.data as { code?: string } | null;
  const saved = localDb.saveSharedRelaisCopy({
    ...current,
    creneauRetraitId: creneauId,
    codeQrValidation: out?.code || current.codeQrValidation,
    updatedAt: new Date().toISOString(),
  });
  await refreshSharedRelais();
  return saved;
}

/** Fait avancer le statut d'un dépôt partagé (administrateur) ; null si ce dépôt n'est pas partagé. */
export async function advanceSharedRelais(relaisId: string): Promise<LocalRelais | null> {
  const code = adminCode();
  if (!supabase || !code || !isShared(relaisId)) return null;
  const res = await withTimeout(supabase.rpc('idea_admin_relais_advance', { p_code: code, p_id: relaisId }));
  if (!res) throw new RelaisBookingError('Network error');
  if (res.error) throw new RelaisBookingError(res.error.message);
  await refreshSharedRelais();
  return localDb.getRelais().find((r) => r.id === relaisId) ?? null;
}

// Réglages du Local Relais (horaires, capacité, créneaux bloqués) partagés par l'administrateur.
registerShared('relais', {
  collect: () => [
    {
      settings: localDb.getRelaisSettings(),
      blocked: localDb.getAllCreneaux().filter((slot) => slot.blocked).map((slot) => slot.id),
    },
  ],
  apply: (items) => {
    const first = (items[0] ?? {}) as { settings?: Partial<RelaisSettings>; blocked?: unknown };
    const blocked = Array.isArray(first.blocked) ? first.blocked.filter((id): id is string => typeof id === 'string') : [];
    localDb.applySharedRelaisConfig(first.settings ?? null, blocked);
  },
});

export function notifyRelaisConfigChanged(): void {
  if (isAdminSession()) notifyShared('relais');
}
