// user.model.ts
export interface Role {
    
    id: number;  // Assurez-vous que les types correspondent à ceux de votre base de données
    nom: string; // Nom du rôle
  
  
}

export interface User {
    id: number;
    nom: string;
    email: string;
    role: Role;
}
// user.model.ts
export interface Users {
    id: number;
    nom: string;
    password?: string; // mot de passe peut être optionnel
    imageUrl?: string; // URL de l'image
  }
  
// register-user.dto.ts
export interface LoginUserDto {
    
    email: string;
    password: string;
   
}
