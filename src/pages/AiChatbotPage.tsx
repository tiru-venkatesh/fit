import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, Send, Bot, User, Trash2, ArrowRight, Heart, Zap, RefreshCw
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';
import { GlassCard } from '../components/GlassCard';
import { useToast } from '../components/ToastProvider';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AiChatbotPage() {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content: "Welcome, athlete! I am your server-side GoldenGym AI Coach. Ask me anything related to sports nutrition, progressive resistance overloading, daily water distribution, or recovery sleep protocols. Let's maximize your output!",
      timestamp: new Date(),
    }
  ]);

  const presetSuggestions = [
    'Suggest a fat-loss snack with 25g protein',
    'Design an active mobility rest set',
    'Explain progressive overloading for beginners',
    'How do I calculate body recomposition macros?'
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    if (!customText) setInputMessage('');

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const updatedList = [...messages, userMsg];
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedList.map(m => ({
            sender: m.sender,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'ai',
          content: data.reply,
          timestamp: new Date()
        }
      ]);
    } catch {
      // offline reply
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'ai',
          content: "I'm processing via my local sports fallback algorithms. Consistently optimize compound chest presses and squats 3 times weekly, drink 3.5 liters of clean water daily, and prioritize 8 hours of deep nocturnal resting sleep!",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'ai',
        content: "Reset complete. Let's configure your new physical objectives! Ask me any fitness query now.",
        timestamp: new Date(),
      }
    ]);
    toast('Chat logs flushed securely.', 'success');
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 md:pl-72 flex flex-col animate-fade-in duration-300">
          <div className="max-w-3xl mx-auto space-y-6 w-full flex-grow flex flex-col justify-between">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
              <div>
                <span className="text-[10px] uppercase font-black text-orange-500 tracking-widest flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 animate-pulse" /> ATHLETIC RECONSTITUTOR CHATBOT
                </span>
                <h1 className="text-xl font-extrabold text-white mt-1 uppercase">AI Nutrition & Fitness Coach</h1>
              </div>

              <button
                onClick={handleClearChat}
                className="p-2 bg-zinc-950 hover:bg-zinc-900 border border-white/[0.04] rounded-xl hover:text-rose-400 transition-colors"
                title="Flush chat history"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Message Area */}
            <GlassCard className="p-4 border border-white/[0.04] flex-grow flex flex-col justify-between min-h-[400px]">
              <div className="space-y-4 flex-grow overflow-y-auto max-h-[460px] pr-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md p-4 rounded-2xl text-[11px] leading-relaxed font-semibold transition-all ${
                        m.sender === 'user'
                          ? 'bg-orange-500 text-white rounded-br-none shadow-md'
                          : 'bg-zinc-950 border border-white/[0.04] text-zinc-300 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 opacity-60">
                        {m.sender === 'user' ? (
                          <>
                            <User className="h-3.5 w-3.5 text-white" />
                            <span className="text-[8px] font-black uppercase">You</span>
                          </>
                        ) : (
                          <>
                            <Bot className="h-3.5 w-3.5 text-orange-400" />
                            <span className="text-[8px] font-black uppercase text-orange-400">GoldenGym AI Coach</span>
                          </>
                        )}
                      </div>
                      <p className="whitespace-pre-line leading-relaxed leading-normal">{m.content}</p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-md p-4 bg-zinc-950 border border-white/[0.04] rounded-2xl rounded-bl-none text-zinc-400 flex items-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-orange-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Formulating bio-insights...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions row for quick taps */}
              {messages.length === 1 && (
                <div className="space-y-2 pt-4 border-t border-white/[0.02]">
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Click a suggestion to query:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {presetSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(s)}
                        className="text-left bg-zinc-950 hover:bg-zinc-900 border border-white/[0.04] hover:border-orange-500/20 p-2.5 rounded-xl text-[9px] font-bold text-zinc-400 hover:text-white transition-all duration-200 block truncate"
                      >
                        {s} <ArrowRight className="h-2.5 w-2.5 inline ml-1 text-orange-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Input form */}
            <div className="flex gap-2.5">
              <input
                type="text"
                placeholder="Ask diet macros, training splits, cardiac rules..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 rounded-xl bg-zinc-950 border border-white/10 px-4 py-3 text-xs font-bold text-white outline-none focus:border-orange-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-orange-500 hover:bg-orange-600 text-white p-3.5 rounded-xl block shadow-lg transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
