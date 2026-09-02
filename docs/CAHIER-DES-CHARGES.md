# Cahier des charges — Consolidation IDÉA CHARTRONS

Document de synthèse et de pilotage, issu du travail de réflexion mené (voir `docs/STRATEGIE-ACCUEIL.md` pour le détail argumenté). Ce document fige les décisions prises et ordonne les étapes. La phase de réflexion ouverte est close ; ce qui suit est un plan d'exécution, pas un nouveau brainstorm.

## 1. Objectif (le pourquoi)

IDÉA CHARTRONS a déjà beaucoup de fonctionnalités construites, mais leur promesse n'est pas assez claire et leur hiérarchie n'est pas organisée. L'objectif n'est **pas** d'ajouter de nouveaux modules, mais de :

- rendre lisible ce qui existe déjà (socle),
- combler les quelques manques concrets identifiés (accueil, Local Relais orphelin, Espace Pro caché),
- exploiter des atouts réels du quartier (flux touristique Airbnb, carrefour de passage physique, rotation étudiante, activité de restauration à midi) avec des moyens proportionnés,
- garder une plateforme évolutive plutôt que disproportionnée : chaque nouvel ajout doit, autant que possible, réutiliser une brique déjà codée plutôt qu'empiler une nouvelle couche.

Fil conducteur : cohérence avec l'esprit "quartier village" — s'adresser à tous ceux qui sont physiquement présents dans le quartier (habitants, étudiants, salariés, visiteurs Airbnb), pas seulement aux résidents au sens strict.

## 2. État du socle — ce qui est codé, ce qui ne l'est pas

| Élément | État | Action requise |
|---|---|---|
| Concierge IA (moteur local) | Codé, en production | Aucune — surveiller l'usage réel avant d'envisager OpenAI (voir §5) |
| Annonces & Entraide (dons, ventes, services, petits boulots) | Codé | Aucune — la catégorie "petits boulots" existe déjà pour les stages/jobs étudiants |
| Anti-Gaspi | Codé | Aucune |
| Commerces & Carte, Brocanteurs | Codé | Arbitrage à trancher : onglet séparé ou fusionné dans "Commerces" (voir §4, étape 2) |
| Agenda | Codé | Aucune |
| Local Relais | Codé, mais **orphelin** : plus lié ni dans la nav ni dans l'accueil | Réintégration dans le parcours (voir §4, étape 4) |
| Carnet / impact personnel | Codé, mais strictement individuel | Extension en compteur collectif (voir §4, étape 3) |
| Espace Pro | Codé, mais un seul lien caché dans la page Acteurs | Ajouter un point d'entrée visible (voir §4, étape 5) |
| Kit QR commerçant | Codé (fonctionnalité récente) | Pas de nouveau code — nouveaux usages (vitrine physique, Airbnb) |
| Texte d'accueil / hiérarchie des raccourcis | Non conforme à la nouvelle stratégie | À réécrire (voir §4, étape 1) |
| "Pass Quartier" (accès basé sur la présence, pas la résidence) | **Nouveau concept, non codé** | À spécifier précisément avant tout développement (voir §4, étape 8) |
| Module "Chartrons Midi" | **Nouveau, non codé** | Développement léger, réutilise les données d'ardoise existantes (voir §4, étape 6) |
| Vitrine physique multilingue + QR | Hors code | Exécution terrain (voir §4, étape 7) |
| Tarif Premium Pro | Décidé : 20 €/mois, tarif associatif | À refléter dans le contenu de l'app (FAQ, page Pro) (voir §4, étape 5) |

## 3. Ce qui reste au stade d'idée, non engagé maintenant

Pour ne pas construire une plateforme disproportionnée, les pistes suivantes, évoquées pendant la réflexion, sont **mises de côté pour l'instant** — ni rejetées, ni engagées :

- Connexion réelle à OpenAI (le moteur local suffit tant que l'usage réel ne prouve pas ses limites)
- Digest hebdomadaire par e-mail/WhatsApp
- Statistiques d'usage pour les commerçants Premium
- Onboarding guidé au premier lancement
- Carte cadeau numérique inter-commerces
- Licence en marque blanche pour d'autres quartiers
- Subvention publique / associative
- Rapport d'activité anonymisé, journal de quartier imprimé
- Partenariat avec des conciergeries Airbnb (piste à fort potentiel mais non validée : reste à savoir ce qu'on peut leur offrir en échange)

## 4. Étapes, par ordre de priorité

**Étape 1 — Nouveau texte d'accueil.** Remplacer le texte hero actuel par la formulation retenue (voir `STRATEGIE-ACCUEIL.md` §3). Aucune dépendance technique, gain de clarté immédiat.

**Étape 2 — Réorganiser la page d'accueil et la navigation.** Appliquer la hiérarchie à 3 niveaux (§4 de `STRATEGIE-ACCUEIL.md`). Trancher l'arbitrage Brocanteurs (onglet à part ou fusionné). Ramener la navigation principale à 5 entrées maximum.

**Étape 3 — Réintégrer le Local Relais.** L'option "Déposer au Local Relais" doit apparaître directement dans le parcours de création d'une annonce, et un accès doit redevenir visible dans la navigation.

**Étape 4 — Étendre le compteur d'impact en version collective.** Réutiliser la logique déjà existante (`localImpact.ts`) pour afficher un chiffre agrégé sur l'accueil, en plus de la version individuelle du Carnet.

**Étape 5 — Espace Pro visible + tarif à jour.** Ajouter un point d'entrée clair vers l'Espace Pro depuis l'accueil, et mettre à jour le contenu (FAQ, page Pro) avec le tarif retenu : 20 €/mois, tarif associatif.

**Étape 6 — Module "Chartrons Midi".** Affichage conditionnel (11h30–14h) mettant en avant les ardoises du jour et les commerces de bouche à proximité, à partir des données déjà existantes. C'est le point le plus simple à mesurer : suivre si les questions posées au Concierge à l'heure du midi concernent déjà la nourriture, pour confirmer la demande.

**Étape 7 — Point de contact physique (vitrine).** Une fois les langues prioritaires et les dimensions de la vitrine précisées : rédiger le contenu multilingue (accroche + explication courte + appel à scanner) dans le même code couleur que la signalétique du quartier, sans risque de confusion avec un panneau officiel. Installer au local, en s'appuyant sur le flux de passage confirmé (place, tram, axe nord-sud vers les quais et la rue Notre-Dame).

**Étape 8 — Démarchage des associations de commerçants.** Présenter le projet en s'appuyant sur l'argument du flux de passage prouvé à l'emplacement du local, plutôt que sur l'application seule. Annoncer le tarif associatif à 20 €/mois.

**Étape 9 — Spécifier le Pass Quartier avant de le coder.** Définir précisément : qui y a accès (tout appareil présent dans le quartier, sans distinction résident/visiteur), quels avantages il débloque, comment les commerçants l'alimentent. Valider ce fonctionnement avec les premiers commerçants engagés à l'étape 8 avant de lancer le développement.

**Étape 10 — Développer le Pass Quartier**, une fois la spécification validée à petite échelle.

**Étape 11 — Suivi de l'usage réel.** Mettre en place un suivi simple (questions posées au Concierge à midi, scans du QR de la vitrine, nombre de commerçants inscrits) pour décider objectivement, avec des chiffres réels, si l'une des pistes du §3 mérite d'être engagée.

## 5. Note sur l'IA (rappel)

Le moteur local du Concierge tourne déjà seul en production et fonctionne. Pas de connexion à OpenAI prévue à ce stade — seulement si l'étape 11 démontre un besoin réel non couvert.
