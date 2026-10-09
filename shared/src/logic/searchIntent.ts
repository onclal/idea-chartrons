import { normalizeSearchText } from './search.js';

export type SearchIntent = 'ai' | 'directory';

/** Mots qui ouvrent une question ou une demande (FR / EN / ES), après normalisation. */
const REQUEST_STARTERS = new Set([
  'ou', 'quel', 'quelle', 'quels', 'quelles', 'comment', 'pourquoi', 'quand', 'combien', 'qui', 'que', 'quoi',
  'est', 'sont', 'peut', 'peux', 'puis', 'pouvez', 'faut', 'a', 'y',
  'donne', 'donnez', 'cherche', 'cherchez', 'chercher', 'recherche', 'trouve', 'trouvez', 'trouver',
  'propose', 'proposez', 'recommande', 'recommandez', 'conseille', 'indique', 'montre', 'besoin', 'veux', 'voudrais',
  'je', 'j', 'jai', 'on', 'nous', 'il', 'tu', 'vous', 'mon', 'ma', 'mes',
  'un', 'une', 'des', 'du', 'de', 'la', 'le', 'les',
  'what', 'where', 'when', 'why', 'how', 'which', 'who', 'can', 'could', 'is', 'are', 'do', 'does', 'i', 'we', 'my', 'any',
  'find', 'need', 'looking', 'show',
  'donde', 'como', 'cual', 'cuando', 'porque', 'quien', 'puedo', 'hay', 'dame', 'busco', 'quiero', 'necesito',
]);

/** Une expression qui désigne au plus ce nombre de commerces est un nom de commerce, pas un type de commerce. */
const MAX_SHOPS_FOR_A_NAME = 3;

function containsWholeWords(haystack: string, needle: string): boolean {
  return ` ${haystack} `.includes(` ${needle} `);
}

/**
 * Devine ce que veut le visiteur depuis la barre de recherche unique.
 *
 * Le Concierge IA est le chemin par défaut : il trouve les pros, répond aux questions et propose des adresses.
 * L'annuaire n'est choisi que pour **un nom de commerce précis** (« Bistro des Chartrons », « Ananda »),
 * c'est-à-dire une expression qui ne désigne qu'un à trois commerces. Un type de commerce (« plombier »,
 * « boulangerie », « pizzeria ») désigne beaucoup de fiches : cela va au Concierge.
 */
export function classifySearchIntent(query: string, shopNames: readonly string[] = []): SearchIntent {
  const raw = query.trim();
  if (!raw) return 'directory';
  if (/[?¿]/.test(raw)) return 'ai';

  const normalized = normalizeSearchText(raw);
  if (!normalized) return 'directory';
  const words = normalized.split(' ');

  const names = shopNames.map((name) => normalizeSearchText(name)).filter(Boolean);
  if (names.includes(normalized)) return 'directory';

  if (normalized.length >= 3) {
    const matching = names.filter((name) => containsWholeWords(name, normalized)).length;
    const isNamePart = matching >= 1 && matching <= MAX_SHOPS_FOR_A_NAME && (words.length >= 2 || matching === 1);
    if (isNamePart && !(words.length >= 2 && REQUEST_STARTERS.has(words[0]) && matching > 1)) return 'directory';
  }

  return 'ai';
}
