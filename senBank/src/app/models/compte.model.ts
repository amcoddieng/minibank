export interface Compte {
  idCompte: number;
  numeroCompte: string;
  solde: number;
  idusers: number;
  archive?: number;
  bloquer?: number;
  // Champs joints depuis la table users
  nom?: string;
  prenom?: string;
  role?: string;
  dateCreation?: string | Date;
}
