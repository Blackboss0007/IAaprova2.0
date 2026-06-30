import React, { useState, useEffect, useRef } from 'react';

type TimerMode = '25min' | '50min' | 'custom';

const PRESETS = [
  { id: '25min', label: 'Pomodoro', duration: 25, icon: '🍅', desc: 'Clássico 25 min' },
  { id: '50min', label: 'Pomodoro Pro', duration: 50, icon: '💪', desc: 'Foco avançado 50 min' },
  { id: 'custom', label: 'Personalizado', duration: 0, icon: '⚙️', desc: 'Defina seu tempo' },
] as const;

const MATERIAS = [
  'Direito Constitucional', 'Direito Penal', 'Processo Penal',
  'Direito Administrativo', 'Português', 'Raciocínio Lógico',
  'Informática', 'Redação', 'Revisão geral',
];

interface Session {
  id: string;
  materia: string;
  duracao: number;
  completado: boolean;
  data: string;
}

export function PomodoroPage() {
  const [mode, setMode] = useState<TimerMode>('25min');
  const [customMin, setCustomMin] = useState(30);
  const [materia, setMateria] = useState('Direito Constitucional');
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [sessoes, setSessoes] = useState<Session[]>([
    { id: '1', materia: 'Direito Penal', duracao: 25, completado: true, data: '20/06' },
    { id: '2', materia: 'Processo Penal', duracao: 25, completado: true, data: '20/06' },
    { id: '3', materia: 'Direito Constitucional', duracao: 50, completado: true, data: '19/06' },
  ]);
  const [completedToday, setCompletedToday] = useState(2);
  const intervalRef = useRef<number | null>(null);

  const totalSeconds = mode === '25min' ? 25 * 60 : mode === '50min' ? 50 * 60 : customMin * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  const resetTimer = (m: TimerMode, cust: number = customMin) => {
    const dur = m === '25min' ? 25 * 60 : m === '50min' ? 50 * 60 : cust * 60;
    setSeconds(dur);
    setRunning(false);
    setPhase('focus');
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    resetTimer(mode);
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setCompletedToday(c => c + 1);
            const sess: Session = {
              id: Date.now().toString(),
              materia,
              duracao: mode === 'custom' ? customMin : parseInt(mode),
              completado: true,
              data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            };
            setSessoes(prev => [sess, ...prev]);
            setPhase('break');
            const breakDur = 5 * 60;
            return breakDur;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const circumference = 2 * Math.PI * 100;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Pomodoro</h1>
          <p className="text-gray-400 text-sm">Sessões de foco cronometradas para maximizar sua produtividade</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Timer */}
          <div className="lg:col-span-3">
            {/* Presets */}
            <div className="flex gap-2 mb-6">
              {PRESETS.map(p => (
                <button key={p.id} onClick={() => { setMode(p.id as TimerMode); }}
                  className={`flex-1 py-3 rounded-xl text-xs font-medium transition-all border ${
                    mode === p.id
                      ? 'text-white border-indigo-500/50'
                      : 'text-gray-400 border-white/[0.06] hover:text-gray-200'
                  }`}
                  style={mode === p.id ? { background: 'rgba(99,102,241,0.15)' } : {}}>
                  <div className="text-lg mb-0.5">{p.icon}</div>
                  <div>{p.label}</div>
                </button>
              ))}
            </div>

            {/* Custom input */}
            {mode === 'custom' && (
              <div className="flex items-center gap-3 mb-6 p-4 rounded-xl border border-white/[0.06]">
                <span className="text-gray-300 text-sm">Minutos:</span>
                <input
                  type="number" min={1} max={120} value={customMin}
                  onChange={e => { setCustomMin(Number(e.target.value)); resetTimer('custom', Number(e.target.value)); }}
                  className="w-24 px-3 py-2 rounded-lg text-white text-sm text-center border outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                />
                <span className="text-gray-400 text-xs">= {fmt(customMin * 60)}</span>
              </div>
            )}

            {/* Matéria */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-300 mb-2">Estudando agora</label>
              <select
                value={materia}
                onChange={e => setMateria(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white border outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', appearance: 'none' }}>
                {MATERIAS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Phase badge */}
            {phase === 'break' && (
              <div className="mb-4 px-4 py-2 rounded-lg border border-green-500/30 text-green-400 text-sm text-center"
                style={{ background: 'rgba(16,185,129,0.08)' }}>
                ☕ Pausa de 5 minutos — você merece!
              </div>
            )}

            {/* Circle timer */}
            <div className="flex flex-col items-center">
              <div className="relative w-56 h-56 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle
                    cx="110" cy="110" r="100" fill="none"
                    stroke={phase === 'break' ? '#10b981' : '#6366f1'}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white font-mono">{fmt(seconds)}</span>
                  <span className="text-gray-400 text-xs mt-1">{phase === 'focus' ? materia.split(' ')[0] : 'Pausa'}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => resetTimer(mode)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white border border-white/[0.08] hover:bg-white/[0.06] transition-all">
                  ↺
                </button>
                <button
                  onClick={() => setRunning(!running)}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                  style={{ background: running ? 'rgba(239,68,68,0.8)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                  {running ? '⏸' : '▶'}
                </button>
                <button
                  onClick={() => { setRunning(false); setPhase('focus'); resetTimer(mode); }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white border border-white/[0.08] hover:bg-white/[0.06] transition-all">
                  ⏹
                </button>
              </div>
            </div>
          </div>

          {/* Stats panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Today stats */}
            <div className="p-5 rounded-xl border border-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-white font-medium text-sm mb-4">Hoje</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(99,102,241,0.08)' }}>
                  <p className="text-2xl font-bold text-indigo-400">{completedToday}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Sessões</p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)' }}>
                  <p className="text-2xl font-bold text-green-400">{completedToday * 25}min</p>
                  <p className="text-xs text-gray-400 mt-0.5">Focado</p>
                </div>
              </div>

              {/* Pomodoro dots */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Sessões completadas</p>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{ background: i < completedToday ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)' }}>
                      {i < completedToday ? '🍅' : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* History */}
            <div className="p-5 rounded-xl border border-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-white font-medium text-sm mb-4">Histórico</h3>
              <div className="space-y-2">
                {sessoes.slice(0, 5).map(s => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-base">🍅</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-xs font-medium truncate">{s.materia}</p>
                      <p className="text-gray-500 text-[10px]">{s.duracao} min · {s.data}</p>
                    </div>
                    <span className="text-green-400 text-xs font-medium">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="p-4 rounded-xl border border-amber-500/20"
              style={{ background: 'rgba(245,158,11,0.06)' }}>
              <p className="text-amber-300 text-xs font-medium mb-1">💡 Dica do mentor</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Após 4 pomodoros, faça uma pausa longa de 20-30 min. Isso consolida o aprendizado na memória de longo prazo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
