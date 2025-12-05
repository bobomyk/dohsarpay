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
import { Book, CartItem, User } from './types';
import { Plus } from 'lucide-react';

// Mock Data (Initial State) - Burmese Books with Curated Covers
const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: "Linga Dipa Chit Thu",
    author: "Chit Oo Nyo",
    price: 4500,
    category: "Novels & Fiction",
    rating: 4.9,
    coverUrl: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=300&h=450",
    description: "A legendary historical novel retelling the Ramayana from the perspective of Ravana (Dasagiri). It explores deep emotions, love, and the complexity of the villain's heart.",
    authorBio: "Chit Oo Nyo is a celebrated Burmese writer known for his historical fiction. He brings ancient characters to life with modern psychological depth.",
    previewPages: [
      "https://placehold.co/400x600/FFF/000?text=Chapter+1:+Dasagiri's+Heart",
      "https://placehold.co/400x600/FFF/000?text=Chapter+2:+The+Lanka+Kingdom",
      "https://placehold.co/400x600/FFF/000?text=Chapter+3:+Sita"
    ]
  },
  {
    id: 2,
    title: "Mone Ywe Ma Hu (Not Out of Hate)",
    author: "Journal Kyaw Ma Ma Lay",
    price: 3500,
    category: "Novels & Fiction",
    rating: 4.8,
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300&h=450",
    description: "A classic Burmese novel depicting the cultural clash between traditional Burmese values and Western influence during the colonial era through a heartbreaking marriage.",
    authorBio: "Journal Kyaw Ma Ma Lay was one of the greatest Burmese female writers of the 20th century. Her works often focus on the struggles of women and Burmese culture.",
    previewPages: [
      "https://placehold.co/400x600/FFF/000?text=Introduction",
      "https://placehold.co/400x600/FFF/000?text=Chapter+1:+The+Merchant",
      "https://placehold.co/400x600/FFF/000?text=Chapter+2:+Way+Way"
    ]
  },
  {
    id: 3,
    title: "The Glass Palace",
    author: "Amitav Ghosh",
    price: 12000,
    category: "History & Politics",
    rating: 4.7,
    coverUrl: "https://images.unsplash.com/photo-1599579085896-12683930b2c1?auto=format&fit=crop&q=80&w=300&h=450",
    description: "An epic saga spanning a century, from the fall of the Konbaung Dynasty in Mandalay to modern times, weaving together the history of Burma, India, and Malaya.",
    authorBio: "Amitav Ghosh is an internationally acclaimed author. The Glass Palace is widely regarded as a masterpiece of historical fiction centered on Myanmar.",
    previewPages: [
      "https://placehold.co/400x600/FFF/000?text=Prologue:+Mandalay",
      "https://placehold.co/400x600/FFF/000?text=Chapter+1:+Rajkumar",
      "https://placehold.co/400x600/FFF/000?text=Map+of+Burma"
    ]
  },
  {
    id: 4,
    title: "Burmese Traditional Snacks",
    author: "Daw Yi Yi",
    price: 2500,
    category: "Health & Cooking",
    rating: 4.5,
    coverUrl: "https://images.unsplash.com/photo-1601342630318-7c631a31dc52?auto=format&fit=crop&q=80&w=300&h=450",
    description: "Learn to make classic Myanmar snacks like Mohinga, Lahpet Thoke, and Shwe Yin Aye. A complete guide to the tastes of the Golden Land.",
    authorBio: "Daw Yi Yi has dedicated her life to documenting grandmothers' recipes from across the Ayeyarwady region.",
    previewPages: [
      "https://placehold.co/400x600/FFF/000?text=Recipe:+Mohinga",
      "https://placehold.co/400x600/FFF/000?text=Recipe:+Coconut+Noodles",
      "https://placehold.co/400x600/FFF/000?text=Ingredients+Guide"
    ]
  },
  {
    id: 5,
    title: "Dhammapada Verses",
    author: "Ashin Janakabhivamsa",
    price: 1500,
    category: "Religion & Dhamma",
    rating: 5.0,
    coverUrl: "https://images.unsplash.com/photo-1621845199651-7f4c519543e9?auto=format&fit=crop&q=80&w=300&h=450",
    description: "A collection of sayings of the Buddha in verse form and one of the most widely read and best known Buddhist scriptures.",
    authorBio: "Ashin Janakabhivamsa was a renowned Burmese Buddhist monk and writer who helped spread the teachings of Theravada Buddhism.",
    previewPages: [
      "https://placehold.co/400x600/FFF/000?text=Verse+1",
      "https://placehold.co/400x600/FFF/000?text=Verse+2",
      "https://placehold.co/400x600/FFF/000?text=Explanation"
    ]
  },
  {
    id: 6,
    title: "Myanmar Folktales",
    author: "Maung Htin Aung",
    price: 3000,
    category: "Children",
    rating: 4.6,
    coverUrl: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=300&h=450",
    description: "A delightful collection of traditional folktales from the villages of Myanmar. Perfect for children and adults who love storytelling.",
    authorBio: "Maung Htin Aung was a scholar and writer who preserved many oral traditions of Myanmar through his English translations.",
  },
   {
    id: 7,
    title: "From The Land of Green Ghosts",
    author: "Pascal Khoo Thwe",
    price: 8500,
    category: "Biographies",
    rating: 4.8,
    coverUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=300&h=450",
    description: "A memoir of coming of age in Burma. A powerful story of a young Padaung man's journey from a remote village to Cambridge University.",
    authorBio: "Pascal Khoo Thwe is a Burmese author from the Padaung tribe. His memoir has won international acclaim for its lyrical prose and historical insight."
  },
  {
    id: 8,
    title: "Pyi Min Thar",
    author: "Min Theinkha",
    price: 2800,
    category: "Novels & Fiction",
    rating: 4.7,
    coverUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=300&h=450",
    description: "A famous mystery and astrology novel by Min Theinkha. Join the protagonist in a world of mystical Burmese arts and suspense.",
    authorBio: "Min Theinkha was a prolific writer and astrologer, famous for his detective novels and books on Burmese astrology."
  },
  {
    id: 9,
    title: "Architecture of Bagan",
    author: "History Dept",
    price: 15000,
    category: "Art & Design",
    rating: 4.9,
    coverUrl: "https://images.unsplash.com/photo-1552554622-6b39df280c44?auto=format&fit=crop&q=80&w=300&h=450",
    description: "A visual journey through the thousands of temples in Bagan. Includes architectural diagrams, history, and photography.",
    authorBio: "Compiled by leading historians and architects specializing in Southeast Asian archeology."
  },
  {
    id: 10,
    title: "General Knowledge 2024",
    author: "Mg Mg",
    price: 2000,
    category: "General Knowledge",
    rating: 4.2,
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=300&h=450",
    description: "Essential general knowledge for students and exam preparation in Myanmar. Covers geography, history, and current events.",
    authorBio: "Mg Mg is a dedicated educator creating accessible learning materials for Myanmar students."
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    email: 'admin@dohsarpay.com'
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

  // User & Auth State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Derived Admin State
  const isAdmin = currentUser?.role === 'admin';

  // Admin Book Form State
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

  // Auth Functions
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
  };

  const handleSignup = (user: User) => {
    setUsers(prev => [...prev, user]);
    setCurrentUser(user);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Admin Functions
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
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="">
        {view === 'home' && (
          <div className="animate-in fade-in duration-300">
            <Hero 
              books={books.slice(0, 10)} // Show up to 10 books in the trending slider
              onAddToCart={addToCart}
              onBookClick={handleBookClick}
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 md:mt-6 mb-10">
              
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

      {/* Admin Floating Add Button (Mobile/Desktop) - Only show for Admin role */}
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
        onSignup={handleSignup}
        users={users}
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