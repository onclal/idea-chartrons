import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DispoSignal } from '@idea-chartrons/shared';
import { api } from '../lib/api';
import { Badge } from './ui';

/**
 * Bandeau public "En ce moment dans le quartier" : affiche les signaux de
 * disponibilité actifs publiés par les commerçants (volet Réseau Pro / B2B).
 * Rendu vide (rien affiché) si aucun signal actif ou si Supabase n'est pas
 * configuré — ne doit jamais bloquer le reste de la page.
 */
export function DispoMaintenantBanner() {
  const { t } = useTranslation();
  const [signals, setSignals] = useState<DispoSignal[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .getActiveDispoSignals()
      .then((data) => {
        if (!cancelled) setSignals(data);
      })
      .catch(() => {
        // Silencieux : ce bandeau est un bonus, pas un élément critique de la page.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (signals.length === 0) return null;

  return (
    <div className="rounded-2xl bg-chartrons-green/8 border border-chartrons-green/20 px-3 py-2.5 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-chartrons-green">
        {t('dispoBanner.title')}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-0.5 -mx-1 px-1">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="relative shrink-0 w-[260px] overflow-hidden rounded-xl bg-white border border-chartrons-brass/50 shadow-card px-3 py-2.5 pl-4"
          >
            <span className="absolute inset-y-0 left-0 w-1.5 bg-chartrons-brass" aria-hidden="true" />
            <div className="flex items-center justify-between gap-2">
              <Badge variant="brass">{signal.shopName}</Badge>
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-chartrons-brass shrink-0">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chartrons-brass opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-chartrons-brass" />
                </span>
                {t('dispoBanner.live')}
              </span>
            </div>
            <p className="text-sm text-chartrons-olive-dark mt-1.5 leading-snug">{signal.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
