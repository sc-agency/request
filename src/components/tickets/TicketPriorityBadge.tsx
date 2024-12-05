import React from 'react';
import { Badge } from '../ui/Badge';
import type { Ticket } from '../../types';

const priorityConfig: Record<Ticket['priority'], { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
  low: { label: 'Faible', variant: 'default' },
  normal: { label: 'Normal', variant: 'success' },
  high: { label: 'Élevé', variant: 'warning' },
  urgent: { label: 'Urgent', variant: 'danger' },
};

export function TicketPriorityBadge({ priority }: { priority: Ticket['priority'] }) {
  const config = priorityConfig[priority];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}