'use client';

import { useState, useEffect } from 'react';
import { BottomNav, TabType } from '@/components/BottomNav';
import MarketplaceView from '@/components/MarketplaceView';
import RadarView from '@/components/RadarView';
import { ProfileView } from '@/components/ProfileView';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Em um ambiente real, usaríamos useSession do NextAuth ou cookies.
  useEffect(() => {
    // Se quiser simular autenticação, descomente isso no futuro.
    // const user = localStorage.getItem('user');
    // if (!user) window.location.href = '/login';
  }, []);

  return (
    <main className="min-h-[100dvh] relative text-foreground mesh-bg">
      {/* App Shell Content Area - Preserving state via CSS visibility instead of unmounting */}
      <div className="pb-[90px]">
        <div className={activeTab === 'home' ? 'block' : 'hidden'}>
          <MarketplaceView />
        </div>
        
        <div className={activeTab === 'map' ? 'block' : 'hidden'}>
          <RadarView />
        </div>
        
        <div className={activeTab === 'chat' ? 'block' : 'hidden'}>
          <div className="flex items-center justify-center min-h-[70vh] text-muted-foreground">
            <h2 className="text-xl font-bold tracking-widest uppercase opacity-50">Módulo de Chat Inativo</h2>
          </div>
        </div>
        
        <div className={activeTab === 'profile' ? 'block' : 'hidden'}>
           <ProfileView />
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </main>
  );
}
