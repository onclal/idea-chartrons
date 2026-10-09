import { useCallback, useEffect, useState } from 'react';
import { notifyShared, registerShared } from './sharedContent';
import { writeLocalStorage } from './storage';

/**
 * « J'aime » sur les vidéos de l'éditorial.
 * - Le like reste sur l'appareil du visiteur (comme les favoris) : aucun compteur partagé.
 * - L'interrupteur « Likes sur les vidéos » est fixé par l'administrateur (page « Réglages »)
 *   et partagé avec tous les visiteurs via le contenu partagé (voir sharedContent.ts).
 *   Éteint par défaut.
 */
export const VIDEO_LIKES_SETTING_KEY = 'idea-chartrons-video-likes-enabled';
export const VIDEO_LIKES_KEY = 'idea-chartrons-video-likes';
const CHANGE_EVENT = 'idea-chartrons-video-likes';

export function loadVideoLikesEnabled(): boolean {
  try {
    return localStorage.getItem(VIDEO_LIKES_SETTING_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeEnabled(enabled: boolean): void {
  try {
    writeLocalStorage(VIDEO_LIKES_SETTING_KEY, String(enabled));
  } catch {
    // Stockage plein : la valeur partagée sera rechargée à la prochaine visite.
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function saveVideoLikesEnabled(enabled: boolean): boolean {
  writeEnabled(enabled);
  notifyShared('settings');
  return enabled;
}

registerShared('settings', {
  collect: () => [{ videoLikes: loadVideoLikesEnabled() }],
  apply: (items) => {
    const first = items[0];
    writeEnabled(Boolean(first && typeof first === 'object' && (first as { videoLikes?: unknown }).videoLikes === true));
  },
});

function loadLikedIds(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(VIDEO_LIKES_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function useVideoLikesEnabled(): boolean {
  const [enabled, setEnabled] = useState(loadVideoLikesEnabled);
  useEffect(() => {
    const refresh = () => setEnabled(loadVideoLikesEnabled());
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => window.removeEventListener(CHANGE_EVENT, refresh);
  }, []);
  return enabled;
}

/** État « aimé » d'une vidéo sur cet appareil, et bascule. */
export function useVideoLike(videoId: string): { liked: boolean; toggle: () => void } {
  const [liked, setLiked] = useState(() => loadLikedIds().includes(videoId));
  useEffect(() => {
    setLiked(loadLikedIds().includes(videoId));
  }, [videoId]);
  const toggle = useCallback(() => {
    const ids = loadLikedIds().filter((id) => id !== videoId);
    const next = !loadLikedIds().includes(videoId);
    if (next) ids.push(videoId);
    try {
      writeLocalStorage(VIDEO_LIKES_KEY, JSON.stringify(ids.slice(-200)));
    } catch {
      // Stockage plein : le like reste valable pour cette visite seulement.
    }
    setLiked(next);
  }, [videoId]);
  return { liked, toggle };
}
