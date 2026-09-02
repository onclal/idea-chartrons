import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ActeurLocalCategory,
  isCommunityEvent,
  isFleaMarketEvent,
  isPremiumProMerchant,
  type ActeurLocal,
  type AgendaEvenement,
} from '@idea-chartrons/shared';
import { Badge, Button, Card, EmptyState, Loading } from '../components/ui';
import { PageHelp } from '../components/PageHelp';
import { DistanceBadge } from '../components/DistanceBadge';
import { PhoneLink } from '../components/PhoneLink';
import { PlaceCover } from '../components/PlaceCover';
import { resolveMediaUrl } from '../lib/media';
import { api } from '../lib/api';

const EXPERIENCES_MAX = 4;

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function TourismePage() {
  const { t, i18n } = useTranslation();
  const [acteurs, setActeurs] = useState<ActeurLocal[]>([]);
  const [events, setEvents] = useState<AgendaEvenement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getActeurs(), api.getEvents()])
      .then(([acteursData, eventsData]) => {
        setActeurs(acteursData);
        setEvents(eventsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const conciergeries = useMemo(
    () =>
      acteurs
        .filter((acteur) => acteur.categorie === ActeurLocalCategory.TourismeConciergerie)
        .sort((a, b) => {
          const premium = Number(isPremiumProMerchant(b)) - Number(isPremiumProMerchant(a));
          if (premium !== 0) return premium;
          return a.nomCommerce.localeCompare(b.nomCommerce, 'fr');
        }),
    [acteurs],
  );

  const experiences = useMemo(
    () =>
      events
        .filter((event) => (isCommunityEvent(event) || isFleaMarketEvent(event)) && new Date(event.dateFin) >= new Date())
        .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime())
        .slice(0, EXPERIENCES_MAX),
    [events],
  );

  if (loading) return <Loading message={t('common.loading')} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-chartrons-bordeaux">{t('tourisme.title')}</h2>
          <p className="text-sm text-chartrons-warm-gray mt-1">{t('tourisme.subtitle')}</p>
        </div>
        <PageHelp page="tourisme" />
      </div>

      <Card className="!p-4 bg-chartrons-stone/60">
        <p className="text-sm text-chartrons-olive-dark leading-relaxed">{t('tourisme.intro')}</p>
        <Link to="/carte?layer=tourisme">
          <Button type="button" variant="ghost" size="sm" className="mt-3 border border-chartrons-beige">
            🗺️ {t('tourisme.openMap')}
          </Button>
        </Link>
      </Card>

      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-chartrons-olive">
          {t('tourisme.consignes.title')}
        </h3>
        <Card className="!p-4">
          <p className="text-sm text-chartrons-olive-dark leading-relaxed">{t('tourisme.consignes.hint')}</p>
          <p className="text-sm text-chartrons-warm-gray mt-2 leading-relaxed">{t('tourisme.consignes.relais')}</p>
          <Link to="/relais">
            <Button type="button" variant="bordeaux" size="sm" className="mt-3">
              📦 {t('tourisme.consignes.relaisCta')}
            </Button>
          </Link>
        </Card>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-chartrons-olive">
            {t('tourisme.adresses.title')}
          </h3>
          <p className="text-xs text-chartrons-warm-gray mt-1">{t('tourisme.adresses.hint')}</p>
        </div>
        {conciergeries.length === 0 ? (
          <EmptyState icon="🔑" title={t('tourisme.adresses.empty')} message={t('tourisme.adresses.hint')} />
        ) : (
          <div className="space-y-3">
            {conciergeries.map((acteur) => {
              const cover = resolveMediaUrl(acteur.photos[0]);
              return (
                <Link key={acteur.id} to={`/acteurs?fiche=${encodeURIComponent(acteur.id)}`}>
                  <Card className="!p-0 overflow-hidden hover:shadow-card-hover">
                    {cover && <PlaceCover src={cover} />}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-chartrons-olive-dark">{acteur.nomCommerce}</h4>
                        {isPremiumProMerchant(acteur) && (
                          <Badge variant="vip" icon="⭐">
                            {t('badges.premiumPro')}
                          </Badge>
                        )}
                      </div>
                      {acteur.specialite && (
                        <Badge variant="olive" className="mt-1.5">
                          {acteur.specialite}
                        </Badge>
                      )}
                      {acteur.description && (
                        <p className="text-sm text-chartrons-olive-dark/80 mt-2 line-clamp-2">{acteur.description}</p>
                      )}
                      <p className="text-xs text-chartrons-olive-dark/70 mt-2">📍 {acteur.adresse}</p>
                      <DistanceBadge latitude={acteur.latitude} longitude={acteur.longitude} className="mt-1" />
                      <div className="mt-2" onClick={(event) => event.stopPropagation()}>
                        <PhoneLink phone={acteur.telephone} />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-chartrons-olive">
            {t('tourisme.experiences.title')}
          </h3>
          <p className="text-xs text-chartrons-warm-gray mt-1">{t('tourisme.experiences.hint')}</p>
        </div>
        {experiences.length === 0 ? (
          <EmptyState icon="🎪" title={t('tourisme.experiences.empty')} message={t('tourisme.experiences.hint')} />
        ) : (
          <div className="space-y-3">
            {experiences.map((event) => (
              <Card key={event.id} className="!p-0 overflow-hidden">
                {event.image && <img src={event.image} alt="" className="w-full h-32 object-cover" />}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-chartrons-olive-dark">{event.titre}</h4>
                    <Badge variant="brocante">{t(`events.types.${event.type}`)}</Badge>
                  </div>
                  {event.lieu && <p className="text-xs text-chartrons-warm-gray mt-2">📍 {event.lieu}</p>}
                  <p className="text-xs font-semibold text-chartrons-bordeaux mt-2">
                    🕐 {formatDate(event.dateDebut, i18n.language)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
        <Link to="/events" className="inline-block text-xs font-semibold text-chartrons-bordeaux hover:underline">
          {t('tourisme.experiences.cta')} →
        </Link>
      </section>
    </div>
  );
}
