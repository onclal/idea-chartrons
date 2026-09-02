import type { LocaleText } from './locale';
import { writeLocalStorage } from './storage';

/**
 * Hero slides (`hero_slides`) : visuels temporaires diffuses dans le rectangle
 * d'accueil, en plus du visuel de bienvenue par defaut (toujours present).
 * Deux usages : annoncer un evenement du quartier, ou (plus tard) afficher une
 * publicite partenaire pour financer l'association. Vide par defaut : le
 * rectangle d'accueil reste inchange tant qu'aucun slide n'est cree ici.
 */
export const HERO_SLIDES_KEY = 'idea-chartrons-hero-slides';
export const HERO_SLIDES_EVENT = 'idea-chartrons-hero-slides';
export const HERO_SLIDE_ROTATION_MS = 7000;

export type HeroSlideKind = 'event' | 'sponsor';

export interface HeroSlide {
  id: string;
  kind: HeroSlideKind;
  title: LocaleText;
  subtitle: LocaleText;
  imageUrl: string;
  ctaLabel: LocaleText;
  ctaUrl: string;
  /** Nom de l'annonceur, affiche sur les slides sponsorises. */
  sponsorName: string;
  isActive: boolean;
  startAt: string | null;
  endAt: string | null;
}

function txt(fr: string, en: string): LocaleText {
  return { fr, en };
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [];

function emitChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(HERO_SLIDES_EVENT));
}

function asLocaleText(value: unknown, fallback = ''): LocaleText {
  if (value && typeof value === 'object' && 'fr' in value) {
    const rec = value as { fr?: unknown; en?: unknown };
    const fr = String(rec.fr ?? fallback);
    return { fr, en: String(rec.en ?? fr) };
  }
  if (typeof value === 'string' && value.trim()) {
    return { fr: value, en: value };
  }
  return { fr: fallback, en: fallback };
}

function asKind(value: unknown): HeroSlideKind {
  return value === 'sponsor' ? 'sponsor' : 'event';
}

function asIso(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : value;
}

export function normalizeHeroSlide(raw: Partial<HeroSlide> & { id?: string }): HeroSlide {
  return {
    id: String(raw.id ?? '').trim() || `hs-${Date.now().toString(36)}`,
    kind: asKind(raw.kind),
    title: asLocaleText(raw.title),
    subtitle: asLocaleText(raw.subtitle),
    imageUrl: String(raw.imageUrl ?? '').trim(),
    ctaLabel: asLocaleText(raw.ctaLabel, 'Voir'),
    ctaUrl: String(raw.ctaUrl ?? '').trim() || '/events',
    sponsorName: String(raw.sponsorName ?? '').trim(),
    isActive: raw.isActive !== false,
    startAt: asIso(raw.startAt),
    endAt: asIso(raw.endAt),
  };
}

export function emptyHeroSlide(): Omit<HeroSlide, 'id'> {
  return {
    kind: 'event',
    title: txt('', ''),
    subtitle: txt('', ''),
    imageUrl: '',
    ctaLabel: txt('Voir', 'See'),
    ctaUrl: '/events',
    sponsorName: '',
    isActive: true,
    startAt: null,
    endAt: null,
  };
}

export function loadHeroSlides(): HeroSlide[] {
  try {
    const raw = localStorage.getItem(HERO_SLIDES_KEY);
    if (!raw) return [...DEFAULT_HERO_SLIDES];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.map((item) => normalizeHeroSlide(item as Partial<HeroSlide>))
      : [...DEFAULT_HERO_SLIDES];
  } catch {
    return [...DEFAULT_HERO_SLIDES];
  }
}

function saveHeroSlides(slides: HeroSlide[]): HeroSlide[] {
  const next = slides.map((slide) => normalizeHeroSlide(slide));
  try {
    writeLocalStorage(HERO_SLIDES_KEY, JSON.stringify(next));
  } catch {
    // Session-only if storage is full.
  }
  emitChange();
  return next;
}

export function listHeroSlides(): HeroSlide[] {
  return loadHeroSlides();
}

export function addHeroSlide(input: Partial<HeroSlide>): HeroSlide {
  const slide = normalizeHeroSlide({
    ...emptyHeroSlide(),
    ...input,
    id: input.id || `hs-${Date.now().toString(36)}`,
  });
  saveHeroSlides([...loadHeroSlides(), slide]);
  return slide;
}

export function updateHeroSlide(id: string, patch: Partial<HeroSlide>): HeroSlide | null {
  let updated: HeroSlide | null = null;
  const slides = loadHeroSlides().map((slide) => {
    if (slide.id !== id) return slide;
    updated = normalizeHeroSlide({ ...slide, ...patch, id: slide.id });
    return updated;
  });
  saveHeroSlides(slides);
  return updated;
}

export function toggleHeroSlide(id: string): HeroSlide | null {
  const current = loadHeroSlides().find((slide) => slide.id === id);
  if (!current) return null;
  return updateHeroSlide(id, { isActive: !current.isActive });
}

export function removeHeroSlide(id: string): void {
  saveHeroSlides(loadHeroSlides().filter((slide) => slide.id !== id));
}

function inSchedule(slide: HeroSlide, now: Date): boolean {
  const ts = now.getTime();
  if (slide.startAt) {
    const start = new Date(slide.startAt).getTime();
    if (!Number.isNaN(start) && ts < start) return false;
  }
  if (slide.endAt) {
    const end = new Date(slide.endAt).getTime();
    if (!Number.isNaN(end) && ts > end) return false;
  }
  return true;
}

/** Slides actuellement diffusables : actifs, dans leur creneau, avec une image. */
export function activeHeroSlides(now: Date = new Date()): HeroSlide[] {
  return loadHeroSlides().filter((slide) => slide.isActive && slide.imageUrl && inSchedule(slide, now));
}
