import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { StudioFeedItem, StudioSlotId } from '@idea-chartrons/shared';
import { Card } from './ui';
import { useStudioFeed } from '../lib/studioFeed';
import { useVideoLike, useVideoLikesEnabled } from '../lib/videoLikes';

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
 * Vidéo de l'éditorial : sur grand écran, elle occupe la zone à gauche de la colonne centrale
 * et reste visible pendant le défilement ; sur téléphone, elle s'affiche dans la page.
 * Le format (vertical ou horizontal) s'adapte automatiquement à la vidéo.
 */
function EditorialVideo({ item }: { item: StudioFeedItem }) {
  const { t } = useTranslation();
  const likesEnabled = useVideoLikesEnabled();
  const { liked, toggle } = useVideoLike(item.id);
  const titleId = 'studio-slot-editorial-video';
  return (
    <section
      aria-labelledby={titleId}
      data-studio-slot="editorial-video"
      className="xl:absolute xl:right-full xl:top-0 xl:!mt-0 xl:mr-6 xl:w-72 xl:h-full"
    >
      <div className="xl:sticky xl:top-24">
        <video
          src={item.videoUrl ?? undefined}
          poster={item.imageUrl ?? undefined}
          controls
          playsInline
          preload="metadata"
          className="w-full h-auto max-h-[70vh] rounded-2xl bg-black object-contain"
        />
        <div className="mt-2 px-1">
          {item.label ? (
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-chartrons-brass">{item.label}</span>
          ) : null}
          <h2 id={titleId} className="text-sm font-semibold text-chartrons-olive-dark leading-snug">{item.title}</h2>
          {likesEnabled ? (
            <button
              type="button"
              onClick={toggle}
              aria-pressed={liked}
              className="touch-target mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-chartrons-bordeaux"
            >
              <span aria-hidden="true">{liked ? '❤️' : '🤍'}</span>
              {liked ? t('studioSlots.unlikeVideo') : t('studioSlots.likeVideo')}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * Emplacement de branchement des outils de STUDIO ALL.
 * Invisible tant que le flux est vide ; voir docs/BRANCHEMENT-STUDIO-ALL.md.
 */
export function StudioSlot({ slot }: StudioSlotProps) {
  const { t } = useTranslation();
  const allItems = useStudioFeed()[slot];
  const video = slot === 'editorial' ? allItems.find((item) => item.videoUrl) : undefined;
  const items = video ? allItems.filter((item) => item !== video) : allItems;
  if (items.length === 0 && !video) return null;

  const titleId = `studio-slot-${slot}`;
  const rowClass = 'flex items-start gap-3 px-4 py-3 touch-target';

  const list = items.length === 0 ? null : (
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

  if (!video) return list;
  return (
    <>
      <EditorialVideo item={video} />
      {list}
    </>
  );
}
