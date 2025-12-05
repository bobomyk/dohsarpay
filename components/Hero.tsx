import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Book } from '../types';
import { BookCard } from './BookCard';

interface HeroProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  onAddToCart: (book: Book) => void;
}

export const Hero: React.FC<HeroProps> = ({ books, onBookClick, onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2); // Start smaller (mobile default)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Responsive items per view - AGGRESSIVELY COMPACT
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerView(5); // Ultra compact 5 items
      } else if (window.innerWidth >= 1024) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(3);
      } else {
        setItemsPerView(2); // 2 items on mobile for compactness
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto slide
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 4000); // Slightly faster for dynamic feel

    return () => clearInterval(interval);
  }, [currentIndex, isHovered, itemsPerView, books.length]);

  const handleNext = () => {
    setCurrentIndex(prev => {
        const maxIndex = books.length - itemsPerView;
        return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const handlePrev = () => {
    setCurrentIndex(prev => {
        const maxIndex = books.length - itemsPerView;
        return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-50 text-primary rounded-lg">
                <Flame size={18} fill="currentColor" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-dark tracking-tight">
            Trending Now
            </h2>
        </div>
        
        <div className="flex gap-1">
          <button 
            onClick={handlePrev}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-dark transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-dark transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div 
        className="relative overflow-hidden -mx-2 px-2 pb-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {books.map((book) => (
            <div 
              key={book.id} 
              className="flex-shrink-0 px-1.5 md:px-2 box-border"
              style={{ width: `${100 / itemsPerView}%` }}
            >
               <BookCard 
                 book={book}
                 onAddToCart={onAddToCart}
                 onBookClick={onBookClick}
               />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};