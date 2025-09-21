import { Routes } from '@angular/router';
import { Connexion } from './pages/connexion/connexion';
import { Profil } from './pages/client/profil/profil';

export const routes: Routes = [
    {path:'connexion',component:Connexion},
    {path:'profilClient',component:Profil}
];
