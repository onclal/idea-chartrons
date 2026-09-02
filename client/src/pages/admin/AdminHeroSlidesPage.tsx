import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminDataTable } from '../../components/admin/AdminDataTable';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Badge, Button, Card, EmptyState, Input, Modal, Select } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { loc } from '../../lib/locale';
import { toDatetimeLocal } from '../../lib/format';
import {
  addHeroSlide,
  emptyHeroSlide,
  listHeroSlides,
  normalizeHeroSlide,
  removeHeroSlide,
  toggleHeroSlide,
  updateHeroSlide,
  type HeroSlide,
  type HeroSlideKind,
} from '../../lib/heroSlides';

interface SlideForm {
  kind: HeroSlideKind;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  imageUrl: string;
  ctaFr: string;
  ctaEn: string;
  ctaUrl: string;
  sponsorName: string;
  isActive: boolean;
  startAt: string;
  endAt: string;
}

const emptyForm = (): SlideForm => {
  const draft = emptyHeroSlide();
  return {
    kind: draft.kind,
    titleFr: '',
    titleEn: '',
    subtitleFr: '',
    subtitleEn: '',
    imageUrl: '',
    ctaFr: draft.ctaLabel.fr,
    ctaEn: draft.ctaLabel.en,
    ctaUrl: draft.ctaUrl,
    sponsorName: '',
    isActive: true,
    startAt: '',
    endAt: '',
  };
};

function toForm(slide: HeroSlide): SlideForm {
  return {
    kind: slide.kind,
    titleFr: slide.title.fr,
    titleEn: slide.title.en,
    subtitleFr: slide.subtitle.fr,
    subtitleEn: slide.subtitle.en,
    imageUrl: slide.imageUrl,
    ctaFr: slide.ctaLabel.fr,
    ctaEn: slide.ctaLabel.en,
    ctaUrl: slide.ctaUrl,
    sponsorName: slide.sponsorName,
    isActive: slide.isActive,
    startAt: slide.startAt ? toDatetimeLocal(slide.startAt) : '',
    endAt: slide.endAt ? toDatetimeLocal(slide.endAt) : '',
  };
}

function fromForm(form: SlideForm): Omit<HeroSlide, 'id'> {
  const toIso = (value: string): string | null => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  };
  return normalizeHeroSlide({
    kind: form.kind,
    title: { fr: form.titleFr.trim(), en: (form.titleEn || form.titleFr).trim() },
    subtitle: { fr: form.subtitleFr.trim(), en: (form.subtitleEn || form.subtitleFr).trim() },
    imageUrl: form.imageUrl.trim(),
    ctaLabel: { fr: form.ctaFr.trim() || 'Voir', en: (form.ctaEn || form.ctaFr).trim() || 'See' },
    ctaUrl: form.ctaUrl.trim() || '/events',
    sponsorName: form.sponsorName.trim(),
    isActive: form.isActive,
    startAt: toIso(form.startAt),
    endAt: toIso(form.endAt),
  });
}

export function AdminHeroSlidesPage() {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [slides, setSlides] = useState(() => listHeroSlides());
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState<SlideForm>(emptyForm());

  const refresh = () => setSlides(listHeroSlides());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return slides;
    return slides.filter((slide) => {
      const hay = `${slide.title.fr} ${slide.title.en} ${slide.sponsorName} ${slide.ctaUrl}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, slides]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setCreating(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setCreating(false);
    setEditing(slide);
    setForm(toForm(slide));
  };

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const handleImageFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!form.titleFr.trim() || !form.imageUrl.trim()) return;
    const payload = fromForm(form);
    if (editing) {
      updateHeroSlide(editing.id, payload);
    } else {
      addHeroSlide(payload);
    }
    showToast(t('adminSpace.saved'));
    refresh();
    closeModal();
  };

  const handleToggle = (slide: HeroSlide) => {
    toggleHeroSlide(slide.id);
    refresh();
  };

  const handleDelete = (slide: HeroSlide) => {
    if (!window.confirm(t('adminSpace.heroSlides.deleteConfirm', { title: loc(i18n.language, slide.title) }))) {
      return;
    }
    removeHeroSlide(slide.id);
    refresh();
    showToast(t('adminSpace.saved'));
  };

  const actions = (slide: HeroSlide) => (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="secondary" size="sm" onClick={() => handleToggle(slide)}>
        {slide.isActive ? t('adminSpace.banners.deactivate') : t('adminSpace.banners.activate')}
      </Button>
      <Button type="button" variant="secondary" size="sm" onClick={() => openEdit(slide)}>
        {t('common.edit')}
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="border-chartrons-brick/30 text-chartrons-brick"
        onClick={() => handleDelete(slide)}
      >
        {t('common.delete')}
      </Button>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <AdminPageHeader
        title={t('adminSpace.nav.heroSlides')}
        subtitle={t('adminSpace.pages.heroSlidesSub')}
        action={
          <Button variant="bordeaux" onClick={openCreate} className="w-full sm:w-auto">
            + {t('adminSpace.actions.create')}
          </Button>
        }
      />

      <Card className="!p-4 mb-5">
        <p className="text-sm text-chartrons-warm-gray leading-relaxed">{t('adminSpace.heroSlides.hint')}</p>
      </Card>

      <div className="mb-4">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('common.search')} />
      </div>

      <AdminDataTable
        items={filtered}
        empty={
          <EmptyState
            icon="🖼️"
            title={t('adminSpace.heroSlides.empty')}
            message={t('adminSpace.dashboard.empty')}
            action={{ label: `+ ${t('adminSpace.actions.create')}`, onClick: openCreate }}
          />
        }
        columns={[
          {
            header: t('adminSpace.banners.fields.title'),
            render: (slide) => (
              <div className="flex items-center gap-2 min-w-0">
                {slide.imageUrl ? (
                  <img src={slide.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : null}
                <p className="font-medium text-chartrons-olive-dark truncate max-w-sm">
                  {loc(i18n.language, slide.title)}
                </p>
              </div>
            ),
          },
          {
            header: t('adminSpace.heroSlides.fields.kind'),
            render: (slide) => (
              <Badge variant="brass">{t(`adminSpace.heroSlides.kind.${slide.kind}`)}</Badge>
            ),
          },
          {
            header: t('adminSpace.fields.status'),
            render: (slide) => (
              <Badge variant={slide.isActive ? 'olive' : 'gray'}>
                {slide.isActive ? t('adminSpace.banners.active') : t('adminSpace.banners.inactive')}
              </Badge>
            ),
          },
          { header: t('adminSpace.fields.actions'), render: actions },
        ]}
        mobileCard={(slide) => (
          <Card key={slide.id} className="!p-4">
            <div className="flex items-start gap-3">
              {slide.imageUrl ? (
                <img src={slide.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-chartrons-olive-dark">{loc(i18n.language, slide.title)}</p>
                <p className="text-xs text-chartrons-warm-gray mt-0.5">{slide.ctaUrl}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="brass">{t(`adminSpace.heroSlides.kind.${slide.kind}`)}</Badge>
                  <Badge variant={slide.isActive ? 'olive' : 'gray'}>
                    {slide.isActive ? t('adminSpace.banners.active') : t('adminSpace.banners.inactive')}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-3">{actions(slide)}</div>
          </Card>
        )}
      />

      <Modal
        open={creating || !!editing}
        onClose={closeModal}
        title={editing ? t('adminSpace.actions.edit') : t('adminSpace.actions.create')}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label={t('adminSpace.heroSlides.fields.kind')}
            value={form.kind}
            onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as HeroSlideKind }))}
            options={[
              { value: 'event', label: t('adminSpace.heroSlides.kind.event') },
              { value: 'sponsor', label: t('adminSpace.heroSlides.kind.sponsor') },
            ]}
          />
          <Input
            label={t('adminSpace.banners.fields.titleFr')}
            value={form.titleFr}
            onChange={(e) => setForm((f) => ({ ...f, titleFr: e.target.value }))}
            required
          />
          <Input
            label={t('adminSpace.banners.fields.titleEn')}
            value={form.titleEn}
            onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
          />
          <Input
            label={t('adminSpace.heroSlides.fields.subtitleFr')}
            value={form.subtitleFr}
            onChange={(e) => setForm((f) => ({ ...f, subtitleFr: e.target.value }))}
          />
          <Input
            label={t('adminSpace.heroSlides.fields.subtitleEn')}
            value={form.subtitleEn}
            onChange={(e) => setForm((f) => ({ ...f, subtitleEn: e.target.value }))}
          />

          <div>
            <Input
              label={t('adminSpace.heroSlides.fields.imageUrl')}
              value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://…"
            />
            <label className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-chartrons-olive cursor-pointer">
              📷 {t('adminSpace.heroSlides.fields.uploadImage')}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
            </label>
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="" className="mt-2 w-full h-28 object-cover rounded-xl" />
            ) : null}
          </div>

          {form.kind === 'sponsor' && (
            <Input
              label={t('adminSpace.heroSlides.fields.sponsorName')}
              value={form.sponsorName}
              onChange={(e) => setForm((f) => ({ ...f, sponsorName: e.target.value }))}
              placeholder={t('adminSpace.heroSlides.fields.sponsorNamePlaceholder')}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('adminSpace.banners.fields.ctaFr')}
              value={form.ctaFr}
              onChange={(e) => setForm((f) => ({ ...f, ctaFr: e.target.value }))}
            />
            <Input
              label={t('adminSpace.banners.fields.ctaEn')}
              value={form.ctaEn}
              onChange={(e) => setForm((f) => ({ ...f, ctaEn: e.target.value }))}
            />
          </div>
          <Input
            label={t('adminSpace.banners.fields.ctaUrl')}
            value={form.ctaUrl}
            onChange={(e) => setForm((f) => ({ ...f, ctaUrl: e.target.value }))}
            placeholder="/events"
          />

          <Select
            label={t('adminSpace.fields.status')}
            value={form.isActive ? '1' : '0'}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.value === '1' }))}
            options={[
              { value: '1', label: t('adminSpace.banners.active') },
              { value: '0', label: t('adminSpace.banners.inactive') },
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('adminSpace.fields.start')}
              type="datetime-local"
              value={form.startAt}
              onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
            />
            <Input
              label={t('adminSpace.fields.end')}
              type="datetime-local"
              value={form.endAt}
              onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
            />
          </div>
          <p className="text-[11px] text-chartrons-warm-gray leading-snug">{t('adminSpace.heroSlides.datesHint')}</p>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={closeModal}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="bordeaux" className="flex-1">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
