export type UserRole = 'creator' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface NewUser {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}