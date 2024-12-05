import { create } from 'zustand';
import type { Client } from '../types';

interface ClientState {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  toggleClientStatus: (id: string) => void;
}

const demoClients: Client[] = [
  {
    id: '1',
    companyName: 'TechCorp Solutions',
    contactName: 'Jean Dupont',
    email: 'contact@techcorp.fr',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Tech, 75001 Paris',
    siret: '12345678901234',
    iban: 'FR7630001007941234567890185',
    bic: 'BNPAFRPP',
    active: true,
  },
  {
    id: '2',
    companyName: 'Digital Services SARL',
    contactName: 'Marie Martin',
    email: 'contact@digitalservices.fr',
    phone: '+33 1 98 76 54 32',
    address: '456 Avenue du Digital, 69001 Lyon',
    siret: '98765432109876',
    active: true,
  },
];

export const useClientStore = create<ClientState>((set) => ({
  clients: demoClients,
  setClients: (clients) => set({ clients }),
  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, { ...client, active: true }] })),
  updateClient: (id, updatedClient) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...updatedClient } : client
      ),
    })),
  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    })),
  toggleClientStatus: (id) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, active: !client.active } : client
      ),
    })),
}));