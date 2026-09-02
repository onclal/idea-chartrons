import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isCommunityEvent, isResidentFeedPost } from '@idea-chartrons/shared';
import type { AgendaEvenement, LocalRelais, PostAnnonce } from '@idea-chartrons/shared';
import { Badge, Card, Loading } from '../components/ui';
import { PageHelp } from '../components/PageHelp';
import { PickupAlert } from '../components/PickupAlert';
import { HeroCarousel } from '../components/HeroCarousel';
import { UpcomingEventsBanner } from '../components/UpcomingEventsBanner';
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
  const [stats, setStats] = useState({ posts: 0, acteurs: 0, events: 0 });
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
    Promise.all([
      api.getPosts(),
      api.getActeurs(),
      api.getEvents(),
      api.getRelais(),
    ])
      .then(([postsData, acteurs, events, relais]) => {
        setStats({
          posts: postsData.filter((p) => p.statut === 'Disponible' && isResidentFeedPost(p)).length,
          acteurs: acteurs.length,
          events: events.filter((e) => isCommunityEvent(e) && new Date(e.dateFin) >= new Date()).length,
        });
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

  const ctaLinks = [
    { to: '/relais', label: t('home.cta.relais'), icon: '📦', gradient: 'from-chartrons-brass to-chartrons-olive' },
    { to: '/carnet', label: t('nav.carnet'), icon: '📔', gradient: 'from-chartrons-bordeaux to-chartrons-olive-dark' },
    { to: '/decouvrir', label: t('home.cta.decouvrir'), icon: '🚶', gradient: 'from-chartrons-olive to-chartrons-olive-light' },
    { to: '/pratique', label: t('home.cta.pratique'), icon: 'ℹ️', gradient: 'from-chartrons-brass to-chartrons-olive' },
    { to: '/conciergerie', label: t('home.cta.conciergerie'), icon: '🔑', gradient: 'from-chartrons-brass to-chartrons-olive' },
    { to: '/favoris', label: t('home.cta.favoris'), icon: '♥', gradient: 'from-chartrons-bordeaux to-chartrons-olive-dark' },
    { to: '/favoris#parcours', label: t('home.cta.parcours'), icon: '🗺️', gradient: 'from-chartrons-brass to-chartrons-bordeaux' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        to="/pro?tab=kit"
        className="flex items-center justify-between gap-3 min-h-[52px] px-4 py-3 rounded-2xl bg-chartrons-brass/15 border border-chartrons-brass/50"
      >
        <span className="text-sm font-semibold text-chartrons-olive-dark">
          {t('home.proBanner.text')} <span className="underline">{t('home.proBanner.cta')}</span>
        </span>
        <span aria-hidden className="text-lg text-chartrons-olive-dark">→</span>
      </Link>

      <PickupAlert relaisList={relaisList} posts={posts} ownedPostIds={ownedPostIds} />

      <UpcomingEventsBanner events={upcomingEvents} />

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
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          <Badge variant="brass" icon="🙋">{t('guest.badge')}</Badge>
          <p className="text-xs text-chartrons-warm-gray">{t('guest.noAccount')}</p>
        </div>
        <button
          type="button"
          onClick={() => setFaqOpen(true)}
          className="mt-2 mx-auto block text-xs font-semibold text-chartrons-green underline-offset-2 hover:underline"
        >
          {t('faq.comparisonTitle')}
        </button>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {[
          { value: stats.posts, label: t('home.stats.posts'), color: 'text-chartrons-bordeaux' },
          { value: stats.acteurs, label: t('home.stats.acteurs'), color: 'text-chartrons-olive' },
          { value: stats.events, label: t('home.stats.events'), color: 'text-chartrons-brick' },
        ].map(({ value, label, color }) => (
          <Card key={label} className="text-center !p-4">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-[10px] text-chartrons-warm-gray mt-1 leading-tight font-medium uppercase tracking-wide">
              {label}
            </p>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        {ctaLinks.map(({ to, label, icon, gradient }) => (
          <Link key={to} to={to}>
            <Card className="flex items-center gap-4 !p-4 hover:shadow-card-hover">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow-sm`}
              >
                {icon}
              </div>
              <span className="font-semibold text-chartrons-olive-dark">{label}</span>
              <span className="ml-auto text-chartrons-warm-gray text-lg">→</span>
            </Card>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-chartrons-bordeaux to-chartrons-olive-dark p-5 text-white shadow-card">
        <p className="text-sm font-medium opacity-95">{t('app.tagline')}</p>
        <p className="text-xs opacity-60 mt-1.5">{t('home.areaHint')}</p>
      </section>

      <FaqModal open={faqOpen} onClose={() => setFaqOpen(false)} />
    </div>
  );
}
