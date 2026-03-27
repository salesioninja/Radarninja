'use client';

import { User, Camera, Star, Gift, LogOut, Bell, BellOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePushNotification } from '@/hooks/use-push-notification';
import { cn } from '@/lib/utils';
// Import auth from next-auth se estiver usando cliente, caso contrário usa mock.
// import { signOut } from 'next-auth/react';

export function ProfileView() {
  const { isSupported, subscription, subscribe, unsubscribe, loading: pushLoading } = usePushNotification();

  return (
    <div className="min-h-screen mesh-bg text-[#F0F4FF] font-sans pb-24 overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto px-4 pt-12 space-y-6">
        
        {/* ═══ PROFILE HEADER ═══ */}
        <div className="glass-dark rounded-2xl p-6 flex flex-col items-center justify-center text-center relative">
          <div className="relative mb-4">
            {/* Avatar Ring Gradiente */}
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[var(--neon-cyan)] to-[var(--neon-purple)]">
              <div className="w-full h-full bg-[#0D0D12] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white/50" />
              </div>
            </div>
            {/* Camera Icon */}
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-[var(--neon-purple)] rounded-full flex items-center justify-center border-2 border-[#0D0D12] hover:bg-[var(--neon-purple)]/80 transition-colors">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-white tracking-wide">salesio</h2>
          <p className="text-[13px] text-white/50 mb-4 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-60">
              <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
            </svg>
            salesioninja@gmail.com
          </p>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
            <Star className="w-3.5 h-3.5 text-[#00ff88] fill-[#00ff88]" />
            <span className="text-[#00ff88] font-bold text-sm tracking-wide">10</span>
            <span className="text-white/50 text-xs font-medium">pontos</span>
          </div>
        </div>

        {/* ═══ NOTIFICATIONS SETTINGS ═══ */}
        {isSupported && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  subscription ? "bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]" : "bg-white/5 text-white/30"
                )}>
                  {subscription ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Notificações Push</h3>
                  <p className="text-[11px] text-white/40">Receber alertas de promoções</p>
                </div>
              </div>
              
              <Button
                size="sm"
                variant={subscription ? "outline" : "default"}
                disabled={pushLoading}
                onClick={subscription ? unsubscribe : subscribe}
                className={cn(
                  "rounded-lg h-9 px-4 text-xs font-bold transition-all",
                  subscription 
                    ? "border-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10" 
                    : "bg-[var(--neon-cyan)] text-[#0D0D12] hover:bg-[var(--neon-cyan)]/90"
                )}
              >
                {pushLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : subscription ? (
                  'Desativar'
                ) : (
                  'Ativar'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STATS GRID ═══ */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-dark rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <Gift className="w-6 h-6 text-[var(--neon-purple)] mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">1</h3>
            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Ofertas Resgatadas</p>
          </div>
          <div className="glass-dark rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <Star className="w-6 h-6 text-[#00ff88] mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">10</h3>
            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Total de Pontos</p>
          </div>
        </div>

        {/* ═══ HISTÓRICO DE RESGATES ═══ */}
        <div className="pt-4">
          <h3 className="text-sm font-bold text-white/80 flex items-center gap-2 mb-4">
            <Gift className="w-4 h-4 text-[var(--neon-cyan)]" />
            Histórico de Resgates
          </h3>
          
          <div className="space-y-3">
            <div className="glass-dark rounded-2xl p-3 flex gap-4 items-center">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&q=80" alt="Manicure" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-white line-clamp-1 mb-1">Manicure + Pedicure</h4>
                <p className="text-[11px] text-[var(--neon-cyan)] mb-2">Espaço Beleza Nails</p>
                <div className="flex items-center gap-3 text-[10px] font-medium">
                  <span className="text-white/40 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" />
                    </svg>
                    21/03/2026
                  </span>
                  <span className="text-[#00ff88] flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" /> +10 pontos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LOGOUT BUTTON ═══ */}
        <div className="pt-8">
          <Button 
            variant="outline"
            className="w-full h-12 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 glass-dark bg-transparent transition-all"
            onClick={() => {
              // signOut({ callbackUrl: '/login' });
              window.location.href = '/login';
            }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>

      </div>
    </div>
  );
}
