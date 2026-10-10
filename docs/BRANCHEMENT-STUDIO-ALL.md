# Branchement des outils de STUDIO ALL

IDÉA CHARTRONS **ne fabrique pas** les contenus éditoriaux ni les outils marketing des professionnels : ils sont produits dans le projet « STUDIO ALL ». Le site prévoit seulement **trois emplacements** qui s'affichent dès qu'un flux de contenus est branché, et restent invisibles sinon.

## Où sont les emplacements

| Emplacement (`slot`) | Où il s'affiche | Titre affiché |
|---|---|---|
| `editorial` | Accueil, juste sous la photo et le slogan | « À la une du quartier » |
| `proSpotlight` | Accueil, sous « Aujourd'hui aux Chartrons » | « Offres des pros du quartier » |
| `proTools` | Espace Pro, en bas de la page | « Outils pour votre commerce » |

Chaque emplacement montre au plus **5 éléments**. Tant que le flux est vide, absent ou en erreur, l'emplacement n'apparaît pas et le site fonctionne normalement.

## Comment brancher

1. STUDIO ALL publie un fichier JSON à une adresse publique (https).
2. Dans l'hébergeur (Vercel), ajouter la variable d'environnement `VITE_STUDIO_FEED_URL` avec cette adresse, puis redéployer.
3. Le serveur qui héberge le JSON doit autoriser le site (en-tête `Access-Control-Allow-Origin`).

Pour débrancher : supprimer la variable et redéployer.

## Format du flux

```json
{
  "editorial": [
    {
      "id": "chartrons-chai-galerie",
      "label": "Éditorial",
      "title": "Les Chartrons, de chai en galerie",
      "summary": "Petite histoire d'un quartier qui a su se réinventer.",
      "url": "/decouvrir",
      "imageUrl": "https://exemple.fr/photo.jpg",
      "publishedAt": "2026-10-07T08:00:00Z"
    }
  ],
  "proSpotlight": [ { "title": "Menu du jour à 14 €", "url": "https://exemple.fr/menu" } ],
  "proTools": [ { "title": "Kit affiche vitrine", "summary": "À imprimer" } ]
}
```

- `title` est obligatoire ; sans titre, l'élément est ignoré.
- `url` : chemin interne du site (`/decouvrir`) ou adresse `http(s)`. Tout autre lien (`javascript:`, `//autre-site`) est supprimé.
- `imageUrl` : adresse `http(s)` uniquement.
- `videoUrl` (éditorial seulement) : adresse `http(s)` d'une vidéo. La première vidéo du flux s'affiche **dans la zone à gauche de l'accueil** sur grand écran (elle reste visible au défilement), et dans la page sur téléphone. Format vertical ou horizontal : automatique. Contrôle sans STUDIO ALL : ajouter `?apercu=video` à l'adresse du site pour voir une vidéo d'essai (`client/public/demo-editorial.mp4`).
- Textes limités : titre 120 caractères, résumé 280, étiquette 30. Aucun HTML n'est interprété.

## Où est le code

- Contrat et validation : `shared/src/logic/studioFeed.ts` (testé dans `shared/test/logic.test.ts`).
- Lecture du flux : `client/src/lib/studioFeed.ts` (délai maximal 5 s, aucune erreur visible).
- Affichage : `client/src/components/StudioSlot.tsx`, placé dans `HomePage.tsx` et `ProDashboardPage.tsx`.
