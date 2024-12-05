import React, { useState } from 'react';
import { Plus, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useUserStore } from '../store/users';
import { useClientStore } from '../store/clients';
import { ClientUserForm } from '../components/clients/ClientUserForm';
import type { User } from '../types';

export function Accounts() {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus } = useUserStore();
  const clients = useClientStore((state) => state.clients);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const clientUsers = users.filter(user => user.role === 'client');
  
  const filteredUsers = clientUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clients.find(c => c.id === user.clientId)?.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = (data: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      username: data.username!,
      email: data.email!,
      password: data.password!,
      role: 'client',
      clientId: data.clientId,
      active: true,
    };
    addUser(newUser);
    setShowForm(false);
  };

  const handleUpdateUser = (data: Partial<User>) => {
    if (editingUser) {
      const updatedData = { ...data };
      if (!updatedData.password) {
        delete updatedData.password;
      }
      updateUser(editingUser.id, updatedData);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Comptes utilisateurs</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau compte
        </button>
      </div>

      {(showForm || editingUser) && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingUser ? 'Modifier le compte' : 'Nouveau compte'}
            </h2>
            <ClientUserForm
              clientId={editingUser?.clientId}
              initialData={editingUser || undefined}
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              onCancel={() => {
                setShowForm(false);
                setEditingUser(null);
              }}
            />
          </div>
        </Card>
      )}

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher un compte..."
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
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {clients.find(c => c.id === user.clientId)?.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.active ? (
                        <>
                          <UserCheck className="w-3 h-3" />
                          Actif
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3" />
                          Inactif
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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