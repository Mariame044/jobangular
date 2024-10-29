
export interface Metier {
  id: number;
  nom: string;
 
}
export interface Video {
    id: number;
    duree: string;
    description: string;
    titre: string;
    url: string; // URL de la vidéo
    metier: Metier | null; // Doit être de type Metier ou null
    trancheage: Trancheage | null; // Doit être de type Metier ou null
    nombreDeVues?: number; // Ajoutez d'autres propriétés selon vos besoins
  }
  export interface Trancheage {
    id: number;
    ageMin: number;
    ageMax: number;
    description: string;
  }