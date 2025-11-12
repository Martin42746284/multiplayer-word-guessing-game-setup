# 🎮 Test IDs - Brain Flash

Utilisez ces IDs pour tester l'application.

## Game Test ID

```
Game ID: 550e8400-e29b-41d4-a716-446655440000
Game Title: Quiz Test - Brain Flash
Status: pending
Questions: 20 (incluses dans seed-questions.sql)
```

## Questions Incluses

| # | Question | Réponse | Domaine |
|----|----------|---------|---------|
| 1 | Quelle est la capitale de la France? | PARIS | Capitales |
| 2 | Quelle est la capitale de l'Italie? | ROME | Capitales |
| 3 | Quelle est la capitale de l'Espagne? | MADRID | Capitales |
| 4 | Quelle est la capitale de l'Allemagne? | BERLIN | Capitales |
| 5 | Quelle est la capitale de la Belgique? | BRUXELLES | Capitales |
| 6 | Quel animal est le plus grand du monde? | BALEINE | Animaux |
| 7 | Quel animal court le plus vite? | GUEPARD | Animaux |
| 8 | Quel animal vit en Afrique avec des rayures? | ZEBRE | Animaux |
| 9 | Quel animal vole et utilise l'écholocalisation? | CHAUVE-SOURIS | Animaux |
| 10 | Quel animal aquatique ressemble à un rongeur? | CASTOR | Animaux |
| 11 | En quel année l'homme a marché sur la lune? | MILLE-NEUF-CENT-SOIXANTE-NEUF | Culture |
| 12 | Combien de continents y a-t-il? | SEPT | Géographie |
| 13 | Quel est le plus haut sommet du monde? | EVEREST | Géographie |
| 14 | Quelle est la planète la plus proche du soleil? | MERCURE | Science |
| 15 | Combien de mers y a-t-il principalement? | SEPT | Géographie |
| 16 | Quel est le symbole chimique du fer? | FE | Science |
| 17 | Quel est le gaz que nous respirons? | OXYGENE | Science |
| 18 | Combien de jours compte une année? | TROIS-CENT-SOIXANTE-CINQ | Science |
| 19 | Quel est le plus grand océan du monde? | PACIFIQUE | Géographie |
| 20 | Quel est le cycle de transformation de l'eau? | EVAPORATION | Science |

## Supabase Credentials

```
Project URL: https://tkqriznutvgwozqegyym.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Region: EU
```

## URLs de Test

### Accueil
```
http://localhost:5173/
```

### Joueur (8 rôles)
```
http://localhost:5173/player/Droit?gameId=550e8400-e29b-41d4-a716-446655440000
http://localhost:5173/player/Nurs?gameId=550e8400-e29b-41d4-a716-446655440000
http://localhost:5173/player/Théologie?gameId=550e8400-e29b-41d4-a716-446655440000
http://localhost:5173/player/Informatique?gameId=550e8400-e29b-41d4-a716-446655440000
http://localhost:5173/player/Langue%20Anglaise?gameId=550e8400-e29b-41d4-a716-446655440000
http://localhost:5173/player/Communication?gameId=550e8400-e29b-41d4-a716-446655440000
http://localhost:5173/player/Gestion?gameId=550e8400-e29b-41d4-a716-446655440000
http://localhost:5173/player/Professeur?gameId=550e8400-e29b-41d4-a716-446655440000
```

### Affichage Public
```
http://localhost:5173/display?gameId=550e8400-e29b-41d4-a716-446655440000
```

### Fin de Partie
```
http://localhost:5173/end?gameId=550e8400-e29b-41d4-a716-446655440000
```

## Scoring Examples

### Réponse Correcte Rapide (< 20 sec)
```
Question: Quelle est la capitale de la France?
Réponse: PARIS
Temps: 5 secondes
Points: 100 (base) + 30 (bonus) = 130 points ✅
```

### Réponse Correcte Lente (> 20 sec)
```
Question: Quelle est la capitale de la France?
Réponse: PARIS
Temps: 25 secondes
Points: 100 points ✅
```

### Réponse Incorrecte
```
Question: Quelle est la capitale de la France?
Réponse: LONDON
Temps: 10 secondes
Points: -25 points ❌
```

## Scénario de Test Complet

### Joueur 1 - Droit
```
Lien: http://localhost:5173/player/Droit?gameId=550e8400-e29b-41d4-a716-446655440000
Réponses rapides correctes: Q1-Q10 (130 pts x 10 = 1300 pts)
Réponses lentes correctes: Q11-Q15 (100 pts x 5 = 500 pts)
Réponses incorrectes: Q16-Q20 (-25 pts x 5 = -125 pts)
SCORE TOTAL: 1675 points
```

### Joueur 2 - Nurs
```
Lien: http://localhost:5173/player/Nurs?gameId=550e8400-e29b-41d4-a716-446655440000
Réponses rapides correctes: Q1-Q5 (130 pts x 5 = 650 pts)
Réponses lentes correctes: Q6-Q15 (100 pts x 10 = 1000 pts)
Réponses incorrectes: Q16-Q20 (-25 pts x 5 = -125 pts)
SCORE TOTAL: 1525 points
```

## Checklist de Déploiement

- [ ] `db-schema.sql` exécuté
- [ ] `seed-questions.sql` exécuté avec Game ID 550e8400-e29b-41d4-a716-446655440000
- [ ] Edge Functions déployées (verify-answer, finalize-game)
- [ ] RLS Policies configurées
- [ ] Application dev server lancé (`npm run dev`)
- [ ] Accueil accessible
- [ ] Joueur 1 connecté avec rôle Droit
- [ ] Joueur 1 voit le Game ID en paramètre URL
- [ ] Questions chargent correctement
- [ ] Scoring fonctionne

## Pour Ajouter Plus de Games

Créez un nouveau jeu avec un nouvel UUID:

```sql
INSERT INTO games (id, title, description, status) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'Quiz Test 2',
  'Second test game',
  'pending'
);

-- Ensuite ajoutez les questions avec ce nouvel ID...
```

Utilisez des générateurs UUID:
- https://www.uuidgenerator.net/
- CLI: `uuidgen` (macOS/Linux)

---

**Statut**: Prêt pour tests avec Game ID 550e8400-e29b-41d4-a716-446655440000 ✅
