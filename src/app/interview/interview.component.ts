import { Component, OnInit } from '@angular/core';
import { Interview, Metier } from '../models/interview';
import { InterviewService } from '../services/interview.service';
import { MetierService } from '../services/metier.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Trancheage } from '../models/video';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'],
})
export class InterviewComponent implements OnInit {
  interviews: Interview[] = [];
  newInterview: Interview = { id: 0, duree: '', description: '',titre: '', date: new Date(), url: '', metier: null , trancheage: null};
  selectedFile: File | null = null;
  metiers: Metier[] = [];
  trancheages: Trancheage[] = [];
  errorMessage: string = '';
  searchTerm: string = '';
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  modalInterview: Interview = { id: 0, duree: '', description: '',titre: '', date: new Date(), url: '', metier: null , trancheage: null};
  private unsubscribe$ = new Subject<void>();

  constructor(
    private interviewService: InterviewService,
    private metierService: MetierService,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.loadInterviews();
    this.getAllMetiers();
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
  loadInterviews() {
    this.interviewService.obtenirToutesLesInterview()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (interviews) => {
          this.interviews = this.searchTerm ? interviews.filter(interview =>
            interview.description.toLowerCase().includes(this.searchTerm.toLowerCase())
          ) : interviews;
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des interviews';
        }
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
      this.modalInterview = { id: 0, duree: '', description: '',titre: '', date: new Date(), url: '', metier: null , trancheage: null}; // Réinitialiser pour la création
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalInterview = { id: 0, duree: '', description: '',titre: '', date: new Date(), url: '', metier: null , trancheage: null};
    this.selectedFile = null;
  }

  ajouterOuModifierInterview() {
    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('fichier', this.selectedFile as Blob);
    }

    // Convertir la date au format ISO avant de l'ajouter au formData
    formData.append('duree', this.modalInterview.duree);
    formData.append('description', this.modalInterview.description);
    formData.append('date', this.modalInterview.date.toISOString()); // Ajoutez la date au format ISO
    formData.append('metierId', this.modalInterview.metier?.id.toString() || '');
    formData.append('trancheageId', this.modalInterview.trancheage?.id.toString() || ''); 

    if (this.isEditing) {
      this.interviewService.updateInterview(this.modalInterview.id, formData).subscribe(updatedInterview => {
        const index = this.interviews.findIndex(i => i.id === updatedInterview.id);
        if (index !== -1) {
          this.interviews[index] = updatedInterview;
        }
        this.closeModal();
      });
    } else {
      this.interviewService.addInterview(formData).subscribe(newInterview => {
        this.interviews.push(newInterview);
        this.closeModal();
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  supprimerInterview(id: number) {
    this.interviewService.deleteInterview(id).subscribe(() => {
      this.interviews = this.interviews.filter(interview => interview.id !== id);
    });
  }

  regarderInterview(id: number) {
    this.interviewService.regarderInterview(id).subscribe(interview => {
      console.log(interview);
    });
  }
}
