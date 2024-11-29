import { User, NewUser } from '../../types/user';
import { mockUsers } from './mockData';

let users = [...mockUsers];

export const fetchUsers = async (): Promise<User[]> => {
  return Promise.resolve(users);
};

export const createUser = async (user: NewUser): Promise<User> => {
  const newUser: User = {
    id: (users.length + 1).toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  return Promise.resolve(newUser);
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  users = users.map(user => 
    user.id === id 
      ? { ...user, ...updates }
      : user
  );
  const updatedUser = users.find(user => user.id === id);
  if (!updatedUser) throw new Error('User not found');
  return Promise.resolve(updatedUser);
};

export const deleteUser = async (id: string): Promise<void> => {
  users = users.filter(user => user.id !== id);
  return Promise.resolve();
};