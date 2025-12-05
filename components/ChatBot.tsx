import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService.ts';
import { ChatMessage } from '../types.ts';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Sawasdee krub! 🙏 I am Nong Read. Can I help you find a book or check payment options (TrueMoney, QR, COD)?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelMessageId = (Date.now() + 1).toString();
    
    // Optimistic UI update for model message placeholder
    setMessages(prev => [...prev, {
      id: modelMessageId,
      role: 'model',
      text: '',
      isStreaming: true
    }]);

    let accumulatedText = '';

    await sendMessageToGemini(userMessage.text, (chunk) => {
      accumulatedText += chunk;
      setMessages(prev => prev.map(msg => 
        msg.id === modelMessageId 
          ? { ...msg, text: accumulatedText }
          : msg
      ));
    });

    // Finish streaming
    setMessages(prev => prev.map(msg => 
      msg.id === modelMessageId 
        ? { ...msg, isStreaming: false }
        : msg
    ));
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 bg-gradient-to-r from-secondary to-teal-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle size={28} />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </button>

      {/* Chat Interface (Sheet/Modal) */}
      <div 
        className={`fixed inset-0 z-50 flex items-end md:items-end justify-end pointer-events-none ${
          isOpen ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
      >
        {/* Backdrop (Mobile only) */}
        <div 
          className={`absolute inset-0 bg-black/40 md:hidden pointer-events-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />

        {/* Chat Window */}
        <div 
          className={`
            pointer-events-auto bg-white w-full md:w-96 h-[85vh] md:h-[600px] md:mr-8 md:mb-8 md:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-20 md:opacity-0'}
          `}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary to-teal-600 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none">Nong Read</h3>
                <span className="text-xs text-teal-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/> 
                  AI Assistant
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white text-dark border border-gray-100 rounded-bl-none'
                    }
                  `}
                >
                  {msg.text ? (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  ) : (
                    <div className="flex gap-1 items-center h-5 px-2">
                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                  {msg.role === 'model' && !msg.isStreaming && (
                    <div className="mt-1 flex justify-end">
                        <Sparkles size={10} className="text-secondary opacity-50" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex gap-2 items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about books..."
                className="flex-1 bg-transparent outline-none text-sm text-dark placeholder-gray-400"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-full transition-all ${
                  input.trim() && !isLoading ? 'bg-secondary text-white hover:scale-110' : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center mt-2">
               <p className="text-[10px] text-gray-400">Powered by Google Gemini</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};