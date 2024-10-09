import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/jeuderole';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private baseUrl = 'http://localhost:8080/api/question'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

 
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Token:', token);  // Pour déboguer
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  // Ajouter une question
  ajouterQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.baseUrl, question, { headers: this.getHeaders() });
  }

  // Modifier une question
  modifierQuestion(id: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.baseUrl}/${id}`, question, { headers: this.getHeaders() });
  }

  // Supprimer une question
  supprimerQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Obtenir les détails d'une question
  getQuestionDetails(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Obtenir toutes les questions
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.baseUrl, { headers: this.getHeaders() });
  }
}