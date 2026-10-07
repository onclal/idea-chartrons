import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isFleaMarketEvent, type AgendaEvenement } from '@idea-chartrons/shared';
import { Card } from './ui';

interface TodayInChartronsProps {
  /** Événements déjà filtrés (à venir bientôt) et triés par date de début croissante. */
  events: AgendaEvenement[];
}

function formatEventDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Bloc « Aujourd'hui aux Chartrons » de l'accueil : ce qui se passe bientôt dans le quartier,
 * alimenté automatiquement par l'agenda. C'est aussi la zone où viendront se brancher les
 * contenus éditoriaux (voir docs/MASTERBOOK.md, objectif 5).
 */
export function TodayInChartrons({ events: upcoming }: TodayInChartronsProps) {
  const { t, i18n } = useTranslation();
  // Un événement récurrent (marché, puces) n'apparaît qu'une fois, à sa prochaine date.
  const events = upcoming.filter((event, index) => upcoming.findIndex((other) => other.titre === event.titre) === index);

  return (
    <section aria-labelledby="today-title">
      <Card className="!p-0 overflow-hidden">
        <h2 id="today-title" className="px-4 pt-4 pb-2 text-base font-bold text-chartrons-olive-dark">
          {t('home.today.title')}
        </h2>
        {events.length === 0 ? (
          <p className="px-4 pb-3 text-sm text-chartrons-warm-gray">{t('home.today.empty')}</p>
        ) : (
          <ul className="divide-y divide-chartrons-beige">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  to={isFleaMarketEvent(event) ? '/brocanteurs' : '/events'}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-chartrons-stone touch-target"
                >
                  <span className="text-chartrons-olive-dark font-medium truncate">{event.titre}</span>
                  <span className="text-xs text-chartrons-warm-gray shrink-0">
                    {formatEventDate(event.dateDebut, i18n.language)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          to="/events"
          className="flex items-center justify-between gap-3 px-4 py-3 border-t border-chartrons-beige text-sm font-semibold text-chartrons-green hover:bg-chartrons-stone touch-target"
        >
          <span>{t('home.today.agenda')}</span>
          <span aria-hidden>→</span>
        </Link>
      </Card>
    </section>
  );
}
