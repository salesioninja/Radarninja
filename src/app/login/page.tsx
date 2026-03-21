'use client';

import { useState } from 'react';
import { Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Import auth from next-auth if using client side auth

export default function LoginPage() {
  const [email, setEmail] = useState('salesioninja@gmail.com');
  const [phone, setPhone] = useState('46999765576');
  const [password, setPassword] = useState('12345678');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth flow mock:
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_phone', phone);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm glass-dark rounded-3xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            <span className="text-[var(--neon-cyan)]">Negócios</span>{' '}
            <span className="text-[var(--neon-purple)]">Ninja</span>
          </h1>
          <p className="text-white/60 text-sm">
            Entre para descobrir ofertas incríveis
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-dark pl-10"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 ml-1">
              Telefone/WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input-dark pl-10"
                placeholder="(46) 99999-9999"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 ml-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-dark pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full h-12 btn-gradient text-[15px] mt-2 flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Entrar
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
