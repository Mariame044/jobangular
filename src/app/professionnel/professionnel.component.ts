import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUserDto, User } from '../models/user';
import { Role } from '../models/reprep';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-professionnel',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './professionnel.component.html',
    styleUrls: ['./professionnel.component.css']
})
export class ProfessionnelComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    users: User[] = [];
    roles: Role[] = [];
    errorMessage: string = '';
    searchTerm: string = '';
    isModalOpen: boolean = false;
    isEditing: boolean = false;
    private unsubscribe$ = new Subject<void>(); // Subject pour gérer les désabonnements

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService, 
        private router: Router
    ) {
        // Initialisation du formulaire
        this.registerForm = this.formBuilder.group({
            nom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.getAllUsers();
        this.getRoles();
    }

    // Ouvrir le modal en mode création ou édition
    openModal(mode: 'create' | 'edit', user?: User) {
        this.isModalOpen = true;
        this.isEditing = mode === 'edit';
        this.errorMessage = ''; // Réinitialiser l'erreur lors de l'ouverture du modal

        if (mode === 'edit' && user) {
            this.registerForm.patchValue({
                nom: user.nom,
                email: user.email,
                role: user.role?.nom // Utilisation de l'opérateur de coalescence pour éviter les erreurs
            });
        } else {
            this.registerForm.reset(); // Réinitialiser le formulaire pour la création
        }
    }

    // Fermer le modal
    closeModal() {
        this.isModalOpen = false;
        this.registerForm.reset(); // Réinitialiser le formulaire lors de la fermeture
    }

    // Soumettre le formulaire
    onSubmit() {
        if (this.registerForm.valid) {
            const user: LoginUserDto = this.registerForm.value;

            this.userService.register(user).subscribe(
                (response) => {
                    console.log('User registered successfully', response);
                    this.getAllUsers(); // Actualiser la liste des utilisateurs après l'inscription
                    this.closeModal(); // Fermer le modal après l'inscription
                },
                (error) => {
                    console.error('Error registering user', error);
                    this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'; // Gestion d'erreur
                }
            );
        }
    }

    // Récupérer tous les utilisateurs
    getAllUsers() {
        this.userService.getAllUsers().subscribe(
            (data) => {
                this.users = data;
            },
            (error) => {
                console.error('Error fetching users', error);
            }
        );
    }

    // Récupérer les rôles
    getRoles() {
        this.userService.getRoles().subscribe(
            (data) => {
                this.roles = data; // Mettez à jour la liste des rôles
            },
            (error) => {
                console.error('Error fetching roles', error);
            }
        );
    }

    // Assurez-vous de gérer le désabonnement si nécessaire
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete(); // Désabonnement propre
    }
}
