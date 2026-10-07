import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AgendaEvenement, LocalRelais, PostAnnonce } from '@idea-chartrons/shared';
import { Badge, Loading } from '../components/ui';
import { PageHelp } from '../components/PageHelp';
import { PickupAlert } from '../components/PickupAlert';
import { HeroCarousel } from '../components/HeroCarousel';
import { TodayInChartrons } from '../components/TodayInChartrons';
import { SmartBanner } from '../components/SmartBanner';
import { DemoNotice } from '../components/DemoNotice';
import { FaqModal } from '../components/FaqModal';
import { ConfortDashboard } from '../components/ConfortDashboard';
import { useConfort } from '../context/ConfortContext';
import { quaisChartronsPhotoSrc } from '../lib/media';
import { api } from '../lib/api';
import { getOwnedPostIds } from '../lib/guestCarnet';
import { activeHeroSlides, HERO_SLIDES_EVENT, type HeroSlide } from '../lib/heroSlides';

/** Fenêtre de mise en avant sur l'accueil : 14 jours, tous types d'événements confondus. */
const UPCOMING_EVENTS_WINDOW_DAYS = 14;
const UPCOMING_EVENTS_MAX = 5;

function isUpcomingSoon(event: AgendaEvenement, now: Date): boolean {
  const start = new Date(event.dateDebut);
  const windowEnd = new Date(now.getTime() + UPCOMING_EVENTS_WINDOW_DAYS * 86400000);
  return start >= now && start <= windowEnd;
}

export function HomePage() {
  const { t } = useTranslation();
  const { isConfortMode } = useConfort();
  const [relaisList, setRelaisList] = useState<LocalRelais[]>([]);
  const [posts, setPosts] = useState<PostAnnonce[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<AgendaEvenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => activeHeroSlides());
  const [faqOpen, setFaqOpen] = useState(false);

  const ownedPostIds = getOwnedPostIds();

  useEffect(() => {
    const refreshHeroSlides = () => setHeroSlides(activeHeroSlides());
    refreshHeroSlides();
    window.addEventListener(HERO_SLIDES_EVENT, refreshHeroSlides);
    return () => window.removeEventListener(HERO_SLIDES_EVENT, refreshHeroSlides);
  }, []);

  useEffect(() => {
    Promise.all([api.getPosts(), api.getEvents(), api.getRelais()])
      .then(([postsData, events, relais]) => {
        setRelaisList(relais);
        setPosts(postsData);
        const now = new Date();
        setUpcomingEvents(
          events
            .filter((event) => isUpcomingSoon(event, now))
            .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime())
            .slice(0, UPCOMING_EVENTS_MAX),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (isConfortMode) {
    return (
      <div className="space-y-6 animate-fade-in">
        {!loading && (
          <PickupAlert relaisList={relaisList} posts={posts} ownedPostIds={ownedPostIds} />
        )}
        <ConfortDashboard />
      </div>
    );
  }

  if (loading) return <Loading message={t('common.loading')} />;

  // Liens secondaires : toujours accessibles, mais en bas de page pour laisser la place au contenu.
  const moreLinks = [
    { to: '/relais', label: t('home.cta.relais') },
    { to: '/carnet', label: t('nav.carnet') },
    { to: '/decouvrir', label: t('home.cta.decouvrir') },
    { to: '/pratique', label: t('home.cta.pratique') },
    { to: '/conciergerie', label: t('home.cta.conciergerie') },
    { to: '/favoris', label: t('home.cta.favoris') },
    { to: '/favoris#parcours', label: t('home.cta.parcours') },
    { to: '/tourisme', label: t('home.cta.tourisme') },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PickupAlert relaisList={relaisList} posts={posts} ownedPostIds={ownedPostIds} />

      <section className="relative">
        <div className="absolute top-2 right-2 z-10">
          <PageHelp page="home" />
        </div>
        <HeroCarousel
          defaultSlide={{
            imageSrc: quaisChartronsPhotoSrc(),
            imageAlt: t('home.heroAlt'),
            title: t('home.welcome'),
            description: t('home.description'),
          }}
          extraSlides={heroSlides}
        />
        <p className="text-[10px] text-chartrons-warm-gray/80 mt-1.5 px-1">{t('home.heroCredit')}</p>
      </section>

      <TodayInChartrons events={upcomingEvents} />

      <section className="space-y-4 pt-2 border-t border-chartrons-beige">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-chartrons-warm-gray">
          {t('home.moreTitle')}
        </h2>
        <nav aria-label={t('home.moreTitle')}>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
            {moreLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="flex items-center min-h-[44px] text-sm font-medium text-chartrons-olive-dark hover:underline touch-target"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          to="/pro?tab=kit"
          className="flex items-center justify-between gap-3 min-h-[44px] text-sm font-semibold text-chartrons-olive-dark touch-target"
        >
          <span>
            {t('home.proBanner.text')} <span className="underline">{t('home.proBanner.cta')}</span>
          </span>
          <span aria-hidden>→</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="brass" icon="🙋">{t('guest.badge')}</Badge>
          <p className="text-xs text-chartrons-warm-gray">{t('guest.noAccount')}</p>
        </div>
        <button
          type="button"
          onClick={() => setFaqOpen(true)}
          className="text-xs font-semibold text-chartrons-green underline-offset-2 hover:underline min-h-[44px] touch-target"
        >
          {t('faq.comparisonTitle')}
        </button>

        <SmartBanner />
        <DemoNotice className="" />
        <p className="text-[11px] text-chartrons-warm-gray">{t('app.tagline')} · {t('home.areaHint')}</p>
      </section>

      <FaqModal open={faqOpen} onClose={() => setFaqOpen(false)} />
    </div>
  );
}
