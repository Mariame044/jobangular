import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role'; // Assurez-vous que le chemin est correct
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'http://localhost:8080/api/admins/listerole'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Récupérer le token JWT
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Ajouter le token aux en-têtes
    });
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl , { headers: this.getHeaders() });
  }
}
