# MASTER BOOK — IDÉA CHARTRONS

Document de passation, rédigé le 07/10/2026 à la fin de la discussion « 🛠️ IDÉA CHARTRONS — ATELIER ».
Il sert de point de départ unique à la discussion suivante, **consacrée uniquement à l'exécution de la nouvelle version** (celle qui sera mise en ligne).

---

## 1. Charte de travail avec le propriétaire (à respecter en permanence)

Le propriétaire est francophone, non développeur. Il compte sur Claude pour lui simplifier les tâches.

| Règle | Application |
|---|---|
| **Réponses courtes** | La complexité est pour Claude, pas pour lui. Pas de détails techniques non demandés. Une question précise → une réponse précise (oui/non si possible). |
| **Une seule chose à la fois** | Une étape ou une question par message. |
| **Rappeler où on en est** | Terminer par un petit tableau d'état (✅ / ⏳ / ❌) pour ne pas le disperser. |
| **Clarifier avant d'agir** | Reformuler si la demande est ambiguë, sans rien ajouter à ses explications. |
| **Rien sans accord** | Aucune modification, aucun envoi, aucune mise en ligne sans son accord explicite pour **cette** étape. |
| **Guidage pas à pas** | Quand il doit cliquer : endroit exact, couleur et texte du bouton, une action par étape, attendre sa capture. |
| **Secrets** | Ne jamais afficher un mot de passe, un code ou une clé. |
| **Budget** | Surveiller le coût ; s'arrêter et demander avant de dépasser le seuil qu'il fixe. Pas d'analyses lourdes inutiles. |
| **Un seul atelier** | Une seule discussion modifie le site. Les autres peuvent poser des questions mais ne touchent pas au code. |
| **Projets séparés** | IDÉA CHARTRONS ne se mélange pas avec ses autres projets. Les outils externes (voir §2) sont fabriqués ailleurs : ne pas les construire ici. |

---

## 2. Le projet en une page (cap fixé par le propriétaire le 07/10)

- **Objet (inchangé)** : le concierge numérique du quartier des Chartrons (Bordeaux). Gratuit pour les habitants et visiteurs, sans compte ; abonnement pour les commerçants.
- **Cap** :
  1. de l'**éditorial** sur les Chartrons et Bordeaux, pour capter l'audience du quartier ;
  2. des **fonctions marketing et commerciales** pour les professionnels du quartier.
- **Outils externes** : les outils qui feront tourner l'éditorial et le marketing des pros sont **en cours de fabrication dans la discussion « STUDIO ALL »** (fabrique de contenu). IDÉA CHARTRONS devra pouvoir les **brancher plus tard**. Ne pas les fabriquer ici.
- **Abonnements** : ils seront revus, car de nouveaux services vont s'ajouter. Intention évoquée : Gratuit / Premium Pro / un palier supérieur (nom provisoire « Super Pro »), lié à la future diffusion vers Google, Facebook, Instagram, WhatsApp, TikTok. **Rien n'est décidé.**
- **Mise en ligne prochaine** : le site doit devenir **présentable**.
- **Paiement** : la version mise en ligne **n'affichera pas le paiement**, mais **tout le code de paiement doit rester en place**, pour qu'il suffise de « brancher la prise » le moment venu. **Ne jamais supprimer cette fonction.**

---

## 3. Objectifs de la nouvelle version (demandés par le propriétaire)

1. **Une seule barre de recherche** qui fait à la fois le Concierge IA et l'annuaire (le site devine : un nom de commerce → fiches ; une question → réponse du Concierge). Sur la page Brocanteurs, elle devient d'elle-même l'« IA Chineur ».
2. **Un accueil épuré, avec un maximum de place libre** pour les futurs contenus éditoriaux. Les lignes actuelles (bandeau e-mail, bandeau démo, « Vous êtes commerçant ? », événements, photo + slogan, « Sans compte », « Fiche gratuite vs Premium Pro ») sont empilées sans hiérarchie : à réorganiser. Piste validée en discussion : photo + slogan + barre de recherche ; un bloc « Aujourd'hui aux Chartrons » ; le reste en bas de page, discret.
3. **Paiement masqué, mais code conservé** (voir §2).
4. **Comprendre l'administration au quotidien** : le propriétaire aime le tableau de bord admin (« Tour de Contrôle »), mais ne sait pas comment administrer le site au jour le jour. Il faut lui fournir un mode d'emploi simple.
5. **Préparer les branchements** : prévoir dans le site les emplacements où les outils de STUDIO ALL viendront se brancher (éditorial, marketing pro), sans les construire.

**Première étape demandée** : un « bureau d'étude » qui inspecte tout le site et rassemble les bilans et actions déjà faits (ce document en est la base) avant toute modification.

---

## 4. État du site au 07/10/2026

### Fait et en ligne
| Élément | Détail |
|---|---|
| Lot 1 : honnêteté des données (PR #1) | Étiquette « Exemple » sur les contenus fictifs, bandeau « Version de démonstration », notes inventées retirées de 13 fiches rédigées à la main, compteurs de l'accueil justes (événements, professionnels réels, annonces réelles). |
| Lot 0 : sécurité, côté site (PR #2) | L'Espace Pro (Communication, Dispo maintenant) passe par des fonctions Supabase qui vérifient le code du commerce ; le code admin n'est plus inscrit dans le site, il est vérifié par la base (`idea_verify_admin`). |
| Travail d'une autre discussion (PR #3, #4) | Vérification automatique à chaque modification (`.github/workflows/ci.yml`), tests des règles métier (`npm test`), site publié branché sur Supabase (`client/.env.production`, clé publique), GitHub Pages retiré. |
| Hébergement | **Vercel** = hébergeur principal (déploiement automatique depuis `main`). Netlify : configuration présente, non utilisée. Voir `docs/DEPLOIEMENT.md`. |

### ⚠️ À vérifier en tout premier (sécurité, non confirmé)
Le code du lot 0 est en ligne, mais **les scripts Supabase n'ont pas été confirmés** :
1. `docs/sql/003a_securite_espace_pro_gardiennes.sql` exécuté dans Supabase (résultat attendu : `doit_etre_false = false`) ?
2. Code administrateur défini (table `idea_admin_access`, par le propriétaire lui-même, guidé pas à pas ; puis supprimer la requête de l'historique Supabase) ?
3. `docs/sql/003b_securite_espace_pro_fermeture.sql` exécuté (ferme les accès ouverts à tous sur `pro_contents` et `pro_campaigns`) ?

Tant que 1 et 2 ne sont pas faits : la connexion admin, l'onglet Communication et « Dispo maintenant » ne fonctionnent pas en ligne. Tant que 3 n'est pas fait : la faille reste ouverte.
Projet Supabase : organisation « idea-chartrons », projet « idea-chartrons » (eu-west-1). Les tables `ideeprod_*` de la même base appartiennent à un autre outil : **ne pas y toucher**.

### Points ouverts
- `claim_shop_access_code` reste appelable par tous, pour tout commerce qui n'a pas encore de code : à décider avec le propriétaire.
- Les téléphones, e-mails et qualifications des 13 fiches rédigées à la main (`shared/src/data/chartronsPois.ts`) ne sont pas vérifiés.
- Décisions en attente du propriétaire : prix Premium Pro (20 € ou 39 € ; un bandeau dit encore 39 €), frais de 1 € et commission Anti-Gaspi de 5 % (à garder et annoncer, ou supprimer), informations légales (association, n° RNA, responsable de publication), noms des deux pages « conciergerie ».

---

## 5. Cahier des charges de remise à niveau (28 points) — où on en est

Document complet : https://claude.ai/artifact/SAWuVPD2XBUsbHuF2A1V3C

| Lot | Contenu | État |
|---|---|---|
| 0 | Sécurité (S1 mot de passe admin, S2 lien admin public) | S1 ✅ côté site (scripts Supabase à confirmer) · S2 ⏳ |
| 1 | Honnêteté des données (D1–D8) | ✅ en ligne |
| 2 | FAQ, tarifs, mentions légales (F1–F5, L1) | ⏳ (attend les décisions du propriétaire) |
| 3 | Navigation : carte illisible, annuaire trop long, accueil sans hiérarchie, pages « conciergerie » aux noms proches, favoris en double (N1–N5) | ⏳ — recoupe les objectifs §3 |
| 4 | Esthétique : en-tête trop haut, nom coupé (« I.. » en mode admin), colonne étroite sur ordinateur (E1–E3) | ⏳ — recoupe les objectifs §3 |
| 5 | Fin du cahier initial : compteur d'impact collectif, « Chartrons Midi », suivi d'usage, spécification du Pass Quartier (C1–C4) | ⏳ |

Attention : le « Lot 2 » de la PR #3 (vérification automatique, Vercel) **n'est pas** le lot 2 de ce cahier.

---

## 6. Contexte produit (transmis par la discussion « Projet Idea Chartrons »)

- Brainstorm « Volet Pro & B2B » : 4 besoins des commerçants — administratif allégé, remplir les creux, collectif/mutualisation, fidélité mutualisée. En réserve : kit marketing auto-généré, statistiques simples, carte cadeau inter-commerces. Principes : back-office admin + pro simple, code efficace et groupé.
- « Communication PRO » (Espace Pro) : rédaction d'annonce, amélioration par IA, campagnes. Champ `channel` volontairement ouvert pour brancher plus tard des réseaux externes. **Réservée Premium Pro.**
- « Prendre la main » (admin) : bouton visible en mode admin sur chaque fiche, pour entrer dans l'Espace Pro d'un commerçant bloqué, sans toucher à son code.
- FAQ : contient la question « À quoi sert l'onglet Communication ? » et la ligne correspondante du tableau Gratuit/Premium. Ne pas l'écraser.

---

## 7. Repères techniques

- Monorepo : `client/` (site React + Vite), `shared/` (logique, données, Concierge local), `server/` (non déployé).
- Données : l'essentiel vit dans le navigateur du visiteur (`client/src/lib/localDb.ts`, passage central `client/src/lib/api.ts`) ; l'Espace Pro et « Dispo maintenant » sont dans Supabase.
- Contenus d'exemple : `isExampleContent()` (`shared/src/data/seed.ts`) ; bandeau démo désactivable avec `VITE_DEMO_NOTICE=false`.
- Vérifications avant tout envoi : `npm run build`, `npm test`, `npx tsc -p client --noEmit`.
- Documents : `docs/CAHIER-DES-CHARGES.md` (plan du 01/09), `docs/STRATEGIE-ACCUEIL.md`, `docs/DEPLOIEMENT.md`, `docs/sql/`.
- Rapport de bilan initial : https://claude.ai/artifact/2Txe2m7EZ5tWTX7e98BHVJ

---

## 8. Démarrage de la nouvelle discussion (ordre conseillé)

1. Lire ce master book et `CLAUDE.md`.
2. Vérifier avec le propriétaire, pas à pas, les 3 points Supabase du §4.
3. Bureau d'étude : inspecter le site en ligne et proposer **le plan d'exécution de la nouvelle version** (objectifs §3 + lots restants §5), découpé en étapes validables une par une.
4. Exécuter étape par étape, chacune sur une branche, avec captures avant/après et accord du propriétaire avant la mise en ligne.
