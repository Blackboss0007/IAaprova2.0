import React, { useState } from 'react';
import { useUserProfile, TipoProva, Banca, NivelAtual } from '../context/UserProfileContext';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';

const TIPO_PROVA_OPTIONS: { id: TipoProva; label: string; icon: string; desc: string }[] = [
  { id: 'concurso_policial', label: 'Concurso Policial', icon: '👮', desc: 'PC, PM, PF, PRF, PCDF' },
  { id: 'concurso_federal', label: 'Concurso Federal', icon: '🏛️', desc: 'TCU, AGU, Receita Federal, INSS' },
  { id: 'concurso_estadual', label: 'Concurso Estadual', icon: '⚖️', desc: 'TJ, MP, Defensoria, Tribunais' },
  { id: 'enem', label: 'ENEM', icon: '📚', desc: 'Exame Nacional do Ensino Médio' },
  { id: 'vestibular', label: 'Vestibular', icon: '🎓', desc: 'FUVEST, UNICAMP, UNESP e outros' },
  { id: 'oab', label: 'OAB', icon: '⚖️', desc: '1ª e 2ª Fases da OAB' },
];

const BANCAS: Banca[] = ['CESPE/Cebraspe', 'FCC', 'FGV', 'VUNESP', 'IBFC', 'Quadrix', 'AOCP', 'NC-UFPR', 'não sei'];

const MATERIAS_POR_TIPO: Record<TipoProva, string[]> = {
  concurso_policial: ['Direito Constitucional', 'Direito Penal', 'Processo Penal', 'Direito Administrativo', 'Português', 'Raciocínio Lógico', 'Informática', 'Legislação Especial', 'Criminologia', 'Medicina Legal'],
  concurso_federal: ['Direito Constitucional', 'Direito Administrativo', 'Português', 'Raciocínio Lógico', 'Direito Tributário', 'Informática', 'Contabilidade', 'Direito Civil', 'Redação', 'Atualidades'],
  concurso_estadual: ['Direito Constitucional', 'Direito Administrativo', 'Processo Civil', 'Processo Penal', 'Direito Civil', 'Direito Penal', 'Português', 'Raciocínio Lógico'],
  enem: ['Matemática', 'Português e Literatura', 'Ciências da Natureza', 'Ciências Humanas', 'Redação', 'Atualidades'],
  vestibular: ['Matemática', 'Português', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Redação', 'Inglês'],
  oab: ['Direito Constitucional', 'Direito Civil', 'Processo Civil', 'Direito Penal', 'Processo Penal', 'Direito Empresarial', 'Direito Tributário', 'Direito Administrativo', 'Ética OAB', 'Estatuto da OAB'],
  outro: ['Português', 'Matemática', 'Raciocínio Lógico', 'Informática', 'Atualidades'],
};

const NIVEL_OPTIONS: { id: NivelAtual; label: string; desc: string; icon: string }[] = [
  { id: 'iniciante', label: 'Iniciante', desc: 'Começando agora, pouco ou nenhum estudo anterior', icon: '🌱' },
  { id: 'basico', label: 'Básico', desc: 'Já estudei um pouco mas sem metodologia', icon: '📖' },
  { id: 'intermediario', label: 'Intermediário', desc: 'Tenho base sólida, mas ainda cometo erros', icon: '🎯' },
  { id: 'avancado', label: 'Avançado', desc: 'Já fiz provas antes e sei onde preciso melhorar', icon: '🚀' },
];

const STEPS = [
  { id: 1, title: 'Olá! Eu sou a Athena.', subtitle: 'Vou ser sua mentora pessoal de aprovação.' },
  { id: 2, title: 'Qual é o seu objetivo?', subtitle: 'Seja específico — isso vai personalizar tudo.' },
  { id: 3, title: 'Qual tipo de prova?', subtitle: 'Escolha a categoria principal.' },
  { id: 4, title: 'Data e disponibilidade', subtitle: 'Quanto tempo você tem e como usar.' },
  { id: 5, title: 'Diagnóstico inicial', subtitle: 'Onde você está agora.' },
  { id: 6, title: 'Plano gerado ✨', subtitle: 'A Athena criou seu plano personalizado.' },
];

export function OnboardingPage() {
  const { completeOnboarding } = useUserProfile();
  const { navigate } = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    objetivo: '',
    nomeConcurso: '',
    tipoProva: '' as TipoProva,
    banca: 'CESPE/Cebraspe' as Banca,
    dataProva: '',
    horasDia: 4,
    nivelAtual: '' as NivelAtual,
    materiasDificeis: [] as string[],
    materiasFortes: [] as string[],
  });

  const materias = data.tipoProva ? MATERIAS_POR_TIPO[data.tipoProva] : MATERIAS_POR_TIPO['concurso_policial'];
  const diasRestantes = data.dataProva ? Math.ceil((new Date(data.dataProva).getTime() - Date.now()) / 86400000) : null;

  const toggleMateria = (m: string, tipo: 'dificeis' | 'fortes') => {
    const key = tipo === 'dificeis' ? 'materiasDificeis' : 'materiasFortes';
    const removeKey = tipo === 'dificeis' ? 'materiasFortes' : 'materiasDificeis';
    setData(prev => {
      const list = prev[key];
      const removeList = prev[removeKey];
      return {
        ...prev,
        [key]: list.includes(m) ? list.filter(x => x !== m) : [...list, m],
        [removeKey]: removeList.filter(x => x !== m),
      };
    });
  };

  const finish = () => {
    completeOnboarding(data);
    navigate('dashboard');
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left — Athena panel */}
      <div className="hidden lg:flex flex-col w-80 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a0a18 0%, #110d2e 60%, #0d1a2e 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, #6366f1 0%, transparent 60%)' }} />

        <div className="relative z-10 flex flex-col h-full px-8 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-brand">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-white font-semibold">AprovaIA</span>
          </div>

          {/* Athena avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.3)' }}>
                🦉
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2"
                style={{ borderColor: '#0a0a18' }} />
            </div>
            <h3 className="text-white font-semibold">Athena</h3>
            <p className="text-indigo-300 text-xs">Sua mentora de aprovação</p>
          </div>

          {/* Athena message */}
          <div className="p-4 rounded-xl border border-indigo-500/20 mb-8"
            style={{ background: 'rgba(99,102,241,0.08)' }}>
            <p className="text-gray-300 text-sm leading-relaxed">
              {step === 1 && `Olá, ${user?.name?.split(' ')[0] || 'futuro aprovado'}! Vou conhecer seu perfil para montar um plano de estudos cirúrgico. Responda com honestidade — quanto mais preciso, mais eficaz será seu plano.`}
              {step === 2 && 'Defina seu objetivo com clareza. Candidatos com objetivos específicos têm 3x mais chances de aprovação do que aqueles que estudam "de forma geral".'}
              {step === 3 && 'Cada tipo de prova tem um DNA diferente. A CESPE testa raciocínio; a FCC testa decoreba. Vou calibrar tudo para o seu formato.'}
              {step === 4 && 'Tempo é o seu ativo mais precioso. Vou distribuir as matérias de forma inteligente com base na data da prova e nas horas disponíveis.'}
              {step === 5 && 'Diagnóstico honesto é o começo de toda aprovação. Não existe matéria fácil ou difícil — existe o que você já domina e o que ainda vai dominar.'}
              {step === 6 && 'Plano pronto! Analisei seu perfil e criei uma rota personalizada para sua aprovação. Vamos começar?'}
            </p>
          </div>

          {/* Steps tracker */}
          <div className="mt-auto space-y-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className={`flex items-center gap-3 py-1.5 ${step === s.id ? 'opacity-100' : step > s.id ? 'opacity-60' : 'opacity-30'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  step > s.id ? 'bg-green-500' : step === s.id ? 'gradient-brand' : 'border border-white/20'
                }`}>
                  {step > s.id ? '✓' : <span className="text-white">{i + 1}</span>}
                </div>
                <span className={`text-xs ${step === s.id ? 'text-white font-medium' : 'text-gray-400'}`}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-col flex-1 px-6 py-8 overflow-y-auto">
        {/* Progress bar */}
        <div className="max-w-xl mx-auto w-full mb-8">
          <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-1 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Etapa {step} de {STEPS.length}</span>
            <span className="text-xs text-gray-500">{Math.round(progress)}% completo</span>
          </div>
        </div>

        <div className="max-w-xl mx-auto w-full flex-1">
          {/* Step header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">{STEPS[step - 1].title}</h2>
            <p className="text-gray-400 text-sm">{STEPS[step - 1].subtitle}</p>
          </div>

          {/* STEP 1 — Welcome */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-indigo-500/20 text-center"
                style={{ background: 'rgba(99,102,241,0.06)' }}>
                <div className="text-5xl mb-4">🦉</div>
                <h3 className="text-white font-bold text-xl mb-2">Bem-vindo ao AprovaIA</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                  Vou criar um plano de aprovação personalizado para você em menos de 2 minutos. Precisarei de algumas informações sobre seus objetivos e disponibilidade.
                </p>
              </div>
              {[
                { icon: '🗺️', title: 'Mapa da Aprovação', desc: 'Visualize sua probabilidade real de passar' },
                { icon: '📅', title: 'Cronograma Inteligente', desc: 'Plano diário gerado pela Athena para você' },
                { icon: '⚔️', title: 'Sala de Guerra', desc: 'Modo intensivo quando a prova está chegando' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl glass card-hover">
                  <span className="text-2xl flex-shrink-0">{f.icon}</span>
                  <div>
                    <p className="text-white font-medium text-sm">{f.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => setStep(2)} className="w-full py-3.5 rounded-xl text-sm font-semibold btn-primary mt-2">
                Começar meu plano →
              </button>
            </div>
          )}

          {/* STEP 2 — Objetivo */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Qual cargo/prova você quer passar?</label>
                <input
                  type="text"
                  value={data.nomeConcurso}
                  onChange={e => setData(p => ({ ...p, nomeConcurso: e.target.value, objetivo: e.target.value }))}
                  placeholder="Ex: Delegado de Polícia SP, ENEM 2025, OAB 1ª Fase..."
                  className="w-full px-4 py-3 rounded-xl text-sm input-dark"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-3">Banca organizadora</label>
                <div className="grid grid-cols-3 gap-2">
                  {BANCAS.map(b => (
                    <button key={b} onClick={() => setData(p => ({ ...p, banca: b }))}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        data.banca === b ? 'tag-indigo' : 'glass btn-ghost'
                      }`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(3)} disabled={!data.nomeConcurso}
                className="w-full py-3.5 rounded-xl text-sm font-semibold btn-primary">
                Continuar →
              </button>
            </div>
          )}

          {/* STEP 3 — Tipo de prova */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {TIPO_PROVA_OPTIONS.map(t => (
                  <button key={t.id} onClick={() => setData(p => ({ ...p, tipoProva: t.id }))}
                    className={`p-4 rounded-xl text-left transition-all border ${
                      data.tipoProva === t.id
                        ? 'border-indigo-500/50 text-white'
                        : 'glass card-hover text-gray-400'
                    }`}
                    style={data.tipoProva === t.id ? { background: 'rgba(99,102,241,0.12)' } : {}}>
                    <span className="text-2xl block mb-2">{t.icon}</span>
                    <p className="font-medium text-sm">{t.label}</p>
                    <p className="text-xs opacity-60 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(4)} disabled={!data.tipoProva}
                className="w-full py-3.5 rounded-xl text-sm font-semibold btn-primary">
                Continuar →
              </button>
            </div>
          )}

          {/* STEP 4 — Data e horas */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Data prevista da prova</label>
                <input type="date" value={data.dataProva}
                  onChange={e => setData(p => ({ ...p, dataProva: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm input-dark"
                  style={{ colorScheme: 'dark' }} />
                {diasRestantes !== null && diasRestantes > 0 && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg tag-indigo text-xs">
                    <span>📅</span>
                    <span>{diasRestantes} dias até a prova — {diasRestantes < 30 ? '⚡ Modo intensivo recomendado!' : diasRestantes < 90 ? '🎯 Fase de consolidação' : '📚 Fase de construção'}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Horas de estudo por dia: <span className="text-indigo-400 font-bold">{data.horasDia}h</span>
                </label>
                <input type="range" min={1} max={12} value={data.horasDia}
                  onChange={e => setData(p => ({ ...p, horasDia: Number(e.target.value) }))}
                  className="w-full accent-indigo-500 mb-2" />
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { h: 2, label: 'Leve', desc: 'Trabalhador/a' },
                    { h: 5, label: 'Moderado', desc: 'Dedicado/a' },
                    { h: 8, label: 'Intenso', desc: 'Full time' },
                  ].map(opt => (
                    <button key={opt.h} onClick={() => setData(p => ({ ...p, horasDia: opt.h }))}
                      className={`p-3 rounded-lg text-center text-xs transition-all ${data.horasDia === opt.h ? 'tag-indigo' : 'glass btn-ghost'}`}>
                      <p className="font-bold">{opt.h}h/dia</p>
                      <p className="opacity-70 mt-0.5">{opt.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(5)} disabled={!data.dataProva}
                className="w-full py-3.5 rounded-xl text-sm font-semibold btn-primary">
                Continuar →
              </button>
            </div>
          )}

          {/* STEP 5 — Diagnóstico */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-3">Seu nível atual de conhecimento</label>
                <div className="space-y-2">
                  {NIVEL_OPTIONS.map(n => (
                    <button key={n.id} onClick={() => setData(p => ({ ...p, nivelAtual: n.id }))}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all border ${
                        data.nivelAtual === n.id ? 'border-indigo-500/50' : 'glass'
                      }`}
                      style={data.nivelAtual === n.id ? { background: 'rgba(99,102,241,0.10)' } : {}}>
                      <span className="text-2xl flex-shrink-0">{n.icon}</span>
                      <div>
                        <p className={`font-medium text-sm ${data.nivelAtual === n.id ? 'text-indigo-300' : 'text-gray-300'}`}>{n.label}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{n.desc}</p>
                      </div>
                      {data.nivelAtual === n.id && <span className="ml-auto text-indigo-400">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-3">
                  Matérias mais difíceis para você <span className="text-gray-500">(selecione todas)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {materias.map(m => {
                    const isDificil = data.materiasDificeis.includes(m);
                    const isForte = data.materiasFortes.includes(m);
                    return (
                      <button key={m} onClick={() => toggleMateria(m, isDificil ? 'dificeis' : 'dificeis')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isDificil ? 'tag-red' : 'glass btn-ghost'}`}>
                        {isDificil ? '⚠️ ' : ''}{m}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => setStep(6)} disabled={!data.nivelAtual}
                className="w-full py-3.5 rounded-xl text-sm font-semibold btn-primary">
                ✨ Gerar meu plano personalizado
              </button>
            </div>
          )}

          {/* STEP 6 — Plan generated */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-indigo-500/20"
                style={{ background: 'rgba(99,102,241,0.06)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.15)' }}>🦉</div>
                  <div>
                    <p className="text-indigo-300 font-semibold text-sm mb-2">Athena analisou seu perfil</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {data.nomeConcurso && `Para o ${data.nomeConcurso}, `}com {data.horasDia}h/dia de estudo
                      {diasRestantes ? ` e ${diasRestantes} dias até a prova` : ''}, criei um plano personalizado focado em aprovação eficiente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Concurso', value: data.nomeConcurso || 'Definido', icon: '🎯' },
                  { label: 'Dias restantes', value: diasRestantes ? `${diasRestantes} dias` : 'A definir', icon: '📅' },
                  { label: 'Horas/dia', value: `${data.horasDia}h de estudo`, icon: '⏱️' },
                  { label: 'Nível', value: NIVEL_OPTIONS.find(n => n.id === data.nivelAtual)?.label || '', icon: '📊' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl glass">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{item.icon}</span>
                      <span className="text-gray-400 text-xs">{item.label}</span>
                    </div>
                    <p className="text-white font-semibold text-sm truncate">{item.value}</p>
                  </div>
                ))}
              </div>

              {data.materiasDificeis.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-500/20 tag-amber text-xs">
                  <p className="font-semibold mb-1">⚡ Foco inicial recomendado:</p>
                  <p>{data.materiasDificeis.slice(0, 3).join(', ')} — estas serão priorizadas no seu cronograma.</p>
                </div>
              )}

              <button onClick={finish}
                className="w-full py-4 rounded-xl text-sm font-bold btn-primary text-base">
                🚀 Entrar na plataforma
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
