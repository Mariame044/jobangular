

export interface Metier {
  id: number;
  nom: string;
  description: string;
  imageUrl?: string;
  categorie?: { id: number; nom: string } | null; 
  // Categorie optionnelle
}
