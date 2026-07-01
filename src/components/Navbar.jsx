import React, { useState } from 'react';
import logo from '../assets/logo.jpeg';

export default function Navbar({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  currentUser,
  onLogout,
  cart = [],
  updateQuantity,
  removeFromCart,
  clearCart
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartDiscount = cart.reduce((acc, item) => {
    if (item.hasPromo) {
      const diff = item.originalPrice - item.price;
      return acc + (diff * item.quantity);
    }
    return acc;
  }, 0);
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentTab('catalog');
  };

  const quickLinks = [
    { label: 'PRODUTOS', value: '' },
    ...categories.map(cat => ({ label: cat, value: cat }))
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 transition-all duration-300">
      {/* Slogan Top Bar */}
      <div className="bg-black text-white text-[10px] sm:text-xs font-semibold py-2 text-center tracking-wider">
        Otimizando você! | Especialistas em tecnologia
      </div>
      <div className="container mx-auto px-4">
        {/* Top Header Row */}
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => {
              setCurrentTab('catalog');
              setSelectedCategory('');
              setSearchQuery('');
            }}
          >
            <img 
              src={logo} 
              alt="GENJOY CELULARES & ACESSÓRIOS" 
              className="w-10 h-10 rounded-full object-cover border border-slate-100 group-hover:opacity-90 transition-opacity" 
            />
            <div className="flex flex-col">
              <span className="font-black text-sm sm:text-base text-black uppercase tracking-wider leading-none">
                GENJOY
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
                CELULARES & ACESSÓRIOS
              </span>
            </div>
          </div>

          {/* Centered Search Bar */}
          <div className="flex-grow max-w-md mx-auto hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentTab !== 'catalog') {
                    setCurrentTab('catalog');
                  }
                }}
                placeholder="O que você procura?"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-black focus:bg-white transition-all pr-12"
              />
              <button className="absolute right-1 w-8 h-8 bg-black text-white rounded-full hover:bg-neutral-800 transition-colors flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Admin toggle button */}
            <button
              onClick={() => setCurrentTab(currentTab === 'admin' ? 'catalog' : 'admin')}
              className={`p-2 rounded-full border flex items-center justify-center transition-all duration-200 ${
                currentTab === 'admin'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-slate-600 hover:text-black border-transparent hover:bg-slate-50'
              }`}
              title={currentTab === 'admin' ? 'Ver Catálogo' : 'Painel Administrativo'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>

            {/* Authentication User / Entrar Link */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-800 font-semibold select-none">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-800">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline">{currentUser.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                  title="Sair do painel"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div 
                onClick={() => setCurrentTab('admin')}
                className="flex items-center gap-1 cursor-pointer text-slate-600 hover:text-black transition-colors py-2 px-1 group"
              >
                <svg className="w-5 h-5 stroke-current group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span className="font-semibold text-xs uppercase tracking-wider hidden sm:inline">Entrar</span>
              </div>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-black cursor-pointer transition-colors group flex items-center justify-center border-none bg-transparent outline-none focus:outline-none"
              title="Ver Sacola / Carrinho"
            >
              <svg className="w-5 h-5 stroke-current group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Instagram Link Button */}
            <a
              href="https://www.instagram.com/genjoybr?igsh=MXRncmUwbjlzemt3NA=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-black transition-colors hidden md:inline-flex items-center justify-center"
              title="Siga-nos no Instagram"
            >
              <svg className="w-5 h-5 stroke-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* WhatsApp Link Button */}
            <a
              href="https://wa.me/556499731390"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-emerald-600 transition-colors hidden md:inline-flex items-center justify-center"
              title="Fale conosco no WhatsApp"
            >
              <svg viewBox="0 0 448 512" class="w-5 h-5 fill-current text-gray-700 hover:text-[#25D366] transition-colors" xmlns="http://www.w3.org/2000/svg">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.8 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.6-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="pb-3 md:hidden">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentTab !== 'catalog') {
                  setCurrentTab('catalog');
                }
              }}
              placeholder="O que você procura?"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-black focus:bg-white transition-all pr-12"
            />
            <button className="absolute right-1 w-8 h-8 bg-black text-white rounded-full hover:bg-neutral-800 transition-colors flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Categories Underbar Row */}
        <div className="hidden md:flex items-center justify-center gap-8 py-3 border-t border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
          {quickLinks.map((link) => {
            // Match empty string as empty, otherwise match brand case-insensitively
            const isActive = link.value === '' 
              ? selectedCategory === '' 
              : selectedCategory.toUpperCase() === link.value.toUpperCase();

            return (
              <button
                key={link.label}
                onClick={() => handleCategoryClick(link.value)}
                className={`hover:text-black transition-colors relative py-1 ${
                  isActive ? 'text-black font-extrabold' : 'text-slate-500 font-medium'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full animate-fade-in"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drawer / Modal Lateral do Carrinho */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          {/* Background Backdrop Overlay */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-500 bg-opacity-75 transition-opacity duration-500 ease-in-out"
          ></div>

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            {/* Slide-over panel */}
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition duration-500 ease-in-out animate-slide-left">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5 stroke-current text-slate-900" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  Minha Sacola
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Content / Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                    <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <h3 className="text-base font-bold text-slate-800 mb-1">Seu carrinho está vazio</h3>
                    <p className="text-slate-450 text-xs">Adicione celulares ou acessórios do catálogo para começar.</p>
                  </div>
                ) : (
                  <div className="space-y-4 divide-y divide-slate-100">
                    {cart.map((item, idx) => {
                      const itemSubtotal = item.price * item.quantity;
                      return (
                        <div key={item.id} className={`flex items-center gap-4 py-4 ${idx === 0 ? 'pt-0' : ''}`}>
                          {/* Thumbnail */}
                          <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center p-1 shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-contain" 
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80';
                              }}
                            />
                          </div>

                          {/* Title and price */}
                          <div className="flex-grow min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 truncate" title={item.name}>{item.name}</h4>
                            <span className="text-xs text-slate-500 font-semibold mt-0.5 block">
                              {formatPrice(item.price)}
                            </span>

                            {/* Quantity controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 rounded-md border border-slate-200 hover:border-slate-400 flex items-center justify-center text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-slate-800 w-6 text-center select-none">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 rounded-md border border-slate-200 hover:border-slate-400 flex items-center justify-center text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Actions & subtotal */}
                          <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors focus:outline-none"
                              title="Remover item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                            <span className="text-xs font-bold text-slate-900 leading-tight mt-auto">
                              {formatPrice(itemSubtotal)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer / Calculations */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4 shrink-0">
                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-slate-800 font-semibold">
                        {formatPrice(cartSubtotal + cartDiscount)}
                      </span>
                    </div>
                    
                    {/* Discount section */}
                    {cartDiscount > 0 && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg text-xs animate-pulse">
                          Você Economiza:
                        </span>
                        <span className="text-emerald-600 font-extrabold text-sm">
                          -{formatPrice(cartDiscount)}
                        </span>
                      </div>
                    )}

                    <hr className="border-slate-200 my-2" />
                    
                    <div className="flex justify-between text-sm font-bold text-slate-900">
                      <span>Total</span>
                      <span>
                        {formatPrice(cartSubtotal)}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <button
                    onClick={() => {
                      let message = `Olá, Genjoy! Gostaria de fechar o seguinte pedido:\n`;
                      cart.forEach((item) => {
                        message += `- ${item.quantity}x ${item.name} (${formatPrice(item.price)} cada)\n`;
                      });
                      message += `------------------------------------\n`;
                      message += `Total: ${formatPrice(cartSubtotal)}`;
                      
                      const encodedMessage = encodeURIComponent(message);
                      const whatsappUrl = `https://wa.me/556499731390?text=${encodedMessage}`;
                      
                      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                      clearCart();
                      setIsCartOpen(false);
                    }}
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border-none"
                  >
                    <svg viewBox="0 0 448 512" class="w-5 h-5 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    Concluir Pedido via WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
