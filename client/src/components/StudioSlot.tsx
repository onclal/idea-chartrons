import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { StudioFeedItem, StudioSlotId } from '@idea-chartrons/shared';
import { Card } from './ui';
import { useStudioFeed } from '../lib/studioFeed';

interface StudioSlotProps {
  slot: StudioSlotId;
}

function ItemBody({ item }: { item: StudioFeedItem }) {
  return (
    <>
      {item.imageUrl ? (
        <img src={item.imageUrl} alt="" loading="lazy" className="w-16 h-16 rounded-lg object-cover shrink-0 bg-chartrons-beige" />
      ) : null}
      <span className="min-w-0 flex-1">
        {item.label ? (
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-chartrons-brass">{item.label}</span>
        ) : null}
        <span className="block text-sm font-semibold text-chartrons-olive-dark leading-snug">{item.title}</span>
        {item.summary ? (
          <span className="block text-xs text-chartrons-warm-gray mt-0.5 leading-relaxed">{item.summary}</span>
        ) : null}
      </span>
    </>
  );
}

/**
 * Emplacement de branchement des outils de STUDIO ALL.
 * Invisible tant que le flux est vide ; voir docs/BRANCHEMENT-STUDIO-ALL.md.
 */
export function StudioSlot({ slot }: StudioSlotProps) {
  const { t } = useTranslation();
  const items = useStudioFeed()[slot];
  if (items.length === 0) return null;

  const titleId = `studio-slot-${slot}`;
  const rowClass = 'flex items-start gap-3 px-4 py-3 touch-target';

  return (
    <section aria-labelledby={titleId} data-studio-slot={slot}>
      <Card className="!p-0 overflow-hidden">
        <h2 id={titleId} className="px-4 pt-4 pb-2 text-base font-bold text-chartrons-olive-dark">
          {t(`studioSlots.${slot}`)}
        </h2>
        <ul className="divide-y divide-chartrons-beige">
          {items.map((item) => (
            <li key={item.id}>
              {item.url === null ? (
                <div className={rowClass}>
                  <ItemBody item={item} />
                </div>
              ) : item.url.startsWith('/') ? (
                <Link to={item.url} className={`${rowClass} hover:bg-chartrons-stone`}>
                  <ItemBody item={item} />
                </Link>
              ) : (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className={`${rowClass} hover:bg-chartrons-stone`}>
                  <ItemBody item={item} />
                </a>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
