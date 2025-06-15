CREATE TABLE Utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    tel VARCHAR(20),
    img LONGBLOB DEFAULT NULL,
    password VARCHAR(255),
    cin VARCHAR(20),
    bio TEXT,
    birth DATETIME,
    valide BOOLEAN DEFAULT FALSE,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Etudiants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    tel VARCHAR(20),
    img LONGBLOB DEFAULT NULL,
    password VARCHAR(255),
    cin VARCHAR(20),
    bio TEXT,
    birth DATETIME,
    rabais INT DEFAULT 0,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Frais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    montant INT,
    msg TEXT,
    preuve LONGBLOB DEFAULT NULL,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Utilisateurs(id) ON DELETE CASCADE
);

CREATE TABLE VerifCodes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    created_At DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Professeurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    tel VARCHAR(20),
    img LONGBLOB DEFAULT NULL,
    password VARCHAR(255),
    cin VARCHAR(20) UNIQUE,
    bio TEXT,
    birth DATETIME,
    specialites VARCHAR(255),
    salaire INT DEFAULT 0,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Formations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    img LONGBLOB DEFAULT NULL,
    descr TEXT,
    prix INT NOT NULL,
    genre VARCHAR(50),
    type VARCHAR(50),
    categorie VARCHAR(50),
    duree INT,
    salle VARCHAR(255),
    profID INT,
    FOREIGN KEY (profID) REFERENCES Professeurs(id) ON DELETE SET NULL
);

CREATE TABLE Tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    formationsID INT,
    FOREIGN KEY (formationsID) REFERENCES formations(id) ON DELETE CASCADE
);

CREATE TABLE Seances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jour VARCHAR(50) NOT NULL,
    horaire TIME NOT NULL,
    formationID INT,
    FOREIGN KEY (formationID) REFERENCES formations(id) ON DELETE CASCADE
);

CREATE TABLE FAQs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    reponse TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Protestations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    tel VARCHAR(20),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT NOT NULL,
    sujet VARCHAR(255) NOT NULL,
    statut VARCHAR(50)
);

CREATE TABLE Annonces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descr TEXT NOT NULL,
    img LONGBLOB
);

CREATE TABLE Paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    etudiantID INT NOT NULL,
    formationID INT,
    total INT NOT NULL,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) DEFAULT 'nonpaye',
    preuve LONGBLOB DEFAULT NULL,
    datePaiement DATE,
    FOREIGN KEY (etudiantID) REFERENCES Etudiants(id) ON DELETE CASCADE,
    FOREIGN KEY (formationID) REFERENCES Formations(id) ON DELETE SET NULL
);

CREATE TABLE Inscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formationID INT NOT NULL,
    etudiantID INT NOT NULL,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formationID) REFERENCES Formations(id) ON DELETE CASCADE,
    FOREIGN KEY (etudiantID) REFERENCES Etudiants(id) ON DELETE CASCADE,
    UNIQUE KEY (formationID, etudiantID)
);

CREATE TABLE Attentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formationID INT NOT NULL,
    etudiantID INT NOT NULL,
    valide BOOLEAN DEFAULT FALSE,
    paye BOOLEAN DEFAULT FALSE,
    msg TEXT,
    preuve LONGBLOB,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formationID) REFERENCES Formations(id) ON DELETE CASCADE,
    FOREIGN KEY (etudiantID) REFERENCES Etudiants(id) ON DELETE CASCADE,
    UNIQUE KEY (formationID, etudiantID)
);

CREATE TABLE Evenements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    participants VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    lieu VARCHAR(255),
    descr TEXT,
    img LONGBLOB DEFAULT NULL,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Revenus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    descr TEXT,
    montant INT NOT NULL,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Depenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    descr TEXT,
    montant INT NOT NULL,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    evenementID INT DEFAULT NULL,
    FOREIGN KEY (evenementID) REFERENCES Evenements(id) ON DELETE CASCADE
);

CREATE TABLE Dettes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    montant INT NOT NULL,
    descr TEXT,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deadline DATE,
    status VARCHAR(50) DEFAULT 'nonpaye'
);

CREATE TABLE Salaires (
	id INT AUTO_INCREMENT PRIMARY KEY,
    profID INT,
    datePaiement DATE,
    created_At DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profID) REFERENCES Professeurs(id) ON DELETE CASCADE
);

CREATE TABLE Docs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    descr TEXT,
    type VARCHAR(50) DEFAULT "inconnu",
    taille INT DEFAULT 0,
    contenu LONGBLOB DEFAULT NULL,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    formationID INT,
    FOREIGN KEY (formationID) REFERENCES Formations(id) ON DELETE CASCADE
);

CREATE TABLE Msgs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenu TEXT NOT NULL,
    emetteur VARCHAR(255) NOT NULL,
    emetteurID INT,
    img LONGBLOB DEFAULT NULL,
    role VARCHAR(50) NOT NULL,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    formationID INT,
    FOREIGN KEY (formationID) REFERENCES Formations(id) ON DELETE CASCADE,
    INDEX idx_emetteur (emetteur),
    INDEX idx_formation (formationID),
    INDEX idx_created_at (created_At)
);

CREATE TABLE Rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    profID INT NOT NULL,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profID) REFERENCES Professeurs(id) ON DELETE CASCADE,
    INDEX idx_profID (profID),
    INDEX idx_created_at (created_At)
);

CREATE TABLE Certificats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    etudiantID INT NOT NULL,
    formationID INT,
    descr TEXT,
    mention VARCHAR(50),
    code VARCHAR(50) NOT NULL UNIQUE,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (etudiantID) REFERENCES Etudiants(id) ON DELETE CASCADE,
    FOREIGN KEY (formationID) REFERENCES Formations(id) ON DELETE SET NULL,
    INDEX idx_etudiant (etudiantID),
    INDEX idx_formation (formationID),
    INDEX idx_created_at (created_At)
);

CREATE TABLE Comptables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Secretaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE NotificationsEtud (
    id INT AUTO_INCREMENT PRIMARY KEY,
    etudiantID INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    msg TEXT,
    vue BOOLEAN NOT NULL DEFAULT FALSE,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (etudiantID) REFERENCES Etudiants(id) ON DELETE CASCADE
);

CREATE TABLE NotificationsProf (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profID INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    msg TEXT,
    vue BOOLEAN NOT NULL DEFAULT FALSE,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profID) REFERENCES Professeurs(id) ON DELETE CASCADE
);

CREATE INDEX idx_etudiantID ON Paiements(etudiantID);
CREATE INDEX idx_formationID ON Paiements(formationID);
CREATE INDEX idx_datePaiement ON Paiements(datePaiement);
CREATE INDEX idx_paiement_search ON Paiements (etudiantID, formationID, created_At);
CREATE INDEX idx_inscription_formation ON Inscriptions (formationID);
CREATE INDEX idx_inscription_date ON Inscriptions (created_At);