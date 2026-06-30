import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

const WEEKLY_DATA = [45, 60, 30, 75, 90, 55, 80];
const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = (value / max) * 100;
  const today = new Date().getDay();
  const dayIdx = today === 0 ? 6 : today - 1;
  const isToday = WEEKLY_DATA.indexOf(value) === dayIdx;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-6 h-16 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="absolute bottom-0 left-0 right-0 rounded-full transition-all"
          style={{
            height: `${pct}%`,
            background: isToday ? 'linear-gradient(180deg,#c084fc,#8b5cf6)' : 'rgba(139,92,246,0.35)'
          }}
        />
      </div>
      <span className="text-[10px] text-gray-500">{DAYS[WEEKLY_DATA.indexOf(value)]}</span>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();

  const stats = [
    { label: 'Dias estudados', value: '34', unit: 'dias', icon: '🔥', color: '#f59e0b', trend: '+3 esta semana' },
    { label: 'Horas totais', value: '142', unit: 'horas', icon: '⏱️', color: '#8b5cf6', trend: '+8h esta semana' },
    { label: 'Sequência atual', value: '7', unit: 'dias', icon: '⚡', color: '#10b981', trend: 'Recorde: 12 dias' },
    { label: 'Simulados feitos', value: '18', unit: 'total', icon: '📝', color: '#8b5cf6', trend: '74% aproveitamento' },
  ];

  const activities = [
    { tipo: 'Simulado', descricao: 'Direito Constitucional — 15 questões', tempo: '2h atrás', acerto: '80%', icon: '📝', color: '#8b5cf6' },
    { tipo: 'Pomodoro', descricao: 'Direito Penal — 3 sessões', tempo: '5h atrás', acerto: null, icon: '⏱️', color: '#10b981' },
    { tipo: 'Mentor IA', descricao: 'Dúvida sobre ato administrativo', tempo: 'ontem', acerto: null, icon: '🤖', color: '#8b5cf6' },
    { tipo: 'Cronograma', descricao: 'Plano da semana atualizado', tempo: '2 dias atrás', acerto: null, icon: '📅', color: '#f59e0b' },
  ];

  const quickActions = [
    { label: 'Novo simulado', icon: '📝', page: 'simulados', desc: 'Testar conhecimentos' },
    { label: 'Falar com mentor', icon: '🤖', page: 'mentor', desc: 'Tirar dúvidas com IA' },
    { label: 'Iniciar pomodoro', icon: '⏱️', page: 'pomodoro', desc: 'Sessão de foco' },
    { label: 'Ver mapa', icon: '🗺️', page: 'mapa-aprovacao', desc: 'Chance de aprovação' },
  ];

  const metaDiaria = 75; // percent

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 reveal">
          <div>
            <p className="text-gray-400 text-sm mb-1">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="text-2xl font-bold text-white">
              Olá, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {user?.objetivo || 'Defina seu objetivo no perfil'}
            </p>
          </div>
          {/* Meta diária */}
          <div className="hidden md:block p-4 rounded-2xl glass-crystal card-breathe text-right"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-xs text-gray-400 mb-2">Meta diária</p>
            <div className="flex items-center gap-2 justify-end mb-1.5">
              <span className="text-white font-semibold text-sm">{metaDiaria}%</span>
            </div>
            <div className="w-32 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-2 rounded-full" style={{ width: `${metaDiaria}%`, background: 'linear-gradient(90deg,#8b5cf6,#8b5cf6)' }} />
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5">4.5h / 6h estudadas hoje</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="p-5 rounded-2xl glass-crystal card-breathe reveal"
              style={{ background: 'rgba(255,255,255,0.02)', animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{s.icon}</span>
                <span className="text-[10px] text-gray-500 text-right">{s.trend}</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-white">{s.value}</span>
                <span className="text-gray-400 text-sm mb-1">{s.unit}</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl glass-crystal card-breathe"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-semibold text-sm">Evolução semanal</h3>
                <p className="text-gray-400 text-xs mt-0.5">Minutos estudados por dia</p>
              </div>
              <span className="text-xs text-purple-400 font-medium">Esta semana ↑ 18%</span>
            </div>
            <div className="flex items-end gap-3 h-20">
              {WEEKLY_DATA.map((v, i) => (
                <MiniBar key={i} value={v} max={Math.max(...WEEKLY_DATA)} />
              ))}
            </div>
          </div>

          {/* Next revision */}
          <div className="p-6 rounded-2xl glass-crystal card-breathe"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <h3 className="text-white font-semibold text-sm mb-4">Próximas revisões</h3>
            <div className="space-y-3">
              {[
                { materia: 'Dir. Constitucional', urgencia: 'hoje', dot: '#ef4444' },
                { materia: 'Processo Penal', urgencia: 'amanhã', dot: '#f59e0b' },
                { materia: 'Dir. Administrativo', urgencia: 'em 3 dias', dot: '#10b981' },
                { materia: 'Português', urgencia: 'em 5 dias', dot: '#8b5cf6' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.dot }} />
                  <span className="text-gray-300 text-xs flex-1">{r.materia}</span>
                  <span className="text-gray-500 text-xs">{r.urgencia}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('cronograma')}
              className="mt-4 w-full py-2 rounded-lg text-xs font-medium text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 transition-all">
              Ver cronograma completo
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {quickActions.map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.page as any)}
              className="p-4 rounded-2xl glass-crystal card-breathe btn-magnetic text-left hover:border-purple-500/30 transition-all group"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-2xl mb-2 block">{a.icon}</span>
              <p className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors">{a.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">{a.desc}</p>
            </button>
          ))}
        </div>

        {/* Recent activity */}
        <div className="p-6 rounded-2xl glass-crystal card-breathe"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h3 className="text-white font-semibold text-sm mb-4">Atividades recentes</h3>
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${a.color}18` }}>
                  <span className="text-base">{a.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{a.tipo}</span>
                    {a.acerto && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                        {a.acerto}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{a.descricao}</p>
                </div>
                <span className="text-gray-600 text-xs flex-shrink-0">{a.tempo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
