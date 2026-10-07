import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useConciergePanel } from '../context/ConciergePanelContext';
import { classifySearchIntent } from '@idea-chartrons/shared';
import { useSearch } from '../context/SearchContext';
import { api } from '../lib/api';
import { ConciergeBeretLoader } from './ConciergeBeretLoader';

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function HeroSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { query, setQuery } = useSearch();
  const { ask, pending, persona } = useConciergePanel();
  const [shopNames, setShopNames] = useState<string[]>([]);

  useEffect(() => {
    api
      .getActeurs()
      .then((acteurs) => setShopNames(acteurs.map((acteur) => acteur.nomCommerce)))
      .catch(() => setShopNames([]));
  }, []);

  const isChineur = persona === 'chineur';

  const submitDirectory = (q: string) => {
    navigate(q ? `/recherche?q=${encodeURIComponent(q)}` : '/recherche');
  };

  // Une seule barre : le site devine s'il s'agit d'un nom de commerce (annuaire) ou d'une question (Concierge).
  // Sur la page Brocanteurs, tout part vers l'IA Chineur.
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    const intent = isChineur ? 'ai' : classifySearchIntent(q, shopNames);
    if (intent === 'ai') {
      if (!q || pending) return;
      void ask(q);
      return;
    }
    submitDirectory(q);
  };

  const placeholder = isChineur ? t('search.placeholderChineur') : t('search.placeholderUnified');

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-stretch" role="search">
        <div className="flex flex-1 min-w-0 items-stretch overflow-hidden bg-white shadow-sm focus-within:ring-2 rounded-2xl focus-within:ring-white/50">
          <span className="shrink-0 w-12 min-h-[48px] text-chartrons-olive-dark flex items-center justify-center">
            {pending ? (
              <ConciergeBeretLoader size="sm" />
            ) : (
              <SearchIcon />
            )}
          </span>
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-w-0 pr-2 bg-transparent border-0 text-chartrons-olive-dark placeholder:text-chartrons-warm-gray/60 focus:outline-none text-base py-3 min-h-[48px]"
            aria-label={placeholder}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="cursor-pointer shrink-0 touch-target w-10 min-h-[48px] text-chartrons-warm-gray text-xs hover:text-chartrons-olive-dark"
              aria-label={t('search.clear')}
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            disabled={pending}
            className="cursor-pointer shrink-0 touch-target px-3.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all disabled:opacity-60 min-h-[48px] bg-chartrons-green text-white hover:bg-chartrons-green-light"
          >
            {isChineur ? t('search.askAi') : t('search.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
