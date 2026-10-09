import { useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { SHARED_SYNC_EVENT, type SharedSyncDetail } from '../../lib/sharedContent';

const LABELS = { agenda: 'agenda', banners: 'bannières', hero: 'rectangle d’accueil' } as const;

/** Prévient l'administrateur que sa modification est (ou n'est pas) visible par tous les visiteurs. */
export function SharedSyncNotice() {
  const { showToast } = useToast();

  useEffect(() => {
    const onSync = (event: Event) => {
      const detail = (event as CustomEvent<SharedSyncDetail>).detail;
      const label = LABELS[detail.kind];
      if (detail.ok) {
        showToast(`Publié pour tous les visiteurs : ${label}.`, 'success');
      } else if (detail.reason === 'too-large') {
        showToast(`Non publié (${label}) : contenu trop lourd, retirez des photos.`, 'error');
      } else {
        showToast(`Non publié (${label}) : visible sur cet appareil seulement.`, 'error');
      }
    };
    window.addEventListener(SHARED_SYNC_EVENT, onSync);
    return () => window.removeEventListener(SHARED_SYNC_EVENT, onSync);
  }, [showToast]);

  return null;
}
