import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CategorieComponent } from './categorie/categorie.component';
import { ProfessionnelComponent } from './professionnel/professionnel.component';
import { MetierComponent } from './metier/metier.component';
import { VideoComponent } from './video/video.component';
import { InterviewComponent } from './interview/interview.component';
import { ProfileComponent } from './profile/profile.component';
import { JeuxComponent } from './jeux/jeux.component';
import { QuestionComponent } from './question/question.component';
import { ReponseComponent } from './reponse/reponse.component';
import { QuizComponent } from './quiz/quiz.component';

export const routes: Routes = [
    
    { path: 'login', component: LoginComponent },
    { path: 'jeux', component: JeuxComponent },
    { path: 'professionnel', component: ProfessionnelComponent },
    { path: 'metier', component: MetierComponent },
    { path: 'video', component: VideoComponent },
    { path: 'interview', component: InterviewComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'question', component: QuestionComponent },
    { path: 'reponse', component: ReponseComponent },
    { path: 'quiz', component: QuizComponent },
  
    { path: 'dashboard', component: DashboardComponent },
    { path: 'categorie', component: CategorieComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
    
];
