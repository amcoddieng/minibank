import { Component } from '@angular/core';
import { HeaderComponents } from './header/header';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Accueil } from './pages/agent/accueil/accueil';
import { GestionComptes } from './pages/agent/gestion-comptes/gestion-comptes';
import { Profil } from './pages/client/profil/profil';
import { Annulation } from './pages/agent/annulation/annulation';
import { Crediter } from './pages/agent/crediter/crediter';
import { Connexion } from './pages/connexion/connexion';
import { CreerCompte } from './pages/agent/creer-compte/creer-compte';
import { Modifiermdp } from './pages/agent/modifiermdp/modifiermdp';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponents,
    RouterOutlet,
    RouterModule,
    Connexion,
    Accueil,
    GestionComptes,
    Profil,
    Annulation,
    Crediter,
    CreerCompte,
    Modifiermdp,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
