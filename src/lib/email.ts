import nodemailer from 'nodemailer';
import type { Ticket, Comment } from '../types';

// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io', // Utiliser Mailtrap pour les tests
  port: 2525,
  auth: {
    user: process.env.SMTP_USER || 'your_mailtrap_user',
    pass: process.env.SMTP_PASS || 'your_mailtrap_password'
  }
});

// Email de l'administrateur
const ADMIN_EMAIL = 'admin@clientsolve.com';

// Templates d'emails
const emailTemplates = {
  ticketCreated: (ticket: Ticket) => ({
    subject: `[ClientSolve] Nouveau ticket créé - ${ticket.reference}`,
    html: `
      <h2>Nouveau ticket créé</h2>
      <p><strong>Référence:</strong> ${ticket.reference}</p>
      <p><strong>Titre:</strong> ${ticket.title}</p>
      <p><strong>Description:</strong> ${ticket.description}</p>
      <p><strong>Priorité:</strong> ${ticket.priority}</p>
      <p><strong>Statut:</strong> ${ticket.status}</p>
    `
  }),
  
  ticketUpdated: (ticket: Ticket) => ({
    subject: `[ClientSolve] Ticket mis à jour - ${ticket.reference}`,
    html: `
      <h2>Ticket mis à jour</h2>
      <p><strong>Référence:</strong> ${ticket.reference}</p>
      <p><strong>Titre:</strong> ${ticket.title}</p>
      <p><strong>Nouveau statut:</strong> ${ticket.status}</p>
      <p><strong>Priorité:</strong> ${ticket.priority}</p>
    `
  }),

  newComment: (ticket: Ticket, comment: Comment) => ({
    subject: `[ClientSolve] Nouveau commentaire sur le ticket ${ticket.reference}`,
    html: `
      <h2>Nouveau commentaire</h2>
      <p><strong>Ticket:</strong> ${ticket.reference} - ${ticket.title}</p>
      <p><strong>Commentaire:</strong> ${comment.content}</p>
      ${comment.isInternal ? '<p><em>Note: Commentaire interne</em></p>' : ''}
    `
  })
};

// Fonctions d'envoi d'emails
export async function sendTicketNotification(type: 'created' | 'updated', ticket: Ticket) {
  const template = type === 'created' 
    ? emailTemplates.ticketCreated(ticket)
    : emailTemplates.ticketUpdated(ticket);

  try {
    await transporter.sendMail({
      from: '"ClientSolve CRM" <noreply@clientsolve.com>',
      to: ADMIN_EMAIL,
      ...template
    });
    console.log(`Email de notification envoyé pour le ticket ${ticket.reference}`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
}

export async function sendCommentNotification(ticket: Ticket, comment: Comment) {
  const template = emailTemplates.newComment(ticket, comment);

  try {
    await transporter.sendMail({
      from: '"ClientSolve CRM" <noreply@clientsolve.com>',
      to: ADMIN_EMAIL,
      ...template
    });
    console.log(`Email de notification envoyé pour le nouveau commentaire sur le ticket ${ticket.reference}`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
}