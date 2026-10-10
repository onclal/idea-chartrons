import { mergeSharedPosts, parseSharedPost, prepareSharedPost, PostStatus, type PostAnnonce } from '@idea-chartrons/shared';
import { ADMIN_SESSION_KEY } from '../config/admin';
import { supabase } from './supabaseClient';
import { writeLocalStorage } from './storage';

/**
 * Publications partagées (annonces et Anti-Gaspi) via Supabase, voir docs/sql/006_publications_partagees.sql.
 * Sans Supabase, ou tant que le script n'est pas exécuté, le site garde son fonctionnement local.
 */
const TOKENS_KEY = 'idea-chartrons-post-tokens';
const TIMEOUT_MS = 2500;

function adminCode(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) || null;
  } catch {
    return null;
  }
}

function loadTokens(): Record<string, string> {
  try {
    const raw = JSON.parse(localStorage.getItem(TOKENS_KEY) ?? '{}');
    return raw && typeof raw === 'object' ? (raw as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** Clé secrète de l'auteur d'une publication (null si cet appareil n'en est pas l'auteur). */
export function getPostOwnerToken(postId: string): string | null {
  return tokenFor(postId, false);
}

/** Clé secrète de l'auteur, gardée sur son appareil : seule elle permet de retirer ou clore sa publication. */
function tokenFor(postId: string, create: boolean): string | null {
  const tokens = loadTokens();
  if (tokens[postId]) return tokens[postId];
  if (!create) return null;
  const token =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
      : `${Date.now()}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  tokens[postId] = token;
  try {
    writeLocalStorage(TOKENS_KEY, JSON.stringify(tokens));
  } catch {
    // Stockage plein : la publication reste valable, sans possibilité de la retirer à distance.
  }
  return token;
}

function withTimeout<T>(promise: PromiseLike<T>): Promise<T | null> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS)),
  ]);
}

/** Publications partagées visibles : tout pour l'administrateur, seulement le validé pour les autres. */
export async function fetchSharedPosts(): Promise<PostAnnonce[]> {
  if (!supabase) return [];
  try {
    const code = adminCode();
    let rows: unknown[] = [];
    if (code) {
      const res = await withTimeout(supabase.rpc('idea_admin_list_posts', { p_code: code }));
      if (res && !res.error && Array.isArray(res.data)) rows = res.data;
    } else {
      const res = await withTimeout(supabase.from('idea_shared_posts').select('payload, statut'));
      if (res && !res.error && Array.isArray(res.data)) {
        rows = res.data.map((row: { payload: unknown; statut: string }) => ({
          ...(row.payload as object),
          statut: row.statut,
        }));
      }
    }
    return rows.map(parseSharedPost).filter((post): post is PostAnnonce => post !== null);
  } catch {
    return [];
  }
}

export async function withSharedPosts(local: PostAnnonce[]): Promise<PostAnnonce[]> {
  const shared = await fetchSharedPosts();
  return shared.length === 0 ? local : mergeSharedPosts(local, shared);
}

/** Envoie une nouvelle publication (visiteur : validation selon le type ; administrateur : telle quelle). */
export async function submitSharedPost(post: PostAnnonce): Promise<void> {
  if (!supabase) return;
  try {
    const payload = prepareSharedPost(post);
    const code = adminCode();
    if (code) {
      await withTimeout(supabase.rpc('idea_admin_upsert_post', { p_code: code, p_post: payload }));
    } else {
      await withTimeout(
        supabase.rpc('idea_submit_post', { p_post: payload, p_owner_token: tokenFor(post.id, true) }),
      );
    }
  } catch {
    // Hors ligne : la publication reste sur l'appareil de son auteur.
  }
}

/** Reporte une modification sur la version partagée (administrateur, ou auteur avec sa clé). */
export async function updateSharedPost(post: PostAnnonce): Promise<void> {
  if (!supabase) return;
  try {
    const code = adminCode();
    if (code) {
      await withTimeout(supabase.rpc('idea_admin_upsert_post', { p_code: code, p_post: prepareSharedPost(post) }));
      return;
    }
    const token = tokenFor(post.id, false);
    if (token && post.statut !== PostStatus.EnAttente) {
      await withTimeout(
        supabase.rpc('idea_owner_set_status', { p_id: post.id, p_owner_token: token, p_statut: post.statut }),
      );
    }
  } catch {
    // Sans effet : la modification reste locale.
  }
}

export async function deleteSharedPost(postId: string): Promise<void> {
  if (!supabase) return;
  try {
    const code = adminCode();
    if (code) {
      await withTimeout(supabase.rpc('idea_admin_delete_post', { p_code: code, p_id: postId }));
      return;
    }
    const token = tokenFor(postId, false);
    if (token) await withTimeout(supabase.rpc('idea_owner_delete_post', { p_id: postId, p_owner_token: token }));
  } catch {
    // Sans effet : la suppression reste locale.
  }
}
