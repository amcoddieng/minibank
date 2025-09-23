import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../../models/transaction.model';
import { TransactionService } from '../../../services/transaction';

@Component({
  selector: 'app-annulation',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  templateUrl: './annulation.html',
  styleUrls: ['./annulation.css'],
})
export class Annulation implements OnInit {
  loading = false;
  error: string | null = null;
  transactions: Transaction[] = [];
  // UI state
  filterType: 'all' | 'transfert' | 'depot' | 'retrait' = 'all';
  idCompteFilter: number | null = null;
  searchId: number | null = null;

  constructor(private txService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;
    this.error = null;
    this.txService.getAllTransactions().subscribe({
      next: (list) => {
        this.transactions = this.applyTypeFilter(list);
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      },
    });
  }

  // Filter on client-side by type
  private applyTypeFilter(list: Transaction[]): Transaction[] {
    if (this.filterType === 'all') return list;
    return list.filter((t) => t.type === this.filterType);
  }

  onFilterTypeChange(type: 'all' | 'transfert' | 'depot' | 'retrait') {
    this.filterType = type;
    this.loadTransactions();
  }

  // Load by account using backend POST /alltransactByidCompte
  loadByCompte() {
    if (this.idCompteFilter == null || isNaN(this.idCompteFilter)) {
      this.error = "Veuillez renseigner un idCompte valide";
      return;
    }
    this.loading = true;
    this.error = null;
    this.txService.getTransactionsByCompte(this.idCompteFilter).subscribe({
      next: (list) => {
        this.transactions = this.applyTypeFilter(list);
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors du chargement par compte';
        this.loading = false;
      },
    });
  }

  // Search by transaction id using POST /Searchtransaction
  search() {
    if (this.searchId == null || isNaN(this.searchId)) {
      this.error = "Veuillez saisir un id de transaction valide";
      return;
    }
    this.loading = true;
    this.error = null;
    this.txService.searchTransaction(this.searchId).subscribe({
      next: (list) => {
        this.transactions = this.applyTypeFilter(list);
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors de la recherche';
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
