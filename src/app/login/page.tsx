'use client';

import { useState } from 'react';
import { Mail, Lock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@acessaronline.com.br');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('46999765576');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Erro ao entrar', { description: 'Usuário não encontrado. Cadastre-se primeiro.' });
      } else {
        toast.success('Login realizado!');
        
        // Pequeno hack para teste: se o email tiver admin, manda pro painel
        // O ideal seria pegar a sessão, mas como redirecionamos rápido, 
        // a próxima página já estará protegida.
        if (email.toLowerCase().includes('admin')) {
          window.location.href = '/admin/empresas';
        } else {
          window.location.href = '/';
        }
      }
    } catch (err) {
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-sm glass-dark rounded-3xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            <span className="text-[var(--neon-cyan)]">Radar</span>{' '}
            <span className="text-[var(--neon-purple)]">Ninja</span>
          </h1>
          <p className="text-white/60 text-sm">
            Entre com seu e-mail cadastrado
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white/80 ml-1">
              Seu E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-dark pl-10 w-full bg-black/40 border-white/10 rounded-xl h-12"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white/80 ml-1">
              Sua Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-dark pl-10 w-full bg-black/40 border-white/10 rounded-xl h-12"
                placeholder="Sua senha secreta"
                required
              />
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full h-12 btn-gradient text-[15px] mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Validando...' : (
              <>
                <ArrowRight className="w-4 h-4" />
                Entrar no Sistema
              </>
            )}
          </Button>
        </form>



        <div className="mt-8 text-center text-sm text-white/50">
          Não tem uma conta?{' '}
          <a href="/register" className="text-[var(--neon-cyan)] font-medium hover:underline">
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
}
