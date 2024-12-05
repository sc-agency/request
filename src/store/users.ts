import { create } from 'zustand';
import type { User } from '../types';

interface UserState {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  getUsersByClientId: (clientId: string) => User[];
}

// Demo users with both admin and client accounts
const demoUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@clientsolve.com',
    password: 'admin',
    role: 'admin',
    active: true,
  },
  {
    id: '2',
    username: 'client1',
    email: 'client1@techcorp.fr',
    password: 'client123',
    role: 'client',
    clientId: '1',
    active: true,
  },
  {
    id: '3',
    username: 'client2',
    email: 'client2@digitalservices.fr',
    password: 'client456',
    role: 'client',
    clientId: '2',
    active: true,
  },
];

export const useUserStore = create<UserState>((set, get) => ({
  users: demoUsers,
  setUsers: (users) => set({ users }),
  addUser: (user) =>
    set((state) => ({ users: [...state.users, { ...user, active: true }] })),
  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updatedUser } : user
      ),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
  toggleUserStatus: (id) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      ),
    })),
  getUsersByClientId: (clientId) =>
    get().users.filter((user) => user.role === 'client' && user.clientId === clientId),
}));