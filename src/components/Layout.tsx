import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { LogOut, LayoutDashboard, Ticket, Users, UserCog } from 'lucide-react';

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">ClientSolve</span>
              </Link>
              {user && (
                <div className="ml-10 flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Tableau de bord
                  </Link>
                  <Link
                    to="/tickets"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                  >
                    <Ticket className="w-4 h-4" />
                    Tickets
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <Link
                        to="/clients"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        Clients
                      </Link>
                      <Link
                        to="/accounts"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                      >
                        <UserCog className="w-4 h-4" />
                        Comptes
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            {user && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-4">
                  {user.username} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}