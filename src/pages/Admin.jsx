import React, { useState, useEffect } from 'react';
import API from '../api/api';

export default function Admin({ 
  onOpenAddModal, 
  onOpenEditModal, 
  products, 
  loading, 
  fetchProducts, 
  addNotification,
  currentUser,
  setCurrentUser
}) {
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Tabs and Orders states
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('admin_active_tab') || 'produtos');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrderForItems, setSelectedOrderForItems] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [orderItemsLoading, setOrderItemsLoading] = useState(false);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    localStorage.setItem('admin_active_tab', newTab);
  };

  // 2FA modal states
  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [loading2FA, setLoading2FA] = useState(false);

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

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await API.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      addNotification('Erro ao carregar pedidos do servidor.', 'error');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      addNotification(`Pedido atualizado para ${newStatus}!`, 'success');
      fetchOrders();
      if (newStatus === 'Concluído' && fetchProducts) {
        fetchProducts(); // Refresh products list to show decreased stocks!
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      addNotification('Erro ao atualizar status do pedido.', 'error');
    }
  };

  const handleViewOrderDetails = async (order) => {
    setSelectedOrderForItems(order);
    setOrderItemsLoading(true);
    try {
      const response = await API.get(`/orders/${order.id}/items`);
      setOrderItems(response.data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      addNotification('Erro ao carregar itens do pedido.', 'error');
    } finally {
      setOrderItemsLoading(false);
    }
  };

  useEffect(() => {
    if (fetchProducts) {
      fetchProducts();
    }
    fetchOrders();
  }, [activeTab]);

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

  // Open 2FA setup modal
  const handleOpen2FAModal = async () => {
    setIs2FAOpen(true);
    setTokenInput('');
    if (currentUser && !currentUser.is_two_factor_enabled) {
      setLoading2FA(true);
      try {
        const response = await API.post('/auth/2fa/setup');
        setQrCodeUrl(response.data.qrCode);
        setSecret(response.data.secret);
      } catch (error) {
        console.error('Erro ao iniciar setup 2FA:', error);
        addNotification('Erro ao carregar configurações do 2FA.', 'error');
      } finally {
        setLoading2FA(false);
      }
    }
  };

  // Enable 2FA verification
  const handleEnable2FA = async (e) => {
    e.preventDefault();
    if (!tokenInput || tokenInput.length !== 6) {
      addNotification('O código deve conter 6 dígitos.', 'error');
      return;
    }
    setLoading2FA(true);
    try {
      const response = await API.post('/auth/2fa/enable', { token: tokenInput });
      addNotification('Autenticação de dois fatores (2FA) ativada com sucesso!', 'success');
      
      const updatedUser = { ...currentUser, is_two_factor_enabled: true };
      setCurrentUser(updatedUser);
      localStorage.setItem('genjoy_user', JSON.stringify(updatedUser));
      
      setIs2FAOpen(false);
      setTokenInput('');
    } catch (error) {
      console.error('Erro ao ativar 2FA:', error);
      const errMsg = error.response?.data?.error || 'Código de verificação inválido.';
      addNotification(errMsg, 'error');
    } finally {
      setLoading2FA(false);
    }
  };

  // Disable 2FA verification
  const handleDisable2FA = async (e) => {
    e.preventDefault();
    if (!tokenInput || tokenInput.length !== 6) {
      addNotification('O código deve conter 6 dígitos.', 'error');
      return;
    }
    setLoading2FA(true);
    try {
      await API.post('/auth/2fa/disable', { token: tokenInput });
      addNotification('Autenticação de dois fatores (2FA) desativada.', 'success');
      
      const updatedUser = { ...currentUser, is_two_factor_enabled: false };
      setCurrentUser(updatedUser);
      localStorage.setItem('genjoy_user', JSON.stringify(updatedUser));
      
      setIs2FAOpen(false);
      setTokenInput('');
    } catch (error) {
      console.error('Erro ao desativar 2FA:', error);
      const errMsg = error.response?.data?.error || 'Código de verificação inválido.';
      addNotification(errMsg, 'error');
    } finally {
      setLoading2FA(false);
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

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Security 2FA Config Button */}
          <button
            onClick={handleOpen2FAModal}
            className={`inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl border font-bold text-sm shadow-sm transition-all ${
              currentUser?.is_two_factor_enabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-250 hover:bg-emerald-100/70'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            {currentUser?.is_two_factor_enabled ? '2FA Ativado' : 'Configurar 2FA'}
          </button>

          {/* Add Product Button */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-[#202020] hover:bg-black text-white font-bold text-sm shadow-sm transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Adicionar Produto
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 mb-6 gap-6">
        <button
          onClick={() => handleTabChange('produtos')}
          className={`pb-3 font-bold text-sm transition-all focus:outline-none cursor-pointer border-b-2 ${
            activeTab === 'produtos'
              ? 'border-[#202020] text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Produtos
        </button>
        <button
          onClick={() => handleTabChange('pedidos')}
          className={`pb-3 font-bold text-sm transition-all focus:outline-none cursor-pointer border-b-2 ${
            activeTab === 'pedidos'
              ? 'border-[#202020] text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Pedidos
        </button>
      </div>

      {/* Main Content Area: Products Table or Orders Table */}
      {activeTab === 'pedidos' ? (
        ordersLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#202020] rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 text-sm">Carregando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Nenhum pedido registrado</h3>
            <p className="text-slate-400 text-sm">Os pedidos dos clientes aparecerão aqui assim que finalizados no site.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase tracking-wider bg-slate-50">
                    <th className="px-6 py-4.5">Número do Pedido</th>
                    <th className="px-6 py-4.5">Data</th>
                    <th className="px-6 py-4.5">Valor Total</th>
                    <th className="px-6 py-4.5">Status</th>
                    <th className="px-6 py-4.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        #{order.order_number}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {formatPrice(order.total_price)}
                      </td>
                      <td className="px-6 py-4">
                        {order.status === 'Aprovado' || order.status === 'Concluído' ? (
                          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Aprovado
                          </span>
                        ) : order.status === 'Cancelado' ? (
                          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                            Cancelado
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
                            Pendente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {/* Status dropdown select */}
                          <select
                            value={order.status === 'Concluído' ? 'Aprovado' : order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 text-slate-700 cursor-pointer"
                          >
                            <option value="Pendente">Pendente</option>
                            <option value="Aprovado">Aprovado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>

                          <button
                            onClick={() => handleViewOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm ml-3 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Visualizar Detalhes"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <span>Ver Detalhes</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Products Table */
        loading ? (
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
                      {product.promo_price ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 line-through font-normal">
                            {formatPrice(product.original_price)}
                          </span>
                          <span className="text-rose-600 font-bold">
                            {formatPrice(product.promo_price)}
                          </span>
                        </div>
                      ) : (
                        formatPrice(product.original_price)
                      )}
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
      ))}`

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

      {/* Two-Factor Authentication Modal */}
      {is2FAOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-250 flex items-center justify-center text-slate-700">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Autenticação de Duas Etapas (2FA)</h3>
              </div>
              <button 
                onClick={() => setIs2FAOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {loading2FA && !qrCodeUrl && !currentUser?.is_two_factor_enabled ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-slate-250 border-t-[#202020] rounded-full animate-spin"></div>
                <p className="mt-4 text-xs text-slate-400">Carregando configurações de segurança...</p>
              </div>
            ) : currentUser?.is_two_factor_enabled ? (
              /* If 2FA is ENABLED, show DISABLE option */
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                  <svg className="w-5.5 h-5.5 text-emerald-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-800">A proteção 2FA está ativa!</h4>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Sua conta está protegida por verificação de duas etapas. O login exigirá a verificação do código de segurança de 6 dígitos.
                    </p>
                  </div>
                </div>

                <hr className="border-slate-100 my-4" />

                <form onSubmit={handleDisable2FA} className="space-y-4">
                  <div className="text-slate-500 text-xs leading-relaxed">
                    Para <strong>desativar</strong> o 2FA, insira o código atual de 6 dígitos gerado pelo aplicativo Google Authenticator no seu celular.
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Código de Verificação Atual
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full max-w-[200px] bg-slate-50 border border-slate-200 focus:border-[#202020] focus:bg-white rounded-xl px-4 py-2 text-center text-lg font-black tracking-widest text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 transition-all"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIs2FAOpen(false)}
                      className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading2FA}
                      className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/10 hover:shadow-rose-500/20 transition-all flex items-center gap-1.5"
                    >
                      {loading2FA && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      Desativar 2FA
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* If 2FA is DISABLED, show SETUP flow */
              <form onSubmit={handleEnable2FA} className="space-y-4">
                <div className="text-slate-600 text-xs leading-relaxed">
                  Para ativar o 2FA, siga as instruções abaixo:
                  <ol className="list-decimal list-inside space-y-2 mt-2 font-medium">
                    <li>Abra o aplicativo <strong>Google Authenticator</strong> (ou similar) no seu celular.</li>
                    <li>Escolha a opção de escanear um novo código QR.</li>
                    <li>Escaneie a imagem abaixo com a câmera do celular (ou insira a chave secreta manualmente).</li>
                    <li>Digite o código de 6 dígitos gerado pelo aplicativo no campo abaixo para confirmar a ativação.</li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 my-4">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code 2FA" 
                      className="w-40 h-40 object-contain bg-white p-2 rounded-xl border border-slate-200" 
                    />
                  ) : (
                    <div className="w-40 h-40 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                      Gerando...
                    </div>
                  )}

                  <div className="text-center sm:text-left space-y-1.5 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chave Manual</span>
                    <code className="block bg-white border border-slate-250 font-mono text-sm font-bold text-slate-700 px-3 py-1.5 rounded-lg select-all text-center sm:text-left break-all">
                      {secret || 'Carregando...'}
                    </code>
                    <span className="block text-[9px] text-slate-400">
                      Caso não consiga escanear o código QR, insira a chave acima manualmente no seu aplicativo de autenticação.
                    </span>
                  </div>
                </div>

                <div className="space-y-2 max-w-xs">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Código de Segurança de 6 Dígitos
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#202020] focus:bg-white rounded-xl px-4 py-2.5 text-center text-lg font-black tracking-widest text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIs2FAOpen(false)}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading2FA || !secret}
                    className="px-4 py-2.5 rounded-lg bg-[#202020] hover:bg-black text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                  >
                    {loading2FA && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    Verificar e Ativar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderForItems && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                Itens do Pedido #{selectedOrderForItems.order_number}
              </h2>
              <button
                onClick={() => setSelectedOrderForItems(null)}
                className="text-slate-400 hover:text-slate-650 p-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {orderItemsLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-8 h-8 border-3 border-slate-200 border-t-[#202020] rounded-full animate-spin"></div>
                  <p className="mt-3 text-xs text-slate-400">Carregando itens...</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                      {/* Thumbnail */}
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-100 bg-slate-50 shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      
                      {/* Product Name & details */}
                      <div className="flex-grow min-w-0">
                        <div className="text-sm font-bold text-slate-800 truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          Preço unitário: {formatPrice(item.price)}
                        </div>
                      </div>

                      {/* Quantity & Subtotal */}
                      <div className="text-right shrink-0">
                        <div className="text-sm font-semibold text-slate-800">
                          {item.quantity}x
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {formatPrice(parseFloat(item.price) * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-bold font-semibold">Total do Pedido</span>
                <span className="text-lg font-black text-slate-900">{formatPrice(selectedOrderForItems.total_price)}</span>
              </div>
              <button
                onClick={() => setSelectedOrderForItems(null)}
                className="px-5 py-2 rounded-xl bg-[#202020] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-sm border-none"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
