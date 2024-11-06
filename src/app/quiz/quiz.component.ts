import { Component, OnInit } from '@angular/core';
import { Quiz, Metier } from '../models/jeuderole'; // Assurez-vous que le chemin est correct
import { QuizService } from '../services/quiz.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetierService } from '../services/metier.service'; // Service pour récupérer les métiers
import { Trancheage } from '../models/video';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizzes: Quiz[] = [];
  newQuiz: Quiz = { titre: '', description: '', score: 0, metier: null , trancheage: null}; // Initialisation
  metiers: Metier[] = []; // Pour stocker la liste des métiers
  trancheages: Trancheage[] = [];
  selectedMetierId: number | null = null; // ID du métier sélectionné
  selectedTrancheageId: number | null = null; // ID du métier sélectionné
  isModalOpen = false;

  constructor(
    private quizService: QuizService,
    private metierService: MetierService, // Injecter le service des métiers
    private router: Router,
    private videoService: VideoService,
  ) {}

  ngOnInit(): void {
    this.getAllQuizzes();
    this.getAllMetiers(); // Récupérer les métiers à l'initialisation
    this.getAllTrancheage(); // Récupérez les métiers lors de l'initialisation
  }
  getAllTrancheage(): void {
    this.videoService.getAllTranchesAge().subscribe(
      (data) => {
        this.trancheages = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des métiers', error);
      }
    );
  }
  // Récupérer tous les quizzes
  getAllQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe(
      (data: Quiz[]) => {
        this.quizzes = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des quizzes:', error);
      }
    );
  }

  // Récupérer tous les métiers
  getAllMetiers(): void {
    this.metierService.getAllMetiers().subscribe(
      (data: Metier[]) => {
        console.log('Métiers récupérés:', data); // Debugging
        this.metiers = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des métiers:', error);
      }
    );
  }
// Ajouter un nouveau quiz
ajouterQuiz(): void {
  // Vérifier si un métier est sélectionné
  if (this.selectedMetierId === null) {
      console.error('Aucun métier sélectionné.');
      return; // Ne pas ajouter le quiz si aucun métier n'est sélectionné
  }
  if (this.selectedTrancheageId === null) {
    console.error('Aucun tranche age sélectionné.');
    return; // Ne pas ajouter le quiz si aucun métier n'est sélectionné
}

  // Ajout d'une vérification pour afficher les métiers disponibles
  console.log('ID sélectionné:', this.selectedMetierId);
  console.log('Métiers disponibles:', this.metiers);

  console.log('ID sélectionné:', this.selectedTrancheageId);
  console.log('Tranche age disponibles:', this.trancheages);
  // Préparer le quizDto à envoyer au backend
  const quiz = {
      titre: this.newQuiz.titre,
      description: this.newQuiz.description,
      score: this.newQuiz.score,
      metierId: this.selectedMetierId, // Utiliser metierId au lieu de l'objet metier
      trancheageId: this.selectedTrancheageId // Utiliser metierId au lieu de l'objet metier
  };

  this.quizService.createQuiz(quiz).subscribe(
      (quiz: Quiz) => {
          this.quizzes.push(quiz);
          this.resetForm();
          this.closeModal();
      },
      (error) => {
          console.error('Erreur lors de l\'ajout du quiz:', error);
      }
  );
}

  // Réinitialiser le formulaire
  resetForm(): void {
    this.newQuiz = { titre: '', description: '', score: 0, metier: null , trancheage: null};
    this.selectedMetierId = null; // Réinitialiser l'ID du métier sélectionné
  }

  // Supprimer un quiz
  supprimerQuiz(id: number): void {
    this.quizService.deleteQuiz(id).subscribe(
      () => {
        this.quizzes = this.quizzes.filter(q => q.id !== id);
      },
      (error) => {
        console.error('Erreur lors de la suppression du quiz:', error);
      }
    );
  }

  // Ouvrir le modal
  openModal(): void {
    this.isModalOpen = true;
  }

  // Fermer le modal
  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }
}