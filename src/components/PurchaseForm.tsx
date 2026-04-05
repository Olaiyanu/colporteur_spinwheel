import React, { useState, useMemo } from 'react';
import { Plus, Trash2, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PurchaseItem {
  id: string;
  price: string;
}

interface PurchaseFormProps {
  onQualified: () => void;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ onQualified }) => {
  const [items, setItems] = useState<PurchaseItem[]>([
    { id: crypto.randomUUID(), price: '' }
  ]);
  const [showQualifiedModal, setShowQualifiedModal] = useState(false);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  }, [items]);

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), price: '' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, value: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, price: value };
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (total >= 2000) {
      setShowQualifiedModal(true);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Purchase Details</h2>
          </div>
          <p className="text-indigo-100 opacity-90">Enter your items to see if you qualify for a lucky spin!</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-3">
            {/* Table Header */}
            <div className="flex gap-4 px-4 pb-2 border-b border-gray-50">
              <div className="w-12 text-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">S/N</span>
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Amount (₦)</span>
              </div>
              <div className="w-12" /> {/* Spacer for delete button */}
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 items-center p-2 rounded-2xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-12 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-400 bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 shadow-sm overflow-hidden transition-all">
                    <div className="pl-4 pr-2 py-3 bg-gray-50 border-r border-gray-100 select-none">
                      <span className="text-gray-400 font-bold text-sm">₦</span>
                    </div>
                    <input
                      type="text"
                      placeholder="0.00"
                      value={item.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                          updateItem(item.id, val);
                        }
                      }}
                      className="w-full px-4 py-3 outline-none text-lg font-bold text-gray-800 bg-white placeholder:text-gray-300 min-w-0"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all active:scale-95 shadow-sm border border-indigo-100"
            >
              <Plus size={18} />
              Add Another Item
            </button>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Purchase</p>
                <p className="text-3xl font-black text-gray-900">₦{total.toLocaleString()}</p>
              </div>
              {total < 2000 && (
                <div className="text-right">
                  <p className="text-xs font-bold text-orange-500 uppercase">Target: ₦2,000</p>
                  <p className="text-sm text-gray-400">Need ₦{(2000 - total).toLocaleString()} more to qualify</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={total < 2000}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                total >= 2000
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Check Qualification
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </motion.div>

      {/* Qualification Modal */}
      <AnimatePresence>
        {showQualifiedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-indigo-600" />
              </div>

              <h3 className="text-3xl font-black text-gray-900 mb-4">Congratulations!</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Your purchase of <span className="font-bold text-indigo-600">₦{total.toLocaleString()}</span> qualifies you for our exclusive prize wheel!
              </p>

              <div className="space-y-3">
                <button
                  onClick={onQualified}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Proceed to Spin
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => setShowQualifiedModal(false)}
                  className="w-full py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                >
                  Add more items
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PurchaseForm;
