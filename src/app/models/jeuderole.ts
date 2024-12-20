import { Trancheage } from "./video";

// src/app/models/jeuderole.model.ts
export interface Metier {
  id: number;
  nom: string;
 
}
export interface Jeuderole {
  id?: number; // Optionnel pour les nouveaux jeux
  nom: string;
  description: string;
  metier: Metier | null; // Doit être de type Metier ou null
  trancheage: Trancheage | null; 
  imageUrl?: string; // Optionnel pour les nouveaux jeux
  audioUrl?: string; // Optionnel pour les nouveaux jeux
  // question: Question[]; // Assurez-vous de définir ce modèle également

  
}
export interface Question {
  id?: number;                // ID de la question, optionnel pour les nouvelles questions
  point: number;             // Points associés à la question
  texte: string;             // Texte de la question
  typeQuestion: TypeQuestion; // Type de la question (QUIZ ou JEU_DE_ROLE)
  quizId?: number | null;          // ID du quiz auquel la question est liée
  jeuDeRoleId?: number | null;      // ID du jeu de rôle auquel la question est liée (optionnel)
  reponseId?: number;        // ID de la réponse associée à la question (optionnel)

  // Optionnel : Vous pouvez également garder des références complètes si nécessaire
  jeuDeRole?: Jeuderole;     // Référence au jeu de rôle (optionnel)
  trancheage?: Trancheage ; // Doit être de type Metier ou null
  quiz?: Quiz;  
  reponse?: Reponse;         // Référence à la réponse (optionnel)

  
}
export enum TypeQuestion {
  Quiz = 'Quiz',
  JEU_DE_ROLE = 'JEU_DE_ROLE'
}

export interface Quiz {
  id?: number;          // Optional as it will be generated by the backend
  titre: string;
  description: string;
  score: number;
  metier: Metier | null; // Doit être de type Metier ou null
  
  trancheage: Trancheage | null; // Doit être de type Metier ou null
   // Optional: Badge relationship
}

export interface Reponse {
  id?: number;      
  libelle: string;       // ID de la réponse, optionnel pour les nouvelles réponses
  reponsepossible: string[]; // Liste des réponses possibles
  correct: string;         // Indique si la réponse est correcte

}


