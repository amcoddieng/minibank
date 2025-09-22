import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, RouterModule],
  templateUrl: './gestion-comptes.html',
  styleUrl: './gestion-comptes.css',
})
export class GestionComptes {
  comptes: Compte[] = [
    {
      id: 1,
      nom: 'Amadou Seye',
      numero: '1234565',
      type: 'Distributeur',
      statut: 'Actif',
      date: '16/09/2025 14:00',
    },
    {
      id: 2,
      nom: 'Amadou Seye',
      numero: '1234565',
      type: 'Client',
      statut: 'Bloqué',
      date: '16/09/2025 14:00',
    },
    {
      id: 3,
      nom: 'Amadou Seye',
      numero: '1234565',
      type: 'Client',
      statut: 'Actif',
      date: '16/09/2025 14:00',
    },
  ];

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
