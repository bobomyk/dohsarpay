import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BookCard, BookCardSkeleton } from './components/BookCard';
import { CartDrawer } from './components/CartDrawer';
import { CategoryDrawer } from './components/CategoryDrawer';
import { ChatBot } from './components/ChatBot';
import { BookDetails } from './components/BookDetails';
import { LoginModal } from './components/LoginModal';
import { AdminBookForm } from './components/AdminBookForm';
import { Book, CartItem } from './types';
import { Plus } from 'lucide-react';

// Mock Data (Initial State)
const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: "The Art of Thai Cooking",
    author: "Somsri Chef",
    price: 450,
    category: "Health & Cooking",
    rating: 4.8,
    coverUrl: "https://picsum.photos/300/450?random=10",
    description: "Authentic recipes from the heart of Thailand. Learn to balance the four fundamental tastes: sweet, sour, salty, and spicy. Includes 50 classic recipes and stories from local street food vendors.",
    authorBio: "Somsri Chef grew up in the bustling markets of Chiang Mai, learning the secrets of Thai cuisine from her grandmother. With over 20 years of experience running one of Bangkok's most beloved street food stalls, she is passionate about preserving traditional flavors.",
    previewPages: [
      "https://placehold.co/400x600/FFF/000?text=Page+1:+Introduction",
      "https://placehold.co/400x600/FFF/000?text=Page+2:+Ingredients",
      "https://placehold.co/400x600/FFF/000?text=Page+3:+Tom+Yum+Recipe"
    ]
  },
  {
    id: 2,
    title: "Bangkok Noir",
    author: "Various Authors",
    price: 320,
    category: "Novels & Fiction",
    rating: 4.5,
    coverUrl: "https://picsum.photos/300/450?random=11",
    description: "Dark stories from the city of angels. An anthology of 12 short stories set in Bangkok, exploring the darker side of this vibrant metropolis.",
    authorBio: "A curated collective of Thailand's finest crime and mystery writers, alongside international authors who have called Bangkok their home. This anthology represents the gritty, neon-lit underbelly of the City of Angels.",
    previewPages: [
      "https://placehold.co/400x600/333/FFF?text=Chapter+1:+Night+in+Sukhumvit",
      "https://placehold.co/400x600/333/FFF?text=Chapter+1:+Continued",
      "https://placehold.co/400x600/333/FFF?text=Illustration"
    ]
  },
  {
    id: 3,
    title: "Start With Why",
    author: "Simon Sinek",
    price: 395,
    category: "Business & Management",
    rating: 4.9,
    coverUrl: "https://picsum.photos/300/450?random=12",
    description: "How great leaders inspire everyone to take action. Sinek argues that people don't buy what you do, they buy why you do it.",
    authorBio: "Simon Sinek is an unwavering optimist. He teaches leaders and organizations how to inspire people. From members of Congress to foreign ambassadors, from small business owners to corporations like Microsoft and 3M, he has presented his ideas to people who have the power to change the world.",
    previewPages: [
      "https://placehold.co/400x600/FFF/000?text=Preface:+The+Golden+Circle",
      "https://placehold.co/400x600/FFF/000?text=Chapter+1:+Assume+You+Know",
      "https://placehold.co/400x600/FFF/000?text=Diagram:+Why+How+What"
    ]
  },
  {
    id: 4,
    title: "Jujutsu Kaisen Vol. 20",
    author: "Gege Akutami",
    price: 125,
    category: "Comics & Manga",
    rating: 5.0,
    coverUrl: "https://picsum.photos/300/450?random=13",
    description: "The latest volume of the hit supernatural action manga. Yuji Itadori and his friends continue their battle against the curses in the Culling Game.",
    authorBio: "Gege Akutami is a Japanese manga artist, best known for creating Jujutsu Kaisen. Known for their unique art style and complex power systems, Akutami has become one of the most influential figures in modern shonen manga.",
    previewPages: [
      "https://placehold.co/400x600/FFF/000?text=Manga+Panel+1",
      "https://placehold.co/400x600/FFF/000?text=Manga+Panel+2",
      "https://placehold.co/400x600/FFF/000?text=Manga+Panel+3"
    ]
  },
  {
    id: 5,
    title: "Atomic Habits",
    author: "James Clear",
    price: 420,
    category: "Self-Improvement",
    rating: 4.9,
    coverUrl: "https://picsum.photos/300/450?random=14",
    description: "Tiny Changes, Remarkable Results. An easy and proven way to build good habits and break bad ones.",
    authorBio: "James Clear is a writer and speaker focused on habits, decision-making, and continuous improvement. His work has appeared in The New York Times, Entrepreneur, Time, and on CBS This Morning.",
    previewPages: [
      "https://placehold.co/400x600/FFF/000?text=Introduction",
      "https://placehold.co/400x600/FFF/000?text=The+Fundamentals",
      "https://placehold.co/400x600/FFF/000?text=Chart:+1%25+Better"
    ]
  },
  {
    id: 6,
    title: "Thai For Beginners",
    author: "Benjawan Poomsan",
    price: 550,
    category: "Education & Language",
    rating: 4.6,
    coverUrl: "https://picsum.photos/300/450?random=15",
    description: "The best way to start learning Thai. Covers basic grammar, vocabulary, and conversation skills for travelers and expats.",
    authorBio: "Benjawan Poomsan Becker is a leading author of Thai language learning materials for English speakers. Born in Bangkok and raised in Yasothon, she has dedicated her career to making the Thai language accessible to the world."
  },
   {
    id: 7,
    title: "Design Systems",
    author: "Alla Kholmatova",
    price: 850,
    category: "Art & Design",
    rating: 4.7,
    coverUrl: "https://picsum.photos/300/450?random=16",
    description: "A practical guide to creating design languages for digital products. Learn how to build and maintain effective design systems.",
    authorBio: "Alla Kholmatova is a UX researcher and designer who has spent years studying what makes design systems effective. She has helped numerous companies streamline their design processes and improve collaboration between designers and developers."
  },
  {
    id: 8,
    title: "One Piece Vol. 105",
    author: "Eiichiro Oda",
    price: 115,
    category: "Comics & Manga",
    rating: 5.0,
    coverUrl: "https://picsum.photos/300/450?random=17",
    description: "Join Luffy on his journey to become King of the Pirates. The Straw Hat crew continues their adventure in the New World.",
    authorBio: "Eiichiro Oda is a legendary Japanese manga artist and the creator of One Piece. With over 500 million copies sold worldwide, he holds the Guinness World Record for the most copies published for the same comic book series by a single author."
  }
];

function App() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  
  // Navigation State
  const [view, setView] = useState<'home' | 'details'>('home');
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Categories based on Pann Satt Lann style bookstore
  const categories = [
    "All",
    "Novels & Fiction",
    "Translation",
    "Business & Management",
    "Psychology",
    "Self-Improvement",
    "Philosophy",
    "Religion & Dhamma",
    "History & Politics",
    "Biographies",
    "General Knowledge",
    "Children",
    "Comics & Manga",
    "Education & Language",
    "Health & Cooking",
    "Poem",
    "Magazines",
    "Art & Design"
  ];

  // Custom Hash Router Implementation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#book/')) {
        const id = parseInt(hash.replace('#book/', ''), 10);
        if (!isNaN(id)) {
          setSelectedBookId(id);
          setView('details');
          return;
        }
      }
      // Default to home if hash doesn't match a book
      setView('home');
      setSelectedBookId(null);
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash on load
    handleHashChange();

    // Simulate loading only on initial mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearTimeout(timer);
    };
  }, []);

  const addToCart = (book: Book) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item => 
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Admin Functions
  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleDeleteBook = (book: Book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      setBooks(prev => prev.filter(b => b.id !== book.id));
      if (view === 'details' && selectedBookId === book.id) {
        window.location.hash = ''; // Go home if deleted active book
      }
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsAdminFormOpen(true);
  };

  const handleCreateBook = () => {
    setEditingBook(null);
    setIsAdminFormOpen(true);
  };

  const handleSubmitBook = (bookData: Book | Omit<Book, 'id'>) => {
    if ('id' in bookData && bookData.id) {
      // Update existing
      setBooks(prev => prev.map(b => b.id === bookData.id ? bookData as Book : b));
    } else {
      // Create new
      const newBook: Book = {
        ...(bookData as Omit<Book, 'id'>),
        id: Math.max(...books.map(b => b.id), 0) + 1
      };
      setBooks(prev => [newBook, ...prev]);
    }
  };

  // Navigation Handlers
  const handleBookClick = (book: Book) => {
    window.location.hash = `book/${book.id}`;
  };

  const handleBackToHome = () => {
    // Determine if we should go back in history or just reset hash
    if (window.history.length > 2) {
      window.history.back();
    } else {
      window.location.hash = '';
    }
  };

  const filteredBooks = selectedCategory === "All" 
    ? books 
    : books.filter(b => b.category === selectedCategory);

  // Find the selected book object from state
  const selectedBook = selectedBookId ? books.find(b => b.id === selectedBookId) : null;

  return (
    <div className="min-h-screen pb-20 md:pb-0 font-sans">
      <Navbar 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCategories={() => setIsCategoryOpen(true)}
        onHomeClick={() => window.location.hash = ''}
        onLoginClick={() => setIsLoginModalOpen(true)}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <main className="">
        {view === 'home' && (
          <div className="animate-in fade-in duration-300">
            <Hero 
              books={books.slice(0, 6)} // Pass dynamic books
              onAddToCart={addToCart}
              onBookClick={handleBookClick}
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 mb-10">
              
              <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-dark">
                        {selectedCategory === "All" ? "Recommended For You" : selectedCategory}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {selectedCategory === "All" ? "Best selling books of the month" : `Browse our ${selectedCategory} collection`}
                    </p>
                </div>
                {selectedCategory !== "All" && (
                    <button 
                        onClick={() => setSelectedCategory("All")}
                        className="text-primary font-bold text-sm hover:underline"
                    >
                        View All
                    </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {isLoading 
                  ? Array.from({ length: 8 }).map((_, idx) => (
                      <BookCardSkeleton key={idx} />
                    ))
                  : filteredBooks.length > 0 ? (
                      filteredBooks.map(book => (
                        <BookCard 
                          key={book.id} 
                          book={book} 
                          onAddToCart={addToCart}
                          onBookClick={handleBookClick}
                          isAdmin={isAdmin}
                          onEdit={handleEditBook}
                          onDelete={handleDeleteBook}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center text-gray-400">
                        <p className="text-lg">No books found in this category.</p>
                        <button 
                            onClick={() => setSelectedCategory("All")}
                            className="mt-4 text-primary font-bold hover:underline"
                        >
                            Browse all books
                        </button>
                      </div>
                    )
                }
              </div>
            </div>
          </div>
        )}

        {view === 'details' && selectedBook && (
          <BookDetails 
            book={selectedBook} 
            allBooks={books}
            onBack={handleBackToHome}
            onAddToCart={addToCart}
            onBookClick={handleBookClick}
            isAdmin={isAdmin}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
          />
        )}
      </main>

      {/* Admin Floating Add Button (Mobile/Desktop) */}
      {isAdmin && view === 'home' && (
        <button
          onClick={handleCreateBook}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 z-40 bg-dark text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 font-bold"
        >
          <Plus size={24} />
          Add Book
        </button>
      )}

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
      />

      <CategoryDrawer 
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <AdminBookForm 
        isOpen={isAdminFormOpen}
        onClose={() => setIsAdminFormOpen(false)}
        onSubmit={handleSubmitBook}
        initialData={editingBook}
        categories={categories}
      />

      {/* Hide ChatBot on mobile details page to prevent clutter, show otherwise */}
      <div className={view === 'details' ? 'hidden md:block' : 'block'}>
        <ChatBot />
      </div>
    </div>
  );
}

export default App;