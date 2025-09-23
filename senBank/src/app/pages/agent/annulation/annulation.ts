import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Transaction } from '../../../models/transaction.model';
import { TransactionService } from '../../../services/transaction';

@Component({
  selector: 'app-annulation',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './annulation.html',
  styleUrls: ['./annulation.css'],
})
export class Annulation implements OnInit {
  loading = false;
  error: string | null = null;
  transactions: Transaction[] = [];

  constructor(private txService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;
    this.error = null;
    this.txService.getAllTransactions().subscribe({
      next: (list) => {
        this.transactions = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      },
    });
  }

  annuler(t: Transaction) {
    if (t.etat === 'annule') return;
    const ok = confirm(`Confirmer l'annulation de la transaction #${t.id} ?`);
    if (!ok) return;
    this.loading = true;
    this.txService.annulerTransaction(t.id).subscribe({
      next: () => {
        this.loadTransactions();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Annulation impossible';
        this.loading = false;
      },
    });
  }
}
