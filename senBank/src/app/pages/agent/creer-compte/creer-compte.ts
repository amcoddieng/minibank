import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../../user-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-creer-compte',
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  templateUrl: './creer-compte.html',
  styleUrl: './creer-compte.css',
})
export class CreerCompte {
  model = {
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '' as any,
    datenais: '',
    lieunais: '',
    nin: '',
    role: 'client',
    photo: '' as string | null,
  };

  loading = false;
  message: string | null = null;
  error: string | null = null;
  createdNumero: string | null = null;

  constructor(private userService: UserService) {}

  onSubmit() {
    this.message = null;
    this.error = null;
    this.loading = true;
    const payload = {
      nom: this.model.nom,
      prenom: this.model.prenom,
      adresse: this.model.adresse || '',
      telephone: Number(this.model.telephone),
      datenais: this.model.datenais || '2000-01-01',
      lieunais: this.model.lieunais || '',
      nin: this.model.nin || '',
      role: this.model.role, // 'client' | 'distributeur'
      photo: this.model.photo || null,
    };

    this.userService.creerCompte(payload).subscribe({
      next: (resp) => {
        this.createdNumero = resp?.compte?.numeroCompte ?? null;
        this.message = this.createdNumero
          ? `Compte créé avec succès. N° Compte: ${this.createdNumero}`
          : (resp?.message || 'Compte créé avec succès');
        this.loading = false;
        // reset form
        this.model = {
          nom: '',
          prenom: '',
          adresse: '',
          telephone: '' as any,
          datenais: '',
          lieunais: '',
          nin: '',
          role: 'client',
          photo: '' as string | null,
        };
      },
      error: (err) => {
        this.error = err?.error?.error || 'Erreur lors de la création du compte';
        this.loading = false;
      },
    });
  }
}