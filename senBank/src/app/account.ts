import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Account {
  private apiUrl = 'http://localhost:3000/accounts';

  constructor(private http: HttpClient) {}

  creditAccount(accountId: number, montant: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${accountId}/credit`, { montant });
  }
}
