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
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-3 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} GENJOY CELULARES & ACESSÓRIOS.</p>
          <p className="text-slate-400">
            Contato e Pedidos: <a href="https://wa.me/556499731390" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 font-semibold underline">Fale Conosco no WhatsApp</a> | <a href="https://www.instagram.com/genjoybr?igsh=MXRncmUwbjlzemt3NA==" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 font-semibold underline">Siga nosso Instagram @genjoybr</a>
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
        className="fixed right-6 bottom-6 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 z-40 hover:shadow-xl"
        title="Fale Conosco no WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
