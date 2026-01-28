import React from 'react';
import { useAI } from '../../contexts/AIContext';
import { Sparkles } from 'lucide-react';

export const AIFloatingButton: React.FC = () => {
  const { isOpen, toggleOpen } = useAI();

  // Don't render button when panel is open
  if (isOpen) return null;

  return (
    <button
      onClick={toggleOpen}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center z-50 group"
      title="Open Cortex AI Assistant"
    >
      <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Ask Cortex AI
      </span>
      
      {/* Pulse ring animation */}
      <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20" />
    </button>
  );
};
