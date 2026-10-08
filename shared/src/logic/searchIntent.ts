import { normalizeSearchText } from './search.js';

export type SearchIntent = 'ai' | 'directory';

/** Mots qui ouvrent une question ou une demande (FR / EN / ES), après normalisation. */
const QUESTION_STARTERS = new Set([
  'ou', 'quel', 'quelle', 'quels', 'quelles', 'comment', 'pourquoi', 'quand', 'combien', 'qui', 'que', 'quoi',
  'est', 'sont', 'peut', 'peux', 'puis', 'pouvez', 'faut', 'a', 'y',
  'donne', 'donnez', 'cherche', 'cherchez', 'trouve', 'trouvez', 'propose', 'proposez', 'recommande', 'recommandez',
  'je', 'j', 'jai', 'on', 'nous', 'il', 'tu', 'vous', 'mon', 'ma', 'mes',
  'what', 'where', 'when', 'why', 'how', 'which', 'who', 'can', 'could', 'is', 'are', 'do', 'does', 'i', 'we', 'my', 'any',
  'donde', 'como', 'cual', 'cuando', 'porque', 'quien', 'puedo', 'hay', 'dame', 'busco', 'quiero',
]);

/** Au-delà de ce nombre de mots, on considère qu'il s'agit d'une phrase adressée au Concierge. */
const MAX_DIRECTORY_WORDS = 3;

/**
 * Devine ce que veut le visiteur depuis la barre de recherche unique :
 * - `directory` : un nom de commerce, un métier, une rue (mot ou courte expression) ;
 * - `ai` : une question ou une demande rédigée, que le Concierge IA doit traiter.
 *
 * `shopNames` sert à reconnaître un nom de commerce même quand il compte plus de mots
 * que la limite (« Le Petit Marché des Chartrons » reste une recherche d'annuaire).
 */
export function classifySearchIntent(query: string, shopNames: readonly string[] = []): SearchIntent {
  const raw = query.trim();
  if (!raw) return 'directory';
  if (/[?¿]/.test(raw)) return 'ai';

  const normalized = normalizeSearchText(raw);
  if (!normalized) return 'directory';

  if (normalized.length >= 3) {
    const isShopName = shopNames.some((name) => {
      const candidate = normalizeSearchText(name);
      return candidate.length > 0 && (candidate === normalized || candidate.includes(normalized));
    });
    if (isShopName) return 'directory';
  }

  const words = normalized.split(' ');
  if (QUESTION_STARTERS.has(words[0]) && words.length >= 2) return 'ai';
  return words.length > MAX_DIRECTORY_WORDS ? 'ai' : 'directory';
}
