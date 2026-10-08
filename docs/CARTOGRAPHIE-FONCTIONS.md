# Cartographie des fonctions — usagers et professionnels

Document de travail du 08/10/2026, établi en lisant le code du site (version « site vierge »).
Objectif fixé par le propriétaire : savoir **ce qui sert aux usagers** et **ce qui sert aux pros**, pour décider du gratuit et du payant, puis cadrer l'éditorial.

Vocabulaire : **usager** = habitant ou visiteur (consultant), sans compte. **Pro** = commerçant, artisan, brocanteur, concierge.
Colonne « Réel aujourd'hui » : ✅ fonctionne et est vu de tous · 📱 fonctionne mais reste sur l'appareil de la personne · ⚠️ à corriger ou à décider · 🔒 réservé Premium Pro dans le code actuel.

## 1. Ce que le site offre aux usagers (toujours gratuit)

| # | Fonction | Où | Réel aujourd'hui |
|---|---|---|---|
| U1 | Barre de recherche unique (annuaire ou Concierge IA) | En-tête | ✅ |
| U2 | Concierge IA : questions, itinéraires, recettes, adresses (réponses locales ou serveur IA) | Panneau Concierge | ✅ (moteur local) |
| U3 | Annuaire des commerces, services et santé, 375 fiches, filtres, distance | Annuaire | ✅ |
| U4 | Carte interactive (commerces, santé, marchés, événements) | Carte | ✅ |
| U5 | Agenda du quartier (marché, puces, brocante) | Agenda, accueil | ✅ pour les événements du code · 📱 pour ceux saisis en administration |
| U6 | Annonces et entraide entre voisins : publier, consulter | Annonces | 📱 (les annonces d'un habitant ne sont pas vues des autres) |
| U7 | Anti-Gaspi : offres de fin de journée des commerces | Anti-Gaspi | 📱 |
| U8 | Local Relais : dépôt et retrait d'objets, créneaux, QR | Local Relais | 📱 |
| U9 | Marché des Brocanteurs et IA Chineur | Brocanteurs | ✅ (fiches) · 📱 (pépites) |
| U10 | Découvrir les Chartrons : parcours, patrimoine, anecdotes, vélo | Découvrir | ✅ |
| U11 | Guide pratique : accueil, tri, stationnement, urgences | Guide | ✅ |
| U12 | Tourisme : consignes, conciergeries, bonnes adresses | Tourisme | ✅ |
| U13 | Favoris et parcours enregistrés ; export vers un autre téléphone | Favoris | 📱 |
| U14 | Carnet habitant : fidélité, reçus, impact local | Carnet | 📱 |
| U15 | Alertes d'événements près de ses favoris | Bandeau en haut des pages | 📱 |
| U16 | Signalements civiques anonymes (Mairie, Police municipale) | Guide pratique | 📱 (n'arrivent pas jusqu'à vous) |
| U17 | Urgences, évacuation, « je vais bien » (check-in) | Guide pratique, Carte, Favoris, Mode Confort | ✅ |
| U18 | Mode Confort : gros caractères, lecture à voix haute | En-tête | ✅ |
| U19 | Trois langues : français, anglais, espagnol (pages publiques) | En-tête | ✅ |
| U20 | Installation sur le téléphone (PWA), mode hors ligne | Navigateur | ✅ |
| U21 | « Dispo maintenant » : bandeau des commerces disponibles tout de suite | Annuaire, conciergerie | ✅ (seule fonction publique vraiment partagée) |
| U22 | FAQ, CGV, contact | Pied de page | ✅ |

## 2. Ce que le site offre aux pros

| # | Fonction | Gratuit ou Premium dans le code | Réel aujourd'hui |
|---|---|---|---|
| P1 | Fiche dans l'annuaire et sur la carte | Gratuit | ✅ |
| P2 | Téléphone, e-mail et réseaux (Instagram, Facebook, WhatsApp) cliquables | Gratuit | ✅ (coordonnées à fournir par les pros) |
| P3 | Référencer son commerce, obtenir un code d'accès | Gratuit | ⚠️ voir constat 4 |
| P4 | Espace Pro : connexion par code | Gratuit | ✅ (Supabase) |
| P5 | Kit Vitrine : QR et flyer A6 | Gratuit | ✅ |
| P6 | « Dispo maintenant » : annoncer « je suis disponible » | Gratuit | ✅ (Supabase) |
| P7 | Carte fidélité : règle de points, QR vitrine, créditer en caisse | Gratuit | 📱 |
| P8 | Ardoise du jour (menu du jour) à faire valider | Saisie gratuite, affichage public 🔒 | ⚠️ voir constat 2 |
| P9 | Lien de prise de rendez-vous | Saisie gratuite, affichage public 🔒 | ⚠️ voir constat 2 |
| P10 | Lien vers le site web du commerce | 🔒 | ✅ |
| P11 | Priorité dans le Concierge IA (Top 5) | 🔒 | ✅ |
| P12 | Réservation de table, rendez-vous, Click & Collect | 🔒 | ⚠️ voir constat 3 |
| P13 | Communication : rédiger une annonce, aide IA, campagnes | 🔒 | ⚠️ voir constat 1 |
| P14 | Pépites et arrivages pour brocanteurs (jusqu'à 10 objets) + badge Notre-Dame | 🔒 | 📱 |
| P15 | Publier une offre Anti-Gaspi, une annonce, un événement | Gratuit | 📱 |
| P16 | Être aidé par l'administrateur : « Prendre la main » sur l'Espace Pro | Gratuit | ✅ |
| P17 | Emplacements futurs STUDIO ALL : offres des pros, outils pour votre commerce | À définir | ⏳ branchement prévu |

## 3. Ce que fait l'administration (propriétaire)

Tour de Contrôle (chiffres, messages), modération des annonces, des ardoises et des signalements, agenda, bannières, rectangle d'accueil, Local Relais, fiches commerces (gratuit / Premium Pro), consignes du Concierge IA, kit QR. Détail : page « Mode d'emploi » de l'administration.

## 4. Constats importants

1. **Communication Pro n'a aucun lecteur public.** Les annonces rédigées par les pros sont enregistrées dans Supabase, mais aucune page publique ne les affiche. Aujourd'hui cette fonction « payante » ne produit rien de visible. Elle devrait alimenter les emplacements « offres des pros » de l'accueil.
2. **Gratuit pour saisir, payant pour être vu.** Un pro gratuit peut remplir l'ardoise du jour et le lien de rendez-vous, mais le public ne les voit que si le pro est Premium. Cela donne l'impression d'une fonction qui ne marche pas.
3. **Les réservations n'arrivent pas au commerçant.** Aucune commande ni réservation n'est transmise : l'usager reçoit une confirmation, rien n'est envoyé. La FAQ promet un message WhatsApp ou SMS pré-rempli, qui n'existe pas dans le code. Tant qu'aucun pro n'est Premium, ces boutons ne sont pas visibles, donc pas de risque immédiat.
4. **Le code d'accès d'un commerce peut être réclamé par n'importe qui** tant que le commerce n'en a pas. À sécuriser avant l'ouverture aux pros (validation par vous, ou vérification par e-mail ou téléphone).
5. **Presque tout ce que les usagers publient reste sur leur appareil** (annonces, Anti-Gaspi, Local Relais, signalements, favoris). Seuls « Dispo maintenant », l'Espace Pro (Communication) et les codes sont partagés via Supabase. L'administration partagée est donc à décider avec la stratégie.
6. **À vérifier :** les pros ne semblent pas pouvoir corriger les horaires, les photos et la description de leur fiche depuis l'Espace Pro. Aujourd'hui, c'est surtout l'administrateur qui corrige les fiches.

## 5. Pistes pour la frontière gratuit / payant (à discuter, rien n'est décidé)

Principe proposé : **le gratuit apporte les pros, le payant apporte de la visibilité et des outils de vente.**

| Famille | Piste |
|---|---|
| Être trouvé (P1, P2, P4 à P7, P15) | Gratuit pour tous : c'est ce qui remplit l'annuaire et rend le site utile aux usagers. |
| Être mis en valeur (P10, P11, fiche prioritaire) | Payant : visibilité accrue, lien vers le site, priorité Concierge IA. |
| Vendre et fidéliser (P8, P9, P12, P7 avancée) | À arbitrer : ardoise, rendez-vous et réservation. Si payants, les rendre visibles et utiles (constats 2 et 3). |
| Communiquer (P13, P17) | Payant, mais seulement quand l'accueil affiche réellement les offres des pros (constat 1) et que STUDIO ALL est branché. |
| Brocanteurs (P14) | Payant pour la vitrine « pépites », gratuit pour la fiche. |

Cette frontière dépend aussi du « Super Pro » imaginé pour la diffusion vers Google, Facebook, Instagram, WhatsApp et TikTok, qui viendra avec STUDIO ALL.
