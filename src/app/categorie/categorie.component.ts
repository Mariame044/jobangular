import { Component, OnDestroy, OnInit } from '@angular/core';
import { Categorie } from '../models/categorie';
import { CategorieService } from '../services/categorie.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css'] // Correction: 'styleUrls' (avec 's')
})
export class CategorieComponent implements OnInit, OnDestroy {
  categories: Categorie[] = [];
  modalCategorie: Categorie = { nom: '' }; // Pour le formulaire modal
  editedCategorie: Categorie | null = null;
  errorMessage: string = '';
  searchTerm: string = '';
  isModalOpen: boolean = false; // Indique si le modal est ouvert
  isEditing: boolean = false; // Indique si nous sommes en mode édition
  private unsubscribe$ = new Subject<void>(); // Subject pour gérer les désabonnements

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.loadCategories(); // Charger les catégories lors du démarrage
  }

  loadCategories() {
    this.categorieService.getAllCategories()
      .pipe(takeUntil(this.unsubscribe$)) // Désabonnement lors de la destruction du composant
      .subscribe({
        next: (categories) => {
          this.categories = this.searchTerm ? categories.filter(categorie =>
            categorie.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
          ) : categories; // Filtrer si un terme de recherche existe
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des catégories';
        }
      });
  }

  openModal(mode: 'create' | 'edit', categorie?: Categorie) {
    this.isModalOpen = true;
    this.isEditing = mode === 'edit';
    this.modalCategorie = mode === 'edit' && categorie ? { ...categorie } : { nom: '' }; // Réinitialiser pour la création
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalCategorie = { nom: '' }; // Réinitialiser le formulaire modal lors de la fermeture
  }

  createCategorie() {
    if (this.modalCategorie.nom) {
      this.categorieService.createCategorie(this.modalCategorie)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.loadCategories();
            this.closeModal(); // Fermer le modal après la création
          },
          error: () => {
            this.errorMessage = 'Erreur lors de la création de la catégorie';
          }
        });
    }
  }

  updateCategorie() {
    if (this.modalCategorie.id && this.modalCategorie.nom) {
      this.categorieService.updateCategorie(this.modalCategorie.id, this.modalCategorie)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.loadCategories();
            this.closeModal(); // Fermer le modal après la mise à jour
          },
          error: () => {
            this.errorMessage = 'Erreur lors de la mise à jour de la catégorie';
          }
        });
    }
  }

  deleteCategorie(id: number) {
    this.categorieService.deleteCategorie(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.loadCategories(); // Recharger les catégories après suppression
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la suppression de la catégorie';
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete(); // Nettoyage lors de la destruction
  }
}