'use client';

import { useState, useEffect, useCallback } from 'react';
import { getNearbyOffers, NearbyOffer } from '@/actions/get-nearby-offers';
import { getNinjaSense } from '@/actions/ai-sense';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MapPin, Search, Sparkles, Navigation, WifiOff, AlertCircle, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { OfferCard } from './OfferCard';
import { OfferDetailDialog } from './OfferDetailDialog';

export default function RadarView() {
  const [offers, setOffers] = useState<NearbyOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [gpsError, setGpsError] = useState(false);
  const [hasGps, setHasGps] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiText, setAiText] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<NearbyOffer | null>(null);

  const loadOffers = useCallback(async (lat?: number, lng?: number, query?: string) => {
    setLoading(true);
    try {
      if (!navigator.onLine) throw new Error('Offline');
      const start = performance.now();
      const results = await getNearbyOffers(lat ?? null, lng ?? null, query ?? null);
      console.log(`[Radar] ${(performance.now() - start).toFixed(0)}ms — ${results.length} resultados`);
      setOffers(results);
      localStorage.setItem('local_cached_radar', JSON.stringify(results));
    } catch {
      const cached = localStorage.getItem('local_cached_radar');
      if (cached) setOffers(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  }, []);

  const requestGps = useCallback(() => {
    setGpsError(false);
    setLoading(true);
    if (!navigator.geolocation) {
      setGpsError(true);
      loadOffers(undefined, undefined, searchQuery || undefined);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHasGps(true);
        loadOffers(pos.coords.latitude, pos.coords.longitude, searchQuery || undefined);
      },
      (err) => {
        setGpsError(true);
        if (err.code === err.TIMEOUT) toast.info('GPS demorou. Mostrando resultados sem distância.');
        loadOffers(undefined, undefined, searchQuery || undefined);
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    );
  }, [loadOffers, searchQuery]);

  useEffect(() => {
    requestGps();
    const on = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, [requestGps]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasGps) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadOffers(pos.coords.latitude, pos.coords.longitude, searchQuery || undefined),
        () => loadOffers(undefined, undefined, searchQuery || undefined),
        { timeout: 7000 }
      );
    } else {
      loadOffers(undefined, undefined, searchQuery || undefined);
    }
  };

  const handleAiSuggest = async () => {
    setAiOpen(true);
    if (aiText && offers.length > 0) return;
    setLoadingAi(true);
    try {
      const text = await getNinjaSense(offers);
      setAiText(text);
    } catch {
      setAiText('Sugestão temporariamente indisponível. Tente novamente em instantes.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="mesh-bg min-h-screen text-[#e8e8f4]" style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
      <header className="pt-12 pb-8 px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[var(--neon-cyan)]/30 text-sm font-medium text-[var(--neon-cyan)] bg-white/5">
          <Store className="w-3.5 h-3.5" />
          Descoberta Local
        </div>

        <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-bold leading-tight text-white mb-2">
          Radar de Ofertas e Serviços<br />
          Todos os Dias Para Você Economizar
        </h1>

        <p className="mt-2 text-white/60 text-sm max-w-md mx-auto">
          Descubra estabelecimentos e promoções perto de você em tempo real.
        </p>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-24 space-y-6">
        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Buscar pizzaria, encanador, salão, mercado..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-dark pl-10 h-12 w-full rounded-xl"
            />
          </div>
          <Button type="submit" className="btn-gradient h-12 px-6 rounded-xl shrink-0">
            Buscar
          </Button>
        </form>

        {/* STATUS BANNERS */}
        {gpsError && (
          <div className="glass-dark px-4 py-4 space-y-2 border-[var(--neon-cyan)]/30">
            <div className="flex items-center gap-2 font-semibold text-sm text-[var(--neon-cyan)]">
              <MapPin className="w-4 h-4 shrink-0" />
              Ative o GPS para ver empresas no seu local exato
            </div>
            <p className="text-xs text-white/50 pl-6">Use a busca acima para encontrar por nome ou categoria.</p>
            <button
              onClick={requestGps}
              className="ml-6 mt-1 text-xs font-semibold text-[var(--neon-cyan)] flex items-center gap-1.5 hover:opacity-80"
            >
              <Navigation className="w-3 h-3" /> Tentar GPS novamente
            </button>
          </div>
        )}

        {isOffline && (
          <div className="glass-dark px-4 py-3 flex items-center gap-3 text-sm">
            <WifiOff className="w-4 h-4 text-[var(--neon-cyan)] shrink-0" />
            <span className="text-white/80">Sem conexão — exibindo últimos resultados salvos.</span>
          </div>
        )}

        {/* SECTION HEADING */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="font-bold text-[15px] flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4 text-[var(--neon-cyan)]" />
            Estabelecimentos Perto de Mim
          </h2>

          <Dialog open={aiOpen} onOpenChange={setAiOpen}>
            <Button onClick={handleAiSuggest} variant="outline" className="gap-2 text-xs font-semibold glass-dark text-[#F0F4FF] hover:text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30 h-8 px-3">
              <Sparkles className="w-3 h-3" />
              Sugestão da IA
            </Button>
            <DialogContent className="sm:max-w-md glass-dark text-[#e8e8f4] border-[var(--neon-cyan)]/30">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--neon-cyan)]" />
                  O Ninja Sugere...
                </DialogTitle>
              </DialogHeader>
              <div className="py-4 max-h-[60vh] overflow-y-auto px-1">
                {loadingAi ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full bg-white/10" />
                    <Skeleton className="h-4 w-5/6 bg-white/10" />
                    <Skeleton className="h-4 w-4/6 bg-white/10" />
                  </div>
                ) : (
                  <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">{aiText}</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* OFFER LIST */}
        <div className="flex flex-col gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-dark rounded-xl h-28 w-full p-4 flex flex-col justify-between">
                <Skeleton className="h-5 w-2/3 bg-white/10" />
                <Skeleton className="h-4 w-1/3 bg-white/10 mt-2" />
                <Skeleton className="h-8 w-28 bg-white/10 mt-4 rounded-lg" />
              </div>
            ))
          ) : offers.length === 0 ? (
            <div className="text-center py-16 glass-dark rounded-2xl space-y-4">
              <AlertCircle className="w-10 h-10 mx-auto text-white/20" />
              <p className="font-medium text-white/70">Nenhum estabelecimento encontrado nesta área.</p>
            </div>
          ) : (
            <AnimatePresence>
              {offers.map((offer, idx) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                >
                  {/* Usando Variant LIST */}
                  <OfferCard offer={offer} variant="list" onClick={setSelectedOffer} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      <OfferDetailDialog offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
    </div>
  );
}
