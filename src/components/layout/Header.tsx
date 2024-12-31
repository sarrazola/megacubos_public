import React, { useEffect, useState } from 'react';
import { Eye, Edit2, Plus } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { usePageStore } from '../../store/usePageStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import { supabase } from '../../services/supabaseClient';
import { useSidebarStore } from '../../store/useSidebarStore';

const Header = () => {
  const { isCollapsed } = useSidebarStore();
  const { isEditorMode, toggleEditorMode } = useEditorStore();
  const { currentPage } = usePageStore();
  const { addCanvas } = useCanvasesStore();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadAuthenticatedUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_accounts')
          .select('role')
          .eq('auth_user_id', user.id)
          .single();

        if (error) throw error;
        setCurrentUser(data);
      } catch (error) {
        console.error('Failed to fetch authenticated user:', error);
      }
    };

    loadAuthenticatedUser();
  }, []);

  const handleCreateCanvas = async () => {
    await addCanvas('New Canvas');
  };

  if (currentPage !== 'dashboard') {
    return (
      <header className={`h-16 bg-white border-b fixed top-0 right-0 ${isCollapsed ? 'left-16' : 'left-48'} px-6 flex items-center justify-between z-10 transition-all duration-300`} />
    );
  }

  return (
    <header className={`fixed top-0 right-0 ${isCollapsed ? 'left-16' : 'left-48'} h-16 bg-white border-b z-30 transition-all duration-300`}>
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentUser?.role === 'creator' && (
            <button
              onClick={handleCreateCanvas}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create New Canvas
            </button>
          )}

          <div className="flex-1" />

          {currentUser?.role === 'creator' && (
            <button
              onClick={toggleEditorMode}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              {isEditorMode ? (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Switch to Live Mode</span>
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4" />
                  <span>Switch to Editor Mode</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;