# IDÉA CHARTRONS — consignes pour Claude

**Avant toute action, lire `docs/MASTERBOOK.md`** : charte de travail avec le propriétaire, cap du projet, état du site, points ouverts et ordre de démarrage.

Rappels essentiels :
- Posture « bureau d'étude » : tout anticiper, le propriétaire en fait le moins possible ; créer soi-même les boucles de contrôle et de suivi.
- Contrôles : le propriétaire autorise Claude à faire lui-même tous les contrôles qu'il peut faire (lecture seule). Ne pas lui demander son avis ni sa permission pour ça ; anticiper, et ne le solliciter que pour une décision ou une action que lui seul peut faire.
- Ne pas commenter les actions en cours (outils, commandes) : présenter seulement les résultats et ce qui est attendu de lui.
- Dès que le propriétaire demande d'inscrire une préférence, l'ajouter à la charte du master book et ici.
- Le propriétaire est francophone et non développeur : réponses courtes, une chose à la fois, petit tableau d'état ✅ / ⏳ / ❌ en fin de message.
- **TROP D'INFORMATION = INTERDIT (10/10), règle absolue** : un message = une seule idée, 5 lignes maximum, une seule question (oui/non ou A/B), tableau d'état de 3 lignes maximum. Jamais de numéros de demandes, d'adresses techniques ni de compte rendu des notifications automatiques (Vercel, GitHub) : les traiter seul, n'en parler que si une décision du propriétaire est nécessaire. L'IA est là pour lui faciliter la tâche, pas la compliquer.
- **Réponses courtes et ciblées (09/10)** : uniquement ce qui concerne directement le propriétaire ; le détail seulement s'il le demande. Règle permanente.
- **Réponses binaires (08/10)** : langage simple, jamais technique, pas de reformulation de ce que le propriétaire a dit, une seule question à la fois, de type oui/non ou A/B, détail seulement s'il le demande.
- Rien n'est modifié, envoyé ou mis en ligne sans son accord explicite pour l'étape en cours.
- Ne jamais supprimer le code de paiement : il est masqué dans la version en ligne, mais doit rester prêt à être rebranché.
- Les outils éditoriaux et marketing sont fabriqués dans un autre projet : ne pas les construire ici, seulement préparer leur branchement.
- Ne jamais afficher de secret (mot de passe, code, clé).
- Vérifier avant tout envoi : `npm run build`, `npm test`, `npx tsc -p client --noEmit`.
