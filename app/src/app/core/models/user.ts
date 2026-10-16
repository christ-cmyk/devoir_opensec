export type Role = 'ADMIN' | 'GESTIONNAIRE' | 'CONDUCTEUR';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  nom: string;
  prenom: string;
  role: Role;
  createdAt: string;
}
