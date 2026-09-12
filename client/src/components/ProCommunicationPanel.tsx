import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProCampaign, ProContent, ProContentStatus } from '@idea-chartrons/shared';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { Badge, Button, Card, EmptyState, Loading, Select, Textarea } from './ui';
import { EnhanceWithAiButton } from './EnhanceWithAiButton';

interface ProCommunicationPanelProps {
  shopId: string;
  shopName: string;
}

const STATUS_VARIANT: Record<ProContentStatus, 'olive' | 'gold' | 'bordeaux' | 'stone'> = {
  draft: 'stone',
  ready: 'gold',
  scheduled: 'gold',
  published: 'olive',
  error: 'bordeaux',
};

export function ProCommunicationPanel({ shopId, shopName }: ProCommunicationPanelProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [contents, setContents] = useState<ProContent[]>([]);
  const [campaigns, setCampaigns] = useState<ProCampaign[]>([]);
  const [campaignId, setCampaignId] = useState<string>('');
  const [newCampaignName, setNewCampaignName] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.getShopContents(shopId), api.getShopCampaigns(shopId)])
      .then(([contentList, campaignList]) => {
        setContents(contentList);
        setCampaigns(campaignList);
      })
      .catch((err) => showToast(err instanceof Error ? err.message : t('common.error'), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [shopId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    try {
      await api.createProContent({
        shopId,
        title: title.trim() || null,
        body,
        campaignId: campaignId || null,
        status: 'ready',
      });
      setTitle('');
      setBody('');
      showToast(t('proSpace.communication.created'), 'info');
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('common.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleNewCampaign = async () => {
    if (!newCampaignName.trim()) return;
    try {
      const campaign = await api.createProCampaign(shopId, newCampaignName);
      setNewCampaignName('');
      setCampaigns((list) => [campaign, ...list]);
      setCampaignId(campaign.id);
      showToast(t('proSpace.communication.campaignCreated'), 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('common.error'), 'error');
    }
  };

  const campaignName = (id: string | null) => campaigns.find((c) => c.id === id)?.name ?? null;

  return (
    <div className="space-y-4">
      <Card className="!p-4 sm:!p-5 space-y-4">
        <div>
          <h3 className="text-base font-bold text-chartrons-bordeaux">{t('proSpace.communication.title')}</h3>
          <p className="text-xs text-chartrons-warm-gray mt-1 leading-relaxed">
            {t('proSpace.communication.subtitle')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('proSpace.communication.titlePlaceholder') ?? ''}
            className="w-full rounded-xl border border-chartrons-beige px-3 py-2 text-sm"
          />
          <Textarea
            label={t('proSpace.communication.bodyLabel')}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder={t('proSpace.communication.bodyPlaceholder') ?? ''}
          />
          <EnhanceWithAiButton
            title={title}
            description={body}
            kind="merchant"
            onEnhanced={(next) => {
              setTitle(next.title);
              setBody(next.description);
            }}
          />
          {campaigns.length > 0 && (
            <Select
              label={t('proSpace.communication.campaignLabel')}
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              options={[
                { value: '', label: t('proSpace.communication.noCampaign') },
                ...campaigns.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newCampaignName}
              onChange={(e) => setNewCampaignName(e.target.value)}
              placeholder={t('proSpace.communication.newCampaignPlaceholder') ?? ''}
              className="flex-1 rounded-xl border border-chartrons-beige px-3 py-2 text-sm"
            />
            <Button type="button" variant="secondary" onClick={handleNewCampaign}>
              {t('proSpace.communication.newCampaign')}
            </Button>
          </div>
          <Button type="submit" variant="bordeaux" disabled={saving || !body.trim()} className="w-full">
            {saving ? t('common.loading') : t('proSpace.communication.submit')}
          </Button>
        </form>
      </Card>

      <Card className="!p-4 sm:!p-5 space-y-3">
        <h3 className="text-sm font-bold text-chartrons-olive-dark">{t('proSpace.communication.listTitle')}</h3>
        {loading ? (
          <Loading message={t('common.loading')} />
        ) : contents.length === 0 ? (
          <EmptyState title={t('proSpace.communication.empty')} message={shopName} />
        ) : (
          <ul className="space-y-2">
            {contents.map((content) => (
              <li key={content.id} className="rounded-xl border border-chartrons-beige p-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-chartrons-bordeaux">
                    {content.title || t('proSpace.communication.untitled')}
                  </p>
                  <Badge variant={STATUS_VARIANT[content.status]}>
                    {t(`proSpace.communication.status.${content.status}`)}
                  </Badge>
                </div>
                <p className="text-xs text-chartrons-warm-gray leading-relaxed">{content.body}</p>
                {campaignName(content.campaignId) && (
                  <p className="text-[11px] text-chartrons-brass font-semibold">
                    {campaignName(content.campaignId)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
