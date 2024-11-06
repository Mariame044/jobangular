import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Users } from '../models/user';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://localhost:8080/api/modifier'; // Remplacez par l'URL de votre API
  
  constructor(private http: HttpClient, private authService: AuthenticationService ) {}

  // Récupérer l'utilisateur connecté
  getCurrentUser(): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}`, {
      headers: this.getHeaders()
    });
  }

  // Mettre à jour le profil de l'utilisateur
 // Mettre à jour le profil de l'utilisateur
updateUserProfile(userId: number, fullName: string, password: string, confirmPassword: string, p0: string, image?: File): Observable<Users> {
  const formData: FormData = new FormData();
  formData.append('fullName', fullName);
  
  if (password) {
    formData.append('password', password);
  }
  
  if (confirmPassword) {
    formData.append('confirmPassword', confirmPassword);
  }
  
  // Vérifiez si l'image est définie avant de l'ajouter à FormData
  if (image) {
    formData.append('image', image);
  }

  return this.http.put<Users>(`${this.apiUrl}/current`, formData, {
    headers: this.getHeaders(true) // Indiquer que nous envoyons des données multipart
  });
}


  // Méthode pour obtenir les headers
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
  
}