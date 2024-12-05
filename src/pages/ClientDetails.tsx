import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { useClientStore } from '../store/clients';
import { ClientUsers } from '../components/clients/ClientUsers';
import { useTicketStore } from '../store/tickets';
import { ArrowLeft, Pencil } from 'lucide-react';
import { ClientForm } from '../components/clients/ClientForm';

export function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const client = useClientStore((state) => 
    state.clients.find((c) => c.id === id)
  );
  const [isEditing, setIsEditing] = useState(false);
  const { updateClient } = useClientStore();
  const clientTickets = useTicketStore((state) => 
    state.getTicketsByClientId(id || '')
  );

  if (!client) {
    return <div>Client non trouvé</div>;
  }

  const handleUpdateClient = (data: Partial<typeof client>) => {
    if (id) {
      updateClient(id, data);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/clients')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux clients
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{client.companyName}</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Pencil className="w-4 h-4" />
            Modifier
          </button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Modifier le client</h2>
            <ClientForm
              initialData={client}
              onSubmit={handleUpdateClient}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </Card>
      ) : (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informations du client</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                <dd className="mt-1 text-sm text-gray-900">{client.contactName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{client.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                <dd className="mt-1 text-sm text-gray-900">{client.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">SIRET</dt>
                <dd className="mt-1 text-sm text-gray-900">{client.siret}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                <dd className="mt-1 text-sm text-gray-900">{client.address}</dd>
              </div>
              {client.iban && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">IBAN</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.iban}</dd>
                </div>
              )}
              {client.bic && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">BIC</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.bic}</dd>
                </div>
              )}
            </dl>
          </div>
        </Card>
      )}

      <ClientUsers clientId={client.id} />

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Tickets associés</h2>
          <div className="space-y-4">
            {clientTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{ticket.reference} - {ticket.title}</div>
                  <div className="text-sm text-gray-500">{ticket.description}</div>
                </div>
                <button
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Voir le détail
                </button>
              </div>
            ))}
            {clientTickets.length === 0 && (
              <p className="text-gray-500">Aucun ticket associé à ce client</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}