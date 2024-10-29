import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../services/question.service';
import { JeuderoleService } from '../services/jeuderole.service';
import { Jeuderole, Question, Quiz, Reponse, TypeQuestion } from '../models/jeuderole';
import { Subject, takeUntil } from 'rxjs';
import { ReponseService } from '../services/reponse.service';
import { QuizService } from '../services/quiz.service';
import { Trancheage } from '../models/video';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  newQuestion: Question = { point: 0, texte: '', typeQuestion: TypeQuestion.Quiz };
  reponses: Reponse[] = [];  // Stocker les réponses disponibles
  types = Object.values(TypeQuestion);
  jeuxDeRole: Jeuderole[] = [];  // Liste des jeux de rôle disponibles
  quiz: Quiz[] = [];  // Liste des jeux de rôle disponibles
  selectedJeuDeRoleId: number | null = null; // ID du jeu de rôle sélectionné
 
  selectedQuizId: number | null = null; // ID du jeu de rôle sélectionné
  errorMessage: string | null = null;
  loading = false;
  isModalOpen = false; // État d'ouverture du modal
  private unsubscribe$ = new Subject<void>();

  constructor(
    private questionService: QuestionService,
    private reponseService: ReponseService,
    private jeuderoleService: JeuderoleService,
    private quizService: QuizService,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.loadReponses();
    this.loadQuestions();
    this.loadJeuxDeRole();
    this.loadQuiz();
    
  }
 
  loadReponses(): void {
    this.reponseService.getAllReponses()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.reponses = data;
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des réponses';
        }
      });
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.questions = data;
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des questions';
        }
      });
  }

  loadJeuxDeRole(): void {
    this.jeuderoleService.getAllJeuxDeRole()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.jeuxDeRole = data;
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des jeux de rôle';
        }
      });
  }
  loadQuiz(): void {
    this.quizService.getAllQuizzes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.quiz = data;
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des jeux de rôle';
        }
      });
  }
  ajouterQuestion(): void {
    if (this.newQuestion.texte && this.newQuestion.point) {
      
      if (this.newQuestion.typeQuestion === TypeQuestion.Quiz) {
        this.newQuestion.quizId = this.selectedQuizId; // Ajustez cet ID selon vos besoins
      } else if (this.newQuestion.typeQuestion === TypeQuestion.JEU_DE_ROLE) {
        this.newQuestion.jeuDeRoleId = this.selectedJeuDeRoleId; // ID sélectionné du jeu de rôle
      }
  
      this.loading = true;
  
      this.questionService.ajouterQuestion(this.newQuestion).subscribe({
        next: (response) => {
          this.questions.push(response);
          this.resetForm();
          this.closeModal(); // Fermer le modal après l'ajout
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Erreur lors de l\'ajout de la question';
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
    }
  }
  

  supprimerQuestion(id: number): void {
    this.questionService.supprimerQuestion(id).subscribe({
      next: () => {
        this.questions = this.questions.filter(q => q.id !== id);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression de la question';
      }
    });
  }

  resetForm(): void {
    this.newQuestion = { point: 0, texte: '', typeQuestion: TypeQuestion.Quiz };
    this.selectedJeuDeRoleId = null; // Réinitialiser l'ID du jeu de rôle sélectionné
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm(); // Réinitialiser le formulaire lorsque le modal se ferme
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
