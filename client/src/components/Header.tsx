import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useFavorites } from '../context/FavoritesContext';
import { usePwa } from '../context/PwaContext';
import { useConfort } from '../context/ConfortContext';
import { HeroSearch } from './HeroSearch';

const LANGUAGES = [
  { code: 'fr' as const, flag: '🇫🇷', label: 'Français' },
  { code: 'en' as const, flag: '🇬🇧', label: 'English' },
  { code: 'es' as const, flag: '🇪🇸', label: 'Español' },
];

const ICON_BUTTON =
  'touch-target relative w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors';

function LanguageMenu() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((lang) => lang.code === i18n.language) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t('common.language')} : ${current.label}`}
        className={`${ICON_BUTTON} text-lg leading-none`}
      >
        {current.flag}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-card-hover border border-chartrons-beige p-1 z-50"
        >
          {LANGUAGES.map(({ code, flag, label }) => (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={current.code === code}
              onClick={() => {
                i18n.changeLanguage(code);
                setOpen(false);
              }}
              className={`w-full min-h-[44px] px-3 rounded-lg flex items-center gap-2 text-sm text-left text-chartrons-olive-dark hover:bg-chartrons-stone ${
                current.code === code ? 'font-bold bg-chartrons-beige/60' : ''
              }`}
            >
              <span aria-hidden className="text-lg">
                {flag}
              </span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { t } = useTranslation();
  const { isAdminMode } = useAdmin();
  const { favorites } = useFavorites();
  const { online } = usePwa();
  const { isConfortMode, toggleConfortMode } = useConfort();

  return (
    <header className="sticky top-0 z-40 safe-top shadow-md">
      <div className="bg-gradient-to-br from-chartrons-bordeaux via-chartrons-bordeaux to-chartrons-brick">
        <div className="max-w-lg mx-auto px-4 pt-2.5 pb-2.5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="min-w-0 group" aria-label={`${t('app.name')} — ${t('app.subtitle')}`}>
              <h1 className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                {t('app.name')}
              </h1>
            </Link>
            <div className="flex items-center gap-1.5 shrink-0">
              {isAdminMode && (
                <Link
                  to="/admin"
                  className={ICON_BUTTON}
                  aria-label={t('admin.openDashboard')}
                  title={t('admin.openDashboard')}
                >
                  🛡️
                </Link>
              )}
              {!online && (
                <span className="px-2 py-1 rounded-lg bg-chartrons-brass text-chartrons-olive-dark text-[10px] font-bold">
                  {t('pwa.offlineBadge')}
                </span>
              )}
              <Link to="/favoris" className={ICON_BUTTON} aria-label={t('favorites.title')}>
                ♥
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-white text-chartrons-bordeaux text-[10px] font-bold flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <LanguageMenu />
              {!isConfortMode && (
                <button
                  type="button"
                  onClick={toggleConfortMode}
                  aria-pressed={false}
                  aria-label={t('confort.toggleAria')}
                  title={t('confort.toggleAria')}
                  className="touch-target h-10 px-3 rounded-xl bg-white/10 text-white flex items-center justify-center gap-1.5 text-sm font-semibold hover:bg-white/20 transition-colors"
                >
                  <span aria-hidden>☀️</span>
                  {t('confort.short')}
                </button>
              )}
            </div>
          </div>

          {isConfortMode ? (
            <button
              type="button"
              onClick={toggleConfortMode}
              aria-pressed
              aria-label={t('confort.toggleAriaOn')}
              className="w-full min-h-[60px] px-4 rounded-2xl text-base font-bold touch-target bg-[#ffe14d] text-black border-2 border-black"
            >
              {t('confort.toggleOn')}
            </button>
          ) : (
            <HeroSearch />
          )}
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-chartrons-brass/40 via-chartrons-beige to-chartrons-olive/30" />
    </header>
  );
}
