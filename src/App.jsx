import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import Admin from './pages/Admin';
import ProductFormModal from './pages/ProductFormModal';
import Login from './pages/Login';
import API from './api/api';
import './App.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('catalog');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Search and Category filters (lifted state)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Custom Notifications/Toasts state
  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState([]);

  // Load token/user from local storage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('genjoy_user');
    const storedToken = localStorage.getItem('genjoy_token');
    if (storedUser && storedToken) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('genjoy_user');
        localStorage.removeItem('genjoy_token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('genjoy_token');
    localStorage.removeItem('genjoy_user');
    setCurrentUser(null);
    setCurrentTab('catalog');
    addNotification('Desconectado com sucesso!', 'success');
  };

  // Add toast notification helper
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos no App:', error);
      addNotification('Erro ao carregar os dados do servidor.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories from backend database
  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      if (Array.isArray(response.data)) {
        setCategories(response.data.map((c) => c.name));
      }
    } catch (error) {
      console.error('Erro ao carregar categorias no App:', error);
    }
  };

  // Load products on start and when switching tabs to synchronize
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentTab]);

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };



  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] text-[#1F2937] selection:bg-black selection:text-white">
      {/* Navigation */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Pages Container */}
      <main className="flex-grow pb-16">
        {currentTab === 'catalog' ? (
          <Catalog 
            products={products}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
        ) : !currentUser ? (
          <Login onAuthSuccess={setCurrentUser} addNotification={addNotification} />
        ) : (
          <Admin
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            products={products}
            loading={loading}
            fetchProducts={fetchProducts}
            addNotification={addNotification}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="container mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} GENJOY CELULARES & ACESSÓRIOS. Desenvolvido com Node.js, Express, React e Tailwind CSS.</p>
          <p className="text-[10px] text-slate-400">
            Contato e Pedidos: <a href="https://wa.me/556499731390" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 font-semibold underline">WhatsApp</a> | <a href="https://www.instagram.com/genjoybr?igsh=MXRncmUwbjlzemt3NA==" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 font-semibold underline">Instagram @genjoybr</a>
          </p>
        </div>
      </footer>

      {/* Product Create/Edit Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        productToEdit={productToEdit}
        onSaveSuccess={fetchProducts}
        addNotification={addNotification}
      />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/556499731390"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 bottom-6 w-14 h-14 bg-[#202020] hover:bg-black text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 z-40 border border-slate-700/30"
        title="Fale Conosco no WhatsApp"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.884-6.948C16.59 1.993 14.137.973 11.52.973c-5.437 0-9.862 4.371-9.866 9.8.001 2.012.528 3.976 1.529 5.701L2.17 20.25l4.477-1.096zM18.06 14.93c-.33-.165-1.937-.957-2.235-1.066-.298-.108-.515-.162-.73.163-.215.325-.83.163-1.018-.163-.188-.329-.374-.637-.56-.967-.188-.33-.037-.506.126-.671.148-.15.33-.325.495-.49.165-.163.22-.271.33-.453.11-.183.055-.343-.028-.507-.082-.165-.73-1.761-1-2.414-.263-.637-.531-.55-.73-.56h-.627c-.215 0-.565.081-.861.408-.296.325-1.13 1.101-1.13 2.685 0 1.586 1.147 3.117 1.308 3.333.16.217 2.258 3.447 5.47 4.832.763.329 1.358.525 1.821.672.766.244 1.464.21 2.017.127.616-.092 1.937-.792 2.21-1.558.271-.767.271-1.425.19-1.557-.08-.135-.297-.217-.627-.38z" />
        </svg>
      </a>

      {/* Premium Toast Notifications Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`glass p-4 rounded-xl shadow-lg border flex items-start gap-3 transition-all duration-300 transform translate-y-0 animate-slide-in ${
              n.type === 'success'
                ? 'border-emerald-200 text-emerald-800 bg-emerald-50'
                : 'border-rose-200 text-rose-800 bg-rose-50'
            }`}
          >
            {n.type === 'success' ? (
              <svg className="w-5 h-5 mt-0.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 mt-0.5 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
            <div className="flex-1 text-sm font-medium">{n.message}</div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
              className="text-slate-400 hover:text-slate-600 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
