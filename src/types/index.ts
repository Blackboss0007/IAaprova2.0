export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  objetivo?: string;
  horasDisponiveis?: number;
  concurso?: string;
  dataProva?: string;
  createdAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  materia: string;
  duracao: number; // minutos
  tipo: 'pomodoro' | 'livre' | 'simulado';
  data: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Simulado {
  id: string;
  materia: string;
  questoes: Questao[];
  respostas?: Record<number, string>;
  resultado?: SimuladoResultado;
  criadoEm: string;
}

export interface Questao {
  id: number;
  enunciado: string;
  alternativas: string[];
  gabarito: string;
  explicacao: string;
  materia: string;
  dificuldade: 'fácil' | 'médio' | 'difícil';
}

export interface SimuladoResultado {
  acertos: number;
  erros: number;
  total: number;
  porcentagem: number;
  tempo: number;
}

export interface Cronograma {
  id: string;
  concurso: string;
  dataProva: string;
  horasDia: number;
  materias: MateriaCronograma[];
  plano: PlanoSemanal[];
}

export interface MateriaCronograma {
  nome: string;
  peso: number;
  dificuldade: 'fácil' | 'médio' | 'difícil';
  horasSemanais: number;
}

export interface PlanoSemanal {
  semana: number;
  dias: PlanoDia[];
  focoPrincipal: string;
}

export interface PlanoDia {
  dia: string;
  atividades: Atividade[];
  totalHoras: number;
}

export interface Atividade {
  materia: string;
  tipo: 'estudo' | 'revisao' | 'simulado' | 'descanso';
  duracao: number;
  descricao: string;
}

export interface MapaAprovacao {
  pontuacaoAtual: number;
  pontuacaoMeta: number;
  chancesAprovacao: number;
  nivel: 'iniciante' | 'intermediário' | 'avançado' | 'expert';
  materiasFortes: string[];
  materiasFracas: string[];
  progressoGeral: number;
  diasEstudados: number;
  horasTotais: number;
  evolucaoSemanal: number[];
  projecaoAprovacao: string;
}

export interface PomodoroSession {
  id: string;
  tipo: '25min' | '50min' | 'personalizado';
  duracao: number;
  materia: string;
  completado: boolean;
  data: string;
}

export interface Stats {
  diasEstudados: number;
  horasEstudadas: number;
  sequencia: number;
  metaDiaria: number;
  metaSemanal: number;
  evoluçãoSemanal: number[];
  ultimasAtividades: UltimaAtividade[];
  proximaRevisao: string;
}

export interface UltimaAtividade {
  tipo: string;
  descricao: string;
  tempo: string;
  icone: string;
}
