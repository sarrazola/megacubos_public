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
    return () => {
      // Cleanup when component unmounts
      useCanvasStore.getState().clearState();
    };
  }, []);

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
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gray-50">
        <div className="relative flex flex-col items-center gap-6 p-8 text-center">
          {/* Animated cubes background */}
          <div className="absolute inset-0 -z-10">
            <div 
              className="absolute backdrop-blur-sm border border-blue-100/20 rounded-xl animate-float-1"
              style={{
                background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(30, 41, 59, 0.2) 100%)',
                width: '120px',
                height: '120px',
                left: '10%',
                top: '20%',
                transform: 'rotate(45deg)',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            />
            <div 
              className="absolute backdrop-blur-sm border border-purple-100/20 rounded-xl animate-float-2"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(30, 41, 59, 0.2) 100%)',
                width: '100px',
                height: '100px',
                right: '15%',
                bottom: '30%',
                transform: 'rotate(-30deg)',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            />
          </div>

          {/* Loading icon */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping-slow opacity-75">
              <img 
                src="https://mvkcdelawgnlxqqsjboh.supabase.co/storage/v1/object/public/static_content/Logo.png"
                alt="Logo"
                className="h-16 w-16 opacity-50"
              />
            </div>
            <img 
              src="https://mvkcdelawgnlxqqsjboh.supabase.co/storage/v1/object/public/static_content/Logo.png"
              alt="Logo"
              className="h-16 w-16 animate-pulse"
            />
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">
              Loading your dashboard
            </h3>
            <p className="text-gray-500">
              Preparing your workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-[calc(100vh-4rem)]">
        <CustomDragLayer />
        {isEditorMode && userRole === 'creator' && (
          <div className="hidden md:block w-32 p-2">
            <ComponentPalette />
          </div>
        )}
        <div className="flex-1 p-4">
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