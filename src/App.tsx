import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Builder from './pages/Builder';
import UserManagement from './pages/UserManagement';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { usePageStore } from './store/usePageStore';

function AppContent() {
  const { user, loading } = useAuth();
  const currentPage = usePageStore((state) => state.currentPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-64 transition-all duration-300">
        <Header />
        <main className="pt-16">
          {currentPage === 'dashboard' && <Builder />}
          {currentPage === 'users' && <UserManagement />}
          {currentPage === 'resources' && <Resources />}
          {currentPage === 'profile' && <Profile />}
          {currentPage === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;