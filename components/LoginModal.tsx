import React, { useState } from 'react';
import { X, Lock, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (success: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded check for demonstration
    if (username === 'admin' && password === 'admin123') {
      onLogin(true);
      setError('');
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError('Invalid credentials (Try: admin / admin123)');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-dark"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-dark">Admin Login</h2>
          <p className="text-gray-500 text-sm">Enter your credentials to manage books</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="admin"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-dark text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};