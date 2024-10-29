import { Component, OnInit } from '@angular/core';
import { Reponse } from '../models/jeuderole'; // Correct import path
import { ReponseService } from '../services/reponse.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reponse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reponse.component.html',
  styleUrls: ['./reponse.component.css']
})
export class ReponseComponent implements OnInit {
  reponses: Reponse[] = [];
  newReponse: Reponse = { libelle: '', reponsepossible: [], correct: '' }; // Correct initialization
  reponseText: string = '';
  isModalOpen = false;
  isCorrectResponseInvalid: boolean = false; // New property to track validation

  constructor(private reponseService: ReponseService, private router: Router) {}

  ngOnInit(): void {
    this.getAllReponses();
  }

  getAllReponses(): void {
    this.reponseService.getAllReponses().subscribe(
      (data: Reponse[]) => {
        this.reponses = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des réponses:', error);
      }
    );
  }

  ajouterReponsePossible(): void {
    if (this.reponseText.trim()) {
      this.newReponse.reponsepossible.push(this.reponseText);
      this.reponseText = '';
    }
  }

  ajouterReponse(): void {
    // Check if correct is provided
    if (this.newReponse.correct.trim() === '') {
      console.error('Le champ "correct" est obligatoire.');
      return; // Prevent submission if correct is empty
    }

    // Check if the correct response exists in the possible responses
    if (!this.newReponse.reponsepossible.includes(this.newReponse.correct)) {
      this.isCorrectResponseInvalid = true; // Set validation flag
      return; // Prevent submission if correct is not among possible responses
    }

    // Check if there is at least one possible response
    if (this.newReponse.reponsepossible.length > 0) {
      this.reponseService.ajouterReponse(this.newReponse).subscribe(
        (response: Reponse) => {
          this.reponses.push(response);
          this.resetForm();
          this.closeModal();
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
    this.newReponse = { libelle: '', reponsepossible: [], correct: '' }; // Reset the new response form
  }

  supprimerReponse(id: number): void {
    this.reponseService.supprimerReponse(id).subscribe(
      () => {
        this.reponses = this.reponses.filter(r => r.id !== id);
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
    this.resetForm();
  }
}
