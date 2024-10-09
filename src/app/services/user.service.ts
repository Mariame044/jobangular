import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { LoginUserDto, Role, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/admins';
  private baseUrl1 = 'http://localhost:8080/api/admins/listerole'; // URL de base pour les professionnels

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  // Méthode pour récupérer les en-têtes
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Récupérer le token JWT
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Ajouter le token aux en-têtes
      // Note : 'Content-Type' ne doit pas être défini ici, car nous utilisons FormData
    });
  }
  register(user: LoginUserDto): Observable<User> {
    return this.http.post<User>(`${this. baseUrl}/professionnels`, user, { headers: this.getHeaders() });
}

getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this. baseUrl}/users`, { headers: this.getHeaders() });
}
getRoles(): Observable<Role[]> {
  return this.http.get<Role[]>(this.baseUrl1 , { headers: this.getHeaders() });
}


  // Autres méthodes pour gérer les professionnels...
}
