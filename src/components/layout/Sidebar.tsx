import React, { useEffect, useState } from 'react';
import { PanelLeft, Settings, Database, LayoutDashboard, Users, Code, ChevronRight, User, MoreVertical, Copy, Trash2, Pencil, Check, X, LogOut, Menu } from 'lucide-react';
import { usePageStore } from '../../store/usePageStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import { useCanvasStore } from '../../store/useCanvasStore';
import { fetchUsers } from '../../services/api/users';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { useSidebarStore } from '../../store/useSidebarStore';

const Sidebar = () => {
  const { currentPage, setCurrentPage } = usePageStore();
  const { 
    canvases, 
    fetchCanvases, 
    deleteCanvas, 
    duplicateCanvas,
    renameCanvas,
    currentCanvasId,
    setCurrentCanvas 
  } = useCanvasesStore();

  const { initializeCanvas } = useCanvasStore();
  const { isCollapsed, toggleCollapsed } = useSidebarStore();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { signOut, user } = useAuth();

  useEffect(() => {
    fetchCanvases().catch(error => {
      console.error('Failed to fetch canvases:', error);
    });
  }, [fetchCanvases]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen && !(event.target as Element).closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenu && !(event.target as Element).closest('.canvas-menu')) {
        setOpenMenu(null);
        setConfirmingDelete(null);
        setEditingCanvasId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  const handleDeleteCanvas = (id: string) => {
    if (canvases.length <= 1) {
      alert('Cannot delete the last canvas');
      return;
    }
    setConfirmingDelete(id);
  };

  const confirmDelete = (id: string) => {
    deleteCanvas(id);
    setOpenMenu(null);
    setConfirmingDelete(null);
  };

  const handleDuplicateCanvas = (id: string) => {
    duplicateCanvas(id);
    setOpenMenu(null);
  };

  const handleStartEditing = (canvas: { id: string; name: string }) => {
    setEditingCanvasId(canvas.id);
    setEditingName(canvas.name);
  };

  const handleSaveCanvasName = async () => {
    if (editingCanvasId && editingName.trim()) {
      await renameCanvas(editingCanvasId, editingName.trim());
      setEditingCanvasId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveCanvasName();
    } else if (e.key === 'Escape') {
      setEditingCanvasId(null);
    }
  };

  const handleCanvasSelect = async (canvasId: string) => {
    setCurrentCanvas(canvasId);
    try {
      await initializeCanvas(canvasId);
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      { icon: <LayoutDashboard />, label: 'Canvas', id: 'dashboard', hasSubMenu: true },
    ];

    // Only show these items for creators
    if (currentUser?.role === 'creator') {
      baseItems.push(
        { icon: <Users />, label: 'Users', id: 'users' },
        { icon: <Database />, label: 'Resources', id: 'resources' }
      );
    }

    return baseItems;
  };

  const handleUserMenuClick = (page: string) => {
    // Only allow settings access for creators
    if (page === 'settings' && currentUser?.role !== 'creator') {
      return;
    }
    setCurrentPage(page);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <div className={`
        ${isCollapsed ? 'w-16' : 'w-48'} 
        bg-gray-900 text-white h-screen fixed left-0 top-0 p-3 flex flex-col
        transition-all duration-300 ease-in-out z-40
        ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
        md:translate-x-0
      `}>
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={toggleCollapsed}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="h-4 w-4 text-gray-400 hover:text-gray-200" />
          </button>
          {!isCollapsed && (
            <>
              <img 
                src="https://mvkcdelawgnlxqqsjboh.supabase.co/storage/v1/object/public/static_content/megacubos-dark.png" 
                alt="Megacubos Logo" 
                className="h-5 w-5"
              />
              <span className="text-base font-bold">Megacubos</span>
            </>
          )}
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            {getMenuItems().map((item) => (
              <li key={item.id}>
                <button
                  className={`flex items-center gap-2 p-1.5 w-full hover:bg-gray-800 rounded-lg transition-colors text-sm ${
                    currentPage === item.id ? 'bg-gray-800' : ''
                  }`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {item.hasSubMenu && <ChevronRight className="h-3 w-3" />}
                    </>
                  )}
                </button>
                {!isCollapsed && item.hasSubMenu && currentPage === item.id && (
                  <ul className="ml-2 mt-1 space-y-0.5">
                    {canvases.map((canvas) => (
                      <li key={canvas.id}>
                        <div className="flex items-center gap-1">
                          <button
                            className={`flex-1 p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-xs ${
                              currentCanvasId === canvas.id ? 'bg-gray-800' : ''
                            }`}
                            onClick={() => handleCanvasSelect(canvas.id)}
                          >
                            <span className="block truncate text-left">{canvas.name}</span>
                          </button>
                          {currentUser?.role === 'creator' && (
                            <div className="relative canvas-menu">
                              <button
                                onClick={() => {
                                  setOpenMenu(openMenu === canvas.id ? null : canvas.id);
                                  setConfirmingDelete(null);
                                  setEditingCanvasId(null);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-200 rounded"
                              >
                                <MoreVertical className="h-3 w-3" />
                              </button>
                              {openMenu === canvas.id && (
                                <div className="absolute right-0 mt-1 w-40 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                                  {editingCanvasId === canvas.id ? (
                                    <div className="px-4 py-2 space-y-2">
                                      <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full px-2 py-1 text-gray-900 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={handleSaveCanvasName}
                                          className="flex-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingCanvasId(null)}
                                          className="flex-1 px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleStartEditing(canvas)}
                                        className="w-full px-4 py-2 text-sm text-left text-gray-200 hover:bg-gray-700 flex items-center gap-2"
                                      >
                                        <Pencil className="h-4 w-4" />
                                        Rename
                                      </button>
                                      <button
                                        onClick={() => handleDuplicateCanvas(canvas.id)}
                                        className="w-full px-4 py-2 text-sm text-left text-gray-200 hover:bg-gray-700 flex items-center gap-2"
                                      >
                                        <Copy className="h-4 w-4" />
                                        Duplicate
                                      </button>
                                      {confirmingDelete === canvas.id ? (
                                        <div className="px-4 py-2 space-y-2">
                                          <p className="text-sm text-gray-300">Delete this canvas?</p>
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => confirmDelete(canvas.id)}
                                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                              Yes, delete
                                            </button>
                                            <button
                                              onClick={() => setConfirmingDelete(null)}
                                              className="px-3 py-1 text-sm bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => handleDeleteCanvas(canvas.id)}
                                          className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-gray-700 flex items-center gap-2"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          Delete
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {currentUser && (
          <div className="relative mt-auto pt-3 border-t border-gray-700 user-menu">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center gap-2 hover:bg-gray-800 p-1.5 rounded-lg transition-colors text-sm"
            >
              <div className="p-1.5 bg-gray-800 rounded-full">
                <User className="h-3 w-3" />
              </div>
              {!isCollapsed && (
                <>
                  <span className="font-medium flex-1 text-left truncate">{currentUser.name}</span>
                  <ChevronRight className={`h-3 w-3 transition-transform ${isUserMenuOpen ? 'rotate-90' : ''}`} />
                </>
              )}
            </button>

            {isUserMenuOpen && (
              <div className={`
                absolute ${isCollapsed ? 'left-16' : 'left-0'} bottom-full 
                w-40 mb-2 bg-gray-800 rounded-lg shadow-lg py-1 
                border border-gray-700 z-50
              `}>
                {currentUser.role === 'creator' && (
                  <button
                    onClick={() => handleUserMenuClick('settings')}
                    className="w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                )}
                <button
                  onClick={async () => {
                    try {
                      await signOut();
                      setIsUserMenuOpen(false);
                    } catch (error) {
                      console.error('Error signing out:', error);
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-700 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;