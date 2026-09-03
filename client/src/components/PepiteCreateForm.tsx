import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Modal, Textarea } from './ui';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';

interface PepiteCreateFormProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  merchantId: string;
  tagsCatalog: string[];
}

export function PepiteCreateForm({ open, onClose, onCreated, merchantId, tagsCatalog }: PepiteCreateFormProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('');
  const [era, setEra] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setDescription('');
    setStyle('');
    setEra('');
    setPhotoPreview(null);
    setSelectedTags([]);
    setError(null);
  }, [open]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('proSpace.pepites.form.titleRequired'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.createAntiqueItem({
        title: title.trim(),
        description: description.trim(),
        style: style.trim(),
        era: era.trim(),
        photoUrl: photoPreview,
        tags: selectedTags,
        merchantId,
      });
      showToast(t('proSpace.pepites.form.created'));
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t('proSpace.pepites.form.title')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-chartrons-olive-dark leading-relaxed rounded-xl border border-chartrons-beige bg-chartrons-beige/40 px-3 py-2">
          {t('proSpace.pepites.form.hint')}
        </p>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-chartrons-warm-gray">
            {t('proSpace.pepites.form.photo')}
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-chartrons-gold/30 bg-white cursor-pointer hover:border-chartrons-green/40 transition-colors overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-chartrons-warm-gray px-4 text-center">
                {t('proSpace.pepites.form.photoHint')}
              </span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
          {!photoPreview && (
            <p className="text-[11px] text-chartrons-warm-gray leading-relaxed">
              {t('proSpace.pepites.form.noPhotoHint')}
            </p>
          )}
        </div>
        <Input
          label={t('proSpace.pepites.form.itemTitle')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder={t('proSpace.pepites.form.itemTitlePlaceholder')}
        />
        <Textarea
          label={t('posts.create.description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder={t('proSpace.pepites.form.descriptionPlaceholder')}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('proSpace.pepites.form.style')}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder={t('proSpace.pepites.form.stylePlaceholder')}
          />
          <Input
            label={t('proSpace.pepites.form.era')}
            value={era}
            onChange={(e) => setEra(e.target.value)}
            placeholder={t('proSpace.pepites.form.eraPlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-chartrons-warm-gray">
            {t('proSpace.pepites.form.tags')}
          </label>
          <p className="text-[11px] text-chartrons-warm-gray leading-relaxed">
            {t('proSpace.pepites.form.tagsHint')}
          </p>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
            {tagsCatalog.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    active
                      ? 'bg-chartrons-olive text-white border-chartrons-olive'
                      : 'bg-white text-chartrons-olive-dark border-chartrons-beige hover:bg-chartrons-stone'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
        {error && <p className="text-sm text-chartrons-brick">{error}</p>}
        <Button type="submit" variant="bordeaux" className="w-full" disabled={submitting}>
          {submitting ? t('common.loading') : t('proSpace.pepites.form.submit')}
        </Button>
      </form>
    </Modal>
  );
}
