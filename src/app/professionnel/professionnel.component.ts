import { Component, OnInit } from '@angular/core';


import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { LoginUserDto, User } from '../models/user';

@Component({
  selector: 'app-professionnel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './professionnel.component.html',
  styleUrls: ['./professionnel.component.css']
})
export class ProfessionnelComponent implements OnInit {
  registerForm: FormGroup;
  users: User[] = [];

  constructor(
      private formBuilder: FormBuilder,
      private userService: UserService, // Injectez le service
      private router: Router
  ) {
      this.registerForm = this.formBuilder.group({
          fullName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          role: ['', Validators.required]
      });
  }

  ngOnInit(): void {
      this.getAllUsers();
  }

  onSubmit() {
      if (this.registerForm.valid) {
          const user: LoginUserDto = this.registerForm.value;
          this.userService.register(user).subscribe(
              (response) => {
                  console.log('User registered successfully', response);
                  this.getAllUsers(); // Actualiser la liste des utilisateurs après l'inscription
                  this.registerForm.reset(); // Réinitialiser le formulaire
              },
              (error) => {
                  console.error('Error registering user', error);
              }
          );
      }
  }

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
}