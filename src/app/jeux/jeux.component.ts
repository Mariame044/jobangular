import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Jeuderole, Metier } from '../models/jeuderole';
import { JeuderoleService } from '../services/jeuderole.service';
import { MetierService } from '../services/metier.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Trancheage } from '../models/video';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-jeux',
  standalone: true,  // Composant standalone
  imports: [CommonModule, FormsModule],  // Import des modules nécessaires
  templateUrl: './jeux.component.html',
  styleUrls: ['./jeux.component.css']
})
export class JeuxComponent implements OnInit, OnDestroy {
  jeuxderole: Jeuderole[] = [];
  newJeuderole: Jeuderole = { id: 0, description: '', nom: '', imageUrl: '', audioUrl: '', metier: null , trancheage: null};
  imageFile: File | null = null;
  audioFile: File | null = null;

  metiers: Metier[] = [];
  trancheages: Trancheage[] = [];
  searchTerm: string = '';
  isEditing: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private videoService: VideoService,
    private jeuderoleService: JeuderoleService,
    private metierService: MetierService
  ) {}

  ngOnInit(): void {
    this.getAllTrancheage(); // Récupérez les métiers lors de l'initialisation
    this.obtenirToutesLesjeuderoles();
    this.getAllMetiers();
  }

  loadjeuderole(): void {
    this.jeuderoleService.getAllJeuxDeRole()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (jeuxderole) => {
          this.jeuxderole = this.searchTerm
            ? jeuxderole.filter(jeuderole => jeuderole.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
            : jeuxderole;
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des jeux de rôle';
        }
      });
  }

  obtenirToutesLesjeuderoles(): void {
    this.jeuderoleService.getAllJeuxDeRole().subscribe(
      (jeuxderole) => {
        this.jeuxderole = jeuxderole;
      },
      (error) => {
        console.error('Erreur lors du chargement des jeux de rôle', error);
        this.errorMessage = 'Erreur lors du chargement des jeux de rôle';
      }
    );
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

  onImageChange(event: any): void {
    this.imageFile = event.target.files[0];
  }
  onAudioChange(event: any): void {
    this.audioFile = event.target.files[0];
  }
  
  createjeuderole(): void {
    if (this.newJeuderole.nom && this.newJeuderole.description && this.imageFile && this.audioFile &&this.newJeuderole.metier && this.newJeuderole.trancheage) {
      const formData = new FormData();
      formData.append('image', this.imageFile);
      formData.append('audio', this.audioFile);
      formData.append('nom', this.newJeuderole.nom);
      formData.append('description', this.newJeuderole.description);
      formData.append('metierId', String(this.newJeuderole.metier.id));
      formData.append('trancheageId', String(this.newJeuderole.trancheage.id));

      this.loading = true;
      this.errorMessage = null;

      this.jeuderoleService.ajouterJeuDeRole(formData).subscribe(
        (response: Jeuderole) => {
          this.loading = false;
          this.jeuxderole.push(response);
          this.resetForm();
          this.closeModal();
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          console.error('Erreur lors de l\'ajout du jeu de rôle', error);
          this.errorMessage = 'Échec de l\'ajout du jeu de rôle. Veuillez réessayer.';
        }
      );
    } else {
      alert('Veuillez fournir tous les champs requis (image, nom, description et métier).');
    }
  }

  resetForm(): void {
    this.newJeuderole = { id: 0, nom: '', description: '', imageUrl: '',audioUrl: '', metier: null , trancheage: null};
    this.imageFile = null;
  }

  supprimerJeuDeRole(id: number): void {
    this.jeuderoleService.supprimerJeuDeRole(id).subscribe(() => {
      this.jeuxderole = this.jeuxderole.filter(jeu => jeu.id !== id);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openModal(): void {
    this.resetForm();
    const modal = document.getElementById('metierModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeModal(): void {
    const modal = document.getElementById('metierModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
}
