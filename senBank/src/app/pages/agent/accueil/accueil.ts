import { HeaderProfil } from './../../../header-profil/header-profil';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../user-service';
import { CompteService } from '../../../compteservice';
import { Compte } from '../../../models/compte.model';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, RouterModule, HeaderProfil, RouterLink, FormsModule],
  templateUrl: './accueil.html',
  styleUrls: ['./accueil.css'],
})
export class Accueil implements OnInit {
  comptes: Compte[] = [];
  loading = false;
  error: string | null = null;
  roleFilter: string = '';

  // Tri & Pagination
  sortKey: 'nom' | 'numeroCompte' | 'role' | 'dateCreation' = 'dateCreation';
  sortDir: 'asc' | 'desc' = 'desc';
  pageSize = 5;
  pageIndex = 0; // 0-based

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  // Charger tous les comptes
  loadAll(): void {
    this.loading = true;
    this.error = null;
    this.compteService.getAllComptes().subscribe({
      next: (data) => {
        this.comptes = Array.isArray(data) ? data : [];
        this.loading = false;
        this.resetPaging();
      },
      error: (err) => {
        this.error = 'Erreur de chargement des comptes';
        this.loading = false;
      },
    });
  }

  // Charger par rôle (client, distributeur)
  loadByRole(): void {
    const role = (this.roleFilter || '').trim();
    if (!role) {
      this.loadAll();
      return;
    }
    this.loading = true;
    this.error = null;
    this.compteService.getComptesByRole(role).subscribe({
      next: (list) => {
        this.comptes = list || [];
        this.loading = false;
        this.resetPaging();
      },
      error: (err) => {
        this.error = err?.error?.error || 'Erreur de chargement par rôle';
        this.loading = false;
      },
    });
  }

  // Helpers tri/pagination
  setSort(key: 'nom' | 'numeroCompte' | 'role' | 'dateCreation'): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.pageIndex = 0;
  }

  resetPaging(): void {
    this.pageIndex = 0;
  }

  nextPage(): void {
    if ((this.pageIndex + 1) * this.pageSize < this.sortedComptes.length) {
      this.pageIndex += 1;
    }
  }

  prevPage(): void {
    if (this.pageIndex > 0) this.pageIndex -= 1;
  }

  get sortedComptes(): Compte[] {
    const copy = [...this.comptes];
    const dir = this.sortDir === 'asc' ? 1 : -1;
    return copy.sort((a: any, b: any) => {
      let va = a?.[this.sortKey];
      let vb = b?.[this.sortKey];
      if (this.sortKey === 'dateCreation') {
        // dates as strings => convert
        va = va ? new Date(va).getTime() : 0;
        vb = vb ? new Date(vb).getTime() : 0;
      }
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }

  get pagedComptes(): Compte[] {
    const start = this.pageIndex * this.pageSize;
    return this.sortedComptes.slice(start, start + this.pageSize);
  }

  // Stats par rôle
  get stats() {
    const counts: Record<string, number> = {};
    for (const c of this.comptes as any[]) {
      const r = (c.role || '').toLowerCase();
      counts[r] = (counts[r] || 0) + 1;
    }
    return counts;
  }
}
