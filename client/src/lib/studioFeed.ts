import { useEffect, useState } from 'react';
import { emptyStudioFeed, parseStudioFeed, type StudioFeed } from '@idea-chartrons/shared';

const FEED_URL = import.meta.env.VITE_STUDIO_FEED_URL?.trim() || '';
const FEED_TIMEOUT_MS = 5000;

/** Vidéo d'essai, visible seulement avec « ?apercu=video » dans l'adresse (contrôle du propriétaire). */
const DEMO_EDITORIAL = {
  id: 'apercu-video',
  title: 'Vidéo d’essai de l’espace éditorial',
  summary: 'Aperçu de l’emplacement. Le contenu réel viendra de STUDIO ALL.',
  url: null,
  imageUrl: null,
  videoUrl: '/demo-editorial.mp4',
  label: 'Éditorial',
  publishedAt: null,
};

function wantsVideoPreview(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('apercu') === 'video';
  } catch {
    return false;
  }
}

let cached: Promise<StudioFeed> | null = null;

/**
 * Lit le flux publié par les outils de STUDIO ALL (éditorial, marketing des pros).
 * Sans `VITE_STUDIO_FEED_URL`, ou en cas d'échec, les emplacements restent vides et invisibles :
 * le site ne dépend jamais de ce flux pour fonctionner.
 */
export function loadStudioFeed(): Promise<StudioFeed> {
  if (!FEED_URL) return Promise.resolve(emptyStudioFeed());
  if (!cached) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
    cached = fetch(FEED_URL, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : null))
      .then((raw) => parseStudioFeed(raw))
      .catch(() => emptyStudioFeed())
      .finally(() => window.clearTimeout(timer));
  }
  return cached;
}

export function useStudioFeed(): StudioFeed {
  const [feed, setFeed] = useState<StudioFeed>(emptyStudioFeed);
  useEffect(() => {
    let active = true;
    void loadStudioFeed().then((next) => {
      if (!active) return;
      setFeed(wantsVideoPreview() ? { ...next, editorial: [DEMO_EDITORIAL, ...next.editorial] } : next);
    });
    return () => {
      active = false;
    };
  }, []);
  return feed;
}
