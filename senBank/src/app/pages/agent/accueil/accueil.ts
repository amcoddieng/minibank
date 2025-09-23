import { HeaderProfil } from './../../../header-profil/header-profil';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../../user-service';
import { CompteService } from '../../../compteservice';
import { Compte } from '../../../models/compte.model';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, RouterModule, HeaderProfil, RouterLink],
  templateUrl: './accueil.html',
  styleUrls: ['./accueil.css'],
})
export class Accueil implements OnInit {
  comptes: Compte[] = [];
  loading = false;
  error: string | null = null;

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  private loadComptes(): void {
    this.loading = true;
    this.error = null;
    this.compteService.getAllComptes().subscribe({
      next: (data) => {
        this.comptes = Array.isArray(data) ? data : [];
      },
      error: () => {
        this.error = 'Erreur de chargement des comptes';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
