import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
// import { Account } from '../../../services/account';

@Component({
  selector: 'app-crediter',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './crediter.html',
  styleUrl: './crediter.css',
  // providers: [Account],
})
export class Crediter {
  accountId!: number;
  montant!: number;
  message = '';

  // onSubmit() {
  //   this.accountService.creditAccount(this.accountId, this.montant).subscribe({
  //     next: () => (this.message = 'Compte crédité avec succès !'),
  //     error: () => (this.message = 'Erreur lors du crédit'),
  //   });
  // }
}
