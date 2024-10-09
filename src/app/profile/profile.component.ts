import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Users } from '../models/user'; // Assurez-vous que le chemin est correct
import { ProfileService } from '../services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] // Correction de 'styleUrl' à 'styleUrls'
})
export class ProfileComponent implements OnInit {
  userForm = this.fb.group({
    nom: ['', Validators.required],
    password: ['', [Validators.minLength(6)]],
    confirmPassword: ['', [Validators.minLength(6)]],
    image: [null]
  });

  currentUser!: Users; // Ajout d'un point d'exclamation pour indiquer que currentUser sera initialisé plus tard
  imagePreview: string | ArrayBuffer | null = null; // Pour afficher un aperçu de l'image

  constructor(private fb: FormBuilder, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.profileService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.userForm.patchValue({
        nom: user.nom,
      });
      // Affichage de l'image existante
      this.imagePreview = user.imageUrl || null; // Assurez-vous que imageUrl correspond à la réponse de votre API
    }, error => {
      console.error('Erreur lors du chargement de l’utilisateur', error);
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.userForm.patchValue({ image: file });

    // Prévisualisation de l'image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result; // Mettre à jour l'aperçu de l'image
    };
    if (file) {
      reader.readAsDataURL(file); // Lire le fichier comme URL de données
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const { nom, password, confirmPassword } = this.userForm.value;
      const image = this.userForm.get('image')?.value || undefined; // Assurez-vous que l'image est undefined si elle est null

      // Vérification que les mots de passe correspondent
      if (password && password !== confirmPassword) {
        console.error('Les mots de passe ne correspondent pas');
        return;
      }

      const safeNom: string = nom || ''; // Assurez-vous que nom est toujours une chaîne
      const safePassword: string = password || ''; // S'assurer que password est une chaîne
      const safeConfirmPassword: string = confirmPassword || ''; // S'assurer que confirmPassword est une chaîne

      // Mettre à jour le profil
      this.profileService.updateUserProfile(
        this.currentUser.id,
        safeNom,
        safePassword,
        safeConfirmPassword,
        image // image peut être undefined, géré dans le service
      ).subscribe(
        (updatedUser: Users) => {
          console.log('Profil mis à jour avec succès', updatedUser);
          // Actualisez l'aperçu de l'image si une nouvelle image a été téléchargée
          if (updatedUser.imageUrl) {
            this.imagePreview = updatedUser.imageUrl; // Mettez à jour l'aperçu avec la nouvelle image
          }
        },
        error => {
          console.error('Erreur lors de la mise à jour du profil', error);
        }
      );
    } else {
      console.error('Le formulaire n\'est pas valide');
    }
  }
  editNom() {
    this.userForm.patchValue({
      nom: this.currentUser.nom
    });
  }

}
