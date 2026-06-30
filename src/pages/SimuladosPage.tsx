import React, { useState } from 'react';
import { generateSimulado } from '../services/ai';
import type { Questao, SimuladoResultado } from '../types';

const MATERIAS = [
  'Direito Constitucional', 'Direito Penal', 'Processo Penal',
  'Direito Administrativo', 'Direito Civil', 'Direito Tributário',
  'Português', 'Raciocínio Lógico', 'Informática', 'Legislação Especial',
];

type Mode = 'select' | 'loading' | 'quiz' | 'result';

export function SimuladosPage() {
  const [mode, setMode] = useState<Mode>('select');
  const [materia, setMateria] = useState('');
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [resultado, setResultado] = useState<SimuladoResultado | null>(null);
  const [showExplicacoes, setShowExplicacoes] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [historicoSimulados] = useState([
    { materia: 'Direito Constitucional', acertos: 12, total: 15, data: '20/06/2025' },
    { materia: 'Processo Penal', acertos: 10, total: 15, data: '18/06/2025' },
    { materia: 'Português', acertos: 13, total: 15, data: '15/06/2025' },
  ]);

  const iniciarSimulado = async (m: string) => {
    setMateria(m);
    setMode('loading');
    setRespostas({});
    setResultado(null);
    setShowExplicacoes(false);
    try {
      const raw = await generateSimulado(m, 5);
      const clean = raw.replace(/```json|```/g, '').trim();
      const data = JSON.parse(clean);
      setQuestoes(data.questoes || []);
      setStartTime(Date.now());
      setMode('quiz');
    } catch {
      setQuestoes([]);
      setMode('select');
    }
  };

  const responder = (questaoId: number, alt: string) => {
    setRespostas(prev => ({ ...prev, [questaoId]: alt }));
  };

  const finalizar = () => {
    const tempo = Math.floor((Date.now() - startTime) / 1000);
    let acertos = 0;
    questoes.forEach(q => {
      if (respostas[q.id]?.charAt(0) === q.gabarito) acertos++;
    });
    const total = questoes.length;
    setResultado({
      acertos,
      erros: total - acertos,
      total,
      porcentagem: Math.round((acertos / total) * 100),
      tempo,
    });
    setMode('result');
  };

  const respondidas = Object.keys(respostas).length;
  const total = questoes.length;

  if (mode === 'loading') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-green-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-500 animate-spin" />
          <div className="absolute inset-3 flex items-center justify-center text-2xl">📝</div>
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold mb-1">Gerando questões de {materia}</h3>
          <p className="text-gray-400 text-sm">A IA está preparando 5 questões no nível do seu concurso...</p>
        </div>
      </div>
    );
  }

  if (mode === 'quiz') {
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold">{materia}</h2>
              <p className="text-gray-400 text-xs mt-0.5">{respondidas} de {total} respondidas</p>
            </div>
            <button
              onClick={finalizar}
              disabled={respondidas < total}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
              {respondidas < total ? `Responda todas (${total - respondidas} restantes)` : 'Finalizar simulado'}
            </button>
          </div>
          <div className="h-1.5 rounded-full mb-8" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-1.5 rounded-full transition-all" style={{
              width: `${(respondidas / total) * 100}%`,
              background: 'linear-gradient(90deg,#6366f1,#10b981)'
            }} />
          </div>

          <div className="space-y-8">
            {questoes.map((q, qi) => (
              <div key={q.id} className="p-6 rounded-xl border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-start gap-3 mb-5">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.15)' }}>
                    {qi + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        q.dificuldade === 'fácil' ? 'text-green-400' :
                        q.dificuldade === 'médio' ? 'text-yellow-400' : 'text-red-400'
                      }`} style={{ background: 'rgba(255,255,255,0.06)' }}>
                        {q.dificuldade}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{q.enunciado}</p>
                  </div>
                </div>
                <div className="space-y-2 ml-10">
                  {q.alternativas.map((alt, ai) => {
                    const letra = alt.charAt(0);
                    const selecionada = respostas[q.id] === alt;
                    return (
                      <button
                        key={ai}
                        onClick={() => responder(q.id, alt)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                          selecionada
                            ? 'text-indigo-200 border-indigo-500/50'
                            : 'text-gray-300 border-white/[0.06] hover:border-white/[0.12] hover:text-white'
                        }`}
                        style={selecionada ? { background: 'rgba(99,102,241,0.12)' } : { background: 'rgba(255,255,255,0.02)' }}>
                        {alt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={finalizar}
              disabled={respondidas < total}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              {respondidas < total ? `${total - respondidas} questões sem resposta` : '✓ Finalizar e ver resultado'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'result' && resultado) {
    const formatTempo = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Result card */}
          <div className="p-8 rounded-2xl border border-white/[0.06] mb-6 text-center"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: resultado.porcentagem >= 70
                  ? 'rgba(16,185,129,0.12)'
                  : resultado.porcentagem >= 50
                  ? 'rgba(245,158,11,0.12)'
                  : 'rgba(239,68,68,0.12)',
                border: `2px solid ${resultado.porcentagem >= 70 ? '#10b981' : resultado.porcentagem >= 50 ? '#f59e0b' : '#ef4444'}`
              }}>
              <span className="text-3xl font-bold"
                style={{ color: resultado.porcentagem >= 70 ? '#10b981' : resultado.porcentagem >= 50 ? '#f59e0b' : '#ef4444' }}>
                {resultado.porcentagem}%
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {resultado.porcentagem >= 70 ? '🎉 Ótimo resultado!' : resultado.porcentagem >= 50 ? '📚 Continue praticando' : '💪 Hora de revisar'}
            </h2>
            <p className="text-gray-400 text-sm mb-6">{materia}</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)' }}>
                <p className="text-2xl font-bold text-green-400">{resultado.acertos}</p>
                <p className="text-xs text-gray-400 mt-1">Acertos</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)' }}>
                <p className="text-2xl font-bold text-red-400">{resultado.erros}</p>
                <p className="text-xs text-gray-400 mt-1">Erros</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)' }}>
                <p className="text-2xl font-bold text-indigo-400">{formatTempo(resultado.tempo)}</p>
                <p className="text-xs text-gray-400 mt-1">Tempo</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setShowExplicacoes(!showExplicacoes)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border"
              style={{ borderColor: 'rgba(99,102,241,0.3)', color: '#818cf8', background: 'rgba(99,102,241,0.06)' }}>
              {showExplicacoes ? 'Ocultar' : 'Ver'} explicações detalhadas
            </button>
            <button
              onClick={() => iniciarSimulado(materia)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              Refazer simulado
            </button>
            <button
              onClick={() => setMode('select')}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-300 border border-white/[0.08] hover:bg-white/[0.04] transition-all">
              Novo simulado
            </button>
          </div>

          {/* Explicações */}
          {showExplicacoes && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Explicações das questões</h3>
              {questoes.map((q, i) => {
                const resposta = respostas[q.id];
                const acertou = resposta?.charAt(0) === q.gabarito;
                return (
                  <div key={q.id} className="p-5 rounded-xl border"
                    style={{
                      borderColor: acertou ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
                      background: acertou ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)'
                    }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${acertou ? 'text-green-400' : 'text-red-400'}`}>
                        {acertou ? '✓ ACERTOU' : '✗ ERROU'}
                      </span>
                      <span className="text-gray-500 text-xs">Questão {i + 1}</span>
                    </div>
                    <p className="text-gray-200 text-sm mb-3 leading-relaxed">{q.enunciado}</p>
                    {!acertou && (
                      <div className="flex items-center gap-2 text-xs text-red-400 mb-2">
                        <span>Sua resposta:</span>
                        <span className="font-bold">{resposta || 'Não respondida'}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-green-400 mb-3">
                      <span>Gabarito:</span>
                      <span className="font-bold">{q.gabarito}</span>
                    </div>
                    <div className="p-3 rounded-lg text-xs text-gray-300 leading-relaxed"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      💡 {q.explicacao}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Select
  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Simulados</h1>
          <p className="text-gray-400 text-sm">Questões geradas por IA no nível da sua banca. Pratique e veja sua evolução.</p>
        </div>

        {/* Histórico */}
        {historicoSimulados.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 mb-3">Seus últimos simulados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {historicoSimulados.map((h, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/[0.06]"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium truncate">{h.materia}</span>
                    <span className="text-xs text-gray-500">{h.data}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-1.5 rounded-full"
                        style={{
                          width: `${(h.acertos / h.total) * 100}%`,
                          background: h.acertos / h.total >= 0.7 ? '#10b981' : '#f59e0b'
                        }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: h.acertos / h.total >= 0.7 ? '#10b981' : '#f59e0b' }}>
                      {Math.round((h.acertos / h.total) * 100)}%
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{h.acertos}/{h.total} acertos</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-sm font-medium text-gray-400 mb-3">Escolha a matéria</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {MATERIAS.map(m => (
            <button
              key={m}
              onClick={() => iniciarSimulado(m)}
              className="p-4 rounded-xl border border-white/[0.06] text-left hover:border-indigo-500/30 transition-all group"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-2xl mb-2 block">
                {m.includes('Constitucional') ? '⚖️' :
                 m.includes('Penal') ? '🔒' :
                 m.includes('Administrativo') ? '🏛️' :
                 m.includes('Civil') ? '📜' :
                 m.includes('Português') ? '✍️' :
                 m.includes('Raciocínio') ? '🧠' :
                 m.includes('Informática') ? '💻' : '📚'}
              </span>
              <p className="text-white text-xs font-medium group-hover:text-indigo-300 transition-colors leading-snug">{m}</p>
              <p className="text-gray-500 text-[10px] mt-1">5 questões · IA</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
