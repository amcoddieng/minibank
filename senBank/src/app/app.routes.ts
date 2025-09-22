import { Routes } from '@angular/router';
import { Connexion } from './pages/connexion/connexion';
import { Profil } from './pages/client/profil/profil';
import { Profil2 } from './pages/distributeur/profil2/profil2';
import { Editmdp } from './pages/client/editmdp/editmdp';
import { Transfert } from './pages/client/transfert/transfert';

export const routes: Routes = [
    {path:'connexion',component:Connexion},
    {path:'profilClient',component:Profil},
    {path:'profilDistributeur',component:Profil2},
    {path:'editmdp',component:Editmdp},
    {path:'transfertClient',component:Transfert}
];
 