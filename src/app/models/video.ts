
export interface Metier {
  id: number;
  nom: string;
 
}
export interface Video {
    id: number;
    duree: string;
    description: string;
    url: string; // URL de la vidéo
    metier: Metier | null; // Doit être de type Metier ou null
    nombreDeVues?: number; // Ajoutez d'autres propriétés selon vos besoins
  }
  