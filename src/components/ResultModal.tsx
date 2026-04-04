import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy } from 'lucide-react';
import React from 'react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: string | null;
}

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, result }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 animate-bounce">
                <Trophy size={40} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">Congratulations!</h2>
                <p className="text-gray-500">The wheel has spoken...</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-full p-6 rounded-2xl shadow-inner">
                <p className="text-white text-sm font-medium uppercase tracking-widest opacity-80 mb-1">You got</p>
                <p className="text-white text-3xl font-black tracking-tight drop-shadow-md">
                  {result}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
              >
                Spin Again
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;
