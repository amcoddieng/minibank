-- Création de la base
CREATE DATABASE IF NOT EXISTS projetDB;
USE projetDB;

-- Table users
CREATE TABLE IF NOT EXISTS users (
  idUser INT(11) NOT NULL AUTO_INCREMENT,
  nom VARCHAR(20) NOT NULL,
  prenom VARCHAR(20) NOT NULL,
  dateNaissance DATE NOT NULL,
  lieuNaissance VARCHAR(50) NOT NULL,
  photo VARCHAR(250) DEFAULT NULL,
  telephone INT(11) NOT NULL,
  adresse VARCHAR(30) NOT NULL,
  nin VARCHAR(25) NOT NULL,
  dateCreation DATE DEFAULT CURRENT_TIMESTAMP,
  updatedate DATE DEFAULT CURRENT_TIMESTAMP,
  role ENUM('client','distributeur','agent') NOT NULL,
  PRIMARY KEY (idUser)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table clients
CREATE TABLE IF NOT EXISTS clients (
  id INT(11) NOT NULL AUTO_INCREMENT,
  datecreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  iduser INT(11) NOT NULL,
  PRIMARY KEY (id),
  KEY fk_client_user (iduser),
  CONSTRAINT fk_client_user FOREIGN KEY (iduser) REFERENCES users(idUser) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table distributeurs
CREATE TABLE IF NOT EXISTS distributeurs (
  id INT(11) NOT NULL AUTO_INCREMENT,
  datecreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  iduser INT(11) NOT NULL,
  PRIMARY KEY (id),
  KEY fk_distributeurs_user (iduser),
  CONSTRAINT fk_distributeurs_user FOREIGN KEY (iduser) REFERENCES users(idUser) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table agents
CREATE TABLE IF NOT EXISTS agents (
  id INT(11) NOT NULL AUTO_INCREMENT,
  iduser INT(11) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  email VARCHAR(25) NOT NULL,
  mdp VARCHAR(250) NOT NULL,
  PRIMARY KEY (id),
  KEY fk_user (iduser),
  CONSTRAINT fk_user FOREIGN KEY (iduser) REFERENCES users(idUser) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table comptes
CREATE TABLE IF NOT EXISTS comptes (
  idCompte INT(11) NOT NULL AUTO_INCREMENT,
  idusers INT(11) NOT NULL,
  numeroCompte VARCHAR(10) NOT NULL,
  solde INT(11) NOT NULL,
  motDePasse VARCHAR(255) NOT NULL,
  bloquer TINYINT(1) NOT NULL DEFAULT 0,
  archive TINYINT(1) NOT NULL DEFAULT 0,
  masksolde TINYINT(1) DEFAULT NULL,
  PRIMARY KEY (idCompte),
  KEY fk_comptes_users (idusers),
  CONSTRAINT fk_comptes_users FOREIGN KEY (idusers) REFERENCES users(idUser) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table creditation
CREATE TABLE IF NOT EXISTS creditation (
  id INT(11) NOT NULL AUTO_INCREMENT,
  idCompte INT(11) NOT NULL,
  montant DOUBLE NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_creditation_compte (idCompte),
  CONSTRAINT fk_creditation_compte FOREIGN KEY (idCompte) REFERENCES comptes(idCompte)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table historique
CREATE TABLE IF NOT EXISTS historique (
  id INT(11) NOT NULL AUTO_INCREMENT,
  type ENUM('transfert','depot','retrait') NOT NULL,
  montant DOUBLE NOT NULL,
  frais INT(11) DEFAULT NULL,
  idCompteSource INT(11) DEFAULT NULL,
  idCompteDestinataire INT(11) DEFAULT NULL,
  dateTransaction DATE NOT NULL,
  etat ENUM('reussi','annule') NOT NULL,
  PRIMARY KEY (id),
  KEY fk_histo_source (idCompteSource),
  KEY fk_histo_dest (idCompteDestinataire),
  CONSTRAINT fk_histo_source FOREIGN KEY (idCompteSource) REFERENCES comptes(idCompte),
  CONSTRAINT fk_histo_dest FOREIGN KEY (idCompteDestinataire) REFERENCES comptes(idCompte)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table transactions
CREATE TABLE IF NOT EXISTS transactions (
  id INT(11) NOT NULL AUTO_INCREMENT,
  type ENUM('transfert','depot','retrait') NOT NULL,
  montant DOUBLE NOT NULL,
  frais INT(11) DEFAULT NULL,
  idCompteSource INT(11) DEFAULT NULL,
  idCompteDestinataire INT(11) DEFAULT NULL,
  dateTransaction DATE NOT NULL,
  etat ENUM('reussi','annule') NOT NULL,
  PRIMARY KEY (id),
  KEY fk_transaction_source (idCompteSource),
  KEY fk_transaction_dest (idCompteDestinataire),
  CONSTRAINT fk_transaction_source FOREIGN KEY (idCompteSource) REFERENCES comptes(idCompte),
  CONSTRAINT fk_transaction_dest FOREIGN KEY (idCompteDestinataire) REFERENCES comptes(idCompte)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
