import { useTranslation } from 'react-i18next';
import { isExampleContent } from '@idea-chartrons/shared';

interface ExampleBadgeProps {
  item: { id?: string; isDemo?: boolean } | null | undefined;
  className?: string;
}

/** Pastille « Exemple » affichée à côté d'un contenu fictif livré pour la démonstration. */
export function ExampleBadge({ item, className = '' }: ExampleBadgeProps) {
  const { t } = useTranslation();
  if (!isExampleContent(item)) return null;
  return (
    <span
      title={t('demo.exampleTitle')}
      className={`inline-flex items-center align-middle px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-chartrons-beige text-chartrons-warm-gray ring-1 ring-chartrons-sand/60 ${className}`}
    >
      {t('demo.exampleBadge')}
    </span>
  );
}
