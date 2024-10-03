export interface Jeuderole {
    id: number;
    nom: string;
    description: string;
    metierId: number;
    questions: Question[];
    imageUrl?: string;
  }
  
  export interface Question {
    texte: string;
    choix: string[];
    reponseCorrecte: string;
  }
  