import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Builder from './pages/Builder';
import UserManagement from './pages/UserManagement';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { usePageStore } from './store/usePageStore';
import OnboardingWrapper from './components/layout/OnboardingWrapper';
import RowDetailsPanel from './components/common/RowDetailsPanel';
import { supabase } from './services/supabaseClient';
import { useSidebarStore } from './store/useSidebarStore';

function AppContent() {
  const { user, loading } = useAuth();
  const currentPage = usePageStore((state) => state.currentPage);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { isCollapsed } = useSidebarStore();

  useEffect(() => {
    const loadAuthenticatedUser = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_accounts')
          .select('name, role')
          .eq('auth_user_id', user.id)
          .single();

        if (error) throw error;
        setCurrentUser(data);
      } catch (error) {
        console.error('Failed to fetch authenticated user:', error);
      }
    };

    loadAuthenticatedUser();
  }, [user]);

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

  const isRestrictedPage = (page: string) => {
    if (!currentUser) return true;
    if (currentUser.role === 'creator') return false;
    return ['users', 'resources', 'settings'].includes(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-48'}`}>
        <Header />
        <main className="pt-16">
          {isRestrictedPage(currentPage) ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <>
              {currentPage === 'dashboard' && <Builder />}
              {currentPage === 'users' && <UserManagement />}
              {currentPage === 'resources' && <Resources />}
              {currentPage === 'profile' && <Profile />}
              {currentPage === 'settings' && <Settings />}
            </>
          )}
        </main>
      </div>
      <RowDetailsPanel />
    </div>
  );
}

function App() {
  return (
    <OnboardingWrapper>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </OnboardingWrapper>
  );
}

export default App;