
export interface Role {
  nom: string; // Assurez-vous que le rôle a une propriété "nom"
}
export interface Reprep {
  statusCode: number;     // Code de statut HTTP (ex: 200, 401, 500)
  token: string; // Cela devrait être une chaîne, pas 'string | undefined'
  role: Role; // Assurez-vous que ceci correspond à votre définition de rôle
  refreshToken?: string;  // Refresh token, si applicable
  expirationTime?: string; // Temps d'expiration du token
  nom?: string;           // Nom de l'utilisateur
  prenom?: string;        // Prénom de l'utilisateur
  email?: string;         // Email de l'utilisateur
  message: string;        // Message à afficher
  }
  