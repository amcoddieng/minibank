import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Transaction {
  id: number;
  type: string;
  destinataire: string;
  montant: number;
  date: string;
  statut: string;
}

@Component({
  selector: 'app-annulation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './annulation.html',
  styleUrl: './annulation.css',
})
export class Annulation {
  // transactionId = 0;
  // message = '';

  // constructor(private transaction: Transaction) {}

  // annulerTransaction() {
  //   this.transaction.annulerTransaction(this.transactionId).subscribe({
  //     next: () => (this.message = 'Transaction annulée !'),
  //     error: () => (this.message = 'Erreur lors de l’annulation'),
  //   });
  

  transactions: Transaction[] = [
    {
      id: 1,
      type: 'Transfert',
      destinataire: 'Amadou Seye',
      montant: 20000,
      date: '16/09/2025 14:00',
      statut: 'Actif',
    },
    {
      id: 2,
      type: 'Transfert',
      destinataire: 'Amadou Seye',
      montant: 20000,
      date: '16/09/2025 14:00',
      statut: 'Actif',
    },
    {
      id: 3,
      type: 'Transfert',
      destinataire: 'Amadou Seye',
      montant: 20000,
      date: '16/09/2025 14:00',
      statut: 'Annulé',
    },
  ];

//   annulerTransaction(t: Transaction) {
//     if (t.statut !== 'Annulé') {
//       t.statut = 'Annulé';
//       alert(`Transaction ${t.id} annulée`);
//     }
//   }
 }
