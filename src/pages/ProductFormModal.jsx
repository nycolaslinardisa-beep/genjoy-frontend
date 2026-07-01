import React, { useState, useEffect } from 'react';
import API from '../api/api';

export default function ProductFormModal({ isOpen, onClose, productToEdit, onSaveSuccess, addNotification }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    original_price: '',
    promo_price: '',
    stock: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset or fill form when modal opens or editing product changes
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || '',
        original_price: productToEdit.original_price || '',
        promo_price: productToEdit.promo_price || '',
        stock: productToEdit.stock || '0',
        description: productToEdit.description || '',
      });
      setImagePreview(productToEdit.image_url || '');
      setImageFile(null);
    } else {
      setFormData({
        name: '',
        category: '',
        original_price: '',
        promo_price: '',
        stock: '0',
        description: '',
      });
      setImagePreview('');
      setImageFile(null);
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Validate inputs
  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'O nome é obrigatório.';
    if (!formData.category.trim()) tempErrors.category = 'A categoria é obrigatória.';
    
    if (!formData.original_price) {
      tempErrors.original_price = 'O preço anterior é obrigatório.';
    } else if (isNaN(formData.original_price) || parseFloat(formData.original_price) < 0) {
      tempErrors.original_price = 'O preço anterior deve ser um número positivo.';
    }

    if (formData.promo_price !== undefined && formData.promo_price !== null && formData.promo_price !== '') {
      if (isNaN(formData.promo_price) || parseFloat(formData.promo_price) < 0) {
        tempErrors.promo_price = 'O preço promocional deve ser um número positivo.';
      }
    }

    if (formData.stock === '') {
      tempErrors.stock = 'O estoque é obrigatório.';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      tempErrors.stock = 'O estoque deve ser um número inteiro positivo.';
    }

    if (!productToEdit && !imageFile) {
      tempErrors.image_file = 'O arquivo de imagem é obrigatório.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (errors.image_file) {
        setErrors((prev) => ({ ...prev, image_file: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('category', formData.category);
      payload.append('original_price', formData.original_price);
      if (formData.promo_price !== undefined && formData.promo_price !== null && formData.promo_price !== '') {
        payload.append('promo_price', formData.promo_price);
      }
      payload.append('stock', formData.stock);
      payload.append('description', formData.description);
      
      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (productToEdit) {
        // Edit mode
        await API.put(`/products/${productToEdit.id}`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        addNotification('Produto atualizado com sucesso!', 'success');
      } else {
        // Create mode
        await API.post('/products', payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        addNotification('Produto cadastrado com sucesso!', 'success');
      }

      // Reset form states completely to blank/initial values after successful submission
      setFormData({
        name: '',
        category: '',
        original_price: '',
        promo_price: '',
        stock: '0',
        description: '',
      });
      setImageFile(null);
      setImagePreview('');

      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      const errMsg = error.response?.data?.error || 'Erro ao processar requisição. Verifique os dados.';
      addNotification(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#202020] animate-pulse"></span>
            {productToEdit ? 'Editar Produto' : 'Cadastrar Novo Produto'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Name and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Teclado Mecânico"
                className={`w-full bg-slate-50 border ${
                  errors.name ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 focus:border-[#202020] focus:bg-white'
                } rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 transition-all`}
              />
              {errors.name && <span className="text-xs text-rose-500 mt-1 block">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Categoria *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ex: Eletrônicos"
                className={`w-full bg-slate-50 border ${
                  errors.category ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 focus:border-[#202020] focus:bg-white'
                } rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 transition-all`}
              />
              {errors.category && <span className="text-xs text-rose-500 mt-1 block">{errors.category}</span>}
            </div>
          </div>

          {/* Row 2: Prices and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Preço Anterior (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                name="original_price"
                value={formData.original_price}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full bg-slate-50 border ${
                  errors.original_price ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 focus:border-[#202020] focus:bg-white'
                } rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 transition-all`}
              />
              {errors.original_price && <span className="text-xs text-rose-500 mt-1 block">{errors.original_price}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Preço Promocional (R$)
              </label>
              <input
                type="number"
                step="0.01"
                name="promo_price"
                value={formData.promo_price}
                onChange={handleChange}
                placeholder="Deixe em branco se sem oferta"
                className={`w-full bg-slate-50 border ${
                  errors.promo_price ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 focus:border-[#202020] focus:bg-white'
                } rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 transition-all`}
              />
              {errors.promo_price && <span className="text-xs text-rose-500 mt-1 block">{errors.promo_price}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Quantidade em Estoque *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className={`w-full bg-slate-50 border ${
                  errors.stock ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 focus:border-[#202020] focus:bg-white'
                } rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 transition-all`}
              />
              {errors.stock && <span className="text-xs text-rose-500 mt-1 block">{errors.stock}</span>}
            </div>
          </div>

          {/* Row 3: Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Imagem do Produto *
            </label>
            <input
              type="file"
              accept="image/*"
              required={!productToEdit}
              onChange={handleFileChange}
              className={`w-full bg-slate-50 border ${
                errors.image_file ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 focus:border-[#202020] focus:bg-white'
              } rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 transition-all cursor-pointer`}
            />
            {errors.image_file && <span className="text-xs text-rose-500 mt-1 block">{errors.image_file}</span>}
            {imagePreview && (
              <div className="mt-3 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-lg border border-slate-100 bg-white"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="text-xs text-slate-500">Visualização prévia da imagem carregada.</span>
              </div>
            )}
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Descreva as principais características do produto..."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#202020] focus:ring-1 focus:ring-[#202020]/20 transition-all resize-none"
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4.5 py-2.5 rounded-xl bg-[#202020] hover:bg-black disabled:bg-[#202020]/50 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {productToEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
