import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function Catalog({
  products,
  loading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}) {
  const [promoFilter, setPromoFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [isOpen, setIsOpen] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p) => {
    // 1. Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(query);
      const matchDesc = p.description?.toLowerCase().includes(query);
      if (!matchName && !matchDesc) return false;
    }

    // 2. Category / Brand Filter
    if (selectedCategory) {
      const catLower = selectedCategory.toLowerCase();
      const productCatLower = p.category?.toLowerCase() || '';
      const productNameLower = p.name?.toLowerCase() || '';
      
      const matchesCategory = productCatLower === catLower;
      const matchesBrandInName = productNameLower.includes(catLower);
      
      if (!matchesCategory && !matchesBrandInName) {
        return false;
      }
    }

    // 3. Promo Filter (Even IDs simulated as promotions)
    if (promoFilter === 'promo') {
      const hasPromo = p.id % 2 === 0;
      if (!hasPromo) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return parseFloat(a.price) - parseFloat(b.price);
    }
    if (sortBy === 'price-desc') {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    return b.id - a.id; // default: new arrivals / ID desc
  });

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Search status if searching */}
        {searchQuery && (
          <div className="mb-6 bg-white border border-slate-100 text-slate-600 rounded-xl p-4 text-sm flex items-center justify-between shadow-sm">
            <span>
              Buscando por: <strong className="text-black font-semibold">"{searchQuery}"</strong>
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-black hover:underline"
            >
              Limpar Busca
            </button>
          </div>
        )}

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Sidebar Filters */}
          <aside className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-6">
            {/* Categories Sidebar Filter */}
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left lg:pointer-events-none focus:outline-none"
              >
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Categorias
                </h3>
                <svg
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 lg:hidden ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`${isOpen ? 'block' : 'hidden'} lg:block mt-4`}>
                <div className="flex flex-col gap-3">
                  {/* Option: All */}
                  <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-600 select-none hover:text-black transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="w-4.5 h-4.5 rounded border-slate-350 text-black focus:ring-black accent-black cursor-pointer"
                    />
                    <span>Todos os produtos</span>
                  </label>

                  {/* Dynamic categories from DB */}
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-600 select-none hover:text-black transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategory.toLowerCase() === cat.toLowerCase()}
                        onChange={() => setSelectedCategory(selectedCategory.toLowerCase() === cat.toLowerCase() ? '' : cat)}
                        className="w-4.5 h-4.5 rounded border-slate-350 text-black focus:ring-black accent-black cursor-pointer"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Promotions Sidebar Filter */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                Promoções
              </h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-605 select-none hover:text-black transition-colors">
                  <input
                    type="checkbox"
                    checked={promoFilter === 'all'}
                    onChange={() => setPromoFilter('all')}
                    className="w-4.5 h-4.5 rounded border-slate-350 text-black focus:ring-black accent-black cursor-pointer"
                  />
                  <span>Todos os produtos</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-605 select-none hover:text-black transition-colors">
                  <input
                    type="checkbox"
                    checked={promoFilter === 'promo'}
                    onChange={() => setPromoFilter(promoFilter === 'promo' ? 'all' : 'promo')}
                    className="w-4.5 h-4.5 rounded border-slate-350 text-black focus:ring-black accent-black cursor-pointer"
                  />
                  <span>Somente promoções</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Column: Products Grid */}
          <main className="lg:col-span-3">
            {/* Grid Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                  {selectedCategory || 'Todos os produtos'}
                </h1>
                <p className="text-slate-400 text-xs mt-0.5 font-medium">
                  {loading ? 'Carregando...' : `Resultado: ${filteredProducts.length} ${filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`}
                </p>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  Ordenar por:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-black cursor-pointer transition-colors"
                >
                  <option value="default">Padrão</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name-asc">Nome (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Grid State Renders */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-black rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-400 text-xs font-medium">Carregando catálogo...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <svg
                  className="w-12 h-12 text-slate-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  Nenhum produto encontrado
                </h3>
                <p className="text-slate-400 text-xs">
                  Tente ajustar os termos de busca ou remover os filtros aplicados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sortedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}