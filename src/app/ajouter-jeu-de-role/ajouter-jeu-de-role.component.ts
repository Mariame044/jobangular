import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { JeuderoleService } from '../services/jeuderole.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajouter-jeu-de-role',
  standalone: true,
  templateUrl: './ajouter-jeu-de-role.component.html',
  styleUrls: ['./ajouter-jeu-de-role.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class AjouterJeuDeRoleComponent {
  jeuForm: FormGroup;

  constructor(private fb: FormBuilder, private jeuderoleService: JeuderoleService) {
    this.jeuForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      metierId: ['', Validators.required],
      image: [null, Validators.required],
      questions: this.fb.array([this.createQuestion()])
    });
  }

  

  createQuestion(): FormGroup {
    return this.fb.group({
      texte: ['', Validators.required],
      choix: ['', Validators.required],
      reponseCorrecte: ['', Validators.required]
    });
  }

  addQuestion() {
    this.questions.push(this.createQuestion());
  }

  get questions(): FormArray {
    return this.jeuForm.get('questions') as FormArray;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.jeuForm.patchValue({ image: file });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('nom', this.jeuForm.get('nom')?.value);
    formData.append('description', this.jeuForm.get('description')?.value);
    formData.append('metierId', this.jeuForm.get('metierId')?.value);
    formData.append('image', this.jeuForm.get('image')?.value);

    this.questions.controls.forEach((question, index) => {
      formData.append(`questions[${index}][texte]`, question.get('texte')?.value);
      formData.append(`questions[${index}][choix]`, question.get('choix')?.value);
      formData.append(`questions[${index}][reponseCorrecte]`, question.get('reponseCorrecte')?.value);
    });

    this.jeuderoleService.ajouterJeuDeRole(formData).subscribe(
      response => {
        console.log('Jeu de rôle ajouté avec succès', response);
      },
      error => {
        console.error('Erreur lors de l\'ajout du jeu de rôle', error);
      }
    );
  }
  
}
