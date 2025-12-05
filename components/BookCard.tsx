import React from 'react';
import { Book } from '../types.ts';
import { Star, Plus, Pencil, Trash2 } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
  onBookClick: (book: Book) => void;
  isAdmin?: boolean;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, onAddToCart, onBookClick, isAdmin, onEdit, onDelete 
}) => {
  const discount = book.originalPrice && book.originalPrice > book.price 
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div 
      onClick={() => onBookClick(book)}
      className="group relative bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-100 cursor-pointer"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl mb-3 bg-gray-100">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm z-10">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold">{book.rating}</span>
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">
            -{discount}%
          </div>
        )}

        {/* Admin Overlay Actions */}
        {isAdmin && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(book);
                }}
                className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
             >
                <Pencil size={18} />
             </button>
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(book);
                }}
                className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-lg"
             >
                <Trash2 size={18} />
             </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <p className="text-xs text-primary font-medium mb-1 uppercase tracking-wide">{book.category}</p>
        <h3 className="font-bold text-dark text-lg leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">{book.title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-1">{book.author}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col leading-none">
            {book.originalPrice && book.originalPrice > book.price && (
               <span className="text-[10px] md:text-xs text-gray-400 line-through mb-0.5">฿{book.originalPrice.toLocaleString()}</span>
            )}
            <span className="text-lg font-bold text-dark">฿{book.price.toLocaleString()}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(book);
            }}
            className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center hover:bg-primary transition-colors active:scale-90 shadow-md"
            aria-label="Add to cart"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
      <div className="aspect-[2/3] w-full bg-gray-200 rounded-xl mb-3" />
      
      <div className="flex-1 flex flex-col">
        {/* Category placeholder */}
        <div className="h-3 w-1/3 bg-gray-200 rounded mb-2" />
        
        {/* Title placeholder (2 lines) */}
        <div className="h-5 w-full bg-gray-200 rounded mb-1" />
        <div className="h-5 w-2/3 bg-gray-200 rounded mb-2" />
        
        {/* Author placeholder */}
        <div className="h-3 w-1/2 bg-gray-200 rounded mb-4" />
        
        <div className="mt-auto flex items-center justify-between">
          {/* Price */}
          <div className="h-6 w-16 bg-gray-200 rounded" />
          {/* Button */}
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};