import { Link } from 'react-router-dom';
import { Badge, Card } from '../../components/ui';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';

/**
 * Mode d'emploi de l'administration. Rédigé en français uniquement :
 * le propriétaire est seul à administrer le site (voir docs/MASTERBOOK.md, charte).
 */

interface Task {
  where: string;
  to: string;
  what: string;
}

const DAILY: Task[] = [
  { where: 'Tour de Contrôle', to: '/admin', what: 'Coup d’œil sur l’activité : messages reçus, derniers événements, dépôts du Local Relais en attente.' },
  { where: 'Annonces', to: '/admin/annonces', what: 'Approuver ou retirer les annonces du quartier.' },
  { where: 'Panneau › Signalements', to: '/admin/panneau', what: 'Relire les signalements anonymes des habitants, changer leur statut (à examiner, validé, transmis, rejeté).' },
  { where: 'Panneau › Ardoises', to: '/admin/panneau', what: 'Approuver ou refuser les menus du jour des commerçants VIP avant qu’ils apparaissent en vitrine.' },
  { where: 'Local Relais', to: '/admin/relais', what: 'Suivre les dépôts, les créneaux et les QR codes du local.' },
];

const OCCASIONAL: Task[] = [
  { where: 'Agenda', to: '/admin/agenda', what: 'Ajouter, modifier ou retirer une brocante, une animation, une promo flash.' },
  { where: 'Bannières', to: '/admin/banners', what: 'Programmer le message du bandeau d’actualité (public, pros, alerte météo).' },
  { where: 'Rectangle Accueil', to: '/admin/hero', what: 'Programmer un visuel temporaire dans le grand rectangle photo de l’accueil.' },
  { where: 'Panneau › Commerces & POI', to: '/admin/panneau', what: 'Chercher, corriger ou supprimer une fiche de commerce ; la passer en Gratuit ou Premium Pro.' },
  { where: 'Panneau › Concierge IA', to: '/admin/panneau', what: 'Ajouter des consignes au Concierge (par exemple « mettre en avant la rue Notre-Dame ce week-end »).' },
  { where: 'Kit QR', to: '/admin/qr', what: 'Fabriquer un flyer A6 ou un QR code vers la vitrine, l’agenda ou le Concierge.' },
];

const SHARED: Array<{ item: string; where: 'partagé' | 'appareil'; note: string }> = [
  { item: 'Espace Pro : Communication', where: 'partagé', note: 'Enregistré dans la base Supabase, vu par tous.' },
  { item: 'Espace Pro : « Dispo maintenant »', where: 'partagé', note: 'Enregistré dans la base Supabase, vu par tous.' },
  { item: 'Codes d’accès des commerçants', where: 'partagé', note: 'Base Supabase, vérifiés côté base.' },
  { item: 'Votre code administrateur', where: 'partagé', note: 'Base Supabase (jamais écrit dans le site).' },
  { item: 'Annonces, agenda, bannières, rectangle d’accueil, fiches commerces, Local Relais, ardoises, signalements', where: 'appareil', note: 'Enregistrés dans le navigateur de l’appareil utilisé. Ce que vous modifiez ici n’est pas vu par les autres visiteurs.' },
];

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul className="divide-y divide-chartrons-beige">
      {tasks.map((task) => (
        <li key={`${task.where}-${task.what}`} className="py-3 first:pt-0 last:pb-0">
          <Link to={task.to} className="font-semibold text-chartrons-bordeaux hover:underline">
            {task.where}
          </Link>
          <p className="text-sm text-chartrons-olive-dark mt-0.5 leading-relaxed">{task.what}</p>
        </li>
      ))}
    </ul>
  );
}

export function AdminHelpPage() {
  return (
    <div className="space-y-5 max-w-3xl">
      <AdminPageHeader
        title="Mode d’emploi"
        subtitle="Comment administrer IDÉA CHARTRONS au quotidien, sans rien casser."
      />

      <Card className="!p-4 sm:!p-5 border-chartrons-brass/50 bg-chartrons-brass/10 space-y-2">
        <h2 className="font-bold text-chartrons-bordeaux">À savoir en premier</h2>
        <p className="text-sm text-chartrons-olive-dark leading-relaxed">
          Aujourd’hui, la plupart des contenus que vous modifiez ici (annonces, agenda, bannières, rectangle d’accueil, fiches
          commerces) restent enregistrés <strong>dans le navigateur de l’appareil que vous utilisez</strong>. Les autres visiteurs
          ne les voient pas. Seul l’Espace Pro (Communication, « Dispo maintenant ») est partagé. Le détail est en bas de cette page.
        </p>
      </Card>

      <Card className="!p-4 sm:!p-5 space-y-3">
        <h2 className="font-bold text-chartrons-bordeaux">1. Se connecter</h2>
        <ol className="list-decimal pl-5 space-y-1.5 text-sm text-chartrons-olive-dark leading-relaxed">
          <li>Ouvrez l’adresse du site suivie de <code className="px-1 rounded bg-chartrons-beige">/admin</code>.</li>
          <li>Saisissez votre code administrateur et validez. Le code est vérifié par la base de données ; il n’est écrit nulle part dans le site.</li>
          <li>Pour sortir : bouton « Déconnexion » en bas du menu. La connexion s’efface aussi à la fermeture de l’onglet.</li>
        </ol>
        <p className="text-xs text-chartrons-warm-gray leading-relaxed">
          Code perdu ou à changer : le changement se fait dans Supabase, pas ici. Demandez à Claude de vous guider, un clic à la fois.
        </p>
      </Card>

      <Card className="!p-4 sm:!p-5 space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-chartrons-bordeaux">2. Chaque jour (5 minutes)</h2>
          <Badge variant="olive">Routine</Badge>
        </div>
        <TaskList tasks={DAILY} />
      </Card>

      <Card className="!p-4 sm:!p-5 space-y-3">
        <h2 className="font-bold text-chartrons-bordeaux">3. Selon les besoins</h2>
        <TaskList tasks={OCCASIONAL} />
      </Card>

      <Card className="!p-4 sm:!p-5 space-y-3">
        <h2 className="font-bold text-chartrons-bordeaux">4. Aider un commerçant bloqué</h2>
        <p className="text-sm text-chartrons-olive-dark leading-relaxed">
          Connecté en administrateur, ouvrez l’annuaire : chaque fiche affiche le bouton « Prendre la main sur l’Espace Pro », qui entre dans l’Espace Pro du commerçant
          sans toucher à son code. Vous pouvez alors publier à sa place ou corriger sa fiche.
        </p>
      </Card>

      <Card className="!p-4 sm:!p-5 space-y-3 border-chartrons-brick/40">
        <h2 className="font-bold text-chartrons-brick">5. Boutons à ne pas toucher sans y penser</h2>
        <p className="text-sm text-chartrons-olive-dark leading-relaxed">
          Dans le Tour de Contrôle, en bas de page : « Injecter les commerces démo », « Purger les fiches démo » et
          « Réinitialiser les données démo ». Ils modifient toute la base de l’appareil utilisé. Une confirmation est demandée avant chaque action ;
          en cas de doute, répondez « Annuler ».
        </p>
      </Card>

      <Card className="!p-4 sm:!p-5 space-y-3">
        <h2 className="font-bold text-chartrons-bordeaux">6. Ce qui est partagé, ce qui reste sur l’appareil</h2>
        <ul className="space-y-3">
          {SHARED.map((row) => (
            <li key={row.item} className="flex items-start gap-3">
              <Badge variant={row.where === 'partagé' ? 'olive' : 'brass'}>
                {row.where === 'partagé' ? 'Partagé' : 'Cet appareil'}
              </Badge>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-chartrons-olive-dark">{row.item}</p>
                <p className="text-xs text-chartrons-warm-gray leading-relaxed">{row.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
