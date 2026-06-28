import React, { useState } from 'react';

export default function ProductCard({ product }) {
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
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-3.5 py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm border border-transparent"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.884-6.948C16.59 1.993 14.137.973 11.52.973c-5.437 0-9.862 4.371-9.866 9.8.001 2.012.528 3.976 1.529 5.701L2.17 20.25l4.477-1.096zM18.06 14.93c-.33-.165-1.937-.957-2.235-1.066-.298-.108-.515-.162-.73.163-.215.325-.83.163-1.018-.163-.188-.329-.374-.637-.56-.967-.188-.33-.037-.506.126-.671.148-.15.33-.325.495-.49.165-.163.22-.271.33-.453.11-.183.055-.343-.028-.507-.082-.165-.73-1.761-1-2.414-.263-.637-.531-.55-.73-.56h-.627c-.215 0-.565.081-.861.408-.296.325-1.13 1.101-1.13 2.685 0 1.586 1.147 3.117 1.308 3.333.16.217 2.258 3.447 5.47 4.832.763.329 1.358.525 1.821.672.766.244 1.464.21 2.017.127.616-.092 1.937-.792 2.21-1.558.271-.767.271-1.425.19-1.557-.08-.135-.297-.217-.627-.38z" />
            </svg>
            Pedir no WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
