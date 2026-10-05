# Déploiement

Le dépôt contient trois configurations de déploiement du site (`client/dist`) :

| Hébergeur | Fichier | État constaté |
|---|---|---|
| Vercel | `vercel.json` | Relié au dépôt Git depuis le commit d7ed98c (déploiement automatique). |
| Netlify | `netlify.toml` | Configuration présente ; utilisation actuelle non vérifiée. |
| GitHub Pages | branche `gh-pages` | **Retiré le 05/10/2026** : l'ancienne copie (18/08, avec l'ancien code admin) est remplacée par une redirection vers Vercel. Script `npm run deploy` supprimé. |

Les en-têtes de sécurité de Vercel sont alignés sur ceux de Netlify
(`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).

À décider : garder un seul hébergeur (Vercel semble être le principal) et retirer les
deux autres configurations, pour éviter qu'une ancienne version reste en ligne.

## Vérification automatique

`.github/workflows/ci.yml` construit `shared`, `server` et `client` à chaque pull request
et à chaque push sur `main`. Une erreur de type TypeScript fait échouer la vérification.
