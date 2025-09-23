import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './models/user.model'; // chemin correct vers app/models

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000'; // URL de votre backend Node.js

  constructor(private http: HttpClient) {}

  // Récupérer le profil d'un user
  getProfil(idUsers: number): Observable<{ user: User }> {
    return this.http.post<{ user: User }>(`${this.apiUrl}/profil`, { idUsers });
  }

  // Vérifier si un user existe
  userExiste(iduser: number): Observable<{ user: boolean }> {
    return this.http.post<{ user: boolean }>(`${this.apiUrl}/userExiste`, { iduser });
  }

  // Créer un utilisateur + compte
  creerCompte(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/creerCompte`, payload);
  }

  // Ajoutez d'autres méthodes pour d'autres endpoints (ex. connexion)
}
