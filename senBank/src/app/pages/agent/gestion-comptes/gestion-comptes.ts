import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CompteService } from '../../../compteservice';

interface Compte {
  id: number;
  nom: string;
  numero: string;
  type: string; // Client ou Distributeur
  statut: string; // Actif ou Bloqué
  date: string;
}

@Component({
  selector: 'app-gestion-comptes',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './gestion-comptes.html',
  styleUrl: './gestion-comptes.css',
})
export class GestionComptes implements OnInit {
  comptes: Compte[] = [];

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.compteService.getAllComptes().subscribe({
      next: (rows: any[]) => {
        // rows contain c.* plus u.nom, u.prenom, u.role, u.dateCreation
        this.comptes = (rows || []).map((r) => {
          const id = r.idCompte ?? r.id ?? 0;
          const fullName = `${r.nom ?? ''} ${r.prenom ?? ''}`.trim();
          const numero = r.numeroCompte ?? '';
          const role = String(r.role ?? '').toLowerCase();
          const type = role === 'distributeur' ? 'Distributeur' : role === 'client' ? 'Client' : (role || '');
          const isBlocked = Number(r.bloquer) === 1 || Number(r.archive) === 1;
          const statut = isBlocked ? 'Bloqué' : 'Actif';
          const date = r.dateCreation ?? '';
          const view: Compte = { id, nom: fullName, numero, type, statut, date };
          return view;
        });
      },
      error: () => {
        this.comptes = [];
      },
    });
  }

  modifier(c: Compte) {
    alert(`Modifier compte ${c.numero}`);
  }

  bloquer(c: Compte) {
    c.statut = 'Bloqué';
  }

  debloquer(c: Compte) {
    c.statut = 'Actif';
  }
}
