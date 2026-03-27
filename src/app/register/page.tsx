'use client';

import { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { registerAction } from '@/actions/auth';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await registerAction({ name, email, phone, role, password });
      if (res.success) {
        toast.success('Cadastro realizado!', { description: 'Agora você pode entrar.' });
        window.location.href = '/login';
      } else {
        toast.error('Erro no cadastro', { description: res.error });
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
            <span className="text-[var(--neon-cyan)]">Criar</span>{' '}
            <span className="text-[var(--neon-purple)]">Conta</span>
          </h1>
          <p className="text-white/60 text-sm">
            Junte-se à revolução Ninja
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80 ml-1">Nome</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-dark pl-10 w-full bg-black/40 border-white/10 rounded-xl h-11"
                placeholder="Seu Nome"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-dark pl-10 w-full bg-black/40 border-white/10 rounded-xl h-11"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-dark pl-10 w-full bg-black/40 border-white/10 rounded-xl h-11"
                placeholder="Sua senha secreta"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80 ml-1">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input-dark pl-10 w-full bg-black/40 border-white/10 rounded-xl h-11"
                placeholder="(46) 99999-9999"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80 ml-1">Tipo de Conta</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="input-dark pl-10 w-full bg-black/40 border-white/10 rounded-xl h-11 appearance-none cursor-pointer"
                required
              >
                <option value="USER" className="bg-slate-900">USER (Busca Ofertas)</option>
                <option value="BUSINESS" className="bg-slate-900">BUSINESS (Sou Empresa)</option>
              </select>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full h-12 btn-gradient text-[15px] mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Cadastrando...' : (
              <>
                <ArrowRight className="w-4 h-4" />
                Criar Conta Ninja
              </>
            )}
          </Button>
        </form>


        <div className="mt-8 text-center text-sm text-white/50">
          Já tem uma conta?{' '}
          <a href="/login" className="text-[var(--neon-cyan)] font-medium hover:underline">
            Entre aqui
          </a>
        </div>
      </div>
    </div>
  );
}
