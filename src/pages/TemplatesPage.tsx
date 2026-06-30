import React, { useState } from 'react';
import { sendMessage } from '../services/ai';

type TemplateType = 'flashcard' | 'resumo' | 'mapa-mental' | 'questoes-rapidas';

const MATERIAS = ['Direito Constitucional','Direito Penal','Processo Penal','Direito Administrativo','Português','Raciocínio Lógico','Informática','Direito Civil','Direito Tributário'];

interface Flashcard { pergunta: string; resposta: string; nivel: 'facil'|'medio'|'dificil'; }
interface Resumo { titulo: string; topicos: { titulo: string; conteudo: string }[]; dicas: string[]; }

const TEMPLATE_TYPES = [
  { id: 'flashcard', label: 'Flashcards', icon: '🃏', desc: 'Cards de memorização com repetição espaçada' },
  { id: 'resumo', label: 'Resumo Inteligente', icon: '📋', desc: 'Síntese estruturada com pontos principais' },
  { id: 'mapa-mental', label: 'Mapa Mental', icon: '🧠', desc: 'Diagrama visual de conceitos conectados' },
  { id: 'questoes-rapidas', label: 'Quiz Rápido', icon: '⚡', desc: '10 perguntas rápidas para testar o que aprendeu' },
];

function FlashcardView({ cards }: { cards: Flashcard[] }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [resultados, setResultados] = useState<Record<number, 'acertou'|'errou'>>({});

  const card = cards[idx];
  const done = Object.keys(resultados).length === cards.length;

  const responder = (r: 'acertou'|'errou') => {
    setResultados(prev => ({ ...prev, [idx]: r }));
    setFlipped(false);
    if (idx < cards.length - 1) setTimeout(() => setIdx(i => i + 1), 300);
  };

  if (done) {
    const acertos = Object.values(resultados).filter(r => r === 'acertou').length;
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
          style={{ background: 'rgba(16,185,129,0.12)' }}>🎉</div>
        <div className="text-center">
          <h3 className="text-white font-bold text-xl mb-1">{Math.round((acertos/cards.length)*100)}% de acerto</h3>
          <p className="text-gray-400 text-sm">{acertos}/{cards.length} flashcards acertados</p>
        </div>
        <button onClick={() => { setIdx(0); setFlipped(false); setResultados({}); }}
          className="px-6 py-3 rounded-xl text-sm font-semibold btn-primary">
          Reiniciar baralho
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-xs">{idx + 1}/{cards.length}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${card.nivel === 'facil' ? 'tag-green' : card.nivel === 'medio' ? 'tag-amber' : 'tag-red'}`}>
          {card.nivel}
        </span>
      </div>

      {/* Card flip */}
      <div className="cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div className={`relative p-8 rounded-2xl border text-center transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center ${
          resultados[idx] === 'acertou' ? 'border-green-500/30' : resultados[idx] === 'errou' ? 'border-red-500/30' : 'border-white/[0.06]'
        }`}
          style={{ background: flipped ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.025)' }}>
          {!flipped ? (
            <>
              <p className="text-gray-400 text-xs mb-4 uppercase tracking-wider">Pergunta</p>
              <p className="text-white font-medium text-base leading-relaxed">{card.pergunta}</p>
              <p className="text-indigo-400 text-xs mt-6">Clique para ver a resposta</p>
            </>
          ) : (
            <>
              <p className="text-indigo-400 text-xs mb-4 uppercase tracking-wider">Resposta</p>
              <p className="text-gray-200 text-sm leading-relaxed">{card.resposta}</p>
            </>
          )}
        </div>
      </div>

      {flipped && !resultados[idx] && (
        <div className="flex gap-3 mt-4">
          <button onClick={() => responder('errou')}
            className="flex-1 py-3 rounded-xl text-sm font-medium tag-red transition-all hover:opacity-80">
            ✗ Errei
          </button>
          <button onClick={() => responder('acertou')}
            className="flex-1 py-3 rounded-xl text-sm font-medium tag-green transition-all hover:opacity-80">
            ✓ Acertei
          </button>
        </div>
      )}

      {/* Progress dots */}
      <div className="flex gap-1 justify-center mt-4 flex-wrap">
        {cards.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full"
            style={{ background: resultados[i] === 'acertou' ? '#10b981' : resultados[i] === 'errou' ? '#ef4444' : i === idx ? '#6366f1' : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>
    </div>
  );
}

function ResumoView({ resumo }: { resumo: Resumo }) {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h3 className="text-white font-bold text-lg">{resumo.titulo}</h3>
      {resumo.topicos.map((t, i) => (
        <div key={i} className="p-5 rounded-xl glass">
          <h4 className="text-indigo-300 font-semibold text-sm mb-2">{t.titulo}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{t.conteudo}</p>
        </div>
      ))}
      {resumo.dicas?.length > 0 && (
        <div className="p-5 rounded-xl border border-amber-500/20" style={{ background: 'rgba(245,158,11,0.06)' }}>
          <p className="text-amber-300 font-semibold text-sm mb-3">💡 Pontos que caem em prova</p>
          {resumo.dicas.map((d, i) => (
            <div key={i} className="flex items-start gap-2 mt-1.5">
              <span className="text-amber-400 text-xs mt-0.5">→</span>
              <p className="text-gray-300 text-xs">{d}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MapaMentalView({ materia, topicos }: { materia: string; topicos: string[] }) {
  const cx = 200, cy = 160;
  const colors = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899'];
  const n = topicos.length;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 400 320" className="w-full max-w-lg">
        {topicos.map((t, i) => {
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          const r = 110;
          const tx = cx + r * Math.cos(angle);
          const ty = cy + r * Math.sin(angle);
          const color = colors[i % colors.length];
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={tx} y2={ty} stroke={color} strokeWidth="1.5" strokeOpacity="0.4" />
              <ellipse cx={tx} cy={ty} rx={48} ry={16} fill={color} fillOpacity="0.15" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
              <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="7.5" fontWeight="500">
                {t.length > 16 ? t.slice(0, 14) + '..' : t}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={44} fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.6" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="9" fontWeight="700">{materia.split(' ')[0]}</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="white" fontSize="9" fontWeight="700">{materia.split(' ').slice(1).join(' ').slice(0,12)}</text>
      </svg>
      <div className="grid grid-cols-2 gap-2 w-full max-w-md mt-2">
        {topicos.map((t, i) => (
          <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg glass">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
            <span className="text-gray-300 text-xs">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TemplatesPage() {
  const [tipo, setTipo] = useState<TemplateType>('flashcard');
  const [materia, setMateria] = useState('Direito Constitucional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const gerar = async () => {
    setLoading(true);
    setResult(null);
    try {
      let prompt = '';
      if (tipo === 'flashcard') {
        prompt = `Crie 8 flashcards sobre os tópicos mais importantes e mais cobrados em concursos públicos de ${materia}. 
Responda APENAS com JSON válido sem markdown: {"flashcards": [{"pergunta": "...", "resposta": "...", "nivel": "facil|medio|dificil"}]}`;
      } else if (tipo === 'resumo') {
        prompt = `Crie um resumo inteligente e estruturado sobre ${materia} para concursos públicos.
Responda APENAS com JSON válido sem markdown: {"titulo": "...", "topicos": [{"titulo": "...", "conteudo": "..."}], "dicas": ["ponto que cai em prova..."]}`;
      } else if (tipo === 'mapa-mental') {
        prompt = `Liste os 8 principais subtópicos de ${materia} para concursos públicos.
Responda APENAS com JSON válido sem markdown: {"topicos": ["subtopico1", "subtopico2", ...]}`;
      } else {
        prompt = `Crie 6 perguntas rápidas de V/F ou múltipla escolha sobre ${materia} para concursos.
Responda APENAS com JSON válido sem markdown: {"questoes": [{"pergunta": "...", "resposta": "...", "explicacao": "..."}]}`;
      }

      const raw = await sendMessage([{ role: 'user', content: prompt }], 'Você é especialista em concursos públicos brasileiros. Responda apenas com JSON válido, sem markdown ou texto extra.');
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch {
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Templates Inteligentes</h1>
          <p className="text-gray-400 text-sm">Conteúdo gerado por IA adaptado para sua banca e concurso</p>
        </div>

        {/* Tipo selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {TEMPLATE_TYPES.map(t => (
            <button key={t.id} onClick={() => { setTipo(t.id as TemplateType); setResult(null); }}
              className={`p-4 rounded-xl text-left transition-all border ${tipo === t.id ? 'border-indigo-500/50' : 'glass card-hover'}`}
              style={tipo === t.id ? { background: 'rgba(99,102,241,0.12)' } : {}}>
              <span className="text-2xl block mb-2">{t.icon}</span>
              <p className={`font-medium text-xs ${tipo === t.id ? 'text-indigo-300' : 'text-gray-300'}`}>{t.label}</p>
              <p className="text-gray-500 text-[10px] mt-0.5 leading-snug">{t.desc}</p>
            </button>
          ))}
        </div>

        {/* Matéria + gerar */}
        <div className="flex gap-3 mb-8">
          <select value={materia} onChange={e => { setMateria(e.target.value); setResult(null); }}
            className="flex-1 px-4 py-3 rounded-xl text-sm input-dark"
            style={{ appearance: 'none' }}>
            {MATERIAS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <button onClick={gerar} disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-semibold btn-primary whitespace-nowrap">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando...
              </span>
            ) : `✨ Gerar ${TEMPLATE_TYPES.find(t => t.id === tipo)?.label}`}
          </button>
        </div>

        {/* Result */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
              <div className="absolute inset-2 flex items-center justify-center text-xl">{TEMPLATE_TYPES.find(t=>t.id===tipo)?.icon}</div>
            </div>
            <p className="text-gray-400 text-sm">Athena está criando seu {TEMPLATE_TYPES.find(t=>t.id===tipo)?.label.toLowerCase()}...</p>
          </div>
        )}

        {result && !result.error && (
          <div className="animate-in fade-in">
            {tipo === 'flashcard' && result.flashcards && <FlashcardView cards={result.flashcards} />}
            {tipo === 'resumo' && result.titulo && <ResumoView resumo={result} />}
            {tipo === 'mapa-mental' && result.topicos && <MapaMentalView materia={materia} topicos={result.topicos} />}
            {tipo === 'questoes-rapidas' && result.questoes && (
              <div className="max-w-2xl mx-auto space-y-3">
                {result.questoes.map((q: any, i: number) => (
                  <details key={i} className="p-4 rounded-xl glass">
                    <summary className="text-gray-200 text-sm font-medium cursor-pointer list-none flex items-center justify-between">
                      <span>{q.pergunta}</span>
                      <span className="text-indigo-400 text-xs ml-3 flex-shrink-0">ver resposta</span>
                    </summary>
                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                      <p className="text-green-400 text-sm font-semibold mb-1">✓ {q.resposta}</p>
                      <p className="text-gray-400 text-xs leading-relaxed">{q.explicacao}</p>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        )}

        {!result && !loading && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl">{TEMPLATE_TYPES.find(t => t.id === tipo)?.icon}</span>
            <p className="text-white font-medium">Escolha uma matéria e gere seu {TEMPLATE_TYPES.find(t => t.id === tipo)?.label.toLowerCase()}</p>
            <p className="text-gray-500 text-sm">A Athena vai adaptar o conteúdo para o nível e banca do seu concurso</p>
          </div>
        )}
      </div>
    </div>
  );
}
