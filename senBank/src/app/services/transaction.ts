import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private authHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  // Effectuer un dépôt
  depot(idCompte: number, compteDestinataire: string, montant: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/depot`, { idCompte, compteDestinataire, montant }, { headers: this.authHeaders() });
  }

  // Lister toutes les transactions
  getAllTransactions(): Observable<Transaction[]> {
    return this.http
      .get<{ results: Transaction[] }>(`${this.apiUrl}/alltransaction`, { headers: this.authHeaders() })
      .pipe(map((resp) => resp.results || []));
  }

  // Lister transactions par idCompte (source ou destinataire)
  getTransactionsByCompte(idCompte: number): Observable<Transaction[]> {
    return this.http
      .post<{ results: Transaction[] }>(`${this.apiUrl}/alltransactByidCompte`, { idCompte }, { headers: this.authHeaders() })
      .pipe(map((resp) => resp.results || []));
  }

  // Rechercher une transaction par identifiant
  searchTransaction(idtransaction: number): Observable<Transaction[]> {
    const url = `${this.apiUrl}/Searchtransaction?idtransaction=${encodeURIComponent(String(idtransaction))}`;
    return this.http
      .get<{ resultats: Transaction[] }>(url, { headers: this.authHeaders() })
      .pipe(map((resp) => resp.resultats || []));
  }

  // Annuler une transaction par id
  annulerTransaction(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/annulerTransaction`, { idtransaction: id }, { headers: this.authHeaders() });
  }
}
