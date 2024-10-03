import { Component, EventEmitter, Output } from '@angular/core'; // Ajouter EventEmitter et Output
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { Reprep, Role } from '../models/reprep';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  @Output() loginSuccess = new EventEmitter<boolean>(); // Émettre un événement de succès de connexion

  constructor(private authService: AuthenticationService, private router: Router) {}

 // Exemple de réponse
 
 login() {
  const credentials = { email: this.email, password: this.password };

  this.authService.login(credentials).subscribe(
    (response: Reprep) => { 
      const token = response.token ?? ''; // Valeur par défaut si `undefined`
      this.authService.saveToken(token);

      const role: Role = response.role; 

      if (role && role.nom) { 
        localStorage.setItem('role', role.nom);
      } else {
        console.error('Le rôle est indéfini ou n\'a pas de nom.');
      }

      this.email = ''; // Réinitialiser l'email
      this.password = ''; // Réinitialiser le mot de passe
      this.router.navigate(['dashboard']).then(() => {
        // Utiliser location.reload() après la redirection
        location.reload(); // Recharger la page
      });
      this.resetForm(); // Réinitialiser le formulaire
    },
    (error) => {
      if (error.status === 401) {
        this.errorMessage = 'Email ou mot de passe incorrect';
      } else {
        this.errorMessage = 'Une erreur est survenue, veuillez réessayer.';
      }
    }
  );
}

  resetForm() {
    throw new Error('Method not implemented.');
  }
}
