import React, { useState } from 'react';
import { useClientStore } from '../../store/clients';
import { FileUpload } from './FileUpload';
import type { Ticket, Attachment } from '../../types';

interface TicketFormProps {
  onSubmit: (data: Partial<Ticket>) => void;
  initialData?: Partial<Ticket>;
  onCancel: () => void;
  userRole?: string;
  clientId?: string;
}

export function TicketForm({
  onSubmit,
  initialData,
  onCancel,
  userRole,
  clientId,
}: TicketFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'normal',
    clientId: initialData?.clientId || clientId || '',
    status: initialData?.status || 'pending',
  });

  const [attachments, setAttachments] = useState<Attachment[]>(
    initialData?.attachments || []
  );

  const clients = useClientStore((state) => state.clients);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, attachments });
  };

  const handleFileSelect = async (files: File[]) => {
    // In a real app, we would upload these files to a server
    // Here we'll just create fake URLs for demo purposes
    const newAttachments: Attachment[] = files.map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      createdAt: new Date(),
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  const handleFileRemove = (fileId: string) => {
    setAttachments(attachments.filter((file) => file.id !== fileId));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {userRole === 'admin' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            required
          >
            <option value="">Sélectionner un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Titre</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Priorité</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as Ticket['priority'] })}
        >
          <option value="low">Faible</option>
          <option value="normal">Normal</option>
          <option value="high">Élevé</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {initialData && userRole === 'admin' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Statut</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Ticket['status'] })}
          >
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pièces jointes
        </label>
        <FileUpload
          onFileSelect={handleFileSelect}
          existingFiles={attachments}
          onFileRemove={handleFileRemove}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}