import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AgendaEvenement, LocalRelais, PostAnnonce } from '@idea-chartrons/shared';
import { Badge, Loading } from '../components/ui';
import { PageHelp } from '../components/PageHelp';
import { PickupAlert } from '../components/PickupAlert';
import { HeroCarousel } from '../components/HeroCarousel';
import { TodayInChartrons } from '../components/TodayInChartrons';
import { StudioSlot } from '../components/StudioSlot';
import { SmartBanner } from '../components/SmartBanner';
import { DemoNotice } from '../components/DemoNotice';
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
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          <Badge variant="brass" icon="🙋">{t('guest.badge')}</Badge>
          <p className="text-xs text-chartrons-warm-gray">{t('guest.noAccount')}</p>
        </div>
      </section>

      <StudioSlot slot="editorial" />

      <TodayInChartrons events={upcomingEvents} />

      <StudioSlot slot="proSpotlight" />

      <section className="space-y-3">
        <SmartBanner />
        <DemoNotice className="" />
      </section>
    </div>
  );
}
