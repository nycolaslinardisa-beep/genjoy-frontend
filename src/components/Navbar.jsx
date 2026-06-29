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
    { label: 'POCO', value: 'POCO' },
    { label: 'REALME', value: 'REALME' },
    { label: 'REDMI', value: 'REDMI' },
    { label: 'TCL', value: 'TCL' }
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
            {/* Search Bar Icon for Mobile */}
            <div className="block md:hidden relative flex items-center max-w-[150px] sm:max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentTab !== 'catalog') {
                    setCurrentTab('catalog');
                  }
                }}
                placeholder="Buscar..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-full px-4 py-1.5 text-xs focus:outline-none focus:border-black focus:bg-white transition-all pr-8"
              />
              <button className="absolute right-1 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>

            {/* Admin toggle button */}
            <button
              onClick={() => setCurrentTab(currentTab === 'admin' ? 'catalog' : 'admin')}
              className={`p-2 rounded-full border transition-all duration-200 ${
                currentTab === 'admin'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-slate-650 hover:text-black border-transparent hover:bg-slate-50'
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

            {/* Shopping Cart Icon with Badge */}
            <div className="relative p-2 text-slate-600 hover:text-black cursor-pointer transition-colors group">
              <svg className="w-5.5 h-5.5 stroke-current group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span className="absolute top-0 right-0 w-4.5 h-4.5 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </div>

            {/* Instagram Link Button */}
            <a
              href="https://www.instagram.com/genjoybr?igsh=MXRncmUwbjlzemt3NA=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-650 hover:text-black transition-colors"
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
              className="p-2 text-slate-655 hover:text-emerald-600 transition-colors"
              title="Fale conosco no WhatsApp"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.884-6.948C16.59 1.993 14.137.973 11.52.973c-5.437 0-9.862 4.371-9.866 9.8.001 2.012.528 3.976 1.529 5.701L2.17 20.25l4.477-1.096zM18.06 14.93c-.33-.165-1.937-.957-2.235-1.066-.298-.108-.515-.162-.73.163-.215.325-.83.163-1.018-.163-.188-.329-.374-.637-.56-.967-.188-.33-.037-.506.126-.671.148-.15.33-.325.495-.49.165-.163.22-.271.33-.453.11-.183.055-.343-.028-.507-.082-.165-.73-1.761-1-2.414-.263-.637-.531-.55-.73-.56h-.627c-.215 0-.565.081-.861.408-.296.325-1.13 1.101-1.13 2.685 0 1.586 1.147 3.117 1.308 3.333.16.217 2.258 3.447 5.47 4.832.763.329 1.358.525 1.821.672.766.244 1.464.21 2.017.127.616-.092 1.937-.792 2.21-1.558.271-.767.271-1.425.19-1.557-.08-.135-.297-.217-.627-.38z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Categories Underbar Row */}
        <div className="flex items-center justify-center gap-8 py-3 border-t border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
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
