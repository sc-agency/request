import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { useTicketStore } from '../store/tickets';
import { useClientStore } from '../store/clients';
import { useAuthStore } from '../store/auth';
import { TicketStatusBadge } from '../components/tickets/TicketStatusBadge';
import { TicketPriorityBadge } from '../components/tickets/TicketPriorityBadge';
import { TicketForm } from '../components/tickets/TicketForm';
import { formatDate } from '../lib/utils';
import type { Ticket } from '../types';

export function Tickets() {
  const { tickets, addTicket, deleteTicket, getTicketsByClientId } = useTicketStore();
  const clients = useClientStore((state) => state.clients);
  const user = useAuthStore((state) => state.user);
  const [statusFilter, setStatusFilter] = useState<Ticket['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Ticket['priority'] | 'all'>('all');
  const [showForm, setShowForm] = useState(false);

  // Filter tickets based on user role and filters
  const userTickets = user?.role === 'client' && user.clientId
    ? getTicketsByClientId(user.clientId)
    : tickets;

  const filteredTickets = userTickets.filter((ticket) => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;
    return true;
  });

  const handleCreateTicket = (data: Partial<Ticket>) => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      reference: '', // Will be generated by the store
      title: data.title!,
      description: data.description!,
      status: 'pending',
      priority: data.priority!,
      clientId: user?.role === 'client' ? user.clientId! : data.clientId!,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    };
    addTicket(newTicket);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau ticket
        </button>
      </div>

      {showForm && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Nouveau ticket</h2>
            <TicketForm
              onSubmit={handleCreateTicket}
              onCancel={() => setShowForm(false)}
              userRole={user?.role}
              clientId={user?.clientId}
            />
          </div>
        </Card>
      )}

      <div className="flex gap-4 mb-6">
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Ticket['status'] | 'all')}
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="in_progress">En cours</option>
          <option value="resolved">Résolu</option>
          <option value="closed">Fermé</option>
        </select>

        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Ticket['priority'] | 'all')}
        >
          <option value="all">Toutes les priorités</option>
          <option value="low">Faible</option>
          <option value="normal">Normal</option>
          <option value="high">Élevé</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <Card>
        <div className="divide-y">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to={`/tickets/${ticket.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {ticket.reference} - {ticket.title}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    {ticket.description}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Client: {clients.find(c => c.id === ticket.clientId)?.companyName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Mis à jour le {formatDate(ticket.updatedAt)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <TicketStatusBadge status={ticket.status} />
                    <TicketPriorityBadge priority={ticket.priority} />
                  </div>
                  {user?.role === 'admin' && (
                    <div className="flex gap-2">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                        onClick={() => deleteTicket(ticket.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}