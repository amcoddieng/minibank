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

  // Lister les comptes par rôle
  getComptesByRole(role: string): Observable<Compte[]> {
    return this.http.get<{ comptes: Compte[] }>(`${this.apiUrl}/comptesByrole/${encodeURIComponent(role)}`)
      .pipe(
        // Mapper l'objet { comptes } vers un tableau direct
        (source) => new Observable<Compte[]>((subscriber) => {
          const sub = source.subscribe({
            next: (resp) => subscriber.next(resp?.comptes ?? []),
            error: (err) => subscriber.error(err),
            complete: () => subscriber.complete(),
          });
          return () => sub.unsubscribe();
        })
      );
  }

  // Ajoutez pour /creerCompte, /editpassword, etc.
}
