import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, Copy, Sparkles, X, Loader2 } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';

interface ComponentActionsProps {
  componentId: string;
  stopPropagation: (e: React.MouseEvent) => void;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const FALLBACK_MESSAGES = {
  NO_PROMPT: 'Please enter a question.',
  NO_CANVAS: 'No canvas selected.',
  NO_PROPERTIES: 'Unable to find component properties.',
  NO_API_KEY: 'API key not configured.',
  INVALID_RESPONSE: 'Received an invalid response from the AI.',
  ERROR: 'Sorry, there was an error processing your request.'
} as const;

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  aiResponse: string;
  isLoading: boolean;
  onGenerate: () => void;
}

const AIModal: React.FC<AIModalProps> = ({
  isOpen,
  onClose,
  aiPrompt,
  setAiPrompt,
  aiResponse,
  isLoading,
  onGenerate
}) => {
  if (!isOpen) return null;

  console.log('Rendering AIModal with:', { isOpen, aiPrompt, aiResponse, isLoading });

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={onClose}
        style={{ zIndex: 9999 }}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4" style={{ zIndex: 10000 }}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Ask AI about this component</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="aiPrompt" className="block text-sm font-medium text-gray-700 mb-2">
                Your question
              </label>
              <textarea
                id="aiPrompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask Megacubos AI a question..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] text-sm resize-none shadow-sm"
                rows={4}
              />
            </div>

            {aiResponse && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Response
                </label>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-700 prose prose-sm max-w-none">
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
          >
            Close
          </button>
          <button
            onClick={onGenerate}
            disabled={isLoading || !aiPrompt.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ComponentActions: React.FC<ComponentActionsProps> = ({ componentId, stopPropagation }) => {
  console.log('Rendering ComponentActions for:', componentId);
  
  const [isOpen, setIsOpen] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { removeComponent, duplicateComponent, getComponentProperties, selectComponent } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAskAI = async () => {
    console.log('Starting handleAskAI with:', { aiPrompt, currentCanvasId, componentId });
    
    if (!aiPrompt.trim()) {
      console.log('No prompt provided');
      setAiResponse(FALLBACK_MESSAGES.NO_PROMPT);
      return;
    }

    if (!currentCanvasId) {
      console.log('No canvas selected');
      setAiResponse(FALLBACK_MESSAGES.NO_CANVAS);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching properties for component:', componentId);
      const properties = getComponentProperties(currentCanvasId, componentId);
      console.log('Retrieved properties:', properties);
      
      if (!properties) {
        console.log('No properties found');
        setAiResponse(FALLBACK_MESSAGES.NO_PROPERTIES);
        setIsLoading(false);
        return;
      }

      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey) {
        console.log('No API key found');
        setAiResponse(FALLBACK_MESSAGES.NO_API_KEY);
        setIsLoading(false);
        return;
      }

      console.log('Making API request to DeepSeek');
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: "You're an data analyst, take the next information and create a very brief answer, no more than 500 characters, with the answer of the question of the prompt"
            },
            {
              role: 'user',
              content: `${aiPrompt}\n\nComponent Properties:\n${JSON.stringify(properties, null, 2)}`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response not ok:', response.status, errorText);
        throw new Error(`API request failed: ${response.statusText}`);
      }

      console.log('Received API response');
      const data = await response.json() as DeepSeekResponse;
      console.log('Parsed response:', data);
      
      const content = data.choices?.[0]?.message?.content;
      console.log('Extracted content:', content);
      
      if (typeof content === 'string' && content.trim()) {
        setAiResponse(content);
      } else {
        console.log('Invalid content received:', content);
        setAiResponse(FALLBACK_MESSAGES.INVALID_RESPONSE);
      }
    } catch (error) {
      console.error('Error in handleAskAI:', error);
      setAiResponse(FALLBACK_MESSAGES.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    console.log('Closing AI modal');
    setShowAIPrompt(false);
    setAiPrompt('');
    setAiResponse('');
  };

  console.log('Current state:', { isOpen, showAIPrompt, aiPrompt, aiResponse, isLoading });

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          console.log('Menu button clicked');
          e.stopPropagation();
          setIsOpen(!isOpen);
          selectComponent(componentId);
        }}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 component-actions-menu" 
          style={{ zIndex: 1000 }}
        >
          <div className="py-1">
            <button
              onClick={(e) => {
                console.log('Ask AI button clicked');
                e.stopPropagation();
                setShowAIPrompt(true);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Ask AI
            </button>
            {currentCanvasId && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateComponent(currentCanvasId, componentId);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeComponent(currentCanvasId, componentId);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <AIModal
        isOpen={showAIPrompt}
        onClose={handleCloseModal}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        aiResponse={aiResponse}
        isLoading={isLoading}
        onGenerate={handleAskAI}
      />
    </div>
  );
};

export default ComponentActions;