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
                "flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300",
                isActive ? "text-[var(--neon-cyan)] scale-110" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                className={cn("w-6 h-6 transition-all", isActive ? "drop-shadow-[0_0_8px_rgba(0,194,255,0.7)]" : "opacity-70")} 
              />
              <span className="text-[10px] font-semibold tracking-wider font-sans">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
