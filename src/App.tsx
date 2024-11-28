import React from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Builder from './pages/Builder';
import DataManagement from './pages/DataManagement';
import UserManagement from './pages/UserManagement';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { usePageStore } from './store/usePageStore';

function App() {
  const currentPage = usePageStore((state) => state.currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="pt-16">
          {currentPage === 'dashboard' && <Builder />}
          {currentPage === 'data' && <DataManagement />}
          {currentPage === 'users' && <UserManagement />}
          {currentPage === 'resources' && <Resources />}
          {currentPage === 'profile' && <Profile />}
          {currentPage === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}

export default App;