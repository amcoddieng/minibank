import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token'); // côté navigateur
    } else {
      return false; // côté serveur
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.router.navigate(['/connexion']); 
    }
  }
}
