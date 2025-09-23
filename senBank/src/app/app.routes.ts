
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

export const routes: Routes = [
    {path:'connexion',component:Connexion},
    {path:'profilClient',component:Profil},
    {path:'profilDistributeur',component:Profil2},
    {path:'editmdp',component:Editmdp},
    {path:'transfertClient',component:Transfert},
    {path:'editPassordDis',component:EditmdpDist},
    {path:'depot',component:Depot},
    {path:'retrait',component:Retrait},
    {path:'transfertDistributeur',component:TransfertDistributeur}
];
  