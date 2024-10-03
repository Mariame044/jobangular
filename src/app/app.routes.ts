import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CategorieComponent } from './categorie/categorie.component';
import { ProfessionnelComponent } from './professionnel/professionnel.component';
import { MetierComponent } from './metier/metier.component';
import { VideoComponent } from './video/video.component';

export const routes: Routes = [
    
    { path: 'login', component: LoginComponent },
    { path: 'professionnel', component: ProfessionnelComponent },
    { path: 'metier', component: MetierComponent },
    { path: 'video', component: VideoComponent },
  
    { path: 'dashboard', component: DashboardComponent },
    { path: 'categorie', component: CategorieComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
    
];
