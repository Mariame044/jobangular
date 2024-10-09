import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MetierService } from '../services/metier.service';
import { Metier } from '../models/metier';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Categorie } from '../models/categorie';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-metier',
  templateUrl: './metier.component.html',
  styleUrls: ['./metier.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class MetierComponent implements OnInit {
  metiers: Metier[] = [];
  newMetier: Metier = { id: 0, nom: '', description: '', imageUrl: '', categorie: null };
  imageFile: File | null = null;
  categories: Categorie[] = [];
  loading: boolean = false; // Indique si une opération est en cours
  errorMessage: string | null = null; // Message d'erreur éventuel
  searchTerm: string = '';
  private unsubscribe$ = new Subject<void>();
  constructor(private metierService: MetierService) {}

  ngOnInit(): void {
    this.getAllMetiers();
    this.getAllCategories();
    this.loadMetiers();// Récupérez les métiers lors de l'initialisation
  }
  loadMetiers() {
    this.metierService.getAllMetiers()
      .pipe(takeUntil(this.unsubscribe$)) // Désabonnement lors de la destruction du composant
      .subscribe({
        next: (metier) => {
          this.metiers = this.searchTerm ? metier.filter(metier =>
            metier.description.toLowerCase().includes(this.searchTerm.toLowerCase())
          ) : metier; // Filtrer si un terme de recherche existe
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des catégories';
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

  getAllCategories(): void {
    this.metierService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    );
  }

  onImageChange(event: any): void {
    this.imageFile = event.target.files[0];
  }

  createMetier(): void {
    if (this.newMetier.nom && this.newMetier.description && this.imageFile && this.newMetier.categorie) {
      const formData = new FormData();
      formData.append('image', this.imageFile);
      formData.append('nom', this.newMetier.nom);
      formData.append('description', this.newMetier.description);
      formData.append('categorieId', String(this.newMetier.categorie.id));

      this.loading = true; // Démarrer le chargement
      this.errorMessage = null; // Réinitialiser le message d'erreur

      this.metierService.creerMetier(formData).subscribe(
        (response: Metier) => {
          this.loading = false; // Arrêter le chargement
          console.log('Métier créé avec succès', response);
          this.metiers.push(response);
          this.resetForm();
          this.closeModal(); // Fermer le modal après l'ajout
        },
        (error: HttpErrorResponse) => {
          this.loading = false; // Arrêter le chargement
          console.error('Erreur lors de l\'ajout du métier', error);
          this.errorMessage = 'Échec de l\'ajout du métier. Veuillez réessayer.'; // Mettre à jour le message d'erreur
        }
      );
    } else {
      alert('Veuillez fournir tous les champs requis (image, nom, description et catégorie).');
    }
  }

  resetForm(): void {
    this.newMetier = { id: 0, nom: '', description: '', imageUrl: '', categorie: null };
    this.imageFile = null;
  }

  deleteMetier(id: number): void {
    this.metierService.deleteMetier(id).subscribe(
      () => {
        this.metiers = this.metiers.filter(metier => metier.id !== id);
      },
      (error) => {
        console.error('Erreur lors de la suppression du métier', error);
      }
    );
  }

  openModal(): void {
    this.resetForm(); // Réinitialiser pour un nouveau métier
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
