import { prisma } from './db';

export async function initializeDatabase() {
  try {
    // Vérifier la connexion
    await prisma.$connect();
    console.log('Connected to MySQL database');

    // Créer l'utilisateur admin par défaut s'il n'existe pas
    const adminExists = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (!adminExists) {
      await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@clientsolve.com',
          password: 'admin', // En production, utiliser un hash
          role: 'ADMIN',
          active: true
        }
      });
      console.log('Admin user created');
    }

  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// API Clients
export async function getClients() {
  return prisma.client.findMany({
    include: {
      users: true,
      tickets: true
    }
  });
}

export async function createClient(data: any) {
  return prisma.client.create({
    data: {
      ...data,
      active: true
    }
  });
}

// API Tickets
export async function getTickets() {
  return prisma.ticket.findMany({
    include: {
      client: true,
      comments: {
        include: {
          user: true
        }
      },
      attachments: true
    }
  });
}

export async function createTicket(data: any) {
  return prisma.ticket.create({
    data: {
      ...data,
      reference: await generateTicketReference(),
      comments: [],
      attachments: []
    },
    include: {
      client: true,
      comments: true,
      attachments: true
    }
  });
}

async function generateTicketReference() {
  const count = await prisma.ticket.count();
  return `ST${String(count + 1).padStart(3, '0')}`;
}

// API Users
export async function getUsers() {
  return prisma.user.findMany({
    include: {
      client: true
    }
  });
}

export async function createUser(data: any) {
  return prisma.user.create({
    data: {
      ...data,
      active: true
    },
    include: {
      client: true
    }
  });
}