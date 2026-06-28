import React, { useState } from 'react';
import API from '../api/api';

export default function Admin({ onOpenAddModal, onOpenEditModal, products, loading, fetchProducts, addNotification }) {
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Format date helper
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Format price helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // Handle Delete execution
  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      await API.delete(`/products/${productToDelete.id}`);
      addNotification('Produto excluído com sucesso!', 'success');
      fetchProducts();
      setProductToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      addNotification('Erro ao excluir produto. Tente novamente.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Painel de Controle
          </h1>
          <p className="text-slate-500 text-sm">
            Gerencie o catálogo de produtos: cadastre, edite informações ou remova itens.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-[#202020] hover:bg-black text-white font-bold text-sm shadow-sm transition-all self-start sm:self-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Adicionar Produto
        </button>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#202020] rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 text-sm">Carregando dados da tabela...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Nenhum produto cadastrado</h3>
          <p className="text-slate-400 text-sm mb-4">Inicie o seu catálogo adicionando novos produtos.</p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#202020] hover:bg-black text-white transition-all shadow-sm"
          >
            Adicionar Primeiro Produto
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase tracking-wider bg-slate-50">
                  <th className="px-6 py-4.5">Produto</th>
                  <th className="px-6 py-4.5">Categoria</th>
                  <th className="px-6 py-4.5">Preço</th>
                  <th className="px-6 py-4.5">Estoque</th>
                  <th className="px-6 py-4.5">Criado Em</th>
                  <th className="px-6 py-4.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Product Name/Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100 bg-slate-50"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="font-semibold text-sm text-slate-800 max-w-[200px] truncate" title={product.name}>
                          {product.name}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      {formatPrice(product.price)}
                    </td>

                    {/* Stock status badge */}
                    <td className="px-6 py-4">
                      {product.stock <= 0 ? (
                        <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100">
                          Esgotado
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100">
                          Baixo ({product.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Ativo ({product.stock})
                        </span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {formatDate(product.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => onOpenEditModal(product)}
                          className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 border border-transparent hover:border-sky-100 transition-all"
                          title="Editar Produto"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                          title="Excluir Produto"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">Excluir Produto</h3>
            <p className="text-slate-500 text-sm mb-6">
              Tem certeza que deseja excluir <strong>{productToDelete.name}</strong>? Esta ação não poderá ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                disabled={deleteLoading}
                className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/10 hover:shadow-rose-500/20 transition-all flex items-center gap-1.5"
              >
                {deleteLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
