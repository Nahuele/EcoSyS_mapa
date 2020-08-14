export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  password?: string;
  role?: Role;
}

export type Role = 'EDITOR' | 'ADMIN';
