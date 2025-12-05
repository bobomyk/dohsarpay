export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  coverUrl: string;
  category: string;
  rating: number;
  description: string;
  authorBio?: string;
  previewPages?: string[];
}

export interface CartItem extends Book {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  PROMPTPAY = 'PromptPay (Thai QR)',
  TRUEMONEY = 'TrueMoney Wallet',
  COD = 'Cash on Delivery'
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}