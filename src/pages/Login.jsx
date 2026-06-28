import React, { useState } from 'react';
import API from '../api/api';

export default function Login({ onAuthSuccess, addNotification }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (isRegister && !formData.name.trim()) {
      tempErrors.name = 'O nome é obrigatório.';
    }
    if (!formData.email.trim()) {
      tempErrors.email = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Formato de e-mail inválido.';
    }
    if (!formData.password) {
      tempErrors.password = 'A senha é obrigatória.';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'A senha deve conter pelo menos 6 caracteres.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isRegister) {
        // Register API call
        const response = await API.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        
        localStorage.setItem('genjoy_token', response.data.token);
        localStorage.setItem('genjoy_user', JSON.stringify(response.data.user));
        
        addNotification('Cadastro realizado com sucesso!', 'success');
        onAuthSuccess(response.data.user);
      } else {
        // Login API call
        const response = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem('genjoy_token', response.data.token);
        localStorage.setItem('genjoy_user', JSON.stringify(response.data.user));

        addNotification('Login realizado com sucesso!', 'success');
        onAuthSuccess(response.data.user);
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      const errMsg = error.response?.data?.error || 'E-mail ou senha incorretos.';
      addNotification(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      {/* Auth Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-8">
        {/* Toggle tabs */}
        <div className="flex border-b border-slate-100 mb-8 text-sm font-semibold text-slate-400">
          <button
            onClick={() => {
              setIsRegister(false);
              setErrors({});
            }}
            className={`flex-1 pb-3 text-center transition-all ${
              !isRegister ? 'text-[#202020] border-b-2 border-[#202020]' : 'hover:text-slate-600'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              setErrors({});
            }}
            className={`flex-1 pb-3 text-center transition-all ${
              isRegister ? 'text-[#202020] border-b-2 border-[#202020]' : 'hover:text-slate-600'
            }`}
          >
            Cadastrar Conta
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#202020] mb-2">
            {isRegister ? 'Criar Nova Conta' : 'Acesso Restrito'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Cadastre-se para obter acesso de gerenciamento ao catálogo Genjoy.'
              : 'Entre com suas credenciais administrativas para gerenciar produtos.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Sign Up only) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Carlos Silva"
                className={`w-full bg-slate-50 border ${
                  errors.name ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 focus:border-[#202020] focus:bg-white'
                } rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 transition-all`}
              />
              {errors.name && <span className="text-xs text-rose-500 mt-1 block">{errors.name}</span>}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Endereço de E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemplo@email.com"
              className={`w-full bg-slate-50 border ${
                errors.email ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 focus:border-[#202020] focus:bg-white'
              } rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 transition-all`}
            />
            {errors.email && <span className="text-xs text-rose-500 mt-1 block">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Senha de Acesso
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-slate-50 border ${
                errors.password ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 focus:border-[#202020] focus:bg-white'
              } rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#202020]/20 transition-all`}
            />
            {errors.password && <span className="text-xs text-rose-500 mt-1 block">{errors.password}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 rounded-xl bg-[#202020] hover:bg-black disabled:bg-[#202020]/50 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {isRegister ? 'Criar Conta' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
