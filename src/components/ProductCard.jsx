import React, { useState } from 'react';

export default function ProductCard({ product, addToCart }) {
  const [isLiked, setIsLiked] = useState(false);

  // Format price helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const isOutOfStock = product.stock <= 0;
  
  // Calculate promo values
  const hasPromo = product.id % 2 === 0;
  const discountPercent = ((product.id * 3) % 15) + 5; // e.g. 5% to 19%
  const originalPrice = product.price / (1 - discountPercent / 100);

  // WhatsApp order message & link
  const orderMessage = `Olá! Gostaria de pedir o produto: *${product.name}* (Preço: ${formatPrice(product.price)}).`;
  const whatsappUrl = `https://wa.me/556499731390?text=${encodeURIComponent(orderMessage)}`;

  return (
    <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group relative">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 rounded-xl flex items-center justify-center p-3">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Badges Overlaid at Top Left */}
        <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-black text-white uppercase tracking-wider">
            Destaque
          </span>
          {hasPromo && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-[#E11D48] text-white tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Interactive Heart Icon at Bottom Right of Image */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all z-10"
          title={isLiked ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
        >
          <svg
            className={`w-3.5 h-3.5 transition-colors ${isLiked ? 'fill-red-500 stroke-red-505 text-red-500' : 'stroke-current'}`}
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="pt-3.5 px-1 pb-1 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="font-bold text-sm text-slate-900 line-clamp-2 hover:text-black transition-colors mb-1.5" title={product.name}>
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-xs mb-3.5 line-clamp-2 flex-grow">
          {product.description || 'Nenhuma descrição fornecida para este produto.'}
        </p>

        {/* Pricing and Stock info */}
        <div className="flex flex-col gap-2.5 mt-auto pt-2.5 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            {hasPromo ? (
              <>
                <span className="text-base font-black text-black leading-tight">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              </>
            ) : (
              <span className="text-base font-black text-black leading-tight">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            {isOutOfStock ? (
              <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                Esgotado
              </span>
            ) : (
              <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">
                {product.stock} em estoque
              </span>
            )}
          </div>
        </div>

        {/* WhatsApp Order Button */}
        {isOutOfStock ? (
          <button
            disabled
            className="w-full mt-3.5 py-2.5 px-4 rounded-xl bg-slate-105 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200"
          >
            Produto Esgotado
          </button>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className="w-full mt-3.5 py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm border border-transparent cursor-pointer"
          >
            <svg className="w-4 h-4 stroke-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Adicionar ao Carrinho
          </button>
        )}
      </div>
    </div>
  );
}
