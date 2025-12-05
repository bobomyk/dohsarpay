import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Save } from 'lucide-react';
import { Book } from '../types';

interface AdminBookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: Omit<Book, 'id'> | Book) => void;
  initialData?: Book | null;
  categories: string[];
}

export const AdminBookForm: React.FC<AdminBookFormProps> = ({ 
  isOpen, onClose, onSubmit, initialData, categories 
}) => {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    price: 0,
    category: '',
    description: '',
    coverUrl: '',
    rating: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        author: '',
        price: 0,
        category: categories[1] || 'General',
        description: '',
        coverUrl: '',
        rating: 5
      });
    }
  }, [initialData, categories, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' ? parseFloat(value) : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Book);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-dark">
            {initialData ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image Upload */}
            <div className="col-span-full md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative group h-64 flex flex-col items-center justify-center">
                {formData.coverUrl ? (
                  <>
                    <img 
                      src={formData.coverUrl} 
                      alt="Preview" 
                      className="h-full w-full object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <p className="text-white font-medium">Change Image</p>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <ImageIcon size={48} className="mb-2" />
                    <p>Click to upload cover</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="mt-2 text-center text-gray-400 text-xs">Or enter URL below</div>
              <input 
                type="text"
                name="coverUrl"
                value={formData.coverUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="mt-2 w-full p-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            {/* Basic Info */}
            <div className="col-span-full md:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input 
                  type="text"
                  name="author"
                  required
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (฿)</label>
                  <input 
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input 
                    type="number"
                    name="rating"
                    required
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
              />
            </div>
             
             {/* Author Bio */}
             <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Author Bio</label>
              <textarea 
                name="authorBio"
                rows={3}
                value={formData.authorBio || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-primary/30 flex items-center gap-2"
            >
              <Save size={18} />
              {initialData ? 'Update Book' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};