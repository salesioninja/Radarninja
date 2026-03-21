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
    <div className="flex flex-col mb-6 p-4 glass-dark rounded-xl bg-[var(--neon-purple)]/5 border-[var(--neon-purple)]/20 border">
      <h4 className="text-xs font-bold text-[var(--neon-purple)] uppercase tracking-widest flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4" /> Chat IA da Agência
      </h4>
      <p className="text-[10px] text-muted-foreground mb-4">Converse com a Inteligência Artificial Ninja conectada ao N8N.</p>
      
      {/* Histórico de Mensagens */}
      <div 
        ref={scrollRef}
        className="flex flex-col gap-3 max-h-56 overflow-y-auto custom-scrollbar mb-4 pr-1"
      >
        {history.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground opacity-50 my-4 italic">
            Nenhuma mensagem. Envie um "Olá" para começar!
          </div>
        ) : (
          history.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed",
                msg.role === 'user' 
                  ? "bg-[var(--neon-purple)] text-white relative items-end self-end rounded-br-sm shadow-[0_0_15px_rgba(157,80,187,0.3)]" 
                  : "bg-[#1A1A24] text-[#F0F4FF] self-start rounded-bl-sm border border-white/5"
              )}
            >
              {msg.content}
            </div>
          ))
        )}
        
        {isSending && (
          <div className="bg-[#1A1A24] text-[#F0F4FF] self-start rounded-bl-sm border border-white/5 max-w-[85%] rounded-2xl p-3 text-xs flex items-center gap-2">
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
            placeholder="Pergunte sobre cursos, links ou contato..."
            className="input-cyber h-11 pr-12 text-xs bg-black/40"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={isSending}
          />
          <Button 
            disabled={isSending || !chatMessage.trim()}
            onClick={handleSend}
            className="absolute right-1 top-1 bottom-1 h-9 w-9 p-0 rounded-[14px] bg-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/80 text-white flex items-center justify-center transition-all disabled:opacity-50"
          >
            <Navigation className="w-4 h-4" style={{ transform: 'rotate(90deg)', marginLeft: '-2px' }} />
          </Button>
        </div>

        {/* Botões de Ação de Arquivo/Mídia baseados no HTML de Referência */}
        <div className="flex items-center gap-2 mt-1">
          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground hover:text-[var(--neon-cyan)] px-2.5 bg-white/5 rounded-lg border border-white/5">
            <Paperclip className="w-3 h-3 mr-1.5" /> Arquivo
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground hover:text-[var(--neon-cyan)] px-2.5 bg-white/5 rounded-lg border border-white/5">
            <ImageIcon className="w-3 h-3 mr-1.5" /> Mídia
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground hover:text-[var(--neon-cyan)] px-2.5 bg-white/5 rounded-lg border border-white/5">
            <Mic className="w-3 h-3 mr-1.5" /> Áudio
          </Button>
        </div>
      </div>
    </div>
  );
}
