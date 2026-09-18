import { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am NEXORIA Intelligence. Ask me anything about emerging models, hardware breakthroughs, cloud architectures, or technology momentum.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'What are the fastest-growing AI technologies?',
    'Compare LangGraph and CrewAI.',
    'What changed in AI this week?',
    'Show me tools for building AI agents.'
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: q }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = 'According to real-time NEXORIA telemetry: ';
      if (q.toLowerCase().includes('fastest-growing') || q.toLowerCase().includes('growth')) {
        reply += 'Agentic Multi-Agent Frameworks (+84% star velocity), Local Small Language Models (SLMs) with quantized reasoning (+62%), and WebGPU neural inference runtimes lead in global adoption.';
      } else if (q.toLowerCase().includes('compare') || q.toLowerCase().includes('langgraph')) {
        reply += 'LangGraph focuses on stateful cyclic graphs with fine-grained checkpointing and deterministic control, whereas CrewAI prioritizes role-based agent personas and rapid prototyping for collaborative task delegation.';
      } else if (q.toLowerCase().includes('agent')) {
        reply += 'Top recommended agent toolchains for 2026: 1. Model Context Protocol (MCP) clients, 2. Antigravity AGY autonomous CLI, 3. LangGraph, 4. Browser-Use, 5. AutoGen Studio.';
      } else {
        reply += `Analysis for "${q}": The frontier is shifting rapidly towards native multimodal token reasoning and automated self-healing CI/CD pipelines. Hardware compute clusters have expanded by 34% this quarter.`;
      }

      setMessages([...newMsgs, { sender: 'ai', text: reply }]);
      setLoading(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] rounded-2xl bg-[#081223]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Ask Intelligence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400">Autonomous Technology LLM</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none shadow-[0_4px_12px_rgba(8,145,178,0.3)]'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic py-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Analyzing technology intelligence index...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-900 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors shrink-0"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask about AI, frameworks, hardware..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
