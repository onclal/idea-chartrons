import { ADMIN_SESSION_KEY } from '../config/admin';
import { supabase } from './supabaseClient';

/**
 * Contenus d'administration partagés entre tous les visiteurs (table Supabase
 * `idea_shared_content`, voir docs/sql/004_contenus_partages.sql).
 * Lecture : publique. Écriture : uniquement avec le code administrateur, vérifié par la base.
 * Sans Supabase, ou tant que la table n'existe pas, le site garde son fonctionnement local.
 */
export type SharedKind = 'agenda' | 'banners' | 'hero' | 'pricing';

interface SharedHandler {
  collect: () => unknown[];
  apply: (items: unknown[]) => void;
}

export const SHARED_SYNC_EVENT = 'idea-shared-sync';
export type SharedSyncDetail = { ok: boolean; kind: SharedKind; reason?: 'too-large' | 'rejected' };

const MAX_PAYLOAD_CHARS = 900_000;
const PUSH_DELAY_MS = 600;

const handlers = new Map<SharedKind, SharedHandler>();
const timers = new Map<SharedKind, ReturnType<typeof setTimeout>>();
let applying = false;

export function registerShared(kind: SharedKind, handler: SharedHandler): void {
  handlers.set(kind, handler);
}

function emit(detail: SharedSyncDetail): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(SHARED_SYNC_EVENT, { detail }));
}

function readAdminCode(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) || null;
  } catch {
    return null;
  }
}

async function push(kind: SharedKind): Promise<void> {
  const code = readAdminCode();
  const handler = handlers.get(kind);
  if (!supabase || !code || !handler) return;
  const items = handler.collect();
  if (JSON.stringify(items).length > MAX_PAYLOAD_CHARS) {
    emit({ ok: false, kind, reason: 'too-large' });
    return;
  }
  const { error } = await supabase.rpc('idea_admin_save_content', {
    p_code: code,
    p_kind: kind,
    p_items: items,
  });
  emit(error ? { ok: false, kind, reason: 'rejected' } : { ok: true, kind });
}

/** À appeler après chaque modification faite dans l'administration. Sans effet hors mode admin. */
export function notifyShared(kind: SharedKind): void {
  if (applying || !readAdminCode()) return;
  const pending = timers.get(kind);
  if (pending) clearTimeout(pending);
  timers.set(
    kind,
    setTimeout(() => {
      timers.delete(kind);
      void push(kind).catch(() => emit({ ok: false, kind, reason: 'rejected' }));
    }, PUSH_DELAY_MS),
  );
}

/** Charge le contenu partagé et l'applique au stockage local. N'échoue jamais. */
export async function hydrateSharedContent(timeoutMs = 1500): Promise<void> {
  if (!supabase) return;
  try {
    const request = supabase.from('idea_shared_content').select('kind, items');
    const result = await Promise.race([
      request.then((res) => res),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
    ]);
    if (!result || result.error || !Array.isArray(result.data)) return;
    applying = true;
    try {
      for (const row of result.data as Array<{ kind: SharedKind; items: unknown }>) {
        const handler = handlers.get(row.kind);
        if (handler && Array.isArray(row.items)) handler.apply(row.items);
      }
    } finally {
      applying = false;
    }
  } catch {
    // Réseau ou table absente : le site garde son contenu local.
  }
}
