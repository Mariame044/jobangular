import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trancheage, Video } from '../models/video';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { Metier } from '../models/metier';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private baseUrl = 'http://localhost:8080/api/videos';
  private apiUrl = 'http://localhost:8080/api/metiers'; // URL de base de l'API
  private apiUrl1 = 'http://localhost:8080/api/age'; // URL de base de l'API
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
  


  addVideo(formData: FormData): Observable<Video> {
    return this.http.post<Video>(this.baseUrl, formData, { headers: this.getHeaders(true) });
  }

  obtenirToutesLesVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.baseUrl, { headers: this.getHeaders() });
  }



  getVideoById(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateVideo(id: number, video: FormData): Observable<Video> {
    return this.http.put<Video>(`${this.baseUrl}/${id}`, video, { headers: this.getHeaders() });
  }

  deleteVideo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

   // Regarder une vidéo
   regarderVideo(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.baseUrl}/regarder/${id}`, { headers: this.getHeaders() });
  }
    // Méthode pour créer une nouvelle tranche d'âge
    createTrancheAge(tranche: Trancheage): Observable<Trancheage> {
      return this.http.post<Trancheage>(this.apiUrl1, tranche, { headers: this.getHeaders() });
    }
  
    // Méthode pour récupérer toutes les tranches d'âge
    getAllTranchesAge(): Observable<Trancheage[]> {
      return this.http.get<Trancheage[]>(this.apiUrl1 , { headers: this.getHeaders() });
    }
  
    // Méthode pour récupérer une tranche d'âge par ID
    getTrancheAgeById(id: number): Observable<Trancheage> {
      return this.http.get<Trancheage>(`${this.apiUrl1}/${id}`, { headers: this.getHeaders() });
    }
  
    // Méthode pour supprimer une tranche d'âge
    deleteTrancheAge(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl1}/${id}`, { headers: this.getHeaders() });
    }
}
