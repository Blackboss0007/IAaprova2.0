import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { navigate } = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('As senhas não coincidem.'); return; }
    if (password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres.'); return; }
    setLoading(true);
    const result = await signUp(name, email, password);
    setLoading(false);
    if (result.error) setError(result.error);
    else navigate('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-white font-semibold text-lg">AprovaIA</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Criar conta grátis</h2>
        <p className="text-gray-400 text-sm mb-8">Comece sua jornada rumo à aprovação hoje mesmo</p>

        {/* Plan badge */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-indigo-500/30 mb-6"
          style={{ background: 'rgba(99,102,241,0.08)' }}>
          <span className="text-2xl">🎁</span>
          <div>
            <p className="text-indigo-300 font-medium text-sm">7 dias grátis no Plano Premium</p>
            <p className="text-gray-400 text-xs">Sem cartão de crédito necessário</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Nome completo</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-500 border transition-all outline-none focus:border-indigo-500"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-500 border transition-all outline-none focus:border-indigo-500"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-500 border transition-all outline-none focus:border-indigo-500"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Confirmar senha</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repita a senha"
              required
              className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-500 border transition-all outline-none focus:border-indigo-500"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg border border-red-500/30 text-red-400 text-sm"
              style={{ background: 'rgba(239,68,68,0.08)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Criando conta...
              </span>
            ) : 'Criar minha conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Já tem conta?{' '}
          <button onClick={() => navigate('login')}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Entrar
          </button>
        </p>

        <p className="mt-4 text-center text-xs text-gray-600">
          Ao criar sua conta, você concorda com os{' '}
          <span className="text-gray-500 underline cursor-pointer">Termos de Uso</span>
          {' '}e a{' '}
          <span className="text-gray-500 underline cursor-pointer">Política de Privacidade</span>
        </p>
      </div>
    </div>
  );
}
