import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import SpinWheel from './components/SpinWheel';
import ResultModal from './components/ResultModal';
import PurchaseForm from './components/PurchaseForm';
import { RotateCcw, Sparkles, ArrowLeft } from 'lucide-react';
import { WHEEL_ITEMS } from './constants';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItems, setCurrentItems] = useState<string[]>([...WHEEL_ITEMS]);
  const [page, setPage] = useState<'purchase' | 'wheel'>('purchase');

  const handleSpinFinished = useCallback((item: string, index: number) => {
    setResult(item);
    setIsModalOpen(true);
    
    // Update the specific item to "Spin Again"
    setCurrentItems(prev => {
      const newItems = [...prev];
      newItems[index] = "Spin Again";
      return newItems;
    });
    
    // Celebration!
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleQualified = () => {
    setPage('wheel');
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-start md:justify-center p-4 md:p-8 font-sans selection:bg-indigo-100 overflow-x-hidden">
      {/* Header */}
      <div className="text-center mt-8 mb-8 md:mb-12 space-y-4 max-w-4xl w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
          <Sparkles size={16} className="text-yellow-500" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Easter Retreat 2026</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 uppercase">
          Colporteur Page & Prize Wheel
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          {page === 'purchase' 
            ? 'Enter your purchase details to qualify for a lucky spin!'
            : 'Congratulations! You are qualified. Spin the wheel to receive your prize!'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {page === 'purchase' ? (
          <motion.div
            key="purchase-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <PurchaseForm onQualified={handleQualified} />
          </motion.div>
        ) : (
          <motion.div
            key="spin-wheel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Main Wheel Container */}
            <div className="relative group">
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />
              
              <SpinWheel 
                items={currentItems}
                onFinished={handleSpinFinished} 
                isSpinning={isSpinning} 
                setIsSpinning={setIsSpinning} 
              />
            </div>

            <div className="mt-12">
              <button 
                onClick={() => setPage('purchase')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-2xl font-semibold shadow-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
              >
                <ArrowLeft size={18} />
                Back to Purchase
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Controls */}
      <div className="mt-16 flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl text-sm font-semibold shadow-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
          >
            <RotateCcw size={14} />
            Hard Refresh
          </button>
        </div>
        
        <div className="text-xs text-gray-400 font-medium">
          Proudly powered by DLCF Colporteur Unit
        </div>
      </div>

      {/* Result Modal */}
      <ResultModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        result={result} 
      />
    </div>
  );
}
