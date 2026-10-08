import { useTranslation } from 'react-i18next';
import { SHOW_DEMO_NOTICE } from '../config/demo';
import { PAYMENTS_ENABLED } from '../config/payments';

/** Bandeau discret rappelant que le site est une démonstration (contenus d'exemple, paiements simulés). */
export function DemoNotice({ className = 'mb-4' }: { className?: string }) {
  const { t } = useTranslation();
  if (!SHOW_DEMO_NOTICE) return null;
  return (
    <p
      role="note"
      className={`${className} rounded-xl bg-chartrons-beige/70 ring-1 ring-chartrons-sand/50 px-3 py-2 text-[11px] leading-snug text-chartrons-warm-gray`}
    >
      {t(PAYMENTS_ENABLED ? 'demo.notice' : 'demo.noticeNoPayments')}
    </p>
  );
}

/** Mention « paiement simulé » affichée sur les écrans de paiement pendant la démonstration. */
export function SimulatedPaymentNotice({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  if (!SHOW_DEMO_NOTICE) return null;
  return (
    <p role="note" className={`text-[11px] font-medium text-chartrons-bordeaux ${className}`}>
      {t('demo.paymentSimulated')}
    </p>
  );
}

/** Mention rappelant qu'en démonstration une publication reste sur l'appareil. */
export function LocalPublishNotice({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  if (!SHOW_DEMO_NOTICE) return null;
  return <p className={`text-[11px] text-chartrons-warm-gray ${className}`}>{t('demo.publishNotice')}</p>;
}
