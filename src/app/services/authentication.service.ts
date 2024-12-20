import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reprep } from '../models/reprep';

@Injectable({
  providedIn: 'root', // Standalone, vous n'avez pas besoin de l'importer dans un module.
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:8080/auth'; // URL de votre API backend

  constructor(private http: HttpClient) {}

  // Fonction pour se connecter
  login(credentials: { email: string; password: string }): Observable<Reprep> {
    return this.http.post<Reprep>(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string): void {
    // Sauvegarde le token dans le localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt', token);
    }
  }

  getToken(): string | null {
    // Récupère le token depuis le localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt');
    }
    return null;
  }
 
  // Fonction pour se déconnecter
  logout(): void {
    // Retire le token du localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt');
     
    }
  }

  // Vérification si l'utilisateur est connecté
  isLoggedIn(): boolean {
    // Vérifie la disponibilité du localStorage avant d'accéder à l'élément
    return typeof window !== 'undefined' && !!this.getToken();
  }

 // Vérifie si l'utilisateur a le rôle d'admin
 isAdmin(): boolean {
  const role = localStorage.getItem('role'); // Récupère le rôle du localStorage
  return role === 'ADMIN'; // Vérifie si le rôle est ADMIN
}

// Vérifie si l'utilisateur a le rôle de professionnel
isProfessional(): boolean {
  const role = localStorage.getItem('role'); // Récupère le rôle du localStorage
  return role === 'PROFESSIONNEL'; // Vérifie si le rôle est PROFESSIONNEL
}

  // private decodeToken(token: string): any {
  //   try {
  //     const payload = token.split('.')[1];
  //     const decoded = JSON.parse(atob(payload));
  //     console.log('Decoded Token Payload:', decoded); // Debug
  //     return decoded; 
  //   } catch (e) {
  //     console.error('Token decoding error:', e);
  //     return null; 
  //   }
  // }


}

