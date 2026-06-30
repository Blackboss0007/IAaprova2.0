// ─────────────────────────────────────────────
// AprovaIA — Serviço de IA (Anthropic Claude)
// ─────────────────────────────────────────────
// IMPORTANTE: Chamadas diretas ao browser são bloqueadas por CORS.
// O projeto usa respostas mock de alta qualidade que funcionam
// sem configuração. Para IA real, adicione VITE_ANTHROPIC_API_KEY
// e um proxy backend (ex: Vercel Functions /api/chat).
// ─────────────────────────────────────────────

const API_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ANTHROPIC_API_KEY) || '';
const API_URL = 'https://api.anthropic.com/v1/messages';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendMessage(
  messages: ChatMessage[],
  systemPrompt: string,
  _onChunk?: (chunk: string) => void
): Promise<string> {
  if (!API_KEY) {
    return getMockResponse(messages[messages.length - 1]?.content || '');
  }
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    });
    if (!response.ok) return getMockResponse(messages[messages.length - 1]?.content || '');
    const data = await response.json();
    return data.content?.[0]?.text || getMockResponse(messages[messages.length - 1]?.content || '');
  } catch {
    return getMockResponse(messages[messages.length - 1]?.content || '');
  }
}

export async function generateSimulado(materia: string, _quantidade = 5): Promise<string> {
  if (!API_KEY) return getMockSimulado(materia);
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Crie 5 questões de múltipla escolha sobre ${materia} para concursos públicos brasileiros. Responda APENAS com JSON válido, sem markdown:\n{"questoes":[{"id":1,"enunciado":"...","alternativas":["A)...","B)...","C)...","D)...","E)..."],"gabarito":"A","explicacao":"...","materia":"${materia}","dificuldade":"médio"}]}`,
        }],
      }),
    });
    if (!response.ok) return getMockSimulado(materia);
    const data = await response.json();
    return data.content?.[0]?.text || getMockSimulado(materia);
  } catch {
    return getMockSimulado(materia);
  }
}

export async function generateCronograma(params: {
  concurso: string; dataProva: string; horasDia: number; materiasDificeis: string[];
}): Promise<string> {
  if (!API_KEY) return getMockCronograma(params.concurso);
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Crie um cronograma de estudos para:\nConcurso: ${params.concurso}\nData: ${params.dataProva}\nHoras/dia: ${params.horasDia}\nDifíceis: ${params.materiasDificeis.join(', ')}\n\nResponda APENAS com JSON válido sem markdown:\n{"semanas":[{"semana":1,"foco":"...","dias":[{"dia":"Segunda","atividades":[{"materia":"...","tipo":"estudo","duracao":60,"descricao":"..."}]}]}],"estrategia":"...","dicas":["..."]}`,
        }],
      }),
    });
    if (!response.ok) return getMockCronograma(params.concurso);
    const data = await response.json();
    return data.content?.[0]?.text || getMockCronograma(params.concurso);
  } catch {
    return getMockCronograma(params.concurso);
  }
}

// ─── Mock responses de alta qualidade ───────

function getMockResponse(input: string): string {
  const q = input.toLowerCase();
  if (q.includes('cronograma') || q.includes('plano') || q.includes('organizar')) {
    return `## Plano de Estudos Personalizado 📚

**Distribuição semanal recomendada:**

**Segunda e Quarta:** Direito Constitucional (2h) + Direito Penal (1h)
**Terça e Quinta:** Direito Administrativo (2h) + Processo Penal (1h)
**Sexta:** Revisão geral + resolução de questões (2h)
**Sábado:** Simulado completo (3h)
**Domingo:** Descanso e revisão leve (1h)

### Princípios fundamentais:
- Use a técnica Pomodoro para manter o foco
- Priorize resolução de questões anteriores
- Faça revisões espaçadas a cada 7 dias
- Durma bem — consolida a memória

Quer que eu detalhe alguma matéria específica?`;
  }
  if (q.includes('legalidade')) {
    return `## Princípio da Legalidade ⚖️

**Conceito essencial:** Ninguém é obrigado a fazer ou deixar de fazer algo senão em virtude de lei (art. 5º, II, CF/88).

**A distinção que cai em prova:**
- **Particular:** pode tudo que a lei não proíbe
- **Administração Pública:** só pode o que a lei expressamente permite

**A analogia:** O particular é como morador em casa própria — faz o que quiser dentro do permitido. O servidor público é como funcionário de banco — segue o manual, sem inventar.

**Pegadinha clássica da banca:** Afirmar que a Administração "pode fazer o que a lei não proíbe". **ERRADO.** Ela precisa de autorização legal expressa.

---

### 📌 Resumo
- Particular: proibido só o que a lei proibir
- Administração: permitido só o que a lei autorizar
- Base: art. 5º, II c/c art. 37, caput, CF/88

### 🎯 Exercício
Um servidor criou benefício salarial sem previsão legal, por considerá-lo justo. Isso é:
A) Lícito, pois não havia lei proibindo
B) Ilícito, pois a Administração só faz o que a lei autoriza
C) Lícito, pela boa-fé do servidor
D) Depende de aprovação posterior

*Responda antes de ver o gabarito!*

### ➡️ Próximo passo
Leia o art. 37 da CF/88 e resolva 10 questões CESPE sobre princípio da legalidade.`;
  }
  if (q.includes('desmotiv') || q.includes('desanim') || q.includes('não consigo') || q.includes('difícil')) {
    return `Entendo exatamente o que você está sentindo. Isso faz parte do processo — todo candidato aprovado passou por esse momento.

**Vamos olhar os dados reais:**

A diferença entre quem passa e quem não passa raramente é inteligência. É **consistência**. Candidatos que estudam 3h por dia durante 6 meses superam quem estuda 12h por semana sem regularidade.

**O que fazer agora:**
1. Pare de estudar por 30 minutos
2. Faça algo que você goste
3. Volte com UMA matéria só, por 25 minutos (Pomodoro)
4. Resolva apenas 5 questões — não mais

**Memento:** Você já chegou até aqui. Isso já te coloca à frente de 70% das pessoas que desistiram antes de começar.

Me conta: qual matéria está travando mais? Vamos resolver juntos.`;
  }
  return `## Olá! Sou a Athena, sua mentora de aprovação 🦉

Estou aqui para te ajudar a conquistar sua aprovação com estratégia e inteligência.

**Como posso te ajudar agora:**

📚 **Explico qualquer matéria** — do básico ao avançado, com analogias e exemplos reais
📋 **Monto sua estratégia** — plano semanal, revisões espaçadas, foco no que cai
📝 **Analiso seus erros** — identifico padrões e mostro como corrigir
🎯 **Calibro para sua banca** — CESPE, FCC, FGV, VUNESP têm estilos diferentes
💪 **Te motivo com dados** — não com frases vazias

**Qual é a sua dúvida hoje?** Me faz a pergunta — pode ser conteúdo, estratégia ou planejamento.`;
}

function getMockSimulado(materia: string): string {
  return JSON.stringify({
    questoes: [
      {
        id: 1,
        enunciado: `Acerca de ${materia}, assinale a alternativa CORRETA:`,
        alternativas: [
          'A) A Constituição Federal de 1988 adota o sistema parlamentarista de governo.',
          'B) A Constituição Federal de 1988 adota o sistema presidencialista de governo.',
          'C) O controle de constitucionalidade difuso é exclusivo do STF.',
          'D) Os direitos fundamentais têm caráter meramente programático.',
          'E) A separação de poderes não é cláusula pétrea.',
        ],
        gabarito: 'B',
        explicacao: 'O art. 76 da CF/88 adota expressamente o presidencialismo. O controle difuso pode ser exercido por qualquer juízo. Os direitos fundamentais têm aplicabilidade imediata (art. 5º, §1º). A separação de poderes é cláusula pétrea (art. 60, §4º, III).',
        materia, dificuldade: 'médio',
      },
      {
        id: 2,
        enunciado: `Em relação aos princípios de ${materia}, é INCORRETO afirmar que:`,
        alternativas: [
          'A) O princípio da publicidade admite exceções previstas em lei.',
          'B) A moralidade administrativa é pressuposto de validade dos atos.',
          'C) A eficiência foi inserida pela EC nº 19/1998.',
          'D) A impessoalidade proíbe qualquer tipo de tratamento diferenciado.',
          'E) A legalidade vincula toda a Administração Pública.',
        ],
        gabarito: 'D',
        explicacao: 'A impessoalidade não proíbe todo tratamento diferenciado — apenas o favoritismo ou perseguição pessoal. Diferenciações baseadas em critérios objetivos e legais são permitidas (ações afirmativas, cotas etc.).',
        materia, dificuldade: 'difícil',
      },
      {
        id: 3,
        enunciado: `Sobre ${materia}, analise:\nI. A competência é elemento vinculado do ato administrativo.\nII. O motivo e objeto podem ser discricionários.\nIII. A forma é sempre livre na Administração Pública.`,
        alternativas: [
          'A) Apenas I está correta.',
          'B) Apenas I e II estão corretas.',
          'C) Apenas II e III estão corretas.',
          'D) Todas estão corretas.',
          'E) Nenhuma está correta.',
        ],
        gabarito: 'B',
        explicacao: 'A competência (I) é sempre vinculada por lei. O motivo e objeto (II) podem ser discricionários onde a lei permite margem de escolha. A forma (III) não é livre — em regra deve ser escrita e motivada.',
        materia, dificuldade: 'difícil',
      },
      {
        id: 4,
        enunciado: `O prazo prescricional para ações civis contra a Fazenda Pública, conforme o Decreto nº 20.910/1932, é de:`,
        alternativas: ['A) 1 ano', 'B) 2 anos', 'C) 5 anos', 'D) 10 anos', 'E) 20 anos'],
        gabarito: 'C',
        explicacao: 'O Decreto nº 20.910/1932 estabelece prescrição de 5 anos para dívidas passivas da Fazenda Pública. Esse prazo é aplicado às ações civis em geral, conforme entendimento consolidado nos tribunais.',
        materia, dificuldade: 'fácil',
      },
      {
        id: 5,
        enunciado: `Julgue: "O direito de petição pode ser exercido por pessoa jurídica, nacional ou estrangeira."`,
        alternativas: [
          'A) Certo — o art. 5º, XXXIV, não distingue pessoa física de jurídica.',
          'B) Errado — é exclusivo de pessoas físicas brasileiras.',
          'C) Certo — mas somente por empresas públicas.',
          'D) Errado — apenas cidadãos no gozo de direitos políticos.',
          'E) Certo — desde que representada por advogado.',
        ],
        gabarito: 'A',
        explicacao: 'O STF já reconheceu que o direito de petição (art. 5º, XXXIV, "a") pode ser exercido por pessoa física ou jurídica, nacional ou estrangeira, pois a Constituição não faz distinção.',
        materia, dificuldade: 'médio',
      },
    ],
  });
}

function getMockCronograma(concurso: string): string {
  return JSON.stringify({
    semanas: [{
      semana: 1,
      foco: 'Base constitucional e revisão geral',
      dias: [
        { dia: 'Segunda', atividades: [{ materia: 'Direito Constitucional', tipo: 'estudo', duracao: 120, descricao: 'Princípios fundamentais e direitos individuais (art. 1º–17)' }, { materia: 'Português', tipo: 'estudo', duracao: 60, descricao: 'Gramática e interpretação de texto' }] },
        { dia: 'Terça', atividades: [{ materia: 'Direito Administrativo', tipo: 'estudo', duracao: 120, descricao: 'Atos administrativos e poderes da administração' }, { materia: 'Questões', tipo: 'simulado', duracao: 60, descricao: '20 questões de Direito Constitucional' }] },
        { dia: 'Quarta', atividades: [{ materia: 'Direito Penal', tipo: 'estudo', duracao: 120, descricao: 'Teoria do crime e tipicidade' }, { materia: 'Revisão', tipo: 'revisao', duracao: 60, descricao: 'Mapa mental do conteúdo da semana' }] },
        { dia: 'Quinta', atividades: [{ materia: 'Processo Penal', tipo: 'estudo', duracao: 120, descricao: 'Inquérito policial e ação penal' }, { materia: 'Português', tipo: 'estudo', duracao: 60, descricao: 'Redação técnica e coesão textual' }] },
        { dia: 'Sexta', atividades: [{ materia: 'Revisão Geral', tipo: 'revisao', duracao: 120, descricao: 'Flashcards e mapas mentais de toda a semana' }, { materia: 'Questões', tipo: 'simulado', duracao: 60, descricao: '30 questões mistas — foco nos pontos fracos' }] },
        { dia: 'Sábado', atividades: [{ materia: 'Simulado Completo', tipo: 'simulado', duracao: 180, descricao: 'Simulado com 40 questões no tempo real da prova' }] },
        { dia: 'Domingo', atividades: [{ materia: 'Descanso Ativo', tipo: 'descanso', duracao: 60, descricao: 'Revisão leve + descanso mental obrigatório' }] },
      ],
    }],
    estrategia: `Para ${concurso}, resolução de questões é o diferencial. Foque em 60% do tempo em questões e 40% em revisão. Evite estudar matéria nova na semana da prova.`,
    dicas: [
      'Priorize os temas com maior incidência histórica da banca',
      'Faça ao menos um simulado completo por semana com cronômetro',
      'Revise as questões erradas no dia seguinte — nunca deixe para depois',
      'Constância supera intensidade: 3h/dia todos os dias > 8h só no fim de semana',
      'Cuide do sono — a memória de longo prazo se forma durante o descanso',
    ],
  });
}
