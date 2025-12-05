import React, { useState } from 'react';
import { X, Lock, User, Mail, ArrowRight, LogIn } from 'lucide-react';
import { User as UserType } from '../types.ts';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  onSignup: (user: UserType) => void;
  users: UserType[];
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onSignup, users }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setName('');
    setEmail('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin(user);
        handleClose();
      } else {
        setError('Invalid username or password');
      }
    } else {
      // Signup Logic
      if (users.some(u => u.username === username)) {
        setError('Username already exists');
        return;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      const newUser: UserType = {
        id: Date.now().toString(),
        username,
        password,
        name: name || username,
        email,
        role: 'user' // Default role for new signups
      };

      onSignup(newUser);
      handleClose();
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-300 overflow-hidden">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-dark z-10"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            {mode === 'login' ? <Lock size={32} /> : <User size={32} />}
          </div>
          <h2 className="text-2xl font-bold text-dark">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm">
            {mode === 'login' 
              ? 'Enter your credentials to access your account' 
              : 'Join Doh Sar Pay to start your reading journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <>
              <div className="space-y-1 animate-in slide-in-from-left-4 fade-in duration-300">
                <label className="text-sm font-medium text-gray-700">Display Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="John Doe"
                    required={mode === 'signup'}
                  />
                </div>
              </div>

              <div className="space-y-1 animate-in slide-in-from-left-4 fade-in duration-300 delay-75">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="john@example.com"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Username"
                required
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
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-dark text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
          >
            {mode === 'login' ? <LogIn size={18} /> : <ArrowRight size={18} />}
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={toggleMode}
              className="ml-1 text-primary font-bold hover:underline focus:outline-none"
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
        
        {/* Helper text for demo purposes */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          <p>Admin Access: admin / admin123</p>
        </div>
      </div>
    </div>
  );
};