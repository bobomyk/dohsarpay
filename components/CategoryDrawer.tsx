import React from 'react';
import { X, Check } from 'lucide-react';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
  isOpen, onClose, categories, selectedCategory, onSelectCategory
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-full md:w-[350px] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
         <div className="flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <h2 className="text-xl font-bold text-dark">Categories</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                    <X size={24} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="grid grid-cols-1 gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                onSelectCategory(cat);
                                onClose();
                            }}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all active:scale-[0.98] ${
                                selectedCategory === cat
                                ? 'bg-white border-2 border-primary text-primary font-bold shadow-sm'
                                : 'bg-white border border-gray-100 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            <span>{cat}</span>
                            {selectedCategory === cat && <Check size={18} strokeWidth={3} />}
                        </button>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </>
  );
};