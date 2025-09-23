
import { Routes } from '@angular/router';
import { Connexion } from './pages/connexion/connexion';
import { Profil } from './pages/client/profil/profil';
import { Profil2 } from './pages/distributeur/profil2/profil2';
import { Editmdp } from './pages/client/editmdp/editmdp';
import { Transfert } from './pages/client/transfert/transfert';
import { EditmdpDist } from './pages/distributeur/editmdp-dist/editmdp-dist';
import { Depot } from './pages/distributeur/depot/depot';
import { Retrait } from './pages/distributeur/retrait/retrait';
import { TransfertDistributeur } from './pages/distributeur/transfert-distributeur/transfert-distributeur';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'connexion', component: Connexion },
  { path: 'profilClient', component: Profil, canActivate: [authGuard] },
  { path: 'profilDistributeur', component: Profil2, canActivate: [authGuard] },
  { path: 'editmdp', component: Editmdp, canActivate: [authGuard] },
  { path: 'transfertClient', component: Transfert, canActivate: [authGuard] },
  { path: 'editPassordDis', component: EditmdpDist, canActivate: [authGuard] },
  { path: 'depot', component: Depot, canActivate: [authGuard] },
  { path: 'retrait', component: Retrait, canActivate: [authGuard] },
  { path: 'transfertDistributeur', component: TransfertDistributeur, canActivate: [authGuard] }
];
