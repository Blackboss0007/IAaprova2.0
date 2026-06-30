import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/ai';
import type { Message, Conversation } from '../types';

const SYSTEM_PROMPT = `Você é o Mentor IA da plataforma AprovaIA — o assistente de aprovação mais avançado do Brasil.

Seu papel é ser um mentor inteligente, empático e altamente especializado em concursos públicos brasileiros (incluindo PC, PM, TJ, TRF, AGU, TCU, INSS, entre outros), ENEM, vestibulares e OAB.

Características do seu atendimento:
- Respostas diretas, objetivas e baseadas em jurisprudência atualizada
- Use markdown para estruturar bem as respostas (títulos, listas, destaques)
- Inclua dicas práticas e exemplos reais de provas
- Mencione bancas examinadoras (CESPE/Cebraspe, FCC, Vunesp, FGV) quando relevante
- Encoraje o aluno com base em dados reais de aprovação
- Português brasileiro impecável

Você tem acesso ao contexto do aluno e deve personalizar cada resposta ao máximo.`;

const SUGGESTED_PROMPTS = [
  'Como organizar meu cronograma de estudos?',
  'Quais são os temas mais cobrados em Direito Constitucional?',
  'Me explique o princípio da legalidade',
  'Dicas para resolver questões de Português mais rápido',
  'Como funciona a revisão espaçada?',
];

function AvatarAthena() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <polygon points="12,2 20,8 17,21 7,21 4,8" fill="#c084fc" opacity="0.85" />
    </svg>
  );
}

function MessageBubble({ msg, streaming }: { msg: Message; streaming?: boolean }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${
        isUser
          ? 'text-white'
          : 'text-white'
      }`}
        style={{ background: isUser ? 'linear-gradient(135deg,#8b5cf6,#a855f7)' : 'rgba(255,255,255,0.08)' }}>
        {isUser ? 'V' : <AvatarAthena />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'rounded-tr-sm text-white'
          : 'rounded-tl-sm text-gray-200'
      }`}
        style={{
          background: isUser
            ? 'linear-gradient(135deg,#8b5cf6,#a855f7)'
            : 'rgba(255,255,255,0.05)',
          border: isUser ? 'none' : '1px solid rgba(255,255,255,0.06)',
          boxShadow: isUser ? 'var(--shadow-glow-sm)' : 'none'
        }}>
        {msg.content.split('\n').map((line, i) => {
          if (line.startsWith('## ')) return <h3 key={i} className="font-bold text-white mt-2 mb-1">{line.slice(3)}</h3>;
          if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="text-white block mt-1">{line.slice(2, -2)}</strong>;
          if (line.startsWith('- ') || line.startsWith('✅') || line.startsWith('📚')) {
            return <div key={i} className="flex gap-1.5 mt-0.5"><span>{line.slice(0,2)}</span><span>{line.slice(2)}</span></div>;
          }
          return line ? <p key={i} className="mt-1">{line}</p> : <br key={i} />;
        })}
        {streaming && <span className="inline-block w-1.5 h-3.5 bg-purple-400 ml-0.5 animate-pulse" style={{ verticalAlign: 'middle' }} />}
        <p className="text-[10px] mt-2 opacity-50">
          {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

export function MentorPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Estratégia de aprovação',
      messages: [{
        id: '0',
        role: 'assistant',
        content: `## Olá! Sou seu Mentor IA 🤖

Estou aqui para te ajudar a conquistar sua aprovação. Tenho acesso ao seu histórico e vou personalizar cada resposta ao seu perfil.

Posso te ajudar com:
📚 Explicações de matérias e jurisprudência atualizada
📋 Estratégias de estudo e técnicas de memorização
📝 Análise de questões e resolução de erros
🎯 Dicas específicas para a sua banca examinadora
💡 Planejamento e cronograma de estudos

**Qual é a sua dúvida hoje?**`,
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);
  const [activeConvId, setActiveConvId] = useState('1');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId)!;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, typing, streamedText]);

  function streamReveal(fullText: string, msgId: string) {
    const words = fullText.split(' ');
    setStreamingId(msgId);
    setStreamedText('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStreamedText(words.slice(0, i).join(' '));
      if (i >= words.length) {
        clearInterval(interval);
        setStreamingId(null);
      }
    }, 18);
  }

  const sendMsg = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMsgs = [...activeConv.messages, userMsg];
    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? { ...c, messages: updatedMsgs, updatedAt: new Date().toISOString() } : c
    ));
    setInput('');
    setLoading(true);
    setTyping(true);

    try {
      const chatHistory = updatedMsgs.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      const response = await sendMessage(chatHistory, SYSTEM_PROMPT);

      const aiMsgId = (Date.now() + 1).toString();
      const aiMsg: Message = {
        id: aiMsgId,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setTyping(false);
      setConversations(prev => prev.map(c =>
        c.id === activeConvId ? {
          ...c,
          messages: [...updatedMsgs, aiMsg],
          title: updatedMsgs.length === 1 ? text.slice(0, 40) : c.title,
          updatedAt: new Date().toISOString()
        } : c
      ));
      streamReveal(response, aiMsgId);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const newConversation = () => {
    const id = Date.now().toString();
    const conv: Conversation = {
      id,
      title: 'Nova conversa',
      messages: [{
        id: '0',
        role: 'assistant',
        content: 'Olá! Como posso te ajudar hoje? 😊',
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations(prev => [conv, ...prev]);
    setActiveConvId(id);
  };

  return (
    <div className="flex flex-1 overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar conv history */}
      <div className="hidden md:flex flex-col w-56 border-r border-white/[0.06]"
        style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="p-3 border-b border-white/[0.06]">
          <button
            onClick={newConversation}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white hover:bg-white/[0.06] transition-all border border-white/[0.08]">
            <span>+</span> Nova conversa
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveConvId(c.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all ${
                c.id === activeConvId
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-300'
              }`}>
              <p className="font-medium truncate">{c.title}</p>
              <p className="text-gray-600 mt-0.5">
                {new Date(c.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <span>🤖</span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Mentor IA</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-gray-400 text-xs">Online agora</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] px-2 py-1 rounded-full font-medium"
              style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
              Claude Sonnet
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {activeConv.messages.map(msg => (
            <MessageBubble
              key={msg.id}
              msg={msg.id === streamingId ? { ...msg, content: streamedText } : msg}
              streaming={msg.id === streamingId}
            />
          ))}

          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                <span>🤖</span>
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="flex gap-1 items-center h-4">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts — only show when 1 msg */}
        {activeConv.messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-gray-500 text-xs mb-2">Sugestões</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMsg(p)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] text-gray-300 hover:text-white hover:border-purple-500/40 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 pb-6">
          <div className="flex gap-3 items-end p-3 rounded-xl border border-white/[0.08]"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(input); } }}
              placeholder="Digite sua dúvida... (Enter para enviar)"
              rows={1}
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none resize-none leading-relaxed"
              style={{ maxHeight: 120 }}
            />
            <button
              onClick={() => sendMsg(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-40 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#8b5cf6)' }}>
              <span className="text-white text-sm">↑</span>
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-600 mt-2">
            AprovaIA pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
