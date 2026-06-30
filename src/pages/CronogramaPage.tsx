import React, { useState } from 'react';
import { generateCronograma } from '../services/ai';

const CONCURSOS = [
  'PC-SP — Delegado de Polícia', 'PC-SP — Investigador', 'PM-SP — Oficial',
  'PM-SP — Soldado', 'TJ-SP — Escrevente', 'TCE — Auditor', 'AGU — Procurador',
  'TRF — Analista Judiciário', 'Receita Federal — AFRFB', 'INSS — Técnico',
  'Defensoria Pública — Defensor', 'MP — Promotor', 'OAB — 1ª Fase', 'ENEM',
];

const MATERIAS_COMUNS = [
  'Direito Constitucional', 'Direito Penal', 'Processo Penal',
  'Direito Administrativo', 'Direito Civil', 'Processo Civil',
  'Português', 'Raciocínio Lógico', 'Informática', 'Redação',
  'Direito Tributário', 'Direito do Trabalho', 'Legislação Especial',
];

const TIPO_COLORS: Record<string, string> = {
  estudo: '#6366f1',
  revisao: '#f59e0b',
  simulado: '#10b981',
  descanso: '#6b7280',
};

const TIPO_LABELS: Record<string, string> = {
  estudo: 'Estudo',
  revisao: 'Revisão',
  simulado: 'Simulado',
  descanso: 'Descanso',
};

export function CronogramaPage() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [concurso, setConcurso] = useState('');
  const [dataProva, setDataProva] = useState('');
  const [horasDia, setHorasDia] = useState(4);
  const [materiasDificeis, setMateriasDificeis] = useState<string[]>([]);
  const [cronograma, setCronograma] = useState<any>(null);
  const [activeSemana, setActiveSemana] = useState(0);

  const toggleMateria = (m: string) => {
    setMateriasDificeis(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    );
  };

  const gerarCronograma = async () => {
    if (!concurso || !dataProva) return;
    setStep('loading');
    try {
      const raw = await generateCronograma({ concurso, dataProva, horasDia, materiasDificeis });
      const clean = raw.replace(/```json|```/g, '').trim();
      const data = JSON.parse(clean);
      setCronograma(data);
      setStep('result');
    } catch {
      setCronograma(null);
      setStep('form');
    }
  };

  const diasProva = dataProva
    ? Math.ceil((new Date(dataProva).getTime() - Date.now()) / 86400000)
    : null;

  if (step === 'loading') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
          <div className="absolute inset-3 flex items-center justify-center text-2xl">📅</div>
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold mb-2">Gerando seu cronograma personalizado</h3>
          <p className="text-gray-400 text-sm">A IA está analisando seu perfil e criando o melhor plano para você...</p>
        </div>
        <div className="flex gap-2">
          {['Analisando edital...', 'Calculando distribuição...', 'Otimizando revisões...'].map((t, i) => (
            <div key={i} className="text-xs px-3 py-1 rounded-full border border-white/[0.06] text-gray-400 animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}>{t}</div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'result' && cronograma) {
    const semana = cronograma.semanas?.[activeSemana];
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => setStep('form')} className="text-gray-400 hover:text-white text-sm transition-colors">← Voltar</button>
              </div>
              <h1 className="text-2xl font-bold text-white">Cronograma Personalizado</h1>
              <p className="text-gray-400 text-sm mt-1">{concurso} · {diasProva ? `${diasProva} dias restantes` : ''}</p>
            </div>
            <button
              onClick={() => setStep('form')}
              className="px-4 py-2 rounded-lg text-xs font-medium text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 transition-all">
              Refazer cronograma
            </button>
          </div>

          {/* Strategy banner */}
          {cronograma.estrategia && (
            <div className="p-5 rounded-xl border border-indigo-500/20 mb-6"
              style={{ background: 'rgba(99,102,241,0.06)' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-indigo-300 font-medium text-sm mb-1">Estratégia da IA</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{cronograma.estrategia}</p>
                </div>
              </div>
            </div>
          )}

          {/* Week tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {cronograma.semanas?.map((_: any, i: number) => (
              <button key={i} onClick={() => setActiveSemana(i)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeSemana === i
                    ? 'text-white'
                    : 'text-gray-400 border border-white/[0.06] hover:text-gray-200'
                }`}
                style={activeSemana === i ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}>
                Semana {i + 1}
              </button>
            ))}
          </div>

          {/* Week focus */}
          {semana && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium text-indigo-300 px-3 py-1 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.12)' }}>
                  Foco: {semana.foco}
                </span>
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {semana.dias?.map((dia: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl border border-white/[0.06]"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium text-sm">{dia.dia}</h4>
                      <span className="text-xs text-gray-500">
                        {dia.atividades?.reduce((acc: number, a: any) => acc + (a.duracao || 0), 0)} min
                      </span>
                    </div>
                    <div className="space-y-2">
                      {dia.atividades?.map((at: any, j: number) => (
                        <div key={j} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: TIPO_COLORS[at.tipo] || '#6366f1' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-200 text-xs font-medium truncate">{at.materia}</p>
                            <p className="text-gray-500 text-[10px]">{TIPO_LABELS[at.tipo]} · {at.duracao}min</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Tips */}
          {cronograma.dicas?.length > 0 && (
            <div className="p-5 rounded-xl border border-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-white font-semibold text-sm mb-3">💡 Dicas da IA para seu sucesso</h3>
              <div className="space-y-2">
                {cronograma.dicas.map((d: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 text-xs mt-0.5 flex-shrink-0">→</span>
                    <p className="text-gray-300 text-sm">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Cronograma IA</h1>
          <p className="text-gray-400 text-sm">Responda algumas perguntas e a IA vai montar o plano de estudos ideal para você</p>
        </div>

        <div className="space-y-6">
          {/* Concurso */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Qual concurso você vai fazer?</label>
            <select
              value={concurso}
              onChange={e => setConcurso(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white border outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', appearance: 'none' }}>
              <option value="">Selecione o concurso</option>
              {CONCURSOS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Data da prova */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Data prevista da prova</label>
            <input
              type="date"
              value={dataProva}
              onChange={e => setDataProva(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white border outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', colorScheme: 'dark' }}
            />
            {diasProva !== null && diasProva > 0 && (
              <p className="text-indigo-400 text-xs mt-1.5">📅 {diasProva} dias até a prova</p>
            )}
          </div>

          {/* Horas por dia */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Horas disponíveis por dia: <span className="text-indigo-400">{horasDia}h</span>
            </label>
            <input
              type="range"
              min={1} max={12} value={horasDia}
              onChange={e => setHorasDia(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1h</span><span>6h</span><span>12h</span>
            </div>
          </div>

          {/* Matérias difíceis */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Quais matérias são mais difíceis para você? <span className="text-gray-500">(selecione todas)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {MATERIAS_COMUNS.map(m => (
                <button
                  key={m}
                  onClick={() => toggleMateria(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    materiasDificeis.includes(m)
                      ? 'text-indigo-200 border-indigo-500/50'
                      : 'text-gray-400 border-white/[0.08] hover:text-gray-200'
                  }`}
                  style={materiasDificeis.includes(m) ? { background: 'rgba(99,102,241,0.15)' } : {}}>
                  {materiasDificeis.includes(m) ? '✓ ' : ''}{m}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={gerarCronograma}
            disabled={!concurso || !dataProva}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            ✨ Gerar meu cronograma com IA
          </button>
        </div>
      </div>
    </div>
  );
}
