import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentPalette from '../components/builder/ComponentPalette';
import Canvas from '../components/builder/Canvas';
import { useEditorStore } from '../store/useEditorStore';
import { useCanvasStore } from '../store/useCanvasStore';
import CustomDragLayer from '../components/builder/CustomDragLayer';
import PropertiesPanel from '../components/builder/PropertiesPanel';
import { supabase } from '../services/supabaseClient';

const Builder = () => {
  const isEditorMode = useEditorStore((state) => state.isEditorMode);
  const setEditorMode = useEditorStore((state) => state.setEditorMode);
  const toggleEditorMode = useEditorStore((state) => state.toggleEditorMode);
  const selectedComponent = useCanvasStore((state) => state.selectedComponent);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('user_accounts')
          .select('role')
          .eq('auth_user_id', user.id)
          .single();

        setUserRole(data?.role);
        
        // Set initial mode based on role
        if (data?.role === 'creator') {
          setEditorMode(true);
        } else if (data?.role === 'user') {
          setEditorMode(false);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [setEditorMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isEditorMode) {
        toggleEditorMode();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isEditorMode, toggleEditorMode]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-[calc(100vh-4rem)]">
        <CustomDragLayer />
        {isEditorMode && userRole === 'creator' && (
          <div className="hidden md:block w-64 p-4">
            <ComponentPalette />
          </div>
        )}
        <div className="flex-1 p-6">
          <Canvas isEditorMode={isEditorMode && userRole === 'creator' && window.innerWidth >= 768} />
        </div>
        {isEditorMode && selectedComponent && userRole === 'creator' && (
          <div className="hidden md:block w-64 p-4 border-l">
            <PropertiesPanel />
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default Builder;