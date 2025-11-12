-- This SQL script creates sample games and questions for testing

-- Step 1: Create the game first
INSERT INTO games (id, title, description, status)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Quiz Test - Brain Flash',
  'Test Game with 20 questions',
  'pending'
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Insert sample questions for the test game
-- Using game_id: 550e8400-e29b-41d4-a716-446655440000

INSERT INTO questions (game_id, question_text, correct_answer, display_order, time_limit_seconds, image_url) VALUES
-- Capital Cities
('550e8400-e29b-41d4-a716-446655440000', 'Quelle est la capitale de la France?', 'PARIS', 1, 30, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quelle est la capitale de l''Italie?', 'ROME', 2, 30, 'https://images.unsplash.com/photo-1552832860-cfde3bf89f9d?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quelle est la capitale de l''Espagne?', 'MADRID', 3, 30, 'https://images.unsplash.com/photo-1570445106519-2c2afc86e332?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quelle est la capitale de l''Allemagne?', 'BERLIN', 4, 30, 'https://images.unsplash.com/photo-1545205521-08249f127e20?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quelle est la capitale de la Belgique?', 'BRUXELLES', 5, 30, 'https://images.unsplash.com/photo-1576866209830-08c626535fcd?w=400&h=300&fit=crop'),

-- Animals
('550e8400-e29b-41d4-a716-446655440000', 'Quel animal est le plus grand du monde?', 'BALEINE', 6, 30, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quel animal court le plus vite?', 'GUEPARD', 7, 30, 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quel animal vit en Afrique et ressemble à un cheval avec des rayures?', 'ZEBRE', 8, 30, 'https://images.unsplash.com/photo-1551986782-d244d7d6d21d?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quel animal vole et s''oriente avec l''écholocalisation?', 'CHAUVE-SOURIS', 9, 30, 'https://images.unsplash.com/photo-1573566350659-4d67c4c2e8b2?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quel animal aquatique ressemble à un gros rongeur castors?', 'CASTOR', 10, 30, 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=300&fit=crop'),

-- General Knowledge
('550e8400-e29b-41d4-a716-446655440000', 'En quel année l''homme a-t-il marché sur la lune?', 'MILLE-NEUF-CENT-SOIXANTE-NEUF', 11, 30, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Combien de continents y a-t-il?', 'SEPT', 12, 30, 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quel est le plus haut sommet du monde?', 'EVEREST', 13, 30, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quelle est la planète la plus proche du soleil?', 'MERCURE', 14, 30, 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Combien de mers y a-t-il principalement?', 'SEPT', 15, 30, 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop'),

-- Science
('550e8400-e29b-41d4-a716-446655440000', 'Quel est le symbole chimique du fer?', 'FE', 16, 30, 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quel est le gaz que nous respirons?', 'OXYGENE', 17, 30, 'https://images.unsplash.com/photo-1581092162562-40038f60d8d3?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Combien de jours compte une année?', 'TROIS-CENT-SOIXANTE-CINQ', 18, 30, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quel est le plus grand océan du monde?', 'PACIFIQUE', 19, 30, 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440000', 'Quel est le cycle de transformation de l''eau?', 'EVAPORATION', 20, 30, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop');

-- Game ID: 550e8400-e29b-41d4-a716-446655440000
-- Images sourced from Unsplash (free stock photos)
