import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../context/UserProfileContext';

export function PerfilPage() {
  const { user, updateUser } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateUser({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const stats = [
    { label: 'Dias estudados', value: '34', icon: '🔥' },
    { label: 'Horas totais', value: '142h', icon: '⏱️' },
    { label: 'Simulados', value: '18', icon: '📝' },
    { label: 'Sequência', value: '7 dias', icon: '⚡' },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Perfil</h1>

        {/* Avatar + name */}
        <div className="flex items-center gap-6 p-6 rounded-2xl glass mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{user?.name}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className="text-xs px-2 py-0.5 rounded-full tag-indigo mt-1 inline-block">Plano Premium</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="p-4 rounded-xl glass text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <p className="text-white font-bold text-sm">{s.value}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Edit form */}
        <div className="p-6 rounded-2xl glass space-y-4">
          <h2 className="text-white font-semibold text-sm mb-2">Dados pessoais</h2>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Nome completo</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm input-dark" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Email</label>
            <input value={user?.email || ''} disabled
              className="w-full px-4 py-3 rounded-xl text-sm input-dark opacity-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Objetivo / Concurso</label>
            <input value={profile.nomeConcurso} onChange={e => updateProfile({ nomeConcurso: e.target.value, objetivo: e.target.value })}
              placeholder="Ex: Delegado PC-SP"
              className="w-full px-4 py-3 rounded-xl text-sm input-dark" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Horas de estudo por dia</label>
            <input type="number" min={1} max={12} value={profile.horasDia}
              onChange={e => updateProfile({ horasDia: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl text-sm input-dark" />
          </div>
          <button onClick={save}
            className="w-full py-3 rounded-xl text-sm font-semibold btn-primary">
            {saved ? '✓ Salvo!' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}
