import { useEffect, useState } from 'react';
import { notifyShared, registerShared } from './sharedContent';
import { writeLocalStorage } from './storage';

/**
 * Prix de l'abonnement Premium Pro, fixés par l'administrateur (page « Tarifs »).
 * Valeur vide : le site affiche « à définir ». Partagé avec tous les visiteurs via
 * le contenu partagé (voir sharedContent.ts).
 */
export interface PricingSettings {
  monthly: number | null;
  yearly: number | null;
}

export const PRICING_KEY = 'idea-chartrons-pricing';
export const PRICING_EVENT = 'idea-chartrons-pricing';

const EMPTY: PricingSettings = { monthly: null, yearly: null };

function asPrice(value: unknown): number | null {
  const num = typeof value === 'number' ? value : Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(num) && num > 0 && num < 100000 ? Math.round(num * 100) / 100 : null;
}

export function normalizePricing(raw: unknown): PricingSettings {
  const item = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<keyof PricingSettings, unknown>>;
  return { monthly: asPrice(item.monthly), yearly: asPrice(item.yearly) };
}

export function loadPricing(): PricingSettings {
  try {
    const raw = localStorage.getItem(PRICING_KEY);
    return raw ? normalizePricing(JSON.parse(raw)) : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

function writePricing(settings: PricingSettings): void {
  try {
    writeLocalStorage(PRICING_KEY, JSON.stringify(settings));
  } catch {
    // Stockage plein : la valeur partagée sera rechargée à la prochaine visite.
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(PRICING_EVENT));
}

export function savePricing(settings: PricingSettings): PricingSettings {
  const next = normalizePricing(settings);
  writePricing(next);
  notifyShared('pricing');
  return next;
}

registerShared('pricing', {
  collect: () => [loadPricing()],
  apply: (items) => writePricing(normalizePricing(items[0])),
});

export function usePricing(): PricingSettings {
  const [settings, setSettings] = useState<PricingSettings>(loadPricing);
  useEffect(() => {
    const refresh = () => setSettings(loadPricing());
    window.addEventListener(PRICING_EVENT, refresh);
    return () => window.removeEventListener(PRICING_EVENT, refresh);
  }, []);
  return settings;
}

function money(amount: number, lang: string): string {
  const code = lang.toLowerCase();
  const locale = code.startsWith('fr') ? 'fr-FR' : code.startsWith('es') ? 'es-ES' : 'en-GB';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

/** Texte du prix Premium Pro pour la langue donnée. */
export function pricingLabel(settings: PricingSettings, lang: string): string {
  const code = lang.toLowerCase();
  const unit = code.startsWith('en')
    ? { month: '/month', year: '/year', or: 'or', none: 'To be announced (currently free)' }
    : code.startsWith('es')
      ? { month: '/mes', year: '/año', or: 'o', none: 'Por definir (gratis actualmente)' }
      : { month: '/mois', year: '/an', or: 'ou', none: 'À définir (offert actuellement)' };
  const parts: string[] = [];
  if (settings.monthly !== null) parts.push(`${money(settings.monthly, lang)}${unit.month}`);
  if (settings.yearly !== null) parts.push(`${money(settings.yearly, lang)}${unit.year}`);
  return parts.length ? parts.join(` ${unit.or} `) : unit.none;
}
