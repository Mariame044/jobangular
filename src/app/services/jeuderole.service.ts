import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jeuderole } from '../models/jeuderole';

@Injectable({
  providedIn: 'root'
})
export class JeuderoleService {
  private apiUrl = 'http://localhost:8080/jeux';

  constructor(private http: HttpClient) {}

  ajouterJeuDeRole(formData: FormData): Observable<Jeuderole> {
    return this.http.post<Jeuderole>(`${this.apiUrl}/ajouter`, formData);
  }
  getJeuxDeRole(): Observable<Jeuderole[]> {
    return this.http.get<Jeuderole[]>(this.apiUrl);
  }
}
