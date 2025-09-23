import { Routes } from '@angular/router';
import { Connexion } from './pages/connexion/connexion';
import { Profil } from './pages/agent/profil/profil';
import { Accueil } from './pages/agent/accueil/accueil';
import { Annulation } from './pages/agent/annulation/annulation';
import { Crediter } from './pages/agent/crediter/crediter';
import { GestionComptes } from './pages/agent/gestion-comptes/gestion-comptes';
import { CreerCompte } from './pages/agent/creer-compte/creer-compte';
import { Modifiermdp } from './pages/agent/modifiermdp/modifiermdp';
import { Transfert } from './pages/client/transfert/transfert';
import { EditmdpDist } from './pages/distributeur/editmdp-dist/editmdp-dist';
import { Depot } from './pages/distributeur/depot/depot';
import { Retrait } from './pages/distributeur/retrait/retrait';
import { TransfertDistributeur } from './pages/distributeur/transfert-distributeur/transfert-distributeur';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
<<<<<<< HEAD
    { path: 'connexion', component: Connexion },
    { path: '', component: Accueil },
    { path: 'profil', component: Profil },
    { path: 'annulation', component: Annulation },
    { path: 'crediter', component: Crediter },
    { path: 'gestion-comptes', component: GestionComptes },
    { path: 'creer-compte', component: CreerCompte },
    { path: 'modifiermdp', component: Modifiermdp },
    { path: 'transfertClient',component:Transfert},
    { path: 'editPassordDis',component:EditmdpDist},
    { path: 'depot',component:Depot},
    { path: 'retrait',component:Retrait},
    { path: 'transfertDistributeur',component:TransfertDistributeur}
];
=======
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
>>>>>>> 0f8c984454fd254c5957e697a47ac81247dfaead
