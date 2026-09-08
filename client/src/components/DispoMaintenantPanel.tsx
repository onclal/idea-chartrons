import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { DispoSignal } from '@idea-chartrons/shared';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { Badge, Button, Card, Input, Select } from './ui';

const DURATION_OPTIONS = [30, 60, 120, 240] as const;

interface DispoMaintenantPanelProps {
  shopId: string;
  shopName: string;
}

function formatRemaining(expiresAt: string, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const minutes = Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 60_000));
  if (minutes < 60) return t('proSpace.dispo.remainingMinutes', { count: minutes });
  return t('proSpace.dispo.remainingHours', { count: Math.round(minutes / 60) });
}

export function DispoMaintenantPanel({ shopId, shopName }: DispoMaintenantPanelProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState<number>(60);
  const [saving, setSaving] = useState(false);
  const [signals, setSignals] = useState<DispoSignal[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .getShopDispoSignals(shopId)
      .then(setSignals)
      .catch((err) => showToast(err instanceof Error ? err.message : t('common.error'), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [shopId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSaving(true);
    try {
      await api.createDispoSignal({ shopId, shopName, message, durationMinutes: duration });
      setMessage('');
      showToast(t('proSpace.dispo.published'), 'info');
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('common.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="!p-4 sm:!p-5 space-y-4">
      <div>
        <h3 className="text-base font-bold text-chartrons-bordeaux">{t('proSpace.dispo.title')}</h3>
        <p className="text-sm text-chartrons-warm-gray mt-1">{t('proSpace.dispo.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label={t('proSpace.dispo.messageLabel')}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 140))}
          placeholder={t('proSpace.dispo.messagePlaceholder')}
          maxLength={140}
        />
        <Select
          label={t('proSpace.dispo.durationLabel')}
          value={String(duration)}
          onChange={(e) => setDuration(Number(e.target.value))}
          options={DURATION_OPTIONS.map((minutes) => ({
            value: String(minutes),
            label:
              minutes < 60
                ? t('proSpace.dispo.remainingMinutes', { count: minutes })
                : t('proSpace.dispo.remainingHours', { count: minutes / 60 }),
          }))}
        />
        <Button type="submit" variant="bordeaux" className="w-full" disabled={saving || !message.trim()}>
          {saving ? t('common.loading') : t('proSpace.dispo.submit')}
        </Button>
      </form>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-chartrons-warm-gray">
          {t('proSpace.dispo.activeTitle')}
        </p>
        {loading && <p className="text-sm text-chartrons-warm-gray">{t('common.loading')}</p>}
        {!loading && signals.length === 0 && (
          <p className="text-sm text-chartrons-warm-gray">{t('proSpace.dispo.noneActive')}</p>
        )}
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="flex items-center justify-between gap-2 rounded-xl bg-chartrons-stone px-3 py-2"
          >
            <span className="text-sm text-chartrons-olive-dark truncate">{signal.message}</span>
            <Badge variant="green">{formatRemaining(signal.expiresAt, t)}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
