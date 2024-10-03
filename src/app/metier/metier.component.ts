import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MetierService } from '../services/metier.service';
import { Metier } from '../models/metier';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Categorie } from '../models/categorie';
import { SafeUrl } from '@angular/platform-browser';

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
  loading: boolean = false; // Ajout de la variable de chargement
  errorMessage: string | null = null; // Ajout pour stocker les messages d'erreur
  image: SafeUrl | null = null; // URL sécurisée pour afficher l'image
  sanitizer: any;


  constructor(private metierService: MetierService) {}

  ngOnInit(): void {
    this.getAllMetiers();
    this.getAllCategories();
    this.getImage('example.jpg');
      // Vous pouvez charger une image par défaut
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
  getImage(filename: string): void {
    this.metierService.getImage(filename).subscribe((blob: Blob) => {
      const objectURL = URL.createObjectURL(blob);
      this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);  // Sécuriser l'URL de l'image
    }, error => {
      console.error('Erreur lors du chargement de l\'image :', error);
    });
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
          console.log('Image uploaded successfully', response);
          this.metiers.push(response);
          this.resetForm();
        },
        (error: HttpErrorResponse) => {
          this.loading = false; // Arrêter le chargement
          console.error('Erreur lors de l\'upload de l\'image', error);
          this.errorMessage = 'Échec du téléchargement de l\'image. Veuillez réessayer.'; // Mettre à jour le message d'erreur
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
}
