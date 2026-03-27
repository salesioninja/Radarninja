'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Bell, Send, Image as ImageIcon, Link as LinkIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    image: '',
    url: '/',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send notifications');

      setSuccess(true);
      toast.success(`Notificação enviada para ${data.count} usuários!`);
      setFormData({ title: '', body: '', image: '', url: '/' });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao enviar notificações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="text-[var(--neon-cyan)] w-8 h-8" />
            Central de Notificações
          </h1>
          <p className="text-white/50 mt-2">Envie promoções em tempo real para todos os ninjas inscritos.</p>
        </header>

        <Card className="glass-dark border-[var(--neon-purple)]/20 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <CardTitle>Nova Promoção</CardTitle>
            <CardDescription className="text-white/40">Sua mensagem aparecerá como uma notificação push no celular/navegador.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Notificação</Label>
                <Input
                  id="title"
                  placeholder="Ex: 50% de DESCONTO na Pizza!"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-cyber bg-white/5 border-white/10 focus:border-[var(--neon-cyan)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Mensagem (Corpo)</Label>
                <Textarea
                  id="body"
                  placeholder="Ex: Use o cupom NINJA50 e aproveite nossa oferta exclusiva de hoje."
                  required
                  rows={3}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="input-cyber bg-white/5 border-white/10 focus:border-[var(--neon-cyan)]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5" /> URL da Imagem (opcional)
                  </Label>
                  <Input
                    id="image"
                    placeholder="https://suaimagem.com/foto.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input-cyber bg-white/5 border-white/10 focus:border-[var(--neon-cyan)]"
                  />
                  <p className="text-[10px] text-white/30 italic">O banner que aparece aberto na notificação.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url" className="flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5" /> Link de Destino
                  </Label>
                  <Input
                    id="url"
                    placeholder="/loja/minha-pizzaria"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="input-cyber bg-white/5 border-white/10 focus:border-[var(--neon-cyan)]"
                  />
                  <p className="text-[10px] text-white/30 italic">Para onde o usuário vai ao clicar.</p>
                </div>
              </div>

              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">Sucesso! A notificação foi enviada para a fila de disparo.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-6 bg-white/5 border-t border-white/5">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-cyan)] text-[#0D0D12] font-bold h-12 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Disparar Notificação
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Preview Simulado */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest px-1">Preview no Celular</h3>
          <div className="glass-dark border border-white/5 rounded-2xl p-4 flex gap-4 max-w-sm mx-auto shadow-xl">
            <div className="w-12 h-12 bg-[var(--neon-cyan)] rounded-xl flex items-center justify-center shrink-0">
               <Bell className="w-6 h-6 text-[#0D0D12]" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm truncate">{formData.title || 'Título da Promoção'}</h4>
              <p className="text-xs text-white/60 line-clamp-2 mt-1">{formData.body || 'Sua mensagem aparecerá aqui para atrair os ninjas.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
