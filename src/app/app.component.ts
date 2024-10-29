import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import {  MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, LoginComponent,MatToolbarModule, MatIcon, RouterModule, MatSidenavModule, MatNavList]
})
export class AppComponent {
  isOpened: boolean = false;
  


 
  constructor(public router: Router,public authService: AuthenticationService) {
    this.logIN = this.authService.isLoggedIn();
  
  }
  toggleSidebar(): void {
    this.isOpened = !this.isOpened;
  }

  // Méthode pour fermer la sidebar
  closeSidebar(): void {
    this.isOpened = false;
  }
  logIN: boolean = false;

  
   
  
 

  // Méthode pour mettre à jour l'état de connexion
  verifier(isLoggedIn: boolean): void {
    this.logIN = isLoggedIn;
  
    
  }
     // Méthode de déconnexion
  logout(): void {
    this.authService.logout(); // Appel du service d'authentification pour se déconnecter
    this.logIN = false; // Mettre à jour l'état de connexion
    this.router.navigate(['/login']); // Rediriger vers la page de connexion
  }
   // Écouteur d'événements pour gérer la taille de l'écran
   @HostListener('window:resize', ['$event'])
   onResize(event: Event): void {
     const newWidth = (event.target as Window).innerWidth; // Utilisation de window sur l'objet de l'événement
     if (newWidth > 768) {
       this.isOpened = true; // Ouvrir la sidebar sur les écrans larges
     } else {
       this.isOpened = false; // Fermer la sidebar sur les petits écrans
     }
   }
}
