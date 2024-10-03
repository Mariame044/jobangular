import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "../login/login.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, LoginComponent]
})
export class SidebarComponent {
  isOpened: boolean = false; // État d'ouverture du sidenav


  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  // Méthode de déconnexion
  // logout(): void {
  //   this.authService.logout();
  //   this.logIN = false;
  //   this.router.navigate(['login']).then(() => {
  //     location.reload();
  //   });
  // }

  // Méthode pour basculer l'état de la sidebar
  toggleSidebar(): void {
    this.isOpened = !this.isOpened;
  }

  // Méthode pour fermer la sidebar
  closeSidebar(): void {
    this.isOpened = false;
  }
  logIN: boolean = false;

  ngOnInit(): void {
    let auth = localStorage.getItem('authToken');
    if (auth != null) {
      this.logIN = true;
    }
  }

  verifier(value:any) {    
    this.logIN = value;
  }
  logout() {
    localStorage.clear();
    this.logIN = false;
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
