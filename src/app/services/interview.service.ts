import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { Interview } from '../models/interview';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private baseUrl = 'http://localhost:8080/api/interview';
 // URL de base de l'API
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
  


  addInterview(formData: FormData): Observable<Interview> {
    return this.http.post<Interview>(this.baseUrl, formData, { headers: this.getHeaders(true) });
  }

  obtenirToutesLesInterview(): Observable<Interview[]> {
    return this.http.get<Interview[]>(this.baseUrl, { headers: this.getHeaders() });
  }



  getInterviewById(id: number): Observable<Interview> {
    return this.http.get<Interview>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateInterview(id: number, interview: FormData): Observable<Interview> {
    return this.http.put<Interview>(`${this.baseUrl}/${id}`, interview, { headers: this.getHeaders() });
  }

  deleteInterview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

   // Regarder une vidéo
   regarderInterview(id: number): Observable<Interview> {
    return this.http.get<Interview>(`${this.baseUrl}/regarder/${id}`, { headers: this.getHeaders() });
  }
}
