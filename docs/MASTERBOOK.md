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
| **Posture « bureau d'étude »** | Tout anticiper : le propriétaire doit en faire le moins possible. Claude prépare, vérifie et enchaîne lui-même (contrôles automatiques, captures avant/après, vérifications de suivi), et ne le sollicite que pour une décision ou une action que lui seul peut faire. |
| **Boucles automatiques** | Claude crée lui-même ses boucles de contrôle et de suivi (vérifier, corriger, revérifier ; rappels programmés), sans attendre qu'on le lui demande. |
| **Préférences tenues à jour** | Dès que le propriétaire demande d'inscrire une préférence, l'ajouter à cette charte (et à `CLAUDE.md`) dans la foulée. |
| **Contrôles autorisés (07/10)** | Le propriétaire autorise Claude à faire lui-même tous les contrôles en lecture seule. Pas de demande d'avis ni de permission pour cela : anticiper, et ne solliciter que pour une décision ou une action que lui seul peut faire. |
| **Pas de commentaire d'actions (07/10)** | Ne pas raconter les commandes ou outils utilisés : donner seulement les résultats et ce qui est attendu de lui. |
| **Administration en français (07/10)** | Le propriétaire est seul à administrer : l'administration reste en français, sans traduction. L'espagnol vise les pages publiques. |
| **Réponses binaires (08/10)** | Langage simple, jamais technique. Pas de reformulation de ce que le propriétaire a dit. Une seule question à la fois, de type oui/non ou A/B. Le détail n'est donné que s'il le demande. |
| **Réponses courtes et ciblées (09/10)** | Réponses courtes, centrées sur ce qui concerne directement le propriétaire. Rien de plus tant qu'il ne le demande pas. Règle permanente, à ne jamais relâcher (pas de rapports, de listes de détails ni d'explications non demandées). |
| **Trop d'information = interdit (10/10)** | Règle absolue, plus forte que toutes les autres. Un message = **une seule idée, 5 lignes maximum, une seule question** (oui/non ou A/B). Jamais de liste de détails, de numéros de demandes, d'adresses techniques ni de compte rendu des notifications automatiques (Vercel, GitHub) : Claude les traite seul et n'en parle que si elles demandent une décision du propriétaire. Le tableau d'état fait 3 lignes maximum. Le propriétaire n'est pas développeur : l'IA est là pour lui **faciliter** la tâche, jamais la compliquer. En cas de doute, dire moins. |
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

---

## 9. Avancement de l'exécution (mis à jour le 08/10/2026) — demande n° 7 **fusionnée dans `main`**, publiée par Vercel

| Étape | État |
|---|---|
| 1. Paiement masqué, code conservé (`VITE_PAYMENTS_ENABLED`, éteint par défaut) | ✅ en ligne |
| 2. Une seule barre de recherche (`classifySearchIntent`) | ✅ en ligne |
| 3. En-tête allégé (226 px → 124 px sur mobile) | ✅ en ligne |
| 4. Accueil épuré (« Aujourd'hui aux Chartrons », liens en bas) | ✅ en ligne |
| 5. Emplacements STUDIO ALL (`docs/BRANCHEMENT-STUDIO-ALL.md`) | ✅ en ligne |
| 6. Mode d'emploi de l'administration (page `/admin/aide`, en français) | ✅ en ligne |
| 7. Navigation (noms des 2 pages « conciergerie », favoris en double) | ✅ en ligne (09/10) |
| 8. FAQ, tarifs, mentions légales, traduction espagnole des pages publiques restantes (fidélité, légal) | ⏳ préparée sur la branche `claude/etape-8` (demande en brouillon), pas en ligne. Prix et commission 5 % retirés des textes (« à définir ») : la stratégie des prix se travaille plus tard, sans bloquer la construction. FAQ, tableau gratuit/Premium, conditions d'utilisation et fidélité traduits en espagnol. |

Constats à traiter : lien « Espace admin » visible dans le pied de page (S2) ; traduction espagnole incomplète (463 textes sur 1385, surtout administration et Espace Pro, laissés en français volontairement).

### Constat important de l'étape 6 : l'administration n'est pas partagée
Annonces, agenda, bannières, rectangle d'accueil, fiches commerces, Local Relais, ardoises et signalements sont enregistrés dans le navigateur de l'appareil utilisé (`localStorage`, voir `client/src/lib/localDb.ts`). **Ce que le propriétaire modifie dans l'administration n'est pas vu par les autres visiteurs.** Seuls l'Espace Pro (Communication, « Dispo maintenant »), les codes d'accès commerçants et le code administrateur sont dans Supabase.
Conséquence : pour administrer réellement le site en ligne, ces contenus devront être déplacés dans Supabase. À décider avec le propriétaire (étape à ajouter au plan).

### Décisions du propriétaire (07/10/2026)
- Objectif : **partir sur un site vierge** (aucun contenu inventé), en gardant les vraies bases de données (annuaire de 375 fiches, carte, patrimoine, textes) et en remettant tous les pros en gratuit.
- Événements récurrents (Marché des Chartrons, Puces du dimanche, Brocante du Cours Portal) : gardés, sans photo, à vérifier.
- Les fiches rédigées à la main (13) perdent téléphone, e-mail, horaires, carte, photo, qualifications et abonnement tant qu'ils ne sont pas vérifiés.
- Lien « Espace admin » retiré du pied de page ; accès par `/admin`.
- Éditeur : **Association loi 1901 A.I.D.É.S (Association Interactive à Double Éco-Système), 26 place Jean Jacques Rabaud, 33000 Bordeaux, RNA W332029621, SIREN 887 494 813** (affiché en pied de page). Responsable de publication : Laïssaoui ALL.
- Prix de Premium Pro : **en réflexion**, à décider après la cartographie usagers / pros.
- Administration partagée : en pause, à décider après la cartographie.
- Ordre convenu : nettoyage → cartographie des fonctions usagers / pros → gratuit et payant → éditorial.

### Cartographie des fonctions
`docs/CARTOGRAPHIE-FONCTIONS.md` (08/10/2026) : 22 fonctions usagers, 17 fonctions pros, 6 constats (dont : Communication Pro sans lecteur public, réservations non transmises aux commerçants, code d'accès commerce réclamable par tous), pistes pour le gratuit / payant.
- Bandeau « Version de démonstration » : **conservé** (option A) tant que les publications des visiteurs ne sont pas partagées.
- Fusion de la demande n° 7 dans `main` : **autorisée par le propriétaire** le 08/10/2026.

### Point de reprise (08/10/2026)
- **En ligne** (fusion n° 7 du 08/10) : étapes 1 à 6, site vierge (aucun contenu inventé, tous les pros en gratuit, 375 fiches réelles), association A.I.D.É.S affichée en pied de page.
- **Supabase nettoyé le 08/10/2026** : les 10 commerces de test (`acteur-1` à `acteur-10`) et les 2 signaux « Dispo maintenant » de test ont été supprimés ; `pro_contents` et `pro_campaigns` étaient déjà vides. La base ne contient plus que le code administrateur (`idea_admin_access`) et les tables de l'autre outil (`ideeprod_*`, à ne pas toucher).
- **À décider** : frontière gratuit / payant (voir `docs/CARTOGRAPHIE-FONCTIONS.md`), prix de Premium Pro, frais de 1 € et commission Anti-Gaspi 5 %, noms des deux pages « conciergerie », administration partagée dans Supabase (agenda, bannières, rectangle d'accueil), sécurisation de `claim_shop_access_code`, vérification des 13 fiches rédigées à la main.
- **Prochaines étapes côté code** : étape 7 (navigation : noms des pages, favoris en double), étape 8 (FAQ, tarifs, mentions légales, espagnol des pages publiques restantes), lien « Espace admin » désormais absent du pied de page (accès par `/admin`).
- Piège rencontré : ne jamais enchaîner commit et push après une compilation en échec (commande `;` au lieu de `&&`).

### Boucle de contrôle de la recherche IA (09/10/2026)
- **Incident** : depuis l'étape 2, 14 demandes de pros sur 24 (« un plombier », « coiffeur », « boulangerie ouverte »…) partaient vers l'annuaire au lieu du Concierge IA. Cause : règle de décision trop favorable à l'annuaire. **Réparé** : le Concierge IA est le chemin par défaut ; l'annuaire n'est choisi que pour un nom de commerce précis. Deux sorties de secours : lien « Voir aussi dans l'annuaire » dans le panneau du Concierge, bouton « Demander au Concierge IA » sur la page de résultats.
- **Boucle à rejouer avant toute mise en ligne** : (1) `npm test` (tests « recherche IA » : 17 demandes de pros doivent aller au Concierge et trouver au moins un professionnel) ; (2) essai dans le navigateur de 15 demandes de pros, qui doivent toutes ouvrir le panneau du Concierge avec des résultats ; (3) si un échec apparaît : corriger, puis recommencer au (1) jusqu'à 0 échec.
- **Règle** : la recherche IA ne doit jamais être supprimée ni masquée. Toute modification de la barre de recherche rejoue cette boucle.


- **Recherche IA confirmée en ligne par le propriétaire (09/10/2026)** après la fusion de la demande n° 10. Tests plus poussés prévus une fois l'ensemble en ligne.
- **À trancher plus tard (adresse)** : l'adresse du Local Relais s'écrit « Jaques » dans le site (10 occurrences) ; l'adresse officielle de l'association est « Jacques ».

### Administration partagée — tranche 1 (09/10/2026, préparée, pas en ligne)
- **Quoi** : agenda, bannières et rectangle d'accueil modifiés dans l'administration sont enregistrés dans Supabase (table `idea_shared_content`) et vus par tous les visiteurs. Le reste (fiches commerces, Local Relais, signalements) reste local : tranches suivantes.
- **Sécurité** : lecture publique ; écriture uniquement par la fonction `idea_admin_save_content`, qui vérifie le code administrateur côté base.
- **Script à exécuter dans Supabase** : `docs/sql/004_contenus_partages.sql` (par le propriétaire, guidé pas à pas) ; tant qu'il n'est pas exécuté, le site garde son fonctionnement actuel.
- **Contrôles faits** : compilation, 21 tests, types, essais navigateur simulés (visiteur voit le contenu partagé ; table absente = accueil normal ; modification admin envoie le contenu avec le code).
- **Tarifs (09/10/2026)** : le propriétaire fixe lui-même le prix du Premium Pro (mensuel et annuel) dans l'administration, page « Tarifs » ; case vide = « à définir » sur le site. Affiché dans le tableau Gratuit / Premium Pro de la FAQ. Enregistré avec le contenu partagé (script `docs/sql/004_contenus_partages.sql`, qui inclut maintenant les tarifs). Le code de paiement n'est pas modifié.

- **Script Supabase exécuté (09/10/2026)** : `docs/sql/004_contenus_partages.sql` passé par le propriétaire, résultat « Success », contrôle = 0 ligne (attendu). La table `idea_shared_content` et la fonction `idea_admin_save_content` existent.
- **Reste à faire** : test sur le vrai site (ajouter un événement bidon dans l'agenda de l'administration, le voir depuis un autre appareil, puis le supprimer). Reporté par le propriétaire.
- **Décision du propriétaire (09/10/2026)** : vérification du site en ligne (adresse probable `idea-chartrons.vercel.app`, contrôle de la ligne « A.I.D.É.S » en pied de page) et réglages Supabase / Vercel **reportés à la prise en main** du site. Pas d'urgence.

- **Espace éditorial (décision du propriétaire, 09/10/2026)** : format **vidéo**, placé dans la **zone vide à gauche de l'accueil** (grand écran), au-dessus du contenu sur téléphone ; orientation **automatique** (vertical ou horizontal). Contenu fabriqué par STUDIO ALL, branchement ultérieur. Emplacement préparé (champ `videoUrl`), vidéo d'essai visible seulement avec `?apercu=video`. **Demande du propriétaire** : pouvoir « liker » les vidéos ; en attente de décision sur le mode de stockage des likes.
- **Likes sur les vidéos (09/10/2026, préparés, pas en ligne)** : choix du propriétaire = like **sur l'appareil** (pas de compteur partagé) avec un **interrupteur dans l'administration** (page « Réglages », éteint par défaut). L'état de l'interrupteur est partagé via Supabase : **script à exécuter par le propriétaire, guidé pas à pas : `docs/sql/005_reglages_partages.sql`** (après le 004). Tant qu'il n'est pas exécuté, l'interrupteur ne s'enregistre pas pour les autres visiteurs. Compteur partagé : possible plus tard (nouvelle table).

### Publications partagées — tranche 2 (10/10/2026, préparée, pas en ligne)
- **Quoi** : les annonces des habitants et les offres Anti-Gaspi sont enregistrées dans Supabase (table `idea_shared_posts`) et vues de tous.
- **Règles décidées par le propriétaire** : les **annonces sont validées par lui avant publication** ; les **offres Anti-Gaspi sont publiées tout de suite** (sans validation, avec téléphone et fin de validité). **Menus du jour des commerçants : publiés sans validation** (décision du 10/10).
- **Sécurité** : lecture publique seulement de ce qui n'est pas en attente ; l'auteur retire ou clôt sa publication grâce à une clé gardée sur son appareil ; l'administrateur voit tout et agit avec son code (vérifié par la base).
- **Script à exécuter par le propriétaire, guidé pas à pas : `docs/sql/006_publications_partagees.sql`** (après le 004). Tant qu'il n'est pas exécuté, le site garde son fonctionnement actuel.
- **Reste** : Local Relais non partagé (dépend de créneaux) ; le bandeau « Version de démonstration » reste tant que le Local Relais n'est pas partagé.
- **Contrôles** : compilation, 25 tests, types, essai navigateur avec faux serveur (une offre Anti-Gaspi publiée par un visiteur est vue par un autre).

### Politique de modération (décision du propriétaire, 10/10/2026)
- **À contrôler en priorité par le propriétaire** : la partie éditoriale, l'agenda, la vie de quartier, et les **annonces entre particuliers** (pour contrer les ventes illicites).
- **Sans validation** : offres Anti-Gaspi et menus du jour des commerçants. Raison : le commerçant n'a aucun intérêt à mal publier, et le propriétaire n'a pas le temps de tout gérer.
- **Premium Pro** : le professionnel signe et valide son abonnement ; les **engagements de chacun** y seront inscrits (conditions à rédiger avec le propriétaire).
- **Plus tard** : filtre automatique de mots et expressions interdits.
- **Pour les nouveaux développements** : toute nouvelle publication de visiteur ou de pro suit cette politique (validation seulement pour l'éditorial, l'agenda, la vie de quartier et les annonces de particuliers).

### Local Relais partagé + bandeau — tranche 3 (10/10/2026, préparée, pas en ligne)
- **Quoi** : dépôts, places des créneaux et retraits du Local Relais enregistrés dans Supabase (table `idea_shared_relais`) ; horaires, capacité et créneaux bloqués fixés par l'administrateur et partagés (contenu partagé « relais »).
- **Sécurité** : le code de retrait n'est jamais lisible publiquement (seuls le déposant, la personne qui réserve le retrait et l'administrateur le reçoivent) ; seul l'auteur d'une publication peut la déposer ; les places sont comptées par la base.
- **Bandeau « Version de démonstration »** retiré du site. Une petite mention reste sur les formulaires encore enregistrés sur l'appareil (signalements civiques, pépites des brocanteurs).
- **Script à exécuter par le propriétaire, guidé pas à pas : `docs/sql/007_local_relais_partage.sql`** (après 004 et 006). Tant qu'il n'est pas exécuté, le Local Relais garde son fonctionnement local.
- **Contrôles** : compilation, 27 tests, types, essai navigateur avec faux serveur (dépôt partagé visible, code caché, réservation du retrait, code reçu par la personne qui réserve).
