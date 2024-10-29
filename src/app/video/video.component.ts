import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
import { MetierService } from '../services/metier.service'; // Importez le service Metier
import { Trancheage, Video } from '../models/video';
import { Metier } from '../models/metier'; // Importez le modèle Metier
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importez les modules nécessaires
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule], // Ajoutez les modules nécessaires ici
})
export class VideoComponent implements OnInit {
  videos: Video[] = [];
  newVideo: Video = { id: 0, duree: '', description: '',titre: '', url: '', metier: null , trancheage: null}; // Ajoutez le champ pour le métier
  selectedFile: File | null = null;
  metiers: Metier[] = [];
  trancheages: Trancheage[] = [];
  isModalOpen: boolean = false; // Indique si le modal est ouvert
  isEditing: boolean = false; // Indique si nous sommes en mode édition
  modalVideo: Video = { id: 0, duree: '', description: '',titre: '', url: '', metier: null, trancheage: null }; // Vidéo pour le modal
  private unsubscribe$ = new Subject<void>();
  errorMessage: string = '';
  searchTerm: string = '';
  constructor(
    private videoService: VideoService,
    private metierService: MetierService // Injectez le service Metier
  ) {}

  ngOnInit(): void {
    this.obtenirToutesLesVideos();
    this.getAllMetiers(); // Récupérez les métiers lors de l'initialisation
    this.getAllTrancheage(); // Récupérez les métiers lors de l'initialisation
    this.loadVideo();// Récupérez les métiers lors de l'initialisation
  }
  loadVideo() {
    this.videoService.obtenirToutesLesVideos()
      .pipe(takeUntil(this.unsubscribe$)) // Désabonnement lors de la destruction du composant
      .subscribe({
        next: (video) => {
          this.videos = this.searchTerm ? video.filter(video =>
            video.description.toLowerCase().includes(this.searchTerm.toLowerCase())
          ) : video; // Filtrer si un terme de recherche existe
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des catégories';
        }
      });
  }



  obtenirToutesLesVideos() {
    this.videoService.obtenirToutesLesVideos().subscribe(videos => {
      this.videos = videos;
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

  openModal(mode: 'create' | 'edit', video?: Video) {
    this.isModalOpen = true;
    this.isEditing = mode === 'edit';

    if (this.isEditing && video) {
      this.modalVideo = { ...video }; // Remplissez le modal avec les données de la vidéo à éditer
    } else {
      this.modalVideo = { id: 0, duree: '', description: '',titre: '', url: '', metier: null , trancheage: null}; // Réinitialiser pour la création
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalVideo = { id: 0, duree: '', description: '',titre: '', url: '', metier: null , trancheage: null}; // Réinitialiser le formulaire modal lors de la fermeture
    this.selectedFile = null; // Réinitialiser le fichier sélectionné
  }

  ajouterOuModifierVideo() {
    const formData = new FormData();
    
    if (this.selectedFile) {
      formData.append('fichier', this.selectedFile as Blob);
    }

    formData.append('duree', this.modalVideo.duree);
    formData.append('description', this.modalVideo.description);
    formData.append('metierId', this.modalVideo.metier?.id.toString() || '');
    formData.append('trancheageId', this.modalVideo.trancheage?.id.toString() || '');  // Convertir en chaîne

    if (this.isEditing) {
      this.videoService.updateVideo(this.modalVideo.id, formData).subscribe(video => {
        const index = this.videos.findIndex(v => v.id === video.id);
        if (index !== -1) {
          this.videos[index] = video; // Met à jour la vidéo existante
        }
        this.closeModal(); // Ferme le modal
      });
    } else {
      this.videoService.addVideo(formData).subscribe(video => {
        this.videos.push(video);
        this.closeModal(); // Ferme le modal après l'ajout
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  supprimerVideo(id: number) {
    this.videoService.deleteVideo(id).subscribe(() => {
      this.videos = this.videos.filter(video => video.id !== id);
    });
  }

  regarderVideo(id: number) {
    this.videoService.regarderVideo(id).subscribe(video => {
      console.log(video);
    });
  }
}
