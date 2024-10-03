import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Categorie } from '../models/categorie';


@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private baseUrl = 'http://localhost:8080/api/categories'; 
  private baseUrl1 = 'http://localhost:8080/api/enfants/liste';// URL de votre API

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

 
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Token:', token);  // Pour déboguer
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }
  
  

  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.baseUrl1, { headers: this.getHeaders() });
  }

  getCategorieById(categorie:Categorie): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.baseUrl}`, { headers: this.getHeaders() });
  }

  createCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.baseUrl}/creer`, categorie, { headers: this.getHeaders() });
  }
  
  updateCategorie(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.baseUrl}/${id}`, categorie, { headers: this.getHeaders() });
  }

  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}
