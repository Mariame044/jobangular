import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reponse } from '../models/jeuderole';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReponseService {

  private baseUrl = 'http://localhost:8080/api/reponse'; // Remplacez par l'URL de votre API
  constructor(private http: HttpClient, private authService: AuthenticationService) {}

 
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Token:', token);  // Pour déboguer
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }
  // Ajouter une réponse
  ajouterReponse(reponse: Reponse): Observable<Reponse> {
    return this.http.post<Reponse>(this.baseUrl, reponse, { headers: this.getHeaders() });
  }

  // Modifier une réponse
  modifierReponse(id: number, reponse: Reponse): Observable<Reponse> {
    return this.http.put<Reponse>(`${this.baseUrl}/${id}`, reponse, { headers: this.getHeaders() });
  }

  // Supprimer une réponse
  supprimerReponse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Obtenir les détails d'une réponse
  getReponseDetails(id: number): Observable<Reponse> {
    return this.http.get<Reponse>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Obtenir toutes les réponses
  getAllReponses(): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(this.baseUrl, { headers: this.getHeaders() });
  }
}