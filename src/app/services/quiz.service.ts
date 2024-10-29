import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Quiz } from '../models/jeuderole'; // Ensure correct model path
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8080/api/quiz'; // Change this to your actual API URL

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  // Function to get the headers, including Authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Token:', token);  // For debugging purposes
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  // Get all quizzes
  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get a quiz by ID
  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

   // Créer un quiz
   createQuiz(quizDto: { titre: string; description: string; score: number; metierId: number }): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, quizDto, {
      headers: this.getHeaders(), // Si vous avez des en-têtes spécifiques à ajouter
    }).pipe(
      catchError(this.handleError) // Gestion des erreurs
    );
  }


  // Update an existing quiz
  updateQuiz(id: number, quiz: Quiz): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/${id}`, quiz, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a quiz
  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling method
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Something went wrong'));
  }
}
