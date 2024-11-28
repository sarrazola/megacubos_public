import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'creator' | 'user';
  createdAt: string;
}

interface UserStore {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, data: Partial<User>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '+1234567890',
      role: 'creator',
      createdAt: new Date().toISOString(),
    },
  ],
  addUser: (userData) =>
    set((state) => ({
      users: [
        ...state.users,
        {
          ...userData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
  updateUser: (id, data) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...data } : user
      ),
    })),
}));