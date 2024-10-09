import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jeuderole, Question } from '../models/jeuderole';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class JeuderoleService {
  private baseUrl = 'http://localhost:8080/api/jeux';

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  // Méthode pour obtenir les en-têtes avec le token JWT
  private getHeaders(isMultipart: boolean = false): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  
    if (!isMultipart) {
      headers = headers.set('Content-Type', 'application/json');
    }
  
    return headers;
  }
  
  getAllJeuxDeRole(): Observable<Jeuderole[]> {
    return this.http.get<Jeuderole[]>(this.baseUrl, { headers: this.getHeaders() });
  }


  ajouterJeuDeRole(formData: FormData): Observable<Jeuderole> {
    return this.http.post<Jeuderole>(this.baseUrl, formData, { headers: this.getHeaders(true) });
  }


  modifierJeuDeRole(formData: FormData): Observable<Jeuderole> {
    return this.http.put<Jeuderole>(`${this.baseUrl}`, formData);
  }

  // Supprimer un jeu de rôle
  supprimerJeuDeRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Obtenir les détails d'un jeu de rôle
  getJeuDeRoleDetails(id: number): Observable<Jeuderole> {
    return this.http.get<Jeuderole>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Jouer un jeu de rôle et obtenir les questions
  jouer(jeuId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/${jeuId}/jouer`, { headers: this.getHeaders() });
  }

  // Vérifier la réponse d'un enfant
  verifierReponse(enfantId: number, jeuId: number, questionId: number, reponseDonnee: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/${jeuId}/verifier-reponse`, 
      { enfantId, questionId, reponseDonnee },
      { headers: this.getHeaders() }
    );
  }

  // Calculer le score d'un enfant
  calculerScore(enfantId: number, jeuId: number, reponsesDonnees: Map<number, string>): Observable<number> {
    const body = Object.fromEntries(reponsesDonnees);
    return this.http.post<number>(`${this.baseUrl}/${jeuId}/calculer-score`, body, { headers: this.getHeaders() });
  }
}