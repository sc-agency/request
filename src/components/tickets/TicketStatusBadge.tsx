import React from 'react';
import { Badge } from '../ui/Badge';
import type { Ticket } from '../../types';

const statusConfig: Record<Ticket['status'], { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
  pending: { label: 'En attente', variant: 'warning' },
  in_progress: { label: 'En cours', variant: 'default' },
  resolved: { label: 'Résolu', variant: 'success' },
  closed: { label: 'Fermé', variant: 'danger' },
};

export function TicketStatusBadge({ status }: { status: Ticket['status'] }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}