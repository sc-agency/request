import React, { useState } from 'react';
import { Plus, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';
import { Card } from '../ui/Card';
import { useUserStore } from '../../store/users';
import { ClientUserForm } from './ClientUserForm';
import type { User } from '../../types';

interface ClientUserListProps {
  clientId: string;
}

export function ClientUserList({ clientId }: ClientUserListProps) {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus, getUsersByClientId } = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const clientUsers = getUsersByClientId(clientId);

  const handleCreateUser = (data: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      username: data.username!,
      email: data.email!,
      password: data.password!,
      role: 'client',
      clientId: clientId,
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Comptes utilisateurs</h3>
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
            <h4 className="text-lg font-semibold mb-4">
              {editingUser ? 'Modifier le compte' : 'Nouveau compte'}
            </h4>
            <ClientUserForm
              clientId={clientId}
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
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
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