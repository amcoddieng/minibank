import { Routes } from '@angular/router';
import { Connexion } from './pages/connexion/connexion';
import { Profil } from './pages/agent/profil/profil';
import { Accueil } from './pages/agent/accueil/accueil';
import { Annulation } from './pages/agent/annulation/annulation';
import { Crediter } from './pages/agent/crediter/crediter';
import { GestionComptes } from './pages/agent/gestion-comptes/gestion-comptes';
import { CreerCompte } from './pages/agent/creer-compte/creer-compte';
import { Modifiermdp } from './pages/agent/modifiermdp/modifiermdp';

export const routes: Routes = [
  { path: 'connexion', component: Connexion },
  { path: '', component: Accueil },
  { path: 'profil', component: Profil },
  { path: 'annulation', component: Annulation },
  { path: 'crediter', component: Crediter },
  { path: 'gestion-comptes', component: GestionComptes },
  { path: 'creer-compte', component: CreerCompte },
  { path: 'modifiermdp', component: Modifiermdp },
];
