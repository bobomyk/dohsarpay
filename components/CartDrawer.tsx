import React, { useState } from 'react';
import { X, Trash2, CreditCard, Smartphone, Banknote, QrCode, CheckCircle2 } from 'lucide-react';
import { CartItem, PaymentMethod } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, onClose, items, onRemoveItem, onUpdateQuantity, onClearCart
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PaymentMethod.PROMPTPAY);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setStep('checkout');
  };

  const handlePlaceOrder = () => {
    // Simulate API call
    setTimeout(() => {
      setStep('success');
      onClearCart();
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    // Reset state after transition
    setTimeout(() => {
        setStep('cart');
        setSelectedPayment(PaymentMethod.PROMPTPAY);
    }, 300);
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    switch(method) {
        case PaymentMethod.PROMPTPAY: return <QrCode size={20} className="text-blue-600" />;
        case PaymentMethod.TRUEMONEY: return <Smartphone size={20} className="text-orange-500" />;
        case PaymentMethod.COD: return <Banknote size={20} className="text-green-600" />;
        default: return <CreditCard size={20} className="text-purple-600" />;
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
            
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-dark">
                {step === 'cart' ? 'Shopping Cart' : step === 'checkout' ? 'Checkout' : 'Order Complete'}
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <X size={24} />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {step === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <Trash2 size={40} className="opacity-20" />
                    </div>
                    <p className="text-lg">Your cart is empty</p>
                    <button onClick={handleClose} className="text-primary font-medium hover:underline">Start Shopping</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 border border-gray-100">
                        <img src={item.coverUrl} alt={item.title} className="w-20 h-28 object-cover rounded-md bg-gray-200" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-dark line-clamp-1">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.author}</p>
                            <p className="text-primary font-bold mt-1">฿{item.price.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                             <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                                <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold hover:text-dark">-</button>
                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold hover:text-dark">+</button>
                             </div>
                             <button onClick={() => onRemoveItem(item.id)} className="text-red-400 hover:text-red-500">
                                <Trash2 size={18} />
                             </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {step === 'checkout' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Payment Method</h3>
                    <div className="space-y-3">
                        {Object.values(PaymentMethod).map((method) => (
                            <label key={method} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedPayment === method ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value={method} 
                                    checked={selectedPayment === method}
                                    onChange={() => setSelectedPayment(method)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${selectedPayment === method ? 'border-primary' : 'border-gray-300'}`}>
                                    {selectedPayment === method && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                    {getPaymentIcon(method)}
                                    <span className="font-medium text-dark">{method}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Shipping Address</h3>
                    <div className="space-y-3">
                        <input type="text" placeholder="Full Name" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary text-sm" />
                        <textarea placeholder="Address (Street, City, Zip)" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary text-sm h-24 resize-none" />
                    </div>
                </div>
              </div>
            )}

            {step === 'success' && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-dark">Thank you!</h3>
                    <p className="text-gray-500 max-w-xs">Your order has been placed successfully. You will receive a confirmation email shortly.</p>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full max-w-xs mt-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Order ID</span>
                            <span className="font-mono font-bold">#SR-{Math.floor(Math.random() * 10000)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Amount</span>
                            <span className="font-bold text-primary">฿{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && step !== 'success' && (
             <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Total</span>
                    <span className="text-2xl font-bold text-dark">฿{total.toLocaleString()}</span>
                </div>
                {step === 'cart' ? (
                    <button 
                        onClick={handleCheckout}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-200 active:scale-[0.98] transform duration-150"
                    >
                        Checkout
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setStep('cart')}
                            className="flex-1 py-4 bg-gray-100 text-dark rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            Back
                        </button>
                        <button 
                            onClick={handlePlaceOrder}
                            className="flex-[2] py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-200 active:scale-[0.98] transform duration-150"
                        >
                            Place Order
                        </button>
                    </div>
                )}
             </div>
          )}
          {step === 'success' && (
              <div className="p-6 bg-white border-t border-gray-100">
                  <button 
                    onClick={handleClose}
                    className="w-full py-4 bg-dark text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors"
                >
                    Continue Shopping
                </button>
              </div>
          )}
        </div>
      </div>
    </>
  );
};