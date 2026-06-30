import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useRouter } from '../context/RouterContext';

export function ConfiguracoesPage() {
  const { signOut } = useAuth();
  const { updateProfile } = useUserProfile();
  const { navigate } = useRouter();
  const [notif, setNotif] = useState(true);
  const [som, setSom] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Configurações</h1>

        <div className="space-y-4">
          {[
            { label: 'Notificações diárias', desc: 'Lembrete para estudar todos os dias', val: notif, set: setNotif },
            { label: 'Sons do Pomodoro', desc: 'Toque ao fim de cada sessão', val: som, set: setSom },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-xl glass">
              <div>
                <p className="text-white font-medium text-sm">{item.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
              </div>
              <button onClick={() => item.set(!item.val)}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ background: item.val ? '#6366f1' : 'rgba(255,255,255,0.1)' }}>
                <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: item.val ? 'translateX(20px)' : 'none' }} />
              </button>
            </div>
          ))}

          <div className="p-5 rounded-xl glass">
            <p className="text-white font-medium text-sm mb-3">Refazer onboarding</p>
            <p className="text-gray-400 text-xs mb-3">Redefine seu plano e perfil de estudos</p>
            <button onClick={() => { updateProfile({ onboardingCompleted: false }); navigate('dashboard'); }}
              className="px-4 py-2 rounded-lg text-xs font-medium btn-ghost">
              Refazer questionário inicial
            </button>
          </div>

          <div className="p-5 rounded-xl border border-red-500/20" style={{ background: 'rgba(239,68,68,0.05)' }}>
            <p className="text-white font-medium text-sm mb-3">Sair da conta</p>
            <button onClick={signOut}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all">
              Sair do AprovaIA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
