import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { Logo } from '../components/Logo';

function CrystalScene() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden noise-overlay" style={{ background: '#050507' }}>
      <div className="aurora-bg">
        <div className="aurora-blob" style={{ width: 420, height: 420, top: '5%', left: '10%', background: '#8b5cf6' }} />
        <div className="aurora-blob" style={{ width: 380, height: 380, bottom: '0%', right: '5%', background: '#a855f7', animationDelay: '4s' }} />
        <div className="aurora-blob" style={{ width: 260, height: 260, top: '40%', left: '50%', background: '#c084fc', animationDelay: '8s' }} />
      </div>

      {stars.map(s => (
        <div key={s.id} className="star absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 300 300" width="320" height="320" className="crystal-shape">
          <defs>
            <linearGradient id="crystalFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.25" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g className="crystal-glow" filter="url(#glow)">
            <polygon points="150,20 230,110 195,260 105,260 70,110" fill="url(#crystalFill)" stroke="#c084fc" strokeWidth="1.5" />
            <polygon points="150,20 230,110 150,140" fill="rgba(255,255,255,0.10)" stroke="#a855f7" strokeWidth="1" />
            <polygon points="150,20 70,110 150,140" fill="rgba(255,255,255,0.04)" stroke="#a855f7" strokeWidth="1" />
            <line x1="150" y1="140" x2="195" y2="260" stroke="#c084fc" strokeWidth="0.8" opacity="0.6" />
            <line x1="150" y1="140" x2="105" y2="260" stroke="#c084fc" strokeWidth="0.8" opacity="0.6" />
          </g>
        </svg>
      </div>

      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(5,5,7,0.4) 100%)' }} />

      <div className="absolute bottom-12 left-12 right-12 reveal" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-3xl font-bold text-white leading-tight mb-3">
          Sua aprovação,<br />
          <span style={{ background: 'linear-gradient(135deg,#c084fc,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            orquestrada por IA.
          </span>
        </h2>
        <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
          A Athena analisa cada decisão da sua jornada de estudos e constrói o caminho mais curto até a aprovação.
        </p>
      </div>
    </div>
  );
}

const SOCIAL_PROVIDERS = [
  { id: 'google', label: 'Google', icon: 'G' },
  { id: 'github', label: 'GitHub', icon: '⌥' },
  { id: 'apple', label: 'Apple', icon: '' },
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { navigate } = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) setError(result.error);
    else navigate('dashboard');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#050507' }}>
      <div className="hidden lg:flex flex-1 relative">
        <CrystalScene />
      </div>

      <div className="flex flex-col justify-center flex-1 max-w-md mx-auto px-8 py-12 relative">
        <div className="lg:hidden absolute inset-0 -z-10">
          <CrystalScene />
        </div>

        <div className="reveal" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-10">
            <Logo size={36} />
            <span className="text-white font-semibold text-lg tracking-tight">AprovaIA</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Bem-vindo de volta</h2>
          <p className="text-gray-400 text-sm mb-8">Entre na sua conta para continuar estudando</p>
        </div>

        <div className="glass-crystal rounded-2xl p-6 reveal" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 border outline-none transition-all input-glow"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-300">Senha</label>
                <button type="button" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  Esqueceu a senha?
                </button>
              </div>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 border outline-none transition-all input-glow"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl border border-red-500/30 text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.08)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all btn-magnetic active:scale-[0.98] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : 'Entrar na plataforma'}
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-gray-500 text-xs">ou continue com</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {SOCIAL_PROVIDERS.map(p => (
              <button key={p.id} type="button"
                className="py-2.5 rounded-xl text-sm font-medium text-gray-300 border transition-all hover:text-white btn-magnetic"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                title={p.label}>
                {p.icon}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400 reveal" style={{ animationDelay: '0.3s' }}>
          Não tem conta?{' '}
          <button onClick={() => navigate('register')} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Criar conta grátis
          </button>
        </p>
      </div>
    </div>
  );
}
