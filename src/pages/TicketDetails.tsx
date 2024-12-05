import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { useTicketStore } from '../store/tickets';
import { useClientStore } from '../store/clients';
import { useAuthStore } from '../store/auth';
import { useUserStore } from '../store/users';
import { TicketStatusBadge } from '../components/tickets/TicketStatusBadge';
import { TicketPriorityBadge } from '../components/tickets/TicketPriorityBadge';
import { TicketForm } from '../components/tickets/TicketForm';
import { formatDate } from '../lib/utils';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import type { Comment } from '../types';

export function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticket = useTicketStore((state) => 
    state.tickets.find((t) => t.id === id)
  );
  const { updateTicket, deleteTicket, addComment, updateComment, deleteComment } = useTicketStore();
  const clients = useClientStore((state) => state.clients);
  const user = useAuthStore((state) => state.user);
  const users = useUserStore((state) => state.users);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingTicket, setEditingTicket] = useState(false);

  if (!ticket) {
    return <div>Ticket non trouvé</div>;
  }

  const client = clients.find((c) => c.id === ticket.clientId);

  const getCommentAuthor = (userId: string) => {
    const commentUser = users.find(u => u.id === userId);
    return commentUser ? `${commentUser.username} (${commentUser.role})` : 'Utilisateur inconnu';
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      userId: user?.id || '',
      ticketId: ticket.id,
      isInternal,
      createdAt: new Date(),
    };

    addComment(ticket.id, comment);
    setNewComment('');
    setIsInternal(false);
  };

  const handleUpdateTicket = (data: Partial<typeof ticket>) => {
    updateTicket(ticket.id, data);
    setEditingTicket(false);
  };

  const handleDeleteTicket = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      deleteTicket(ticket.id);
      navigate('/tickets');
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/tickets')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux tickets
      </button>

      {editingTicket ? (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Modifier le ticket</h2>
            <TicketForm
              initialData={ticket}
              onSubmit={handleUpdateTicket}
              onCancel={() => setEditingTicket(false)}
              userRole={user?.role}
            />
          </div>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                {ticket.reference} - {ticket.title}
              </h1>
              <p className="text-gray-500">Client: {client?.companyName}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <TicketStatusBadge status={ticket.status} />
                <TicketPriorityBadge priority={ticket.priority} />
              </div>
              {user?.role === 'admin' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTicket(true)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDeleteTicket}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Détails du ticket</CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">{ticket.description}</p>
              <div className="text-sm text-gray-500">
                Créé le {formatDate(ticket.createdAt)}
                <br />
                Dernière mise à jour le {formatDate(ticket.updatedAt)}
              </div>
            </div>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Commentaires</CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          {ticket.comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg ${
                comment.isInternal ? 'bg-yellow-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  {editingComment === comment.id ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={comment.content}
                        onChange={(e) =>
                          updateComment(ticket.id, comment.id, e.target.value)
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingComment(null)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Terminer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-700">
                          {getCommentAuthor(comment.userId)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                        {comment.isInternal && (
                          <span className="text-xs text-yellow-600 font-medium">
                            (Interne)
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900">{comment.content}</p>
                    </>
                  )}
                </div>
                {!editingComment && user?.role === 'admin' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingComment(comment.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteComment(ticket.id, comment.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="mt-4 space-y-4">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            {user?.role === 'admin' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="internal"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                />
                <label htmlFor="internal" className="text-sm text-gray-700">
                  Commentaire interne
                </label>
              </div>
            )}
            <button
              onClick={handleAddComment}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Ajouter le commentaire
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}