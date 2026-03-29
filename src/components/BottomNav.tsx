'use client';

import { Home, Map as MapIcon, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'home' | 'map' | 'chat' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'map', label: 'Mapa', icon: MapIcon },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'profile', label: 'Perfil', icon: User },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-dark rounded-t-[20px] border-b-0 pb-2">
      <div className="flex items-center justify-around h-[70px] max-w-md mx-auto px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "group relative flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300",
                isActive ? "scale-110" : "hover:scale-105"
              )}
            >
              {/* Efeito Glow por trás do ícone ativo */}
              {isActive && (
                <div className="absolute top-1.5 w-10 h-10 bg-[var(--neon-cyan)]/30 blur-md rounded-full -z-10" />
              )}
              
              <Icon 
                className={cn(
                  "w-6 h-6 transition-all duration-300 relative z-10", 
                  isActive ? "text-[var(--neon-cyan)] drop-shadow-[0_0_12px_var(--neon-cyan)]" : "text-white/70 group-hover:text-white"
                )} 
              />
              <span className={cn(
                "text-[10px] font-bold tracking-wider font-sans transition-all duration-300",
                isActive ? "text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]" : "text-white/60 group-hover:text-white/90"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
