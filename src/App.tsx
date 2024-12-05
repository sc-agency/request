import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tickets } from './pages/Tickets';
import { TicketDetails } from './pages/TicketDetails';
import { Clients } from './pages/Clients';
import { ClientDetails } from './pages/ClientDetails';
import { Accounts } from './pages/Accounts';
import { useAuthStore } from './store/auth';

function PrivateRoute({ children, allowedRoles = ['admin', 'client'] }: { 
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const user = useAuthStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/tickets" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="dashboard" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tickets/:id" element={<TicketDetails />} />
          <Route 
            path="clients" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Clients />
              </PrivateRoute>
            } 
          />
          <Route 
            path="clients/:id" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <ClientDetails />
              </PrivateRoute>
            } 
          />
          <Route 
            path="accounts" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Accounts />
              </PrivateRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;