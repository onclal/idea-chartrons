import { sanitizeExternalUrl } from './commerce.js';

/**
 * Contrat de branchement avec les outils de STUDIO ALL (éditorial et marketing des pros).
 * IDÉA CHARTRONS ne fabrique pas ces contenus : il lit un flux JSON publié ailleurs,
 * le valide ici, puis l'affiche dans des emplacements dédiés (voir docs/BRANCHEMENT-STUDIO-ALL.md).
 */
export type StudioSlotId = 'editorial' | 'proSpotlight' | 'proTools';

export interface StudioFeedItem {
  id: string;
  title: string;
  summary: string;
  /** Lien externe ou chemin interne du site (commençant par « / »). */
  url: string | null;
  imageUrl: string | null;
  /** Vidéo de l'éditorial (adresse http(s)) ; le format vertical ou horizontal est géré automatiquement à l'affichage. */
  videoUrl: string | null;
  /** Étiquette courte affichée au-dessus du titre (ex. « Éditorial », « Offre pro »). */
  label: string | null;
  publishedAt: string | null;
}

export type StudioFeed = Record<StudioSlotId, StudioFeedItem[]>;

export const STUDIO_SLOT_IDS: readonly StudioSlotId[] = ['editorial', 'proSpotlight', 'proTools'];

/** Nombre maximal d'éléments retenus par emplacement : un flux trop long ne doit pas envahir la page. */
export const STUDIO_SLOT_MAX_ITEMS = 5;

export function emptyStudioFeed(): StudioFeed {
  return { editorial: [], proSpotlight: [], proTools: [] };
}

function cleanText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

function cleanLink(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  // Chemin interne (« /agenda ») accepté ; « // » refusé car il désigne un autre site.
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  return sanitizeExternalUrl(trimmed);
}

function parseItem(raw: unknown, index: number): StudioFeedItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const title = cleanText(item.title, 120);
  if (!title) return null;
  const published = typeof item.publishedAt === 'string' && !Number.isNaN(Date.parse(item.publishedAt));
  return {
    id: cleanText(item.id, 80) || `item-${index}`,
    title,
    summary: cleanText(item.summary, 280),
    url: cleanLink(item.url),
    imageUrl: sanitizeExternalUrl(typeof item.imageUrl === 'string' ? item.imageUrl : null),
    videoUrl: sanitizeExternalUrl(typeof item.videoUrl === 'string' ? item.videoUrl : null),
    label: cleanText(item.label, 30) || null,
    publishedAt: published ? (item.publishedAt as string) : null,
  };
}

/** Valide un flux reçu de l'extérieur : tout élément douteux est écarté, jamais d'erreur levée. */
export function parseStudioFeed(raw: unknown): StudioFeed {
  const feed = emptyStudioFeed();
  if (!raw || typeof raw !== 'object') return feed;
  const source = raw as Record<string, unknown>;
  for (const slot of STUDIO_SLOT_IDS) {
    const list = source[slot];
    if (!Array.isArray(list)) continue;
    feed[slot] = list
      .map((entry, index) => parseItem(entry, index))
      .filter((entry): entry is StudioFeedItem => entry !== null)
      .slice(0, STUDIO_SLOT_MAX_ITEMS);
  }
  return feed;
}
