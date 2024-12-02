import React, { useState } from 'react';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import { Rocket } from 'lucide-react';

const OnboardingModal = () => {
  const [canvasName, setCanvasName] = useState('My First Canvas');
  const { addCanvas } = useCanvasesStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (canvasName.trim()) {
      await addCanvas(canvasName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl border border-gray-800">
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-500/10 p-3 rounded-full mb-4">
            <Rocket className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Your Dashboard Journey</h2>
          <p className="text-gray-400 mb-6">
            Create your first canvas - a blank space where your data visualization dreams come to life.
          </p>
          
          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              value={canvasName}
              onChange={(e) => setCanvasName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My First Canvas"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create Canvas
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal; 