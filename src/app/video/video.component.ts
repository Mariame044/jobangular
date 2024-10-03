import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
import { MetierService } from '../services/metier.service'; // Importez le service Metier
import { Video } from '../models/video';
import { Metier } from '../models/metier'; // Importez le modèle Metier
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importez les modules nécessaires

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule], // Ajoutez les modules nécessaires ici
})
export class VideoComponent implements OnInit {
  videos: Video[] = [];
  newVideo: Video = { id: 0, duree: '', description: '', url: '', metier: null }; // Ajoutez le champ pour le métier
  selectedFile: File | null = null;
  metiers: Metier[] = [];
  constructor(
    private videoService: VideoService,
    private metierService: MetierService // Injectez le service Metier
  ) { }

  ngOnInit(): void {
    this.obtenirToutesLesVideos();
    this.getAllMetiers(); // Récupérez les métiers lors de l'initialisation
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
  ajouterVideo() {
    const formData = new FormData();
    formData.append('fichier', this.selectedFile as Blob);
    formData.append('duree', this.newVideo.duree);
    formData.append('description', this.newVideo.description);
    // Assurez-vous de passer l'ID du métier sélectionné
    formData.append('metierId', this.newVideo.metier?.id.toString() || ''); // Convertir en chaîne

    this.videoService. addVideo(formData).subscribe(video => {
      this.videos.push(video);
      this.newVideo = { id: 0, duree: '', description: '', url: '', metier: null }; // Réinitialisez le modèle de vidéo
      this.selectedFile = null;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  supprimerVideo(id: number) {
    this.videoService.
  deleteVideo(id).subscribe(() => {
      this.videos = this.videos.filter(video => video.id !== id);
    });
  }

  regarderVideo(id: number) {
    this.videoService.regarderVideo(id).subscribe(video => {
      console.log(video);
    });
  }
}
