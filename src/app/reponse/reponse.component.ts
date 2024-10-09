import { Component, OnInit } from '@angular/core';
import { Reponse } from '../models/jeuderole';
import { ReponseService } from '../services/reponse.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-reponse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reponse.component.html',
  styleUrls: ['./reponse.component.css'] // Corrige le nom pour `styleUrls` (pluriel)
})
export class ReponseComponent implements OnInit {
  reponses: Reponse[] = [];
  newReponse: Reponse = { id: 0,libelle:'', reponsepossible: [], correct: false }; // Correspond au modèle
  reponseText: string = ''; // Ajout d'une variable temporaire pour capturer une réponse possible
  errorMessage: string | null = null;
  selectedReponseId: number | null = null; // ID du jeu de rôle sélectionné
  loading = false;
  isModalOpen = false; // État d'ouverture du modal
  private unsubscribe$ = new Subject<void>();

  constructor(private reponseService: ReponseService, private router: Router) {}

  ngOnInit(): void {
    this.getAllReponses();
  }

  // Récupérer toutes les réponses
  getAllReponses(): void {
    this.reponseService.getAllReponses().subscribe(
      (data) => {
        this.reponses = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des réponses:', error);
      }
    );
  }

  // Ajouter une réponse possible à la liste
  ajouterReponsePossible(): void {
    if (this.reponseText.trim()) {
      this.newReponse.reponsepossible.push(this.reponseText);
      this.reponseText = ''; // Réinitialise le champ de saisie après l'ajout
    }
  }

  // Ajouter une nouvelle réponse (entière) au backend
  ajouterReponse(): void {
    if (this.newReponse.reponsepossible.length > 0) {
      this.reponseService.ajouterReponse(this.newReponse).subscribe(
        (response) => {
          this.reponses.push(response);
          this.resetForm();
          this.closeModal(); 
          this.newReponse = { id: 0, libelle:'',reponsepossible: [], correct: false }; // Réinitialiser le formulaire après ajout
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la réponse:', error);
        }
      );
    } else {
      console.error('Ajoutez au moins une réponse possible');
    }
  }
  resetForm(): void {
    this.newReponse = { id: 0, libelle:'',reponsepossible: [], correct: false };
    this.selectedReponseId = null; // Réinitialiser l'ID du jeu de rôle sélectionné
  }

  // Supprimer une réponse
  supprimerReponse(id: number): void {
    this.reponseService.supprimerReponse(id).subscribe(
      () => {
        this.reponses = this.reponses.filter(r => r.id !== id); // Met à jour la liste après suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression de la réponse:', error);
      }
    );
  }
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm(); // Réinitialiser le formulaire lorsque le modal se ferme
  }
}
