import React from 'react';
import { Book } from '../types';
import { BookCard } from './BookCard';

interface AutoScrollBookListProps {
  books: Book[];
  onAddToCart: (book: Book) => void;
  onBookClick: (book: Book) => void;
  isAdmin?: boolean;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

export const AutoScrollBookList: React.FC<AutoScrollBookListProps> = ({ 
  books, onAddToCart, onBookClick, isAdmin, onEdit, onDelete 
}) => {
  // If we have very few books, duplicating them once might not be enough to fill the screen width for smooth looping.
  // We ensure we have enough content by repeating the list if it's small.
  const displayBooks = books.length < 5 ? [...books, ...books, ...books] : [...books, ...books];

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Gradient Masks for smooth fade edges */}
      <div className="absolute top-0 left-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

      {/* Scrolling Track */}
      <div 
        className="flex w-max animate-scroll hover:[animation-play-state:paused]"
      >
        {displayBooks.map((book, index) => (
          <div 
            key={`${book.id}-${index}`} 
            className="w-[150px] md:w-[180px] mx-2 md:mx-3 flex-shrink-0"
          >
            <BookCard 
              book={book}
              onAddToCart={onAddToCart}
              onBookClick={onBookClick}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};