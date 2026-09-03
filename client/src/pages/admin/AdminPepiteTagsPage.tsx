import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_PEPITE_TAGS } from '@idea-chartrons/shared';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Badge, Button, Card, Input, Loading } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';

export function AdminPepiteTagsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .getPlatformSettings()
      .then((settings) => setTags(settings.pepiteTags ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const persist = async (next: string[]) => {
    setSaving(true);
    try {
      const updated = await api.updatePlatformSettings({ pepiteTags: next });
      setTags(updated.pepiteTags ?? next);
      showToast(t('adminSpace.pepiteTags.saved'));
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('common.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    const value = newTag.trim();
    if (!value) return;
    if (tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
      showToast(t('adminSpace.pepiteTags.duplicate'), 'error');
      return;
    }
    setNewTag('');
    void persist([...tags, value]);
  };

  const handleRemove = (tag: string) => {
    void persist(tags.filter((item) => item !== tag));
  };

  const handleReset = () => {
    if (!window.confirm(t('adminSpace.pepiteTags.resetConfirm'))) return;
    void persist([...DEFAULT_PEPITE_TAGS]);
  };

  if (loading) return <Loading message={t('common.loading')} />;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title={t('adminSpace.pepiteTags.title')}
        subtitle={t('adminSpace.pepiteTags.subtitle')}
      />

      <Card className="!p-4 sm:!p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            label={t('adminSpace.pepiteTags.newTag')}
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder={t('adminSpace.pepiteTags.newTagPlaceholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button type="button" variant="bordeaux" disabled={saving || !newTag.trim()} onClick={handleAdd}>
            {t('adminSpace.pepiteTags.add')}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.length === 0 && (
            <p className="text-sm text-chartrons-warm-gray">{t('adminSpace.pepiteTags.empty')}</p>
          )}
          {tags.map((tag) => (
            <Badge key={tag} variant="olive" className="!py-1.5 !px-3">
              <span className="mr-2">{tag}</span>
              <button
                type="button"
                onClick={() => handleRemove(tag)}
                aria-label={t('adminSpace.pepiteTags.remove', { tag })}
                className="font-bold hover:text-chartrons-brick"
                disabled={saving}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>

        <Button type="button" variant="ghost" className="border border-chartrons-beige" onClick={handleReset} disabled={saving}>
          {t('adminSpace.pepiteTags.reset')}
        </Button>
      </Card>
    </div>
  );
}
