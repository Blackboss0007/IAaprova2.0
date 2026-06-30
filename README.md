# AprovaIA 🎯

> Plataforma SaaS premium de estudos com IA — concursos públicos, ENEM, vestibulares e OAB.

## Stack
- **React 19** + **Vite 8** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Claude API** (Athena — Mentor IA)

---

## ⚡ Quickstart

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/aprovaia.git
cd aprovaia

# 2. Instale as dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env
# Edite .env e adicione sua VITE_ANTHROPIC_API_KEY

# 4. Rode em desenvolvimento
npm run dev
# → http://localhost:5173
```

---

## 🏗️ Estrutura do projeto

```
aprovaia/
├── src/
│   ├── context/
│   │   ├── AuthContext.tsx          # Autenticação (login/registro/sessão)
│   │   ├── RouterContext.tsx        # Roteamento SPA
│   │   └── UserProfileContext.tsx   # Perfil + diagnóstico + onboarding
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── OnboardingPage.tsx       # Wizard 6 etapas
│   │   ├── DashboardPage.tsx
│   │   ├── MentorPage.tsx           # Chat Athena IA
│   │   ├── MapaAprovacaoPage.tsx
│   │   ├── SalaDeGuerraPage.tsx     # Countdown + metas
│   │   ├── CronogramaPage.tsx
│   │   ├── SimuladosPage.tsx
│   │   ├── DiagnosticoPage.tsx
│   │   ├── TemplatesPage.tsx        # Flashcards, resumos, mapas
│   │   ├── PomodoroPage.tsx
│   │   ├── PerfilPage.tsx
│   │   └── ConfiguracoesPage.tsx
│   ├── services/
│   │   └── ai.ts                    # Integração Claude API
│   ├── components/
│   │   ├── layout/Sidebar.tsx
│   │   └── ui/                      # shadcn/ui components
│   ├── types/index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── vercel.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Deploy na Vercel

### Opção 1 — Via GitHub (recomendado)
1. Suba o projeto no GitHub (veja instruções abaixo)
2. Acesse [vercel.com](https://vercel.com) → **New Project**
3. Importe o repositório `aprovaia`
4. Em **Environment Variables**, adicione: `VITE_ANTHROPIC_API_KEY`
5. Clique **Deploy**

### Opção 2 — Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 📤 Subir para o GitHub

```bash
git init
git add .
git commit -m "feat: AprovaIA MVP completo"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/aprovaia.git
git push -u origin main
```

---

## 📦 Build de produção

```bash
npm run build
# Saída em: dist/
```

---

## 🔑 Variáveis de ambiente obrigatórias

| Variável | Onde obter | Obrigatória |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | ✅ Sim |
| `VITE_SUPABASE_URL` | [supabase.com](https://supabase.com) | Futuro |
| `VITE_SUPABASE_ANON_KEY` | [supabase.com](https://supabase.com) | Futuro |

---

## 📋 Páginas disponíveis

| Página | Rota interna | Descrição |
|---|---|---|
| Login | `login` | Autenticação |
| Registro | `register` | Criação de conta |
| Onboarding | `onboarding` | Wizard de perfil |
| Dashboard | `dashboard` | Visão geral |
| Athena IA | `mentor` | Chat com a mentora |
| Mapa da Aprovação | `mapa-aprovacao` | Diagnóstico visual |
| Sala de Guerra | `sala-de-guerra` | Sprint final |
| Cronograma | `cronograma` | Plano IA |
| Simulados | `simulados` | Questões IA |
| Diagnóstico | `diagnostico` | Análise de erros |
| Templates | `templates` | Flashcards + resumos |
| Pomodoro | `pomodoro` | Timer de foco |
| Perfil | `perfil` | Dados do usuário |
| Configurações | `configuracoes` | Preferências |

---

## 🏆 Próximos passos para escalar

- [ ] Integrar Supabase (banco de dados real)
- [ ] Autenticação com Supabase Auth
- [ ] Salvar histórico de simulados no banco
- [ ] Sistema de planos (Stripe)
- [ ] App mobile (Capacitor ou React Native)
- [ ] Notificações push

---

Feito com ❤️ por Rafael Ximenes
