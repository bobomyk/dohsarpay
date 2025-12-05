import React, { useState, useEffect } from 'react';
import { Book, Review } from '../types.ts';
import { ArrowLeft, Star, ShoppingBag, Share2, Heart, User, Send, ChevronDown, ChevronUp, BookOpen, X, Pencil, Trash2 } from 'lucide-react';
import { BookCard } from './BookCard.tsx';

const MOCK_REVIEWS: Review[] = [
  { id: '1', userName: 'Nadech K.', rating: 5, comment: 'Absolutely loved this book! The pacing was perfect and I couldn\'t put it down.', date: '2023-10-15' },
  { id: '2', userName: 'Yaya U.', rating: 4, comment: 'Great story, but the shipping took a bit longer than expected.', date: '2023-10-12' },
  { id: '3', userName: 'Mario M.', rating: 5, comment: 'A masterpiece. Highly recommended for everyone.', date: '2023-09-28' },
];

interface BookDetailsProps {
  book: Book;
  allBooks: Book[];
  onBack: () => void;
  onAddToCart: (book: Book) => void;
  onBookClick: (book: Book) => void;
  isAdmin?: boolean;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

export const BookDetails: React.FC<BookDetailsProps> = ({ 
  book, allBooks, onBack, onAddToCart, onBookClick, isAdmin, onEdit, onDelete 
}) => {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isAuthorBioOpen, setIsAuthorBioOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const discount = book.originalPrice && book.originalPrice > book.price 
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  // Scroll to top on mount or when book changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [book.id]);

  // Lock body scroll when preview is open
  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isPreviewOpen]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim() || !userName.trim()) return;
    
    const newReview: Review = {
        id: Date.now().toString(),
        userName: userName,
        rating: userRating,
        comment: userComment,
        date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([newReview, ...reviews]);
    setUserComment('');
    setUserName('');
    setUserRating(5);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={14} 
            className={`${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  const relatedBooks = allBooks
    .filter(b => b.category === book.category && b.id !== book.id)
    .slice(0, 5);

  return (
    <>
      <div className="bg-white min-h-screen pb-24 md:pb-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Mobile Header (Sticky) */}
        <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md md:hidden border-b border-gray-100">
          <button onClick={onBack} className="p-2 -ml-2 text-dark rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex gap-2">
            {isAdmin ? (
               <>
                 <button onClick={() => onEdit?.(book)} className="p-2 text-blue-600 rounded-full hover:bg-blue-50"><Pencil size={20} /></button>
                 <button onClick={() => onDelete?.(book)} className="p-2 text-red-500 rounded-full hover:bg-red-50"><Trash2 size={20} /></button>
               </>
            ) : (
               <>
                <button className="p-2 text-dark rounded-full hover:bg-gray-100"><Share2 size={20} /></button>
                <button className="p-2 text-dark rounded-full hover:bg-gray-100"><Heart size={20} /></button>
               </>
            )}
          </div>
        </div>

        {/* Desktop Back Button */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 py-6">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
              <ArrowLeft size={20} /> Back to browsing
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 md:pb-12">
              {/* Image Section */}
              <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                  <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 relative group">
                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                      
                      {/* Discount Label */}
                      {discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-full z-10 shadow-lg text-sm">
                            SAVE {discount}%
                        </div>
                      )}

                      {/* Desktop Preview Button on Image Overlay */}
                      {book.previewPages && book.previewPages.length > 0 && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={() => setIsPreviewOpen(true)}
                              className="bg-white text-dark px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <BookOpen size={20} />
                                Read Sample
                            </button>
                        </div>
                      )}
                  </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 pt-2 md:pt-0">
                  <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                              {book.category}
                          </span>
                          <h1 className="text-2xl md:text-4xl font-bold text-dark leading-tight mb-2">
                              {book.title}
                          </h1>
                          <p className="text-lg text-gray-500 font-medium mb-4">{book.author}</p>
                      </div>
                      {/* Desktop Price & Admin Actions */}
                      <div className="hidden md:block text-right">
                          <div className="flex flex-col items-end">
                            {book.originalPrice && book.originalPrice > book.price && (
                                <span className="text-gray-400 line-through text-lg font-medium">฿{book.originalPrice.toLocaleString()}</span>
                            )}
                            <div className="text-3xl font-bold text-primary">฿{book.price.toLocaleString()}</div>
                          </div>
                          
                          <div className="flex items-center gap-1 justify-end mt-2 text-yellow-500">
                              <Star size={18} fill="currentColor" />
                              <span className="text-dark font-bold text-lg">{book.rating}</span>
                              <span className="text-gray-400 text-sm font-normal">({reviews.length} reviews)</span>
                          </div>
                          
                          {isAdmin && (
                            <div className="flex justify-end gap-2 mt-4">
                               <button onClick={() => onEdit?.(book)} className="flex items-center gap-1 px-3 py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors">
                                  <Pencil size={16} /> Edit
                               </button>
                               <button onClick={() => onDelete?.(book)} className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">
                                  <Trash2 size={16} /> Delete
                               </button>
                            </div>
                          )}
                      </div>
                  </div>

                  {/* Mobile Rating & Price Row */}
                  <div className="flex items-center justify-between md:hidden mb-4 border-y border-gray-100 py-3">
                      <div className="flex items-center gap-1.5">
                          <Star size={20} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-dark font-bold text-lg">{book.rating}</span>
                          <span className="text-gray-400 text-sm">({reviews.length})</span>
                      </div>
                      <div className="flex flex-col items-end leading-none">
                        {book.originalPrice && book.originalPrice > book.price && (
                            <span className="text-gray-400 line-through text-xs mb-1">฿{book.originalPrice.toLocaleString()}</span>
                        )}
                        <div className="text-2xl font-bold text-primary">฿{book.price.toLocaleString()}</div>
                      </div>
                  </div>

                  {/* Mobile Preview Button */}
                  {book.previewPages && book.previewPages.length > 0 && (
                    <button 
                      onClick={() => setIsPreviewOpen(true)}
                      className="md:hidden w-full mb-6 flex items-center justify-center gap-2 py-3 border-2 border-primary text-primary rounded-xl font-bold active:bg-primary/5"
                    >
                      <BookOpen size={20} />
                      Read Sample Pages
                    </button>
                  )}

                  {/* Description */}
                  <div className="prose prose-gray max-w-none mb-4">
                      <h3 className="text-lg font-bold text-dark mb-2">Description</h3>
                      <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                          {book.description || "No description available for this book."}
                      </p>
                  </div>

                  {/* About the Author (Collapsible) */}
                  <div className="border-t border-gray-100 py-6 mb-4">
                      <button 
                          onClick={() => setIsAuthorBioOpen(!isAuthorBioOpen)}
                          className="flex items-center justify-between w-full group focus:outline-none"
                      >
                          <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors">About the Author</h3>
                          {isAuthorBioOpen ? (
                              <ChevronUp size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                          ) : (
                              <ChevronDown size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                          )}
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAuthorBioOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                  {book.authorBio || `We don't have a biography for ${book.author} yet.`}
                              </p>
                          </div>
                      </div>
                  </div>

                  {/* Desktop Actions */}
                  <div className="hidden md:flex gap-4 border-t border-gray-100 pt-6 mb-12">
                      <button 
                          onClick={() => onAddToCart(book)}
                          className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                      >
                          <ShoppingBag size={20} />
                          Add to Cart - ฿{book.price.toLocaleString()}
                      </button>
                      
                      {/* Desktop Secondary Preview Button */}
                      {book.previewPages && book.previewPages.length > 0 && (
                        <button 
                          onClick={() => setIsPreviewOpen(true)}
                          className="px-6 py-4 rounded-xl border-2 border-primary text-primary font-bold text-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                        >
                          <BookOpen size={20} />
                          Sample
                        </button>
                      )}

                      <button className="p-4 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 transition-colors">
                          <Heart size={24} />
                      </button>
                      <button className="p-4 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-blue-200 hover:text-blue-500 transition-colors">
                          <Share2 size={24} />
                      </button>
                  </div>

                  {/* Reviews Section */}
                  <div className="border-t border-gray-100 pt-8">
                      <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
                          Customer Reviews <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{reviews.length}</span>
                      </h2>

                      {/* Review Form */}
                      <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                          <h3 className="font-bold text-lg mb-4 text-dark">Write a Review</h3>
                          <form onSubmit={handleSubmitReview}>
                              <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-600 mb-1">Rating</label>
                                  <div className="flex gap-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                          <button
                                              key={star}
                                              type="button"
                                              onClick={() => setUserRating(star)}
                                              className="transition-transform hover:scale-110 focus:outline-none"
                                          >
                                              <Star 
                                                  size={28} 
                                                  className={`${star <= userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-colors`} 
                                              />
                                          </button>
                                      ))}
                                  </div>
                              </div>
                              
                              <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                  <input 
                                      type="text" 
                                      required
                                      value={userName}
                                      onChange={(e) => setUserName(e.target.value)}
                                      placeholder="Your name"
                                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                  />
                              </div>

                              <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-600 mb-1">Review</label>
                                  <textarea 
                                      required
                                      value={userComment}
                                      onChange={(e) => setUserComment(e.target.value)}
                                      placeholder="Share your thoughts about this book..."
                                      rows={3}
                                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                  />
                              </div>

                              <button 
                                  type="submit" 
                                  className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:bg-red-600 transition-all active:scale-95 flex items-center gap-2"
                              >
                                  <Send size={18} /> Submit Review
                              </button>
                          </form>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-6">
                          {reviews.length === 0 ? (
                              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                          ) : (
                              reviews.map((review) => (
                                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                      <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border border-white shadow-sm">
                                                  <User size={20} className="text-gray-500" />
                                              </div>
                                              <div>
                                                  <span className="font-bold text-dark block leading-none mb-1">{review.userName}</span>
                                                  {renderStars(review.rating)}
                                              </div>
                                          </div>
                                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{review.date}</span>
                                      </div>
                                      <p className="text-gray-600 text-sm leading-relaxed pl-[52px]">{review.comment}</p>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>

                  {/* Related Books Section */}
                  {relatedBooks.length > 0 && (
                    <div className="border-t border-gray-100 pt-8 mt-8 mb-8">
                      <div className="flex items-center justify-between mb-4">
                          <h2 className="text-2xl font-bold text-dark">You might also like</h2>
                      </div>
                      <div className="flex overflow-x-auto pb-6 gap-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
                          {relatedBooks.map(related => (
                              <div key={related.id} className="w-[160px] md:w-[200px] flex-shrink-0 snap-start">
                                  <BookCard 
                                      book={related}
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
                  )}
              </div>
          </div>
        </div>

        {/* Mobile Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:hidden z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3">
              <button className="p-3.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">
                  <Heart size={24} />
              </button>
              <button 
                  onClick={() => onAddToCart(book)}
                  className="flex-1 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-red-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                  Add to Cart
              </button>
          </div>
        </div>
      </div>

      {/* Preview Pages Modal */}
      {isPreviewOpen && book.previewPages && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <button 
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
          >
            <X size={28} />
          </button>
          
          <div className="w-full h-full flex items-center overflow-x-auto snap-x snap-mandatory gap-4 p-4 md:p-8 no-scrollbar">
            {/* Spacer for centering first item if needed */}
            <div className="w-2 md:w-auto shrink-0" /> 
            
            {book.previewPages.map((pageUrl, index) => (
              <div 
                key={index} 
                className="shrink-0 snap-center w-full md:w-auto h-[70vh] md:h-[85vh] aspect-[2/3] relative flex items-center justify-center bg-white rounded-lg shadow-2xl overflow-hidden"
              >
                <img 
                  src={pageUrl} 
                  alt={`Page ${index + 1}`} 
                  className="w-full h-full object-contain md:object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                   Page {index + 1}
                </div>
              </div>
            ))}

             <div className="w-2 md:w-auto shrink-0" />
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-sm pointer-events-none">
             Swipe to read pages
          </div>
        </div>
      )}
    </>
  );
};