import React from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { useTicketStore } from '../store/tickets';
import { TicketStatusBadge } from '../components/tickets/TicketStatusBadge';
import { TicketPriorityBadge } from '../components/tickets/TicketPriorityBadge';
import { formatDate } from '../lib/utils';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const tickets = useTicketStore((state) => state.tickets);
  const recentTickets = tickets.slice(0, 5);

  const ticketsByStatus = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tickets</CardTitle>
          </CardHeader>
          <div className="text-3xl font-bold">{tickets.length}</div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>En attente</CardTitle>
          </CardHeader>
          <div className="text-3xl font-bold">{ticketsByStatus.pending || 0}</div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>En cours</CardTitle>
          </CardHeader>
          <div className="text-3xl font-bold">{ticketsByStatus.in_progress || 0}</div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Résolus</CardTitle>
          </CardHeader>
          <div className="text-3xl font-bold">{ticketsByStatus.resolved || 0}</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets récents</CardTitle>
        </CardHeader>
        <div className="divide-y">
          {recentTickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="block p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{ticket.reference} - {ticket.title}</div>
                  <div className="text-sm text-gray-500">
                    Mis à jour le {formatDate(ticket.updatedAt)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <TicketStatusBadge status={ticket.status} />
                  <TicketPriorityBadge priority={ticket.priority} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}