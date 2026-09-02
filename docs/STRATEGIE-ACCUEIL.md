# IDÉA CHARTRONS — Clarifier la promesse et hiérarchiser les fonctionnalités

Document de travail. Basé sur une lecture complète du code (README, i18n, routes, composants) au 1er septembre 2026.

## 1. Diagnostic en une phrase

Le produit fait beaucoup de choses utiles, mais l'accueil ne dit pas laquelle est la raison de venir : le texte d'accueil actuel ("Découvrez les annonces, l'annuaire, la carte et les événements") ne couvre qu'un tiers des fonctionnalités réelles, et 12 raccourcis de même poids visuel se disputent l'attention sans hiérarchie.

## 2. Positionnement proposé

Trois options de phrase d'accroche, à choisir une seule et à répéter partout (titre PWA, balise meta, header, futurs supports imprimés) :

| Option | Accroche | Sous-titre |
|---|---|---|
| A — recommandé | **Le concierge de votre quartier.** | Trouvez un commerce, une bonne affaire anti-gaspi, un coup de main entre voisins — gratuit, sans compte, rien qu'aux Chartrons. |
| B | **Chartrons, en direct.** | Ce qui se passe, se donne, se vend et s'organise dans votre quartier, en temps réel. |
| C | **Votre quartier vous répond.** | Posez une question, trouvez une bonne affaire, donnez un coup de main — tout Chartrons, en un seul endroit. |

L'option A est recommandée : elle nomme la fonctionnalité la plus différenciante (le Concierge IA, qui n'existe nulle part ailleurs) au lieu de rester générique, tout en citant deux bénéfices concrets et récents (anti-gaspi, entraide).

## 3. Nouveau texte d'accueil (hero)

Remplacer, dans `client/src/i18n/index.ts` (clés `home.welcome` / `home.description`, FR et EN) :

- Actuel : *« Bienvenue dans votre quartier — Découvrez les annonces, l'annuaire, la carte et les événements du quartier des Chartrons. »*
- Proposé : *« Le concierge de votre quartier — Trouvez un commerce, une bonne affaire anti-gaspi, un coup de main entre voisins, ou récupérez un objet au Local Relais. Gratuit, sans compte. »*

Ajouter juste sous la barre de recherche un second point d'entrée visuellement distinct : **« Vous êtes commerçant ? Référencez votre commerce → »**, qui manque aujourd'hui sur la page d'accueil (le seul lien vers l'espace Pro est actuellement caché dans la page Acteurs, via `to="/pro?tab=kit"`).

## 4. Hiérarchie des fonctionnalités

### Niveau 1 — Cœur du produit (accueil + navigation principale)

| Fonctionnalité | Pourquoi niveau 1 |
|---|---|
| Concierge IA (barre de recherche unifiée) | Porte d'entrée vers tout le reste, seule fonctionnalité vraiment différenciante |
| Annonces & Entraide | Cœur communautaire, génère du retour régulier |
| Anti-Gaspi | Valeur immédiate et tangible (économie réelle), différenciant, sujet d'actualité |
| Commerces & Carte (annuaire + carte fusionnés) | Utilité quotidienne, forte volumétrie (362 adresses) |
| Agenda (brocantes, événements) | Rythme le retour sur le site (rendez-vous récurrents) |

*Point d'arbitrage : les Brocanteurs peuvent soit rester un 6e onglet dédié (si l'association veut en faire une identité forte et autonome), soit devenir un filtre à l'intérieur de « Commerces » pour garder une navigation à 5 entrées maximum — recommandation UX mobile standard. À trancher selon votre priorité stratégique.*

### Niveau 2 — Accessible en 1-2 clics, pas dans la barre de navigation

- **Local Relais** — à intégrer directement dans le parcours de création d'annonce plutôt que de rester une page isolée (voir §6)
- **Carnet** (points, impact personnel, favoris)
- **Découvrir / Parcours patrimoine**
- **Infos pratiques**
- **Espace Pro** (avec un vrai point d'entrée visible, voir §3)

### Niveau 3 — Toujours accessible, mais en pied de page / discret

- Signalements civiques
- Urgences & évacuation
- FAQ / CGV
- Dashboard admin

## 5. Constats techniques qui expliquent la confusion actuelle

Vérifiés directement dans le code :

- Le **Local Relais** (`/relais`) n'est plus lié ni dans le menu du bas (`BottomNav.tsx`) ni dans les raccourcis d'accueil (`HomePage.tsx`) : il n'est atteignable que via une alerte de retrait (`PickupAlert`) ou le Mode Confort. Un nouveau visiteur ne peut pas le découvrir.
- L'**Espace Pro** (`/pro`) n'a qu'un seul lien d'accès dans toute l'application, caché dans la page Acteurs (`ActeursPage.tsx`, ligne 126).
- Le compteur d'impact (`LocalImpactCards.tsx`) existe déjà et fonctionne, mais reste **strictement individuel** et **caché dans le Carnet** — il n'est jamais montré sur l'accueil, alors qu'il pourrait créer un sentiment d'appartenance collective (voir §6).
- La page d'accueil propose 12 raccourcis de poids visuel identique (`ctaLinks` dans `HomePage.tsx`), sans hiérarchie ni regroupement par intention d'usage.

## 6. Force de proposition — augmenter la valeur d'usage

### Pour les habitants

1. **Compteur d'impact collectif sur l'accueil** — extension du calcul déjà existant dans `localImpact.ts` (aujourd'hui limité au Carnet individuel), agrégé pour tout le quartier : *« 340 kg de nourriture sauvés, 128 objets recirculés, 512 km parcourus à pied ce mois-ci aux Chartrons »*. Effort de développement faible (la logique de calcul existe déjà), impact fort sur le sentiment d'appartenance.
2. **Rattacher le Local Relais au parcours de création d'annonce** : proposer « Déposer au Local Relais » comme option au moment où l'habitant publie un don, plutôt que de laisser cette fonctionnalité orpheline.
3. **Digest hebdomadaire optionnel** (« Cette semaine aux Chartrons ») — envoyé par e-mail ou WhatsApp à qui laisse une adresse volontairement (pas de compte requis), reprenant les annonces marquantes, l'anti-gaspi du jour et l'agenda du week-end. C'est aujourd'hui la seule chose qui manque pour créer une habitude de retour, en l'absence de notifications push natives.
4. **Une action géolocalisée en tête d'accueil** : *« 3 bonnes affaires anti-gaspi à moins de 5 minutes à pied »* — rend l'accueil immédiatement actionnable au lieu d'une liste plate de 12 liens.
5. **Rappel automatique de retrait** au Local Relais après quelques jours sans venue, en extension du `PickupAlert` déjà existant.

### Pour les commerçants

1. **Un vrai point d'entrée « Espace Pro » sur l'accueil**, visible dès la première visite — condition nécessaire pour que les commerçants découvrent l'offre sans qu'on leur en parle de vive voix.
2. **Formulaire d'inscription en 3 champs** (nom, adresse, catégorie) mis en avant visuellement, pas seulement décrit en FAQ.
3. **Mini-tutoriel du kit QR** (fonctionnalité très récente et pertinente) : 3 étapes illustrées — *générer, imprimer, coller en vitrine* — pour que les commerçants comprennent immédiatement comment ça ramène des clients vers l'application.
4. **Aperçu grisé des fonctionnalités Premium** pour un commerce en offre gratuite (Click & Collect, ardoise du jour visibles mais désactivés avec un bouton « Débloquer ») — transforme un argument aujourd'hui seulement textuel (FAQ) en levier de conversion visuel.
5. **Statistiques simples pour les abonnés Premium Pro** (vues de la fiche, scans du QR, points fidélité distribués) — justifie la valeur de l'abonnement dans la durée et encourage le renouvellement.

### Transverse

1. **Un onboarding léger au premier lancement** (2-3 écrans, 20 secondes) présentant les 4 piliers retenus en niveau 1 — comble l'absence actuelle d'explication du produit à la première visite.
2. **Une seule phrase d'identité**, choisie en §2, répétée partout (PWA, meta description, header, futurs flyers imprimés) pour ancrer la mémorisation.

## 7. Priorisation

**Gains rapides, effort faible** (texte + réorganisation, pas de nouvelle logique métier) :
- Nouveau texte d'accueil (§3)
- Réorganisation des raccourcis d'accueil par hiérarchie (§4)
- Lien visible vers l'Espace Pro
- Rattacher le Local Relais au flux de création d'annonce

**Valeur ajoutée, effort moyen** (réutilisent une logique déjà existante) :
- Compteur d'impact collectif (extension de `localImpact.ts`)
- Mini-tutoriel du kit QR
- Aperçu grisé des fonctionnalités Premium

**Chantiers plus lourds** :
- Digest hebdomadaire par e-mail/WhatsApp
- Statistiques pour les commerçants Premium
- Onboarding guidé au premier lancement

---

## 8. Diversifier au-delà de l'abonnement Premium Pro

Non, l'abonnement commerçant n'est pas la seule voie. Pistes concrètes, compatibles avec le positionnement associatif « sans publicité intrusive, sans commission sur les annonces » déjà affiché en FAQ :

- **Carte cadeau numérique inter-commerces** — un bon d'achat utilisable chez plusieurs commerçants du quartier. Petite commission sur l'émission (pas sur chaque vente), et ça fédère les commerçants entre eux plutôt que de les mettre en concurrence.
- **Mise en avant ponctuelle payante, à l'unité** — booster une annonce (habitant) ou un événement de l'agenda (commerçant) pendant 48h, sans engagement d'abonnement. Complète le Premium Pro sans le remplacer, pour ceux qui ne veulent pas s'engager à l'année.
- **Subvention publique / associative** — en tant que plateforme portée par une association et présentée comme un « bien commun numérique », IDÉA CHARTRONS est éligible aux dispositifs de budget participatif ou de subvention de quartier (Bordeaux Métropole, mairie de quartier, fondations locales). C'est une source de financement qui ne dépend d'aucun utilisateur payant.
- **Licence en marque blanche** — le code est déjà générique (monorepo, données de quartier séparées dans `shared/src/data/`). Rien n'empêche de dupliquer la plateforme pour un autre quartier ou une autre ville, avec un abonnement B2B versé par l'association qui l'adopte. C'est le levier à plus fort potentiel si le concept fait ses preuves aux Chartrons.
- **Rapport d'activité pour les commerçants ou la mairie** — statistiques anonymisées et agrégées (fréquentation par catégorie, tendances de l'anti-gaspi, activité de l'annuaire), vendues comme un rapport périodique plutôt qu'un accès permanent.
- **Journal de quartier imprimé**, trimestriel, financé par des encarts commerçants — touche aussi les habitants non connectés et renforce l'ancrage physique de la marque.

## 9. Faut-il connecter le Concierge à OpenAI ?

Un fait vérifié dans le code, important pour la décision : **le site en ligne actuel n'appelle déjà pas OpenAI**. Le `vercel.json` ne construit que le client statique (`npm run build:client` → `client/dist`) ; il n'y a pas de dossier `api/` pour des fonctions serverless Vercel, et le serveur Express (`server/`) n'est pas déployé. Le code du Concierge (`client/src/services/concierge.ts`) essaie bien d'appeler `/api/concierge`, mais cet appel échoue silencieusement sur le site en ligne et retombe systématiquement sur le **moteur local** (`shared/src/logic/concierge.ts` + `conciergeEngine.ts`, plus de 2 100 lignes) — qui gère déjà l'analyse de la question, le classement des commerces, les budgets estimés, les notes patrimoine, un moteur de recettes/panier, et tout ça en sept langues. Ce n'est pas un simple mode dégradé : c'est un vrai moteur, déjà en production, gratuit à faire tourner.

Donc la vraie question n'est pas « ai-je une IA qui mérite OpenAI », mais « qu'est-ce qu'un vrai modèle ajouterait à ce qui tourne déjà, et à quel coût » :

- **Ce qu'OpenAI apporterait** : plus de souplesse sur les questions inhabituelles ou mal formulées que le moteur à règles ne reconnaît pas, une formulation plus naturelle en conversation libre, moins de maintenance à chaque fois qu'il faut ajouter une nouvelle façon de poser une question.
- **Ce que ça coûte** : une facture d'API qui grimpe avec l'usage réel (donc difficile à prévoir avant d'avoir du trafic), et il faut faire tourner le serveur quelque part en continu (le `server/` actuel n'est pas déployé — il faudrait soit le convertir en fonctions serverless Vercel, soit l'héberger ailleurs), ce qui ajoute un coût et une pièce technique à maintenir.

**Ma recommandation** : ne pas brancher OpenAI par principe, comme un badge « vraie IA ». Le moteur local est déjà solide et gratuit. La bonne approche est hybride et progressive : garder le moteur local comme réponse par défaut (rapide, gratuite, déjà en place), et n'activer l'appel à OpenAI que pour les cas où le moteur local signale explicitement qu'il n'a pas compris la question ou n'a rien trouvé — une escalade ciblée plutôt qu'un remplacement complet. Cela limite fortement la facture tout en gardant l'avantage d'un vrai modèle sur les cas difficiles. Avant d'investir là-dedans, il serait utile d'abord de regarder, une fois le trafic réel en place, combien de questions posées au Concierge le moteur local échoue réellement à traiter — c'est cette donnée qui devrait trancher, pas une impression.
