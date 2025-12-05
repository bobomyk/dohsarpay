import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Book } from '../types';
import { BookCard } from './BookCard';

interface HeroProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  onAddToCart: (book: Book) => void;
}

export const Hero: React.FC<HeroProps> = ({ books, onBookClick, onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto slide
  useEffect(() => {
    if (isHovered) return;
    
    const maxIndex = Math.max(0, books.length - itemsPerView);
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [books.length, itemsPerView, isHovered]);

  const nextSlide = () => {
    const maxIndex = Math.max(0, books.length - itemsPerView);
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, books.length - itemsPerView);
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
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
    
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const maxIndex = Math.max(0, books.length - itemsPerView);

  return (
    <div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-dark flex items-center gap-2">
          Featured Collection 
          <span className="text-[10px] uppercase font-bold text-white bg-primary px-2 py-0.5 rounded-full tracking-wider">Hot</span>
        </h2>
        
        <div className="hidden md:flex gap-2">
          <button 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full border border-gray-200 transition-colors ${
              currentIndex === 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={`p-2 rounded-full border border-gray-200 transition-colors ${
              currentIndex >= maxIndex 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        className="relative overflow-hidden -mx-2 px-2 pb-4" // Negative margin to handle card shadow cutoff
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
              className="flex-shrink-0 px-2 md:px-3 box-border"
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
      
      {/* Mobile dots indicator */}
      <div className="flex justify-center gap-1.5 mt-0 md:hidden">
          {Array.from({ length: Math.min(5, books.length) }).map((_, idx) => (
             <div 
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex % 5 ? 'w-4 bg-primary' : 'w-1 bg-gray-200'
                }`}
             />
          ))}
      </div>
    </div>
  );
};
