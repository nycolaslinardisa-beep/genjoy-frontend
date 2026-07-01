import React from 'react';
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
  onLogout
}) {
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
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
    </header>
  );
}
