# 🧪 Checklist de Test - Brain Flash

## Avant de Tester

- [ ] Base de données Supabase configurée
- [ ] Edge Functions déployées
- [ ] Questions de test ajoutées
- [ ] Application en cours d'exécution (`npm run dev`)

## Test 1: Configuration de la Base de Données ✅

- [ ] Vérifiez que `db-schema.sql` a été exécuté sans erreurs
- [ ] Vérifiez que les 5 tables sont créées:
  - [ ] `players`
  - [ ] `games`
  - [ ] `questions`
  - [ ] `game_participants`
  - [ ] `scores`
- [ ] Vérifiez que les indexes sont créés
- [ ] Vérifiez que RLS est activé sur toutes les tables
- [ ] Vérifiez que `REPLICA IDENTITY FULL` est activé pour les subscriptions

**Commande de vérification SQL**:
```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Vérifier les indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public';
```

## Test 2: Edge Functions ✅

### verify-answer function

- [ ] Fonction déployée sans erreurs
- [ ] Testez avec cURL:

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/verify-answer \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "test-game-id",
    "playerId": "test-player-id",
    "questionId": "test-question-id",
    "userAnswer": "EXAMPLE",
    "correctAnswer": "EXAMPLE",
    "responseTimeMs": 15000
  }'
```

**Réponse attendue**: 
```json
{
  "isCorrect": true,
  "pointsEarned": 130,
  "breakdown": { "basePoints": 100, "bonus": 30 }
}
```

### finalize-game function

- [ ] Fonction déployée sans erreurs
- [ ] Testez avec cURL:

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/finalize-game \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"gameId": "test-game-id"}'
```

**Réponse attendue**: 
```json
{
  "gameId": "test-game-id",
  "status": "finished",
  "finalRankings": [...]
}
```

## Test 3: Interface Utilisateur

### HomePage
- [ ] La page charge correctement
- [ ] Les 8 rôles s'affichent
- [ ] Cliquer sur un rôle redirige vers PlayerScreen
- [ ] Affichage public fonctionne
- [ ] Responsive sur mobile

### PlayerScreen
- [ ] Écran de sélection du rôle affiche
- [ ] Confirmation du rôle fonctionne
- [ ] Écran d'attente affiche les joueurs
- [ ] Le clavier personnalisé fonctionne
- [ ] Les images s'affichent correctement
- [ ] Le minuteur compte à rebours
- [ ] La correction affiche la bonne réponse
- [ ] Responsive sur mobile

### PublicDisplay
- [ ] Écran d'accueil affiche
- [ ] Grille des joueurs s'affiche
- [ ] Décompte fonctionne (3, 2, 1)
- [ ] Images affichées pendant 15 sec
- [ ] Leaderboard mises à jour en direct
- [ ] Affichage du gagnant fonctionne
- [ ] Responsive sur tous les appareils

### GameEnd
- [ ] Page charge correctement
- [ ] Classement affiche avec podium
- [ ] Statistiques correctes (nb joueurs, taux réussite, etc.)
- [ ] Bouton "Nouvelle Partie" fonctionne
- [ ] Responsive sur mobile

## Test 4: Temps Réel (Real-time)

- [ ] **Subscriptions joueurs**: Quand un joueur se joint, les autres voient immédiatement
- [ ] **Subscriptions scores**: Les scores mettent à jour en direct
- [ ] **Subscriptions statut jeu**: Quand le jeu change de statut, tous les clients se mettent à jour
- [ ] Vérifiez les logs: Devtools → Network → Supabase websocket

**Indices de fonctionnement**:
- Vous verrez des connexions WebSocket dans Network tab
- Les messages incluront `postgres_changes`
- Les données mettront à jour sans refresh de page

## Test 5: Flux Complet du Jeu

### Scénario: 8 joueurs, 1 question

1. [ ] **Joueur 1** ouvre HomePage
2. [ ] **Joueurs 1-8** sélectionnent des rôles différents
3. [ ] Tous sont redirigés vers PlayerScreen
4. [ ] Écran d'attente montre les 8 joueurs
5. [ ] PublicDisplay montre les 8 joueurs qui se joignent
6. [ ] Décompte commence (3, 2, 1)
7. [ ] Images affichées pendant 15 sec
8. [ ] Chaque joueur répond avec le clavier
9. [ ] Réponses sont soumises aux Edge Functions
10. [ ] Scores mettent à jour en direct
11. [ ] Correction affiche la bonne réponse
12. [ ] Leaderboard mises à jour
13. [ ] GameEnd affiche les 8 joueurs classés
14. [ ] Peut recommencer une partie

## Test 6: Mobile Responsiveness

### Appareils à tester:
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] iPad (768px)
- [ ] Tablet (1024px)
- [ ] Desktop (1920px)

### Éléments à vérifier:
- [ ] Pas de débordement horizontal
- [ ] Texte lisible (min 14px)
- [ ] Images chargent correctement
- [ ] Boutons cliquables (min 44x44px)
- [ ] Clavier personnalisé utilisable
- [ ] Grilles s'adaptent

**Utiliser**: DevTools → Responsive Design Mode (Ctrl+Shift+M)

## Test 7: Performance

### Chargement des images
- [ ] Lazy-loading fonctionne (images se chargent quand visibles)
- [ ] Images affichent avec placeholder pendant le chargement
- [ ] Pas d'images floutées ou pixelisées

**Vérifier**: DevTools → Network → Filter by Images

### Subscriptions
- [ ] Pas de fuites mémoire
- [ ] Subscriptions se ferment au démontage
- [ ] Pas de reconnexions excessives

**Vérifier**: DevTools → Console, regardez les logs

## Test 8: Scoring Logic

Testé avec 3 scénarios:

### Scénario A: Réponse rapide correcte (< 20 sec)
- [ ] Réponse: `EXAMPLE`
- [ ] Temps: 5 secondes
- [ ] **Résultat attendu**: 100 + 30 = 130 points ✅

### Scénario B: Réponse lente correcte (> 20 sec)
- [ ] Réponse: `EXAMPLE`
- [ ] Temps: 25 secondes
- [ ] **Résultat attendu**: 100 points ✅

### Scénario C: Réponse incorrecte
- [ ] Réponse: `WRONG`
- [ ] Correct: `EXAMPLE`
- [ ] **Résultat attendu**: -25 points ✅

## Test 9: Gestion des Erreurs

- [ ] Créer un joueur avec username vide → Erreur affichée
- [ ] Soumettre une réponse avec gameId invalide → Erreur gracieuse
- [ ] Débrancher internet → Reconnexion automatique
- [ ] Fermer onglet → Pas d'erreur dans console
- [ ] Actualiser pendant le jeu → État préservé

## Test 10: Sécurité

- [ ] Les clés secrètes ne sont pas exposées en console
- [ ] Les données sensibles ne sont pas loggées
- [ ] RLS empêche l'accès non autorisé
- [ ] Edge Functions n'acceptent que les requêtes valides
- [ ] CORS configuré correctement

## Rapports de Bugs

Si vous trouvez un bug, notez:

- [ ] **Titre**: Court description
- [ ] **Environnement**: Browser, OS, appareil
- [ ] **Étapes pour reproduire**: Exact steps
- [ ] **Résultat attendu**: What should happen
- [ ] **Résultat actuel**: What actually happened
- [ ] **Logs**: Console errors/warnings
- [ ] **Screenshot**: Si applicable

## Résultats

| Test | Statut | Notes |
|------|--------|-------|
| DB Schema | ⬜ | À tester |
| verify-answer | ⬜ | À tester |
| finalize-game | ⬜ | À tester |
| HomePage | ⬜ | À tester |
| PlayerScreen | ⬜ | À tester |
| PublicDisplay | ⬜ | À tester |
| GameEnd | ⬜ | À tester |
| Real-time | ⬜ | À tester |
| Flux Complet | ⬜ | À tester |
| Mobile | ⬜ | À tester |
| Performance | ⬜ | À tester |
| Scoring | ⬜ | À tester |
| Erreurs | ⬜ | À tester |
| Sécurité | ⬜ | À tester |

**Statut Global**: En attente de tests 🧪

---

**Conseils de Test**:
1. Commencez par les tests de base (DB, Functions)
2. Testez un seul joueur d'abord
3. Progressez vers le scénario complet (8 joueurs)
4. Testez sur mobile en dernier
5. Documentez tous les bugs trouvés
