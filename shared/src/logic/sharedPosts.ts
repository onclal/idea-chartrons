import { PostStatus, PostType } from '../types/enums.js';
import type { PostAnnonce } from '../types/models.js';

/**
 * Publications partagées entre visiteurs (annonces et offres Anti-Gaspi).
 * Les publications transitent par Supabase : lecture publique uniquement après validation par
 * l'administrateur ; tout le reste est vérifié ici avant affichage (aucune donnée externe n'est crue).
 */

/** Taille maximale d'une publication envoyée (photo comprise). Au-delà, la photo reste sur l'appareil. */
export const SHARED_POST_MAX_CHARS = 350_000;

const POST_TYPES = new Set<string>(Object.values(PostType));
const POST_STATUSES = new Set<string>(Object.values(PostStatus));

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function optionalText(value: unknown, max: number): string | null {
  return text(value, max) || null;
}

function validPhoto(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value)) return value;
  return /^https?:\/\//.test(value) ? value : null;
}

/** Valide une publication reçue de l'extérieur ; renvoie null si elle est douteuse. */
export function parseSharedPost(raw: unknown): PostAnnonce | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const id = text(item.id, 80);
  const titre = text(item.titre, 200);
  if (!id || !titre) return null;
  if (typeof item.type !== 'string' || !POST_TYPES.has(item.type)) return null;
  if (typeof item.statut !== 'string' || !POST_STATUSES.has(item.statut)) return null;
  const prix = typeof item.prix === 'number' && Number.isFinite(item.prix) && item.prix >= 0 ? item.prix : null;
  const photos = (Array.isArray(item.photos) ? item.photos : [])
    .map(validPhoto)
    .filter((photo): photo is string => photo !== null)
    .slice(0, 1);
  const created = typeof item.createdAt === 'string' && !Number.isNaN(Date.parse(item.createdAt));
  const updated = typeof item.updatedAt === 'string' && !Number.isNaN(Date.parse(item.updatedAt));
  const now = new Date().toISOString();
  return {
    id,
    auteurNom: optionalText(item.auteurNom, 80),
    titre,
    description: text(item.description, 2000),
    type: item.type as PostType,
    prix,
    statut: item.statut as PostStatus,
    photos,
    telephone: optionalText(item.telephone, 30),
    createdAt: created ? (item.createdAt as string) : now,
    updatedAt: updated ? (item.updatedAt as string) : now,
    acteurId: optionalText(item.acteurId, 80),
    commerceNom: optionalText(item.commerceNom, 120),
    expiresAt:
      typeof item.expiresAt === 'string' && !Number.isNaN(Date.parse(item.expiresAt)) ? item.expiresAt : null,
  };
}

/** Copie à envoyer : sans photo si la publication dépasse la taille maximale. */
export function prepareSharedPost(post: PostAnnonce): PostAnnonce {
  const plain: PostAnnonce = { ...post, isDemo: undefined };
  if (JSON.stringify(plain).length <= SHARED_POST_MAX_CHARS) return plain;
  return { ...plain, photos: [] };
}

/**
 * Fusion de l'affichage : les publications partagées font foi ; les publications de cet appareil
 * qui n'existent pas encore côté partagé (en attente de validation, hors ligne) restent visibles.
 */
export function mergeSharedPosts(local: PostAnnonce[], shared: PostAnnonce[]): PostAnnonce[] {
  const localById = new Map(local.map((post) => [post.id, post]));
  const sharedIds = new Set(shared.map((post) => post.id));
  // Une réservation ou une clôture faite sur cet appareil reste visible ici sur une publication encore « Disponible ».
  const advanced = new Set<string>([PostStatus.Reserve, PostStatus.DepotLocal, PostStatus.Cloture]);
  const sharedView = shared.map((post) => {
    const mine = localById.get(post.id);
    return mine && advanced.has(mine.statut) && post.statut === PostStatus.Disponible
      ? { ...post, statut: mine.statut }
      : post;
  });
  const merged = [...sharedView, ...local.filter((post) => !sharedIds.has(post.id))];
  return merged.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}
