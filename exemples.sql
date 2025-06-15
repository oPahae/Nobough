-- Inserting Data into `Utilisateurs`
INSERT INTO Utilisateurs (nom, prenom, email, tel, password, cin, bio, birth, valide) VALUES
('Alami', 'Youssef', 'youssef.alami@example.com', '0612345678', 'hashed_password_1', 'AA12345', 'Enseignant en informatique', '1985-05-15', TRUE),
('Benali', 'Fatima', 'fatima.benali@example.com', '0698765432', 'hashed_password_2', 'BB65432', 'Étudiante en design', '1998-09-22', TRUE),
('Kabbaj', 'Karim', 'karim.kabbaj@example.com', '0655555555', 'hashed_password_3', 'CC98765', 'Ingénieur logiciel', '1990-07-30', TRUE),
('Elmoubaraki', 'Leila', 'leila.elmoubaraki@example.com', '0644444444', 'hashed_password_4', 'DD44444', 'Consultante en marketing', '1993-11-10', TRUE),
('Zerouali', 'Omar', 'omar.zerouali@example.com', '0633333333', 'hashed_password_5', 'EE33333', 'Étudiant en médecine', '1997-04-18', TRUE);

-- Inserting Data into `Etudiants`
INSERT INTO Etudiants (nom, prenom, email, tel, password, cin, bio, birth, rabais) VALUES
('Alaoui', 'Mohammed', 'mohammed.alaoui@example.com', '0611111111', 'hashed_password_6', 'FF11111', 'Étudiant en web design', '2000-01-20', 10),
('Chakir', 'Sara', 'sara.chakir@example.com', '0622222222', 'hashed_password_7', 'GG22222', 'Étudiante en programmation', '1999-06-15', 15),
('Fassi', 'Ahmed', 'ahmed.fassi@example.com', '0633333333', 'hashed_password_8', 'HH33333', 'Étudiant en mécanique', '2001-03-25', 5),
('Idrissi', 'Nadia', 'nadia.idrissi@example.com', '0644444444', 'hashed_password_9', 'II44444', 'Étudiante en arts', '2002-08-12', 20),
('Mansouri', 'Yassine', 'yassine.mansouri@example.com', '0655555555', 'hashed_password_10', 'JJ55555', 'Étudiant en commerce', '2003-02-28', 0);

-- Inserting Data into `Professeurs`
INSERT INTO Professeurs (nom, prenom, email, tel, password, cin, bio, birth, specialites, salaire) VALUES
('Bennis', 'Hassan', 'hassan.bennis@example.com', '0666666666', 'hashed_password_11', 'KK66666', 'Professeur de web design', '1975-11-30', 'Web Design', 5000),
('Rachidi', 'Samira', 'samira.rachidi@example.com', '0677777777', 'hashed_password_12', 'LL77777', 'Professeure de programmation', '1980-09-14', 'Programmation', 5500),
('Sahli', 'Abdelkrim', 'abdelkrim.sahli@example.com', '0688888888', 'hashed_password_13', 'MM88888', 'Professeur de mécanique', '1970-05-05', 'Mécanique', 6000),
('Tazi', 'Layla', 'layla.tazi@example.com', '0699999999', 'hashed_password_14', 'NN99999', 'Professeure de commerce', '1985-07-17', 'Commerce', 6500),
('Ouazzani', 'Khalid', 'khalid.ouazzani@example.com', '0612121212', 'hashed_password_15', 'OO12121', 'Professeur de mathématiques', '1978-12-25', 'Mathématiques', 7000);

-- Inserting Data into `Formations`
INSERT INTO Formations (titre, description, prix, genre, type, categorie, duree, salle, profID) VALUES
('Web Design', 'Apprenez les bases et les techniques avancées du web design.', 3000, 'Design', 'En ligne', 'Technologie', 40, 'Salle A', 1),
('Motoun', 'Maîtrisez l''art de la maintenance et de la conduite de moto.', 2500, 'Technique', 'En personne', 'Automobile', 30, 'Atelier B', 2),
('Coran', 'Étudiez et comprenez les enseignements du Coran.', 2000, 'Religieux', 'En ligne', 'Religion', 50, 'Salle C', 3),
('Programmation', 'Cours complet sur la programmation et le développement logiciel.', 3500, 'Technique', 'En ligne', 'Technologie', 60, 'Salle D', 4);

-- Inserting Data into `Seances`
INSERT INTO Seances (jour, horaire, formationID) VALUES
('Lundi', '10:00:00', 1),
('Mercredi', '14:00:00', 2),
('Vendredi', '09:00:00', 3),
('Mardi', '11:00:00', 4),
('Jeudi', '13:00:00', 1),
('Samedi', '15:00:00', 2),
('Dimanche', '16:00:00', 3),
('Lundi', '17:00:00', 4);

-- Inserting Data into `Paiements`
INSERT INTO Paiements (etudiantID, formationID, total, status, datePaiement) VALUES
(1, 1, 3000, 'paye', '2023-10-01'),
(2, 2, 2500, 'nonpaye', NULL),
(3, 3, 2000, 'paye', '2023-10-05'),
(4, 4, 3500, 'nonpaye', NULL),
(5, 1, 3000, 'paye', '2023-10-10');

-- Inserting Data into `Inscriptions`
INSERT INTO Inscriptions (formationID, etudiantID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(1, 5);

-- Insertion dans la table Revenus
INSERT INTO Revenus (label, type, descr, montant) VALUES
('Vente de formations', 'Formation', 'Revenu généré par la vente de formations en ligne', 5000),
('Sponsorship', 'Partenariat', 'Revenu généré par un partenariat avec une entreprise locale', 3000),
('Atelier payant', 'Atelier', 'Revenu généré par un atelier spécialisé', 2000);

-- Insertion dans la table Depenses
INSERT INTO Depenses (label, type, descr, montant, evenementID) VALUES
('Achat de matériel', 'Fournitures', 'Achat de matériel pédagogique', 1500, NULL),
('Location salle', 'Logistique', 'Location d''une salle pour un événement', 2000, 1),
('Publicité en ligne', 'Marketing', 'Campagne publicitaire sur les réseaux sociaux', 1000, NULL);

-- Insertion dans la table Salaires
INSERT INTO Salaires (profID, datePaiement) VALUES
(1, '2023-10-05'),
(2, '2023-10-05'),
(3, '2023-10-05');

-- Insertion dans la table Dettes
INSERT INTO Dettes (label, montant, descr, deadline) VALUES
('Dette fournisseur', 2500, 'Dette pour l''achat de matériel pédagogique', '2023-12-31'),
('Emprunt bancaire', 10000, 'Emprunt pour l''expansion des infrastructures', '2024-06-30'),
('Facture impayée', 800, 'Facture pour services de consultation', '2023-11-15');