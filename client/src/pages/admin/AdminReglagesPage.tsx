import { useState } from 'react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Card } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { loadVideoLikesEnabled, saveVideoLikesEnabled } from '../../lib/videoLikes';

/** Interrupteurs du site, fixés ici par l'administrateur (rédigé en français uniquement). */
export function AdminReglagesPage() {
  const { showToast } = useToast();
  const [likes, setLikes] = useState(loadVideoLikesEnabled);

  const toggle = () => {
    const next = saveVideoLikesEnabled(!likes);
    setLikes(next);
    showToast(next ? 'Likes activés sur les vidéos.' : 'Likes désactivés.', 'success');
  };

  return (
    <div>
      <AdminPageHeader
        title="Réglages"
        subtitle="Activez ou coupez des fonctions du site pour tous les visiteurs."
      />
      <Card className="!p-4 sm:!p-5 max-w-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-chartrons-olive-dark">Likes sur les vidéos</p>
            <p className="text-sm text-chartrons-warm-gray mt-1">
              Un bouton « J’aime » apparaît sous la vidéo de l’éditorial. Le like reste sur l’appareil de chaque visiteur.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={likes}
            aria-label="Likes sur les vidéos"
            onClick={toggle}
            className={`relative shrink-0 w-14 h-8 rounded-full transition-colors ${likes ? 'bg-chartrons-green' : 'bg-chartrons-warm-gray/40'}`}
          >
            <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${likes ? 'translate-x-6' : ''}`} />
          </button>
        </div>
        <p className="text-sm mt-3 text-chartrons-olive-dark">
          État : <strong>{likes ? 'activés' : 'désactivés'}</strong>
        </p>
      </Card>
    </div>
  );
}
