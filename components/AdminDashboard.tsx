import React, { useState } from 'react';
import { 
  X, LayoutDashboard, ShoppingBag, Users, BookOpen, 
  TrendingUp, DollarSign, Calendar, Search, MoreHorizontal,
  Pencil, Trash2, ArrowUpRight, ArrowDownRight, MapPin
} from 'lucide-react';
import { Book, User, Order } from '../types.ts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  users: User[];
  orders: Order[];
  onEditBook: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
  onCreateBook: () => void;
}

type Tab = 'overview' | 'orders' | 'inventory' | 'users';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  isOpen, onClose, books, users, orders, onEditBook, onDeleteBook, onCreateBook
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalBooks = books.length;

  // Filter Logic
  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.username.includes(searchTerm));
  const filteredOrders = orders.filter(o => o.id.includes(searchTerm) || o.userName.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderSidebarItem = (id: Tab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        activeTab === id 
          ? 'bg-primary text-white shadow-lg shadow-primary/30' 
          : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-gray-100 flex overflow-hidden animate-in fade-in duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full hidden md:flex">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-dark flex items-center gap-2">
            <LayoutDashboard className="text-primary" />
            Admin Panel
          </h2>
        </div>
        <div className="flex-1 p-4 space-y-2">
          {renderSidebarItem('overview', <TrendingUp size={20} />, 'Dashboard')}
          {renderSidebarItem('orders', <DollarSign size={20} />, 'Sales & Orders')}
          {renderSidebarItem('inventory', <BookOpen size={20} />, 'Books Inventory')}
          {renderSidebarItem('users', <Users size={20} />, 'User Management')}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 font-bold transition-colors"
          >
            <X size={18} /> Exit Dashboard
          </button>
        </div>
      </div>

      {/* Mobile Header (Only visible on small screens) */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden z-10">
         <span className="font-bold text-lg">Admin Panel</span>
         <button onClick={onClose}><X size={24} /></button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden mt-16 md:mt-0">
        
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-dark capitalize hidden md:block">{activeTab}</h1>
            
            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden gap-2 overflow-x-auto pb-2 w-full">
                <button onClick={() => setActiveTab('overview')} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === 'overview' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Overview</button>
                <button onClick={() => setActiveTab('orders')} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === 'orders' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Orders</button>
                <button onClick={() => setActiveTab('inventory')} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === 'inventory' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Books</button>
            </div>

            <div className="hidden md:flex relative w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search data..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
            </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <DollarSign size={24} />
                                </div>
                                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    <ArrowUpRight size={12} className="mr-1" /> +12%
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-dark">฿{totalRevenue.toLocaleString()}</h3>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <ShoppingBag size={24} />
                                </div>
                                <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    <ArrowUpRight size={12} className="mr-1" /> +5%
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                            <h3 className="text-2xl font-bold text-dark">{totalOrders}</h3>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                    <Users size={24} />
                                </div>
                                <span className="flex items-center text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                    <ArrowUpRight size={12} className="mr-1" /> +2%
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Active Users</p>
                            <h3 className="text-2xl font-bold text-dark">{totalUsers}</h3>
                        </div>

                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                    <BookOpen size={24} />
                                </div>
                                <span className="flex items-center text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                    <ArrowDownRight size={12} className="mr-1" /> Low Stock
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Total Books</p>
                            <h3 className="text-2xl font-bold text-dark">{totalBooks}</h3>
                        </div>
                    </div>

                    {/* Recent Orders Preview */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-dark">Recent Transactions</h3>
                            <button onClick={() => setActiveTab('orders')} className="text-primary text-sm font-bold hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Order ID</th>
                                        <th className="px-6 py-4 font-bold">Customer</th>
                                        <th className="px-6 py-4 font-bold">Amount</th>
                                        <th className="px-6 py-4 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.slice(0, 5).map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-dark">#{order.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.userName}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-dark">฿{order.total.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    order.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-red-100 text-red-600'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Date</th>
                                    <th className="px-6 py-4 font-bold">Order ID</th>
                                    <th className="px-6 py-4 font-bold">Customer</th>
                                    <th className="px-6 py-4 font-bold">Shipping Address</th>
                                    <th className="px-6 py-4 font-bold">Total</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{order.date}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-dark">#{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                          <div>{order.userName}</div>
                                          {order.shippingName && order.shippingName !== order.userName && (
                                            <div className="text-xs text-gray-400">Ship to: {order.shippingName}</div>
                                          )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={order.shippingAddress}>
                                            {order.shippingAddress ? (
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                                    <span className="truncate">{order.shippingAddress}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 italic">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-dark">฿{order.total.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                                order.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredOrders.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No orders found matching your search.</div>
                        )}
                    </div>
                </div>
            )}

            {/* INVENTORY TAB */}
            {activeTab === 'inventory' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button 
                            onClick={onCreateBook}
                            className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-lg shadow-primary/30"
                        >
                            + Add New Book
                        </button>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Book</th>
                                        <th className="px-6 py-4 font-bold">Category</th>
                                        <th className="px-6 py-4 font-bold">Price</th>
                                        <th className="px-6 py-4 font-bold">Rating</th>
                                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredBooks.map(book => (
                                        <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={book.coverUrl} alt={book.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                                                    <div>
                                                        <div className="font-bold text-dark line-clamp-1">{book.title}</div>
                                                        <div className="text-xs text-gray-500">{book.author}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">{book.category}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-dark">
                                                ฿{book.price.toLocaleString()}
                                                {book.originalPrice && book.originalPrice > book.price && (
                                                    <span className="ml-2 text-xs text-red-400 line-through">฿{book.originalPrice.toLocaleString()}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">★ {book.rating}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => onEditBook(book)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button onClick={() => onDeleteBook(book)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-bold">User</th>
                                    <th className="px-6 py-4 font-bold">Username</th>
                                    <th className="px-6 py-4 font-bold">Email</th>
                                    <th className="px-6 py-4 font-bold">Role</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center font-bold text-xs">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="font-bold text-dark text-sm">{user.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">@{user.username}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-dark">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};