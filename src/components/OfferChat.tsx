'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Navigation, Paperclip, Image as ImageIcon, Mic, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export function OfferChat({ businessId }: { businessId: string | number }) {
  const [chatMessage, setChatMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isSending]);

  const handleSend = async () => {
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setHistory(prev => [...prev, { role: 'user', content: userText }]);
    setChatMessage('');
    setIsSending(true);

    try {
      // Puxa do localStorage ou mocka se não tiver
      const userPhone = localStorage.getItem('user_phone') || '(46) 99999-9999';
      const userEmail = localStorage.getItem('user_email') || 'anon@mail.com';

      const payload = {
        userId: 'uid_anony_x9',
        userPhone,
        userEmail,
        businessId,
        messageContent: userText,
        timestamp: new Date().toISOString()
      };

      const res = await fetch('https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
        // Removido mode: 'no-cors' para conseguirmos ler a resposta da IA do N8N.
      });

      if (!res.ok) throw new Error('Falha na rede');

      const textOrJson = await res.text();
      let aiResponseText = 'Mensagem enviada! (A IA não retornou texto)';

      try {
        if (textOrJson) {
          let data = JSON.parse(textOrJson);
          if (Array.isArray(data)) data = data[0];
          // Tenta ler vários padrões comuns de saída do node webhook/N8n
          aiResponseText = data?.output || data?.response || data?.mensagem || data?.text || textOrJson;
        }
      } catch {
        if (textOrJson) aiResponseText = textOrJson;
      }

      setHistory(prev => [...prev, { role: 'ai', content: aiResponseText }]);
    } catch (e) {
      console.error('Erro N8N API:', e);
      toast.error('Erro ao receber resposta da IA. Verifique as configurações de CORS do N8N.');
      setHistory(prev => [...prev, {
        role: 'ai', 
        content: 'Desculpe, não consegui conectar ao agente N8N no momento. Seu admin precisa checar as politicas de CORS do Webhook.' 
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col mb-6 p-4 rounded-xl bg-gradient-to-b from-[#E1F5FE] to-[#FFFFFF] border border-[var(--neon-cyan)]/40 shadow-[0_8px_30px_rgba(6,182,212,0.15)] relative z-10 backdrop-blur-md">
      <h4 className="text-xs font-bold text-sky-900 uppercase tracking-widest flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4" /> Chat IA da Agência
      </h4>
      <p className="text-[10px] text-slate-600 mb-4">Converse com a Inteligência Artificial Ninja conectada ao N8N.</p>
      
      {/* Histórico de Mensagens */}
      <div 
        ref={scrollRef}
        className="flex flex-col gap-3 max-h-56 overflow-y-auto custom-scrollbar mb-4 pr-1"
      >
        {history.length === 0 ? (
          <div className="text-center text-xs text-slate-500 my-4 italic font-medium">
            Nenhuma mensagem. Envie um "Olá" para começar!
          </div>
        ) : (
          history.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm",
                msg.role === 'user' 
                  ? "bg-[var(--neon-cyan)] text-white relative items-end self-end rounded-br-sm" 
                  : "bg-white text-slate-800 self-start rounded-bl-sm border border-slate-200"
              )}
            >
              {msg.content}
            </div>
          ))
        )}
        
        {isSending && (
          <div className="bg-white text-slate-800 self-start rounded-bl-sm border border-slate-200 shadow-sm max-w-[85%] rounded-2xl p-3 text-xs flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin text-[var(--neon-cyan)]" /> IA processando...
          </div>
        )}
      </div>

      {/* Área de Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 relative">
          <Input 
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Chat Interativo, Escreva Aqui Suas Dúvidas..."
            className="h-11 pr-12 text-xs bg-white text-slate-800 border-slate-300 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[var(--neon-cyan)] rounded-xl shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={isSending}
          />
          <Button 
            disabled={isSending || !chatMessage.trim()}
            onClick={handleSend}
            className="absolute right-1 top-1 bottom-1 h-9 w-9 p-0 rounded-[14px] bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/80 text-white flex items-center justify-center transition-all disabled:opacity-50"
          >
            <Navigation className="w-4 h-4" style={{ transform: 'rotate(90deg)', marginLeft: '-2px' }} />
          </Button>
        </div>

        {/* Botões de Ação de Arquivo/Mídia baseados no HTML de Referência */}
        <div className="flex items-center gap-2 mt-1">
          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-600 hover:text-[var(--neon-cyan)] hover:bg-slate-100 px-2.5 bg-white/60 rounded-lg border border-slate-200 shadow-sm transition-colors">
            <Paperclip className="w-3 h-3 mr-1.5" /> Arquivo
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-600 hover:text-[var(--neon-cyan)] hover:bg-slate-100 px-2.5 bg-white/60 rounded-lg border border-slate-200 shadow-sm transition-colors">
            <ImageIcon className="w-3 h-3 mr-1.5" /> Mídia
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-600 hover:text-[var(--neon-cyan)] hover:bg-slate-100 px-2.5 bg-white/60 rounded-lg border border-slate-200 shadow-sm transition-colors">
            <Mic className="w-3 h-3 mr-1.5" /> Áudio
          </Button>
        </div>
      </div>
    </div>
  );
}
