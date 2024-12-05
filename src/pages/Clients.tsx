import React, { useState } from 'react';
import { Plus, Pencil, Trash2, UserPlus, UserMinus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useClientStore } from '../store/clients';
import { ClientForm } from '../components/clients/ClientForm';
import type { Client } from '../types';

export function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useClientStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(
    (client) =>
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClient = (data: Partial<Client>) => {
    const newClient: Client = {
      id: Date.now().toString(),
      companyName: data.companyName!,
      contactName: data.contactName!,
      email: data.email!,
      phone: data.phone!,
      address: data.address!,
      siret: data.siret!,
      iban: data.iban,
      bic: data.bic,
    };
    addClient(newClient);
    setShowForm(false);
  };

  const handleUpdateClient = (data: Partial<Client>) => {
    if (editingClient) {
      updateClient(editingClient.id, data);
      setEditingClient(null);
    }
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      deleteClient(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau client
        </button>
      </div>

      {(showForm || editingClient) && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingClient ? 'Modifier le client' : 'Nouveau client'}
            </h2>
            <ClientForm
              initialData={editingClient || undefined}
              onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
              onCancel={() => {
                setShowForm(false);
                setEditingClient(null);
              }}
            />
          </div>
        </Card>
      )}

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher un client..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Société
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {client.companyName}
                    </div>
                    <div className="text-sm text-gray-500">
                      SIRET: {client.siret}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.contactName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingClient(client)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}