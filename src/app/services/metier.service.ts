import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Metier } from '../models/metier';
import {  AuthenticationService } from '../services/authentication.service'; // Assurez-vous d'importer AuthService
import { Categorie } from '../models/categorie';

@Injectable({
  providedIn: 'root'
})
export class MetierService {
  private apiUrl = 'http://localhost:8080/api/metiers/ajout';
  private apiUrl1 = 'http://localhost:8080/api/enfants';
  private baseUrl = 'http://localhost:8080/api/enfants/liste';
  private baseUr = 'http://localhost:8080';

  
  constructor(private http: HttpClient, private authService: AuthenticationService) {}
  // Mettez à jour l'URL de votre API

 

  
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
  

  
  // Récupérer tous les métiers
  getAllMetiers(): Observable<Metier[]> {
    return this.http.get<Metier[]>(this.apiUrl1, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError) // Gérer les erreurs ici
      );
  }
  getImage(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/uploads/images/${filename}`, {
      headers: this.getHeaders(),
      responseType: 'blob'  // Utilisation correcte de 'blob' sans typage additionnel
    });
}


  creerMetier(formData: FormData): Observable<Metier> {
    return this.http.post<Metier>(this.apiUrl, formData, { headers: this.getHeaders(true) });
  }
  

  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  deleteMetier(id: number): Observable<void> {
    const deleteUrl = `http://localhost:8080/api/metiers/${id}`;
    return this.http.delete<void>(deleteUrl, { headers: this.getHeaders() });
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error('Une erreur est survenue', error);
    return throwError(() => new Error('Erreur lors de l\'appel API'));
  }
}
