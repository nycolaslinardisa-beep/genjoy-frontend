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

  // Carrinho de Compras State
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('genjoy_cart');
    if (storedCart) {
      try {
        return JSON.parse(storedCart);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('genjoy_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        addNotification(`Mais um ${product.name} adicionado ao carrinho!`, 'success');
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      addNotification(`${product.name} adicionado ao carrinho!`, 'success');
      
      const hasPromo = product.promo_price !== null && product.promo_price !== undefined;
      const activePrice = hasPromo ? parseFloat(product.promo_price) : parseFloat(product.original_price);
      
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: activePrice,
          originalPrice: parseFloat(product.original_price),
          hasPromo,
          quantity: 1,
          image: product.image_url,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === productId);
      if (item) {
        addNotification(`${item.name} removido do carrinho!`, 'error');
      }
      return prevCart.filter((i) => i.id !== productId);
    });
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

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
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        addNotification={addNotification}
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
            addToCart={addToCart}
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
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20ba5a] transition-all duration-300 z-50 flex items-center justify-center w-14 h-14"
        title="Fale Conosco no WhatsApp"
      >
        <svg viewBox="0 0 448 512" class="w-7 h-7 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>

      {/* Premium Toast Notifications Container */}
      <div className="fixed bottom-24 left-4 right-4 md:right-6 md:left-auto max-w-sm w-[calc(100%-2rem)] z-50 flex flex-col gap-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`shadow-2xl rounded-xl p-4 flex items-center gap-3 animate-slide-in text-white ${
              n.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            {n.type === 'success' ? (
              <svg className="w-5 h-5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
            <div className="flex-grow text-sm font-semibold">{n.message}</div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
              className="text-white/80 hover:text-white shrink-0 cursor-pointer"
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
