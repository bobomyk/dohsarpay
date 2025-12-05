import React from 'react';
import { Home, ShoppingBag, User, Search, LayoutGrid, BookOpen, LogIn, LogOut, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onHomeClick: () => void;
  onOpenCategories: () => void;
  onLoginClick: () => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, onOpenCart, onHomeClick, onOpenCategories, onLoginClick, isAdmin, onLogout 
}) => {
  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              onClick={onHomeClick}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-0 rotate-3 transition-transform duration-300">
                <BookOpen size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-dark to-gray-600 group-hover:from-primary group-hover:to-orange-500 transition-all leading-none">
                  Doh Sar Pay
                </span>
                {isAdmin && (
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={10} /> Admin Mode
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search for books, authors..."
                />
              </div>
            </div>

            {/* Requested Order: 1. Categories, 2. Cart, 3. Profile/Admin */}
            <div className="flex items-center gap-4">
              <button 
                onClick={onOpenCategories}
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors flex flex-col items-center gap-1"
                title="Categories"
              >
                <LayoutGrid size={24} />
              </button>

              <button 
                onClick={onOpenCart}
                className="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                title="Cart"
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {isAdmin ? (
                 <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors font-medium text-sm"
                  title="Logout"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                  title="Admin Login"
                >
                  <User size={24} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header (Logo & Search) */}
      <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-sm flex items-center justify-between">
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-400 rounded-lg flex items-center justify-center text-white shadow-md">
            <BookOpen size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-dark to-gray-600 leading-none">
              Doh Sar Pay
            </span>
            {isAdmin && (
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={9} /> Admin
              </span>
            )}
          </div>
        </div>
        <button className="p-2 text-gray-600">
          <Search size={24} />
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={onHomeClick}
            className="flex flex-col items-center justify-center w-full h-full text-primary space-y-1"
          >
            <Home size={24} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button 
            onClick={onOpenCategories}
            className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-primary space-y-1"
          >
            <LayoutGrid size={24} />
            <span className="text-[10px] font-medium">Categories</span>
          </button>

          <button 
            onClick={onOpenCart}
            className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-primary space-y-1 relative"
          >
            <div className="relative">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </button>
          
          {isAdmin ? (
            <button 
              onClick={onLogout}
              className="flex flex-col items-center justify-center w-full h-full text-red-500 hover:text-red-600 space-y-1"
            >
              <LogOut size={24} />
              <span className="text-[10px] font-medium">Logout</span>
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-primary space-y-1"
            >
              <User size={24} />
              <span className="text-[10px] font-medium">Login</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};