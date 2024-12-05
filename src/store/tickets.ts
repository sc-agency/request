import { create } from 'zustand';
import { sendTicketNotification, sendCommentNotification } from '../lib/email';
import type { Ticket, Comment, Attachment } from '../types';

interface TicketState {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, ticket: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  addComment: (ticketId: string, comment: Comment) => void;
  updateComment: (ticketId: string, commentId: string, content: string) => void;
  deleteComment: (ticketId: string, commentId: string) => void;
  addAttachment: (ticketId: string, attachment: Attachment) => void;
  deleteAttachment: (ticketId: string, attachmentId: string) => void;
  getTicketsByClientId: (clientId: string) => Ticket[];
}

// Demo data
const demoTickets: Ticket[] = [
  {
    id: '1',
    reference: 'ST001',
    title: 'Problème de connexion',
    description: 'Impossible de se connecter à l\'application',
    status: 'pending',
    priority: 'high',
    clientId: '1',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    comments: [],
    attachments: [],
  },
  {
    id: '2',
    reference: 'ST002',
    title: 'Bug d\'affichage',
    description: 'Les images ne s\'affichent pas correctement',
    status: 'in_progress',
    priority: 'normal',
    clientId: '2',
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-15'),
    comments: [],
    attachments: [],
  },
];

let nextTicketNumber = demoTickets.length + 1;

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: demoTickets,
  setTickets: (tickets) => set({ tickets }),
  addTicket: (ticket) => {
    const reference = `ST${String(nextTicketNumber).padStart(3, '0')}`;
    nextTicketNumber++;
    const newTicket = { ...ticket, reference };
    set((state) => ({
      tickets: [...state.tickets, newTicket],
    }));
    sendTicketNotification('created', newTicket);
  },
  updateTicket: (id, updatedTicket) =>
    set((state) => {
      const tickets = state.tickets.map((ticket) =>
        ticket.id === id
          ? { ...ticket, ...updatedTicket, updatedAt: new Date() }
          : ticket
      );
      const updatedTicketFull = tickets.find((t) => t.id === id);
      if (updatedTicketFull) {
        sendTicketNotification('updated', updatedTicketFull);
      }
      return { tickets };
    }),
  deleteTicket: (id) =>
    set((state) => ({
      tickets: state.tickets.filter((ticket) => ticket.id !== id),
    })),
  addComment: (ticketId, comment) =>
    set((state) => {
      const tickets = state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              comments: [...ticket.comments, comment],
              updatedAt: new Date(),
            }
          : ticket
      );
      const updatedTicket = tickets.find((t) => t.id === ticketId);
      if (updatedTicket) {
        sendCommentNotification(updatedTicket, comment);
      }
      return { tickets };
    }),
  updateComment: (ticketId, commentId, content) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              comments: ticket.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
              updatedAt: new Date(),
            }
          : ticket
      ),
    })),
  deleteComment: (ticketId, commentId) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              comments: ticket.comments.filter(
                (comment) => comment.id !== commentId
              ),
              updatedAt: new Date(),
            }
          : ticket
      ),
    })),
  addAttachment: (ticketId, attachment) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              attachments: [...ticket.attachments, attachment],
              updatedAt: new Date(),
            }
          : ticket
      ),
    })),
  deleteAttachment: (ticketId, attachmentId) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              attachments: ticket.attachments.filter(
                (attachment) => attachment.id !== attachmentId
              ),
              updatedAt: new Date(),
            }
          : ticket
      ),
    })),
  getTicketsByClientId: (clientId) =>
    get().tickets.filter((ticket) => ticket.clientId === clientId),
}));