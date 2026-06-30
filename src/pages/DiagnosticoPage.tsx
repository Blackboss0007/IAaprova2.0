import React from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { useRouter } from '../context/RouterContext';

export function DiagnosticoPage() {
  const { getDiagnostico, profile } = useUserProfile();
  const { navigate } = useRouter();
  const diag = getDiagnostico();

  const hasData = Object.keys(diag.scorePorMateria).length > 0;

  const mockData = [
    { materia: 'Raciocínio Lógico', score: 42, erros: 17, acertos: 12, alerta: true },
    { materia: 'Processo Penal', score: 55, erros: 11, acertos: 13, alerta: true },
    { materia: 'Direito Penal', score: 63, erros: 9, acertos: 15, alerta: false },
    { materia: 'Dir. Constitucional', score: 74, erros: 6, acertos: 17, alerta: false },
    { materia: 'Dir. Administrativo', score: 80, erros: 4, acertos: 16, alerta: false },
    { materia: 'Português', score: 84, erros: 3, acertos: 16, alerta: false },
  ];

  const padroes = [
    { tipo: 'Erro conceitual', desc: 'Você confunde prisão temporária com preventiva em 70% das questões sobre cautelares', materia: 'Processo Penal', icon: '🔴' },
    { tipo: 'Lapso de atenção', desc: 'Erra questões de V/F por não ler "EXCETO" no enunciado', materia: 'Raciocínio Lógico', icon: '🟡' },
    { tipo: 'Lacuna de base', desc: 'Dificuldade em silogismos indica lacuna em lógica proposicional', materia: 'Raciocínio Lógico', icon: '🔴' },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Diagnóstico Inteligente</h1>
          <p className="text-gray-400 text-sm">A Athena identificou padrões de erro e recomendações personalizadas</p>
        </div>

        {/* Padrões de erro */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Padrões identificados</h2>
          <div className="space-y-3">
            {padroes.map((p, i) => (
              <div key={i} className="p-5 rounded-xl glass flex items-start gap-4">
                <span className="text-xl flex-shrink-0">{p.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{p.tipo}</span>
                    <span className="text-xs tag-indigo px-2 py-0.5 rounded-full">{p.materia}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
                <button onClick={() => navigate('mentor')}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium tag-indigo flex-shrink-0">
                  Estudar →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Score por matéria */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Desempenho por matéria</h2>
          <div className="space-y-3">
            {mockData.map((m, i) => (
              <div key={i} className="p-4 rounded-xl glass">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {m.alerta && <span className="text-xs">⚠️</span>}
                    <span className="text-gray-200 text-sm font-medium">{m.materia}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: m.score < 60 ? '#ef4444' : m.score < 75 ? '#f59e0b' : '#10b981' }}>
                    {m.score}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-1.5 rounded-full transition-all" style={{
                    width: `${m.score}%`,
                    background: m.score < 60 ? '#ef4444' : m.score < 75 ? '#f59e0b' : '#10b981'
                  }} />
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span className="text-green-400">✓ {m.acertos} acertos</span>
                  <span className="text-red-400">✗ {m.erros} erros</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendações */}
        <div className="p-6 rounded-2xl border border-indigo-500/20" style={{ background: 'rgba(99,102,241,0.06)' }}>
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl">🦉</span>
            <div>
              <p className="text-indigo-300 font-semibold text-sm">Plano de ação — Athena</p>
              <p className="text-gray-400 text-xs mt-0.5">Com base nos seus erros, esta é a prioridade</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              'Resolva 20 questões de Raciocínio Lógico (silogismos) hoje',
              'Revise as diferenças entre prisão temporária e preventiva',
              'Treine questões V/F com atenção ao "EXCETO" e "NÃO" no enunciado',
              'Use a Athena para tirar dúvidas pontuais sobre cada erro',
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-indigo-400 text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                <p className="text-gray-300 text-sm">{r}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('simulados')}
            className="mt-4 w-full py-3 rounded-xl text-sm font-semibold btn-primary">
            Iniciar simulado focado nos pontos fracos →
          </button>
        </div>
      </div>
    </div>
  );
}
