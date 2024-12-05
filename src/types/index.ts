export type User = {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'client';
  companyName?: string;
  clientId?: string;
  password: string;
  active: boolean;
};

export type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
};

export type Ticket = {
  id: string;
  reference: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  attachments: Attachment[];
};

export type Comment = {
  id: string;
  content: string;
  userId: string;
  ticketId: string;
  isInternal: boolean;
  createdAt: Date;
};

export type Client = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  siret: string;
  iban?: string;
  bic?: string;
  active: boolean;
  users?: User[];
};