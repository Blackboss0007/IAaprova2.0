import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';

const MATERIAS_DATA = [
  { nome: 'Direito Constitucional', score: 72, meta: 80, status: 'forte' },
  { nome: 'Direito Penal', score: 65, meta: 75, status: 'media' },
  { nome: 'Processo Penal', score: 58, meta: 75, status: 'fraca' },
  { nome: 'Direito Administrativo', score: 78, meta: 80, status: 'forte' },
  { nome: 'Português', score: 82, meta: 70, status: 'forte' },
  { nome: 'Raciocínio Lógico', score: 55, meta: 70, status: 'fraca' },
  { nome: 'Informática', score: 70, meta: 65, status: 'forte' },
  { nome: 'Legislação Especial', score: 60, meta: 75, status: 'media' },
];

const WEEKLY_EVOLUTION = [48, 55, 62, 58, 70, 68, 75];
const DIAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

function ScoreBar({ score, meta, color }: { score: number; meta: number; color: string }) {
  return (
    <div className="relative h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      {/* Meta marker */}
      <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full -mt-1"
        style={{ left: `${meta}%`, background: 'rgba(255,255,255,0.3)' }} />
    </div>
  );
}

function RadarChart({ data }: { data: typeof MATERIAS_DATA }) {
  const cx = 120, cy = 120, r = 90;
  const n = data.length;
  const points = data.map((d, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const val = d.score / 100;
    return {
      x: cx + r * val * Math.cos(angle),
      y: cy + r * val * Math.sin(angle),
      lx: cx + (r + 18) * Math.cos(angle),
      ly: cy + (r + 18) * Math.sin(angle),
    };
  });

  const polygon = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto">
      {/* Grid circles */}
      {[0.25, 0.5, 0.75, 1].map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r * s} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {/* Axis lines */}
      {data.map((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        return (
          <line key={i} x1={cx} y1={cy}
            x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        );
      })}
      {/* Data polygon */}
      <polygon points={polygon} fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" strokeWidth="1.5" />
      {/* Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={
          data[i].status === 'forte' ? '#10b981' :
          data[i].status === 'fraca' ? '#ef4444' : '#f59e0b'
        } />
      ))}
      {/* Labels - shortened */}
      {data.map((d, i) => (
        <text key={i} x={points[i].lx} y={points[i].ly}
          textAnchor="middle" dominantBaseline="middle"
          fill="rgba(255,255,255,0.4)" fontSize="7">
          {d.nome.split(' ').pop()?.slice(0, 8)}
        </text>
      ))}
    </svg>
  );
}

export function MapaAprovacaoPage() {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'materias' | 'projecao'>('overview');

  const pontuacaoAtual = 68;
  const pontuacaoMeta = 75;
  const chances = 63;
  const nivel = 'Intermediário';
  const diasRestantes = 55;

  const materiasFortes = MATERIAS_DATA.filter(m => m.status === 'forte');
  const materiasFracas = MATERIAS_DATA.filter(m => m.status === 'fraca');

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">Mapa da Aprovação</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#8b5cf6)' }}>PRO</span>
            </div>
            <p className="text-gray-400 text-sm">Sua visão completa de onde você está e o que falta para passar</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">PC-SP — Delegado</p>
            <p className="text-purple-400 text-xs font-medium mt-0.5">{diasRestantes} dias restantes</p>
          </div>
        </div>

        {/* Hero score card */}
        <div className="p-6 rounded-2xl border border-purple-500/20 mb-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.08))' }}>
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 60%)',
            }} />
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main score */}
            <div className="md:col-span-1 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mb-3">
                <svg viewBox="0 0 120 120" className="w-full">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="50" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - pontuacaoAtual / 100)}`}
                    transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{pontuacaoAtual}</span>
                  <span className="text-gray-400 text-xs">/ 100</span>
                </div>
              </div>
              <p className="text-white font-semibold text-sm">Pontuação atual</p>
              <p className="text-gray-400 text-xs mt-0.5">Meta: {pontuacaoMeta} pontos</p>
            </div>

            {/* Chance card */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full p-4 rounded-xl mb-2"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-gray-400 text-xs mb-2">Chance estimada de aprovação</p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-5xl font-bold" style={{
                    background: 'linear-gradient(135deg,#f59e0b,#f97316)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>{chances}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-2 rounded-full transition-all"
                    style={{ width: `${chances}%`, background: 'linear-gradient(90deg,#f59e0b,#f97316)' }} />
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  {chances >= 70 ? '🔥 Excelente! Continue assim.' :
                   chances >= 50 ? '📈 Bom progresso. Foque nas matérias fracas.' :
                   '⚡ Ainda dá tempo. Intensifique os estudos.'}
                </p>
              </div>
            </div>

            {/* Nivel + quick stats */}
            <div className="flex flex-col justify-center gap-3">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-xs text-gray-400 mb-1">Nível atual</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-white font-bold">{nivel}</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {['Iniciante','Intermediário','Avançado','Expert'].map((n, i) => (
                    <div key={n} className="flex-1 h-1 rounded-full"
                      style={{ background: ['Iniciante','Intermediário','Avançado','Expert'].indexOf(nivel) >= i ? '#8b5cf6' : 'rgba(255,255,255,0.08)' }} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.08)' }}>
                  <p className="text-green-400 font-bold">{materiasFortes.length}</p>
                  <p className="text-xs text-gray-400">Fortes</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.08)' }}>
                  <p className="text-red-400 font-bold">{materiasFracas.length}</p>
                  <p className="text-xs text-gray-400">Fracas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            { id: 'overview', label: 'Visão geral' },
            { id: 'materias', label: 'Por matéria' },
            { id: 'projecao', label: 'Projeção' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === t.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
              style={activeTab === t.id ? { background: 'rgba(139,92,246,0.3)' } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar */}
            <div className="p-6 rounded-2xl glass-crystal card-breathe"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-white font-medium text-sm mb-4">Radar de desempenho</h3>
              <RadarChart data={MATERIAS_DATA} />
              <div className="flex justify-center gap-4 mt-3">
                {[['#10b981','Forte'],['#f59e0b','Médio'],['#ef4444','Fraca']].map(([c,l]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                    <span className="text-gray-400 text-xs">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evolução semanal */}
            <div className="p-6 rounded-2xl glass-crystal card-breathe"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-white font-medium text-sm mb-4">Evolução da pontuação</h3>
              <div className="relative h-32 flex items-end gap-2 mb-2">
                {WEEKLY_EVOLUTION.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-gray-500">{v}</span>
                    <div className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${(v / 100) * 120}px`,
                        background: i === WEEKLY_EVOLUTION.length - 1
                          ? 'linear-gradient(180deg,#8b5cf6,#8b5cf6)'
                          : 'rgba(139,92,246,0.25)'
                      }} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-between">
                {DIAS.map((d, i) => <span key={i} className="flex-1 text-center text-[10px] text-gray-500">{d}</span>)}
              </div>

              {/* AI insight */}
              <div className="mt-4 p-3 rounded-lg border border-purple-500/20"
                style={{ background: 'rgba(139,92,246,0.06)' }}>
                <p className="text-purple-300 text-xs font-medium mb-1">💡 Insight da IA</p>
                <p className="text-gray-400 text-xs">Sua pontuação cresceu 27 pontos esta semana. Se mantiver esse ritmo, atingirá a meta em 3 semanas.</p>
              </div>
            </div>

            {/* Priorities */}
            <div className="lg:col-span-2 p-6 rounded-2xl glass-crystal card-breathe"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-white font-medium text-sm mb-4">Prioridades para aprovação</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-red-500/20"
                  style={{ background: 'rgba(239,68,68,0.06)' }}>
                  <p className="text-red-400 text-xs font-medium mb-2">🔴 Urgente — estudar agora</p>
                  {materiasFracas.map(m => (
                    <div key={m.nome} className="flex items-center gap-2 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span className="text-gray-300 text-xs">{m.nome}</span>
                      <span className="ml-auto text-red-400 text-xs">{m.score}%</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl border border-yellow-500/20"
                  style={{ background: 'rgba(245,158,11,0.06)' }}>
                  <p className="text-yellow-400 text-xs font-medium mb-2">🟡 Atenção — melhorar</p>
                  {MATERIAS_DATA.filter(m => m.status === 'media').map(m => (
                    <div key={m.nome} className="flex items-center gap-2 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                      <span className="text-gray-300 text-xs">{m.nome}</span>
                      <span className="ml-auto text-yellow-400 text-xs">{m.score}%</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl border border-green-500/20"
                  style={{ background: 'rgba(16,185,129,0.06)' }}>
                  <p className="text-green-400 text-xs font-medium mb-2">🟢 Fortes — manter</p>
                  {materiasFortes.map(m => (
                    <div key={m.nome} className="flex items-center gap-2 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-gray-300 text-xs">{m.nome}</span>
                      <span className="ml-auto text-green-400 text-xs">{m.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'materias' && (
          <div className="space-y-3">
            {MATERIAS_DATA.sort((a, b) => b.score - a.score).map(m => (
              <div key={m.nome} className="p-5 rounded-2xl glass-crystal card-breathe"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full"
                      style={{ background: m.status === 'forte' ? '#10b981' : m.status === 'fraca' ? '#ef4444' : '#f59e0b' }} />
                    <span className="text-white font-medium text-sm">{m.nome}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">Meta: {m.meta}%</span>
                    <span className="text-sm font-bold" style={{
                      color: m.status === 'forte' ? '#10b981' : m.status === 'fraca' ? '#ef4444' : '#f59e0b'
                    }}>
                      {m.score}%
                    </span>
                  </div>
                </div>
                <ScoreBar score={m.score} meta={m.meta}
                  color={m.status === 'forte' ? '#10b981' : m.status === 'fraca' ? '#ef4444' : '#f59e0b'} />
                <p className="text-gray-500 text-xs mt-2">
                  {m.score >= m.meta
                    ? `✓ ${m.score - m.meta} pontos acima da meta`
                    : `⚡ Faltam ${m.meta - m.score} pontos para a meta`}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'projecao' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-purple-500/20"
              style={{ background: 'rgba(139,92,246,0.06)' }}>
              <h3 className="text-white font-semibold mb-4">📊 Projeção de aprovação</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Se estudar 2h/dia', chance: 45, color: '#ef4444' },
                  { label: 'Se estudar 4h/dia', chance: 63, color: '#f59e0b' },
                  { label: 'Se estudar 6h/dia', chance: 78, color: '#10b981' },
                  { label: 'Se estudar 8h/dia', chance: 91, color: '#8b5cf6' },
                ].map(s => (
                  <div key={s.label} className="p-4 rounded-xl text-center border border-white/[0.06]"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.chance}%</p>
                    <p className="text-gray-400 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl glass-crystal card-breathe">
                <p className="text-white text-sm font-medium mb-2">🎯 Sua projeção atual: 63% de aprovação</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Com 6h/dia de estudo, você tem <strong className="text-purple-300">63% de chance</strong> de aprovação na PC-SP Delegado. Para chegar a 80%+, você precisa elevar Processo Penal e Raciocínio Lógico para pelo menos 70%.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-crystal card-breathe"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-white font-semibold mb-4">📋 Plano de ação IA</h3>
              <div className="space-y-3">
                {[
                  { acao: 'Resolva 20 questões de Processo Penal por dia', impacto: '+8%', prazo: '2 semanas', icon: '📝' },
                  { acao: 'Faça 1 simulado completo por semana', impacto: '+5%', prazo: '1 mês', icon: '📊' },
                  { acao: 'Estude Raciocínio Lógico com exercícios diários', impacto: '+7%', prazo: '3 semanas', icon: '🧠' },
                  { acao: 'Revise Direito Penal com mapas mentais', impacto: '+4%', prazo: '1 semana', icon: '🗺️' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl glass-crystal"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <span className="text-xl flex-shrink-0">{a.icon}</span>
                    <div className="flex-1">
                      <p className="text-gray-200 text-sm">{a.acao}</p>
                      <p className="text-gray-500 text-xs mt-0.5">Prazo: {a.prazo}</p>
                    </div>
                    <span className="text-green-400 text-sm font-bold flex-shrink-0">{a.impacto}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('cronograma')}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#8b5cf6)' }}>
                Gerar cronograma otimizado →
              </button>
              <button onClick={() => navigate('mentor')}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-300 border border-white/[0.08] hover:bg-white/[0.04] transition-all">
                Falar com Mentor IA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
