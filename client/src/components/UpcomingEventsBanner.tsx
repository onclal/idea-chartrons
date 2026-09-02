import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isFleaMarketEvent, type AgendaEvenement } from '@idea-chartrons/shared';

interface UpcomingEventsBannerProps {
  /** Événements déjà filtrés (à venir bientôt) et triés par date de début croissante. */
  events: AgendaEvenement[];
}

function formatEventDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Petit bandeau dépliable sur l'accueil : liste automatiquement les prochains
 * événements de l'agenda (toutes catégories confondues — brocante, animation
 * d'association, atelier...), sans saisie manuelle. Replié par défaut pour
 * rester compact ; un clic déplie la liste complète.
 */
export function UpcomingEventsBanner({ events }: UpcomingEventsBannerProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  if (events.length === 0) return null;

  const [first, ...rest] = events;
  const summary =
    rest.length === 0 ? first.titre : t('upcomingEvents.summary', { title: first.titre, count: rest.length });

  return (
    <div className="rounded-2xl border border-chartrons-beige bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-3 min-h-[52px] px-4 py-3 text-left touch-target"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-chartrons-olive-dark flex items-center gap-2 min-w-0">
          <span aria-hidden>🗓️</span>
          <span className="truncate">{summary}</span>
        </span>
        <span
          aria-hidden
          className={`shrink-0 text-chartrons-olive-dark transition-transform ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>
      {open && (
        <ul className="border-t border-chartrons-beige divide-y divide-chartrons-beige">
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
    </div>
  );
}
