import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // true si token existe
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('compte');
    localStorage.removeItem('user');
  }
}
