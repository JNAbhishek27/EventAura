import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { EventPlan, ChatMessage } from '../types/event';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
}

const SAMPLE_PROMPTS = [
  'Reduce my decoration budget by ₹5,000.',
  'Suggest a vegetarian menu for 100 guests.',
  'Make my wedding more traditional.',
  'Suggest affordable outdoor venues.',
  'Add a photo booth task to the vendor checklist.',
  'Add an acoustic flutist to the welcome drinks schedule.',
];

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onUpdatePlan,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello! I am your EventAura AI celebration assistant. I'm actively synced with your plan "${currentPlan.formData.eventName || currentPlan.concept.themeTitle}".\n\nYou can ask me to adjust budgets, swap menu dishes, change themes, add vendor tasks, or optimize timings. Any change you request will be updated directly in your plan!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/plan/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan,
          userMessage: text,
          chatHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to refine plan: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.updatedPlan) {
        onUpdatePlan(data.updatedPlan);
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.replyMessage || "I've reviewed and updated your event plan.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        planChangesApplied: data.changesMade || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Error sending message to AI Assistant:', err);
      const errorAiMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `I ran into an issue connecting to the AI service (${err?.message || 'Network error'}). Please try again or adjust items manually on the dashboard.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FAF7F2] h-full shadow-2xl border-l border-[#E2D6C4] flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#FAF0E6] via-[#FAF7F2] to-[#F5EEF9] border-b border-[#E8DEC9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9F7AEA] to-[#D4AF37] p-0.5 flex items-center justify-center shadow-xs">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif-luxury text-xl font-bold text-[#271E30]">
                  AI Celebration Copilot
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-[#73637C]">
                Understands follow-up requests & updates the live plan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E0D5C3] text-[#73637C] hover:text-[#271E30] flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#9F7AEA] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                  isUser
                    ? 'bg-[#2D2438] text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-[#2D2438] border border-[#E8DFC9] rounded-bl-xs shadow-xs'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

                  {/* Plan changes applied card */}
                  {msg.planChangesApplied && msg.planChangesApplied.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#F0E8DC] bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Plan Updated Live:</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-emerald-900 list-disc list-inside">
                        {msg.planChangesApplied.map((ch, i) => (
                          <li key={i}>{ch}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={`text-[9px] mt-1.5 text-right ${isUser ? 'text-slate-300' : 'text-[#8E7E97]'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#9F7AEA] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#E8DFC9] text-xs text-[#6B5C74] flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                <span>Adjusting plan and recalculating figures...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="p-3 bg-[#F5EFE6] border-t border-[#E8DFC9]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6A83] block mb-2">
            Suggested Prompts (Click to Run)
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
            {SAMPLE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-[#DECFC0] text-[#4A3C54] hover:bg-[#FAF4EB] hover:border-[#BFA97D] transition truncate max-w-full text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-[#E8DEC9]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Reduce decoration budget by ₹5,000..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D9CEBC] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white hover:brightness-110 disabled:opacity-50 transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
