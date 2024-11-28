import React, { useEffect, useState } from 'react';
import { PanelLeft, Settings, Database, LayoutDashboard, Users, Code, ChevronRight, User, MoreVertical, Copy, Trash2, Pencil, Check, X } from 'lucide-react';
import { usePageStore } from '../../store/usePageStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import { fetchUsers } from '../../services/api/users';

const Sidebar = () => {
  const { currentPage, setCurrentPage } = usePageStore();
  const { canvases, currentCanvasId, setCurrentCanvas, deleteCanvas, duplicateCanvas, renameCanvas } = useCanvasesStore();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const users = await fetchUsers();
        if (users.length > 0) {
          setCurrentUser(users[0]);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    loadCurrentUser();
  }, []);

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

  const handleSaveCanvasName = () => {
    if (editingCanvasId && editingName.trim()) {
      renameCanvas(editingCanvasId, editingName.trim());
      setEditingCanvasId(null);
      setOpenMenu(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveCanvasName();
    } else if (e.key === 'Escape') {
      setEditingCanvasId(null);
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard />, label: 'Canvas', id: 'dashboard', hasSubMenu: true },
    { icon: <Database />, label: 'Data', id: 'data' },
    { icon: <Users />, label: 'Users', id: 'users' },
    { icon: <Code />, label: 'Resources', id: 'resources' },
    { icon: <Settings />, label: 'Settings', id: 'settings' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <PanelLeft className="h-6 w-6" />
        <span className="text-xl font-bold">Megacubos</span>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`flex items-center gap-3 p-2 w-full hover:bg-gray-800 rounded-lg transition-colors ${
                  currentPage === item.id ? 'bg-gray-800' : ''
                }`}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {item.hasSubMenu && <ChevronRight className="h-4 w-4" />}
              </button>
              {item.hasSubMenu && currentPage === item.id && (
                <ul className="ml-4 mt-2 space-y-1">
                  {canvases.map((canvas) => (
                    <li key={canvas.id}>
                      <div className="flex items-center gap-2">
                        <button
                          className={`flex-1 p-2 hover:bg-gray-800 rounded-lg transition-colors text-sm ${
                            currentCanvasId === canvas.id ? 'bg-gray-800' : ''
                          }`}
                          onClick={() => setCurrentCanvas(canvas.id)}
                        >
                          {canvas.name}
                        </button>
                        <div className="relative canvas-menu">
                          <button
                            onClick={() => {
                              setOpenMenu(openMenu === canvas.id ? null : canvas.id);
                              setConfirmingDelete(null);
                              setEditingCanvasId(null);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-200 rounded"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {openMenu === canvas.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
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
        <button
          onClick={() => setCurrentPage('profile')}
          className="mt-auto pt-4 border-t border-gray-700 flex items-center gap-3 w-full hover:bg-gray-800 p-2 rounded-lg transition-colors"
        >
          <div className="p-2 bg-gray-800 rounded-full">
            <User className="h-5 w-5" />
          </div>
          <span className="font-medium">{currentUser.name}</span>
        </button>
      )}
    </div>
  );
};

export default Sidebar;