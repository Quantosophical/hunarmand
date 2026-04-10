"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Languages, Mic } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface ChatMessage {
  id: string;
  text: string;
  translatedText?: string | null;
  senderId: string;
  createdAt: string;
}

export default function D2AChat({ artisanId, artisanName, currentUserId }: { artisanId: string, artisanName: string, currentUserId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && currentUserId) {
      fetchMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/chat/translate?artisanId=${artisanId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !currentUserId) return;

    const optimisticMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      senderId: currentUserId,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artisanId, text: optimisticMsg.text })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? newMsg : m));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-gradient-gold text-primary p-4 rounded-full shadow-[0_10px_30px_rgba(201,168,76,0.3)] hover:scale-110 transition-transform flex items-center justify-center animate-bounce"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-[350px] h-[500px] bg-surface-dark border border-border-gold/30 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-[#1A1612] p-4 flex justify-between items-center border-b border-border-gold/20">
            <div>
               <div className="flex items-center gap-2 mb-1">
                 <Languages className="w-4 h-4 text-accent" />
                 <span className="font-accent text-[0.6rem] tracking-[0.1em] text-accent uppercase">D2A Semantic Translation</span>
               </div>
               <h3 className="font-heading text-lg text-cream">{artisanName}</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-cream transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-deep-black/50 hide-scrollbar" ref={scrollRef}>
            {fetching ? (
              <div className="flex justify-center py-10"><Spinner size="md" className="text-accent" /></div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10">
                <p className="font-sans text-xs text-text-muted">Break the language barrier.</p>
                <p className="font-sans text-xs text-text-muted mt-1">Speak directly with the master weaver.</p>
              </div>
            ) : (
              messages.map(msg => {
                const isMine = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-lg p-3 ${isMine ? 'bg-[#2A2218] border border-border-gold/20 text-cream' : 'bg-surface-mid text-cream'}`}>
                      <p className="font-sans text-sm mb-1">{msg.text}</p>
                      {msg.translatedText && (
                        <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.05)]">
                           <p className="font-heading italic text-[#C9A84C] text-sm">{msg.translatedText}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            {loading && (
               <div className="flex justify-end pr-2"><Spinner size="sm" className="text-accent" /></div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 bg-[#1A1612] border-t border-border-gold/20 flex gap-2 items-center">
            <button type="button" className="p-2 text-text-muted hover:text-accent transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Start typing..." 
              required
              className="flex-1 bg-surface-dark border border-border-gold/30 rounded-full px-4 py-2 text-sm text-cream outline-none focus:border-accent"
            />
            <button type="submit" disabled={loading} className="p-2 bg-accent text-primary rounded-full hover:brightness-110 transition-colors disabled:opacity-50">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
