import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { Logo } from '../Logo';

const NAV = [
  { id: 'dashboard',       label: 'Dashboard',          icon: '⬛' },
  { id: 'mapa-aprovacao',  label: 'Mapa da Aprovação',  icon: '🗺️', badge: 'PRO' },
  { id: 'mentor',          label: 'Athena IA',          icon: '🦉' },
  { id: 'sala-de-guerra',  label: 'Sala de Guerra',     icon: '⚔️' },
  { id: 'cronograma',      label: 'Cronograma',         icon: '📅' },
  { id: 'simulados',       label: 'Simulados',          icon: '📝' },
  { id: 'diagnostico',     label: 'Diagnóstico',        icon: '🔍' },
  { id: 'templates',       label: 'Templates IA',       icon: '🃏' },
  { id: 'pomodoro',        label: 'Pomodoro',           icon: '⏱️' },
] as const;

const BOTTOM = [
  { id: 'perfil',          label: 'Perfil',             icon: '👤' },
  { id: 'configuracoes',   label: 'Configurações',      icon: '⚙️' },
] as const;

export function Sidebar() {
  const { user, signOut } = useAuth();
  const { page, navigate } = useRouter();
  const { profile } = useUserProfile();
  const [col, setCol] = useState(false);

  const diasRestantes = profile.diasRestantes;
  const warMode = diasRestantes !== undefined && diasRestantes <= 30;

  return (
    <aside className={`flex flex-col h-screen border-r transition-all duration-300 ${col ? 'w-16' : 'w-60'}`}
      style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-subtle)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <Logo size={26} />
        {!col && <span className="font-semibold text-white text-sm">AprovaIA</span>}
        <button onClick={() => setCol(!col)} className="ml-auto text-gray-600 hover:text-gray-300 text-lg leading-none">
          {col ? '›' : '‹'}
        </button>
      </div>

      {/* Concurso badge */}
      {!col && profile.nomeConcurso && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <p className="text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">Objetivo</p>
          <p className="text-gray-200 text-xs font-medium mt-0.5 truncate">{profile.nomeConcurso}</p>
          {diasRestantes && (
            <p className={`text-[10px] mt-0.5 font-medium ${warMode ? 'text-red-400' : 'text-gray-400'}`}>
              {warMode ? '⚡' : '📅'} {diasRestantes} dias restantes
            </p>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const active = page === item.id;
          const isWar = item.id === 'sala-de-guerra';
          return (
            <button key={item.id} onClick={() => navigate(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active ? 'text-white font-medium' : isWar && warMode ? 'text-red-300 hover:bg-red-500/10' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
              style={active ? { background: 'rgba(99,102,241,0.18)' } : {}}>
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!col && (
                <>
                  <span className="flex-1 text-left text-xs">{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white' }}>
                      {item.badge}
                    </span>
                  )}
                  {isWar && warMode && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold text-red-300 bg-red-500/15 animate-pulse">
                      ATIVO
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="py-3 px-2 border-t space-y-0.5" style={{ borderColor: 'var(--border-subtle)' }}>
        {BOTTOM.map(item => (
          <button key={item.id} onClick={() => navigate(item.id as any)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              page === item.id ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
            }`}
            style={page === item.id ? { background: 'rgba(99,102,241,0.18)' } : {}}>
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!col && <span className="text-xs">{item.label}</span>}
          </button>
        ))}

        {/* User row */}
        <div className={`flex items-center gap-3 px-3 py-2 mt-1 rounded-lg ${col ? 'justify-center' : ''}`}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!col && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
              </div>
              <button onClick={signOut} title="Sair" className="text-gray-600 hover:text-gray-300 transition-colors text-sm">↩</button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
