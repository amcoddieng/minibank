export interface Transaction {
  id: number;
  type: 'transfert' | 'depot' | 'retrait' | string;
  montant: number;
  frais: number;
  idCompteSource: number;
  idCompteDestinataire: number;
  etat: 'reussi' | 'annule' | string;
  dateTransaction: string;
}
