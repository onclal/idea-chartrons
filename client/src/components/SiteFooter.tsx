import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaqModal } from './FaqModal';

const LINK_CLASS =
  'flex items-center min-h-[44px] text-sm font-medium text-chartrons-olive-dark hover:underline touch-target text-left';

export function SiteFooter() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const showFaqCta = pathname !== '/faq';
  const [faqOpen, setFaqOpen] = useState(false);

  // Liens de découverte (usagers) et d'entrée pour les professionnels : toujours accessibles, en bas de page.
  const exploreLinks = [
    { to: '/relais', label: t('home.cta.relais') },
    { to: '/decouvrir', label: t('home.cta.decouvrir') },
    { to: '/pratique', label: t('home.cta.pratique') },
    { to: '/tourisme', label: t('home.cta.tourisme') },
    { to: '/carnet', label: t('nav.carnet') },
    { to: '/favoris', label: t('home.cta.favorisParcours') },
  ];

  return (
    <footer className="mt-10 pt-6 pb-3 border-t border-chartrons-beige space-y-6">
      <div className="grid grid-cols-2 gap-x-4">
        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="text-xs font-semibold uppercase tracking-wide text-chartrons-warm-gray">
            {t('footer.explore')}
          </h2>
          <ul className="mt-1">
            {exploreLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={LINK_CLASS}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-pros">
          <h2 id="footer-pros" className="text-xs font-semibold uppercase tracking-wide text-chartrons-warm-gray">
            {t('footer.pros')}
          </h2>
          <ul className="mt-1">
            <li>
              <Link to="/pro?tab=kit" className={LINK_CLASS}>
                {t('home.proBanner.cta')}
              </Link>
            </li>
            <li>
              <Link to="/conciergerie" className={LINK_CLASS}>
                {t('home.cta.conciergerie')}
              </Link>
            </li>
            <li>
              <button type="button" onClick={() => setFaqOpen(true)} className={`${LINK_CLASS} w-full`}>
                {t('faq.comparisonTitle')}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {showFaqCta && (
        <Link
          to="/faq"
          className="flex items-center justify-between gap-3 min-h-[52px] px-4 py-3 rounded-2xl bg-chartrons-bordeaux text-white shadow-card"
        >
          <span className="text-sm font-semibold">{t('footer.faqCta')}</span>
          <span aria-hidden className="text-lg">→</span>
        </Link>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-center">
        <p className="text-[11px] text-chartrons-warm-gray leading-relaxed whitespace-pre-line">
          {t('footer.copyright')}
          {'\n'}
          {t('footer.publisher')}
        </p>
        <span className="hidden sm:inline text-chartrons-sand" aria-hidden>
          ·
        </span>
        <div className="flex items-center justify-center gap-1">
          <Link
            to="/faq"
            className="inline-flex items-center justify-center min-h-[44px] px-3 text-xs font-semibold text-chartrons-bordeaux hover:underline"
          >
            {t('footer.faq')}
          </Link>
          <span className="text-chartrons-sand" aria-hidden>
            ·
          </span>
          <Link
            to="/cgv"
            className="inline-flex items-center justify-center min-h-[44px] px-3 text-xs font-semibold text-chartrons-bordeaux hover:underline"
          >
            {t('footer.cgv')}
          </Link>
        </div>
      </div>

      <p className="text-center text-[11px] text-chartrons-warm-gray">
        {t('app.tagline')} · {t('home.areaHint')}
      </p>

      <FaqModal open={faqOpen} onClose={() => setFaqOpen(false)} />
    </footer>
  );
}
