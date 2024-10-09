import { Component, OnInit } from '@angular/core';
import { Interview, Metier } from '../models/interview';
import { InterviewService } from '../services/interview.service';
import { MetierService } from '../services/metier.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'], // Correction ici
})
export class InterviewComponent implements OnInit {
  interviews: Interview[] = [];
  newInterview: Interview = { id: 0, duree: '', description: '', date: new Date(), url: '', metier: null };
  selectedFile: File | null = null;
  metiers: Metier[] = [];
  errorMessage: string = '';
  searchTerm: string = '';
  isModalOpen: boolean = false; // Indique si le modal est ouvert
  isEditing: boolean = false; // Indique si nous sommes en mode édition
  modalInterview: Interview = { id: 0, duree: '', description: '', date: new Date(), url: '', metier: null };
  private unsubscribe$ = new Subject<void>(); // Subject pour gérer les désabonnements
  constructor(
    private interviewService: InterviewService,
    private metierService: MetierService
  ) {}

  ngOnInit(): void {
    this.obtenirToutesLesInterviews(); // Correction ici
    this.getAllMetiers(); 
    this.loadInterview();// Récupérez les métiers lors de l'initialisation
  }
  loadInterview() {
    this.interviewService.obtenirToutesLesInterview()
      .pipe(takeUntil(this.unsubscribe$)) // Désabonnement lors de la destruction du composant
      .subscribe({
        next: (interviews) => {
          this.interviews = this.searchTerm ? interviews.filter(interview =>
            interview.description.toLowerCase().includes(this.searchTerm.toLowerCase())
          ) : interviews; // Filtrer si un terme de recherche existe
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des catégories';
        }
      });
  }


  obtenirToutesLesInterviews() { // Correction de la méthode
    this.interviewService.obtenirToutesLesInterview().subscribe(interviews => {
      this.interviews = interviews;
    });
  }

  getAllMetiers(): void {
    this.metierService.getAllMetiers().subscribe(
      (data) => {
        this.metiers = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des métiers', error);
      }
    );
  }

  openModal(mode: 'create' | 'edit', interview?: Interview) {
    this.isModalOpen = true;
    this.isEditing = mode === 'edit';

    if (this.isEditing && interview) {
      this.modalInterview = { ...interview }; // Remplissez le modal avec les données de l'interview à éditer
    } else {
      this.modalInterview = { id: 0, duree: '', description: '', date: new Date(), url: '', metier: null }; // Réinitialiser pour la création
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalInterview = { id: 0, duree: '', description: '', date: new Date(), url: '', metier: null }; // Réinitialiser le formulaire modal lors de la fermeture
    this.selectedFile = null; // Réinitialiser le fichier sélectionné
  }

  ajouterOuModifierInterview() {
    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('fichier', this.selectedFile as Blob);
    }

    formData.append('duree', this.modalInterview.duree);
    formData.append('description', this.modalInterview.description);
    formData.append('metierId', this.modalInterview.metier?.id.toString() || ''); // Convertir en chaîne

    if (this.isEditing) {
      // Mise à jour d'une interview existante
      this.interviewService.updateInterview(this.modalInterview.id, formData).subscribe(updatedInterview => {
        const index = this.interviews.findIndex(i => i.id === updatedInterview.id);
        if (index !== -1) {
          this.interviews[index] = updatedInterview; // Met à jour l'interview existante
        }
        this.closeModal(); // Ferme le modal
      });
    } else {
      // Ajout d'une nouvelle interview
      this.interviewService.addInterview(formData).subscribe(newInterview => {
        this.interviews.push(newInterview);
        this.closeModal(); // Ferme le modal après l'ajout
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  supprimerInterview(id: number) { // Renommé pour correspondre à la logique
    this.interviewService.deleteInterview(id).subscribe(() => {
      this.interviews = this.interviews.filter(interview => interview.id !== id);
    });
  }

  regarderInterview(id: number) { // Renommé pour correspondre à la logique
    this.interviewService.regarderInterview(id).subscribe(interview => {
      console.log(interview);
    });
  }
}
