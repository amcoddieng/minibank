import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compte } from './models/compte.model';

@Injectable({
  providedIn: 'root',
})
export class CompteService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Récupérer le solde
  getSolde(idUser: number): Observable<{ solde: number }> {
    return this.http.post<{ solde: number }>(`${this.apiUrl}/solde`, { idUser });
  }

  // Lister tous les comptes
  getAllComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/comptes`);
  }

  // Ajoutez pour /creerCompte, /editpassword, etc.
}
