import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { useRouter } from '../context/RouterContext';

interface Revisao {
  materia: string;
  topico: string;
  urgencia: 'critica' | 'alta' | 'media';
  tempoEstimado: number;
}

interface MetaDiaria {
  descricao: string;
  tipo: 'simulado' | 'revisao' | 'questoes' | 'pomodoro';
  concluida: boolean;
}

export function SalaDeGuerraPage() {
  const { profile } = useUserProfile();
  const { navigate } = useRouter();
  const [countdown, setCountdown] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const [metasDiarias, setMetasDiarias] = useState<MetaDiaria[]>([
    { descricao: 'Simulado de 20 questões (Direito Constitucional)', tipo: 'simulado', concluida: false },
    { descricao: 'Revisão: Atos Administrativos (Direito Administrativo)', tipo: 'revisao', concluida: true },
    { descricao: 'Resolver 30 questões de Processo Penal', tipo: 'questoes', concluida: false },
    { descricao: '3 sessões Pomodoro (Raciocínio Lógico)', tipo: 'pomodoro', concluida: false },
    { descricao: 'Flashcards: Princípios Constitucionais (30 cards)', tipo: 'revisao', concluida: true },
  ]);

  const revisoesPrioritarias: Revisao[] = [
    { materia: 'Processo Penal', topico: 'Prisões cautelares e medidas alternativas', urgencia: 'critica', tempoEstimado: 90 },
    { materia: 'Raciocínio Lógico', topico: 'Silogismos e proposições', urgencia: 'critica', tempoEstimado: 60 },
    { materia: 'Direito Penal', topico: 'Concurso de crimes e pena', urgencia: 'alta', tempoEstimado: 75 },
    { materia: 'Direito Constitucional', topico: 'Remédios constitucionais', urgencia: 'alta', tempoEstimado: 45 },
    { materia: 'Português', topico: 'Coesão e coerência textual', urgencia: 'media', tempoEstimado: 60 },
  ];

  const diasRestantes = profile.diasRestantes ?? 15;
  const modoIntensivo = diasRestantes <= 30;

  useEffect(() => {
    if (!profile.dataProva) return;
    const update = () => {
      const diff = new Date(profile.dataProva).getTime() - Date.now();
      if (diff <= 0) { setCountdown({ dias: 0, horas: 0, minutos: 0, segundos: 0 }); return; }
      setCountdown({
        dias: Math.floor(diff / 86400000),
        horas: Math.floor((diff % 86400000) / 3600000),
        minutos: Math.floor((diff % 3600000) / 60000),
        segundos: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [profile.dataProva]);

  const progresso = metasDiarias.filter(m => m.concluida).length;
  const total = metasDiarias.length;

  const urgenciaConfig = {
    critica: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)', label: 'CRÍTICO', border: 'rgba(239,68,68,0.25)' },
    alta: { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', label: 'ALTA', border: 'rgba(245,158,11,0.25)' },
    media: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', label: 'MÉDIA', border: 'rgba(139,92,246,0.25)' },
  };

  const tipoIcon = { simulado: '📝', revisao: '📖', questoes: '❓', pomodoro: '🍅' };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">Sala de Guerra</h1>
              {modoIntensivo && (
                <span className="text-xs px-2.5 py-1 rounded-full font-bold animate-pulse"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                  ⚡ MODO INTENSIVO
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">{profile.nomeConcurso || 'Sua prova está chegando'} — foco total.</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">Progresso hoje</p>
            <p className="text-white font-bold text-lg">{progresso}/{total}</p>
          </div>
        </div>

        {/* COUNTDOWN — Hero */}
        <div className="p-6 rounded-2xl mb-6 relative overflow-hidden noise-overlay reveal"
          style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(139,92,246,0.08) 100%)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #ef4444, transparent 60%)' }} />
          <div className="relative">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">Tempo até a prova</p>
            <div className="flex items-end gap-4 md:gap-8">
              {[
                { value: countdown.dias, label: 'Dias' },
                { value: countdown.horas, label: 'Horas' },
                { value: countdown.minutos, label: 'Min' },
                { value: countdown.segundos, label: 'Seg' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-6xl font-bold text-white font-mono tabular-nums leading-none"
                    style={{ textShadow: '0 0 30px rgba(239,68,68,0.3)' }}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-gray-500 text-xs mt-2 uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
              <div className="flex-1 hidden md:block" />
              <div className="text-right hidden md:block">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-gray-400 text-xs mb-1">Para passar você precisa</p>
                  <p className="text-white font-bold text-2xl">70%</p>
                  <p className="text-gray-400 text-xs mt-0.5">de aproveitamento</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metas diárias */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-sm">Metas de hoje</h2>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${(progresso / total) * 100}%`, background: 'linear-gradient(90deg,#8b5cf6,#10b981)' }} />
                </div>
                <span className="text-xs text-gray-400">{progresso}/{total}</span>
              </div>
            </div>

            <div className="space-y-2">
              {metasDiarias.map((meta, i) => (
                <div key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${meta.concluida ? 'opacity-50' : 'card-hover'}`}
                  style={{
                    background: meta.concluida ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.025)',
                    borderColor: meta.concluida ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)'
                  }}>
                  <button
                    onClick={() => setMetasDiarias(prev => prev.map((m, j) => j === i ? { ...m, concluida: !m.concluida } : m))}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      meta.concluida ? 'bg-green-500 border-green-500' : 'border-gray-600 hover:border-purple-400'
                    }`}>
                    {meta.concluida && <span className="text-white text-xs font-bold">✓</span>}
                  </button>
                  <span className="text-lg flex-shrink-0">{tipoIcon[meta.tipo]}</span>
                  <p className={`flex-1 text-sm ${meta.concluida ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                    {meta.descricao}
                  </p>
                  {!meta.concluida && (
                    <button
                      onClick={() => navigate(meta.tipo === 'simulado' ? 'simulados' : meta.tipo === 'pomodoro' ? 'pomodoro' : 'mentor')}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all tag-indigo flex-shrink-0">
                      Iniciar →
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Simulados recomendados */}
            <div className="p-5 rounded-xl glass mt-2">
              <h3 className="text-white font-semibold text-sm mb-3">📊 Simulados recomendados para hoje</h3>
              <div className="space-y-2">
                {[
                  { materia: 'Processo Penal', questoes: 20, tempo: '30 min', prioridade: '🔴' },
                  { materia: 'Raciocínio Lógico', questoes: 15, tempo: '25 min', prioridade: '🔴' },
                  { materia: 'Dir. Constitucional', questoes: 20, tempo: '30 min', prioridade: '🟡' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span>{s.prioridade}</span>
                    <div className="flex-1">
                      <p className="text-gray-200 text-xs font-medium">{s.materia}</p>
                      <p className="text-gray-500 text-[10px]">{s.questoes} questões · {s.tempo}</p>
                    </div>
                    <button onClick={() => navigate('simulados')}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all tag-indigo">
                      Fazer →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revisões prioritárias */}
          <div className="space-y-4">
            <h2 className="text-white font-semibold text-sm">Revisões prioritárias</h2>
            <div className="space-y-2">
              {revisoesPrioritarias.map((r, i) => {
                const cfg = urgenciaConfig[r.urgencia];
                return (
                  <div key={i} className="p-4 rounded-xl transition-all"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                      <span className="text-gray-500 text-[10px]">{r.tempoEstimado}min</span>
                    </div>
                    <p className="text-white text-xs font-medium">{r.materia}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5 leading-relaxed">{r.topico}</p>
                    <button onClick={() => navigate('mentor')}
                      className="mt-2 text-[10px] font-medium hover:opacity-80 transition-opacity"
                      style={{ color: cfg.color }}>
                      Estudar com Athena →
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Athena tip */}
            <div className="p-4 rounded-xl border border-purple-500/20"
              style={{ background: 'rgba(139,92,246,0.06)' }}>
              <div className="flex items-start gap-2">
                <span>🦉</span>
                <div>
                  <p className="text-purple-300 text-xs font-semibold mb-1">Athena diz:</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Faltando {diasRestantes} dias, o maior erro é tentar aprender matéria nova. Foque em <strong className="text-white">consolidar o que já estudou</strong> com revisões e muitas questões.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
