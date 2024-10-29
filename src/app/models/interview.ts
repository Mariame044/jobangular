import { Trancheage } from "./video";

export interface Metier {
    id: number;
    nom: string;
   
  }
  export interface Interview {
      id: number;
      date:Date;
      duree: string;
      description: string;
      titre: string;
      url: string; // URL de la vidéo
      metier: Metier | null; // Doit être de type Metier ou null
      trancheage: Trancheage | null; // Doit être de type Metier ou null
      nombreDeVues?: number; // Ajoutez d'autres propriétés selon vos besoins
    }
    