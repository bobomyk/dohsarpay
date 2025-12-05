import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Save, Plus, Trash2 } from 'lucide-react';
import { Book } from '../types';

interface AdminBookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: Omit<Book, 'id'> | Book) => void;
  onDelete?: (book: Book) => void;
  initialData?: Book | null;
  categories: string[];
}

export const AdminBookForm: React.FC<AdminBookFormProps> = ({ 
  isOpen, onClose, onSubmit, onDelete, initialData, categories 
}) => {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    price: 0,
    category: '',
    description: '',
    coverUrl: '',
    rating: 0,
    previewPages: []
  });

  const [previewInput, setPreviewInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        previewPages: initialData.previewPages || []
      });
    } else {
      setFormData({
        title: '',
        author: '',
        price: 0,
        category: categories[1] || 'General',
        description: '',
        coverUrl: '',
        rating: 5,
        previewPages: []
      });
    }
    setPreviewInput('');
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

  const handlePreviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            previewPages: [...(prev.previewPages || []), reader.result as string]
          }));
        };
        // Fix: Explicitly cast file to Blob/File to satisfy TypeScript
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const handleAddPreviewUrl = (url: string) => {
    if (!url) return;
    setFormData(prev => ({
      ...prev,
      previewPages: [...(prev.previewPages || []), url]
    }));
  };

  const handleRemovePreview = (index: number) => {
    setFormData(prev => ({
      ...prev,
      previewPages: (prev.previewPages || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Book);
    onClose();
  };

  const handleDelete = () => {
    if (initialData && onDelete) {
      onDelete(initialData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-20">
          <div>
             <h2 className="text-xl font-bold text-dark">
                {initialData ? 'Edit Book Details' : 'Add New Book'}
             </h2>
             <p className="text-xs text-gray-400">Admin Control Panel</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8 flex-1 overflow-y-auto">
          {/* Main Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Cover Image Column */}
            <div className="col-span-1 md:col-span-4 space-y-3">
              <label className="block text-sm font-bold text-gray-700">Cover Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 text-center hover:bg-gray-50 transition-colors relative group aspect-[2/3] flex flex-col items-center justify-center bg-gray-50">
                {formData.coverUrl ? (
                  <>
                    <img 
                      src={formData.coverUrl} 
                      alt="Preview" 
                      className="h-full w-full object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <p className="text-white font-medium flex items-center gap-1"><Upload size={16} /> Change</p>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <ImageIcon size={48} className="mb-2" />
                    <p className="text-sm">Upload Cover</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <input 
                type="text"
                name="coverUrl"
                value={formData.coverUrl}
                onChange={handleChange}
                placeholder="Or paste image URL"
                className="w-full p-2 border border-gray-200 rounded-lg text-xs"
              />
            </div>

            {/* Details Column */}
            <div className="col-span-1 md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Book Title</label>
                    <input 
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Author</label>
                    <input 
                    type="text"
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (฿)</label>
                    <input 
                        type="number"
                        name="price"
                        required
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Rating</label>
                    <input 
                        type="number"
                        name="rating"
                        required
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                    >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                    </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
             <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea 
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Author Bio</label>
                    <textarea 
                        name="authorBio"
                        rows={3}
                        value={formData.authorBio || ''}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                    />
                </div>
             </div>
          </div>

          {/* Preview Pages Management */}
          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">Preview Pages (Read Sample)</label>
            <p className="text-xs text-gray-400 mb-3">Upload images or add URLs for book sample pages.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
                {formData.previewPages?.map((url, idx) => (
                    <div key={idx} className="relative group aspect-[2/3] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img src={url} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <button
                            type="button"
                            onClick={() => handleRemovePreview(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                            title="Remove Page"
                        >
                            <X size={14} />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 rounded">
                            {idx + 1}
                        </span>
                    </div>
                ))}
                
                {/* Upload Button */}
                <label className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors aspect-[2/3]">
                    <Plus size={24} className="text-primary mb-1" />
                    <span className="text-xs text-primary font-bold">Add Page</span>
                    <input type="file" multiple accept="image/*" onChange={handlePreviewImageUpload} className="hidden" />
                </label>
            </div>
            
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={previewInput} 
                    onChange={(e) => setPreviewInput(e.target.value)}
                    placeholder="Or paste image URL here..." 
                    className="flex-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                <button 
                    type="button"
                    onClick={() => {
                        if(previewInput) {
                            handleAddPreviewUrl(previewInput);
                            setPreviewInput('');
                        }
                    }}
                    className="px-4 py-2 bg-gray-100 text-dark font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                    Add URL
                </button>
            </div>
          </div>
        </form>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center rounded-b-2xl">
            {initialData && onDelete ? (
                <button 
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-500 font-bold hover:bg-red-50 hover:border-red-300 transition-all shadow-sm flex items-center gap-2"
                >
                    <Trash2 size={18} />
                    <span className="hidden md:inline">Delete Book</span>
                </button>
            ) : (
                <div /> // Spacer
            )}
            
            <div className="flex gap-3">
                <button 
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-white hover:text-dark transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit}
                    type="button" // Triggered via onClick to be safe outside form
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-primary/30 flex items-center gap-2 active:scale-95"
                >
                    <Save size={18} />
                    {initialData ? 'Save Changes' : 'Create Book'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};