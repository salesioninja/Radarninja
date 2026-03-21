'use client';

import { useState, useEffect, useCallback } from 'react';
import { getNearbyOffers, NearbyOffer } from '@/actions/get-nearby-offers';
import { getNinjaSense } from '@/actions/ai-sense';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MapPin, Search, Sparkles, Navigation, Download, WifiOff, AlertCircle, Store, Phone, MapPinned, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function MarketplaceView() {
  const [offers, setOffers] = useState<NearbyOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [gpsError, setGpsError] = useState(false);
  const [hasGps, setHasGps] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
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
      console.log(`[Marketplace] ${(performance.now() - start).toFixed(0)}ms — ${results.length} resultados`);
      setOffers(results);
      localStorage.setItem('local_cached_offers', JSON.stringify(results));
    } catch {
      const cached = localStorage.getItem('local_cached_offers');
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
    const prompt = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    window.addEventListener('beforeinstallprompt', prompt);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
      window.removeEventListener('beforeinstallprompt', prompt);
    };
  }, []);

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

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  return (
    <div className="mesh-bg min-h-screen text-[#e8e8f4]" style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>

      {/* ═══ HERO HEADER ═══ */}
      <header className="pt-14 pb-10 px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full glass text-sm font-medium text-[#23d5ab]"
          style={{ border: '1px solid rgba(35,213,171,0.3)' }}>
          <Store className="w-3.5 h-3.5" />
          Descoberta Local
          {deferredPrompt && (
            <button onClick={handleInstall} className="ml-2 flex items-center gap-1 opacity-70 hover:opacity-100">
              <Download className="w-3 h-3" /> Instalar
            </button>
          )}
        </div>

        <h1 className="text-[clamp(1.8rem,5vw,3rem)] font-bold leading-tight">
          Radar de Ofertas e Serviços<br />
          <span className="text-neon">Todos os Dias</span> Para Você Economizar
        </h1>

        <p className="mt-4 text-[rgba(232,232,244,0.6)] text-base max-w-md mx-auto">
          Descubra estabelecimentos e promoções perto de você em tempo real.
        </p>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-14 space-y-5">

        {/* ═══ SEARCH BAR ═══ */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(232,232,244,0.4)]" />
            <Input
              placeholder="Buscar pizzaria, encanador, salão, mercado..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-dark pl-10 h-12 w-full rounded-xl placeholder:text-[rgba(232,232,244,0.35)] border-0"
              onFocus={e => e.currentTarget.classList.add('input-dark')}
            />
          </div>
          <Button type="submit" className="btn-gradient h-12 px-6 rounded-xl shrink-0">
            Buscar
          </Button>
        </form>

        {/* ═══ STATUS BANNERS ═══ */}
        {isOffline && (
          <div className="glass-dark px-4 py-3 flex items-center gap-3 text-sm">
            <WifiOff className="w-4 h-4 text-[#23d5ab] shrink-0" />
            <span className="text-[rgba(232,232,244,0.8)]">Sem conexão — exibindo últimos resultados salvos.</span>
          </div>
        )}

        {gpsError && (
          <div className="glass-dark px-4 py-4 space-y-2" style={{ borderColor: 'rgba(35,213,171,0.3)' }}>
            <div className="flex items-center gap-2 font-semibold text-sm">
              <MapPin className="w-4 h-4 text-[#23d5ab] shrink-0" />
              Ative o GPS para ver empresas no seu local exato
            </div>
            <p className="text-xs text-[rgba(232,232,244,0.55)] pl-6">Use a busca acima para encontrar por nome ou categoria.</p>
            <button
              onClick={requestGps}
              className="ml-6 mt-1 text-xs font-semibold text-[#23d5ab] flex items-center gap-1.5 hover:opacity-80"
            >
              <Navigation className="w-3 h-3" /> Tentar GPS novamente
            </button>
          </div>
        )}

        {/* ═══ SECTION HEADING ═══ */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#23d5ab]" />
            Estabelecimentos Perto de Mim
          </h2>

          <Dialog open={aiOpen} onOpenChange={setAiOpen}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAiSuggest}
              disabled={loading || offers.length === 0}
              className="text-sm gap-1.5 hover:bg-[rgba(35,213,171,0.1)] transition-all"
              style={{ borderColor: 'rgba(35,213,171,0.4)', color: '#23d5ab', background: 'transparent' }}
            >
              <Sparkles className="w-3.5 h-3.5" /> Sugestão da IA
            </Button>
            <DialogContent className="sm:max-w-md glass-dark border-[rgba(35,213,171,0.2)] text-[#e8e8f4]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="w-5 h-5 text-[#23d5ab]" />
                  Sugestão da IA
                </DialogTitle>
                <DialogDescription className="text-[rgba(232,232,244,0.55)]">
                  Análise inteligente das melhores ofertas disponíveis.
                </DialogDescription>
              </DialogHeader>
              <div className="py-3">
                {loadingAi ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full bg-white/10" />
                    <Skeleton className="h-4 w-5/6 bg-white/10" />
                    <Skeleton className="h-4 w-4/6 bg-white/10" />
                  </div>
                ) : (
                  <p className="text-[rgba(232,232,244,0.85)] leading-relaxed whitespace-pre-wrap text-sm">{aiText}</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* ═══ OFFER FEED ═══ */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-dark rounded-xl p-5 space-y-3">
                <Skeleton className="h-5 w-2/3 bg-white/10" />
                <Skeleton className="h-4 w-1/3 bg-white/10" />
                <Skeleton className="h-9 w-28 bg-white/10" />
              </div>
            ))
          ) : offers.length === 0 ? (
            <div className="text-center py-16 glass-dark rounded-xl space-y-4">
              <AlertCircle className="w-10 h-10 mx-auto text-[rgba(232,232,244,0.2)]" />
              <div>
                <p className="font-medium text-[rgba(232,232,244,0.7)]">Nenhum estabelecimento encontrado.</p>
                <p className="text-[rgba(232,232,244,0.4)] text-sm mt-1">
                  {searchQuery ? `Nenhum resultado para "${searchQuery}".` : 'Tente ativar o GPS.'}
                </p>
              </div>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    loadOffers(undefined, undefined, undefined);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold btn-gradient"
                >
                  ← Ver todos os estabelecimentos
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {offers.map((offer, idx) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22, delay: idx * 0.06 }}
                >
                    <div className="glass-dark rounded-xl p-5">
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <div>
                          <h3 className="font-semibold text-[#e8e8f4] text-lg leading-snug">{offer.title}</h3>
                          <p className="text-sm text-[rgba(232,232,244,0.55)] mt-0.5">
                            {offer.businessName}
                            {offer.distance >= 0 && (
                              <span className="text-neon font-medium ml-1.5">• {offer.distance.toFixed(1)}km</span>
                            )}
                          </p>
                        </div>
                        <span className="badge-neon text-xs px-3 py-1.5 shrink-0">
                          {offer.price} pts
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="btn-gradient rounded-lg text-sm px-5"
                        onClick={() => setSelectedOffer(offer)}
                      >
                        Ver Ofertas
                      </Button>
                    </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* ═══ DETAIL DIALOG ═══ */}
      <Dialog open={!!selectedOffer} onOpenChange={(o) => !o && setSelectedOffer(null)}>
        <DialogContent className="sm:max-w-md glass-dark border-[rgba(35,213,171,0.25)] text-[#e8e8f4]">
          {selectedOffer && (
            <>
              <DialogHeader className="gap-1">
                <DialogTitle className="text-xl font-bold text-[#e8e8f4] pr-6">
                  {selectedOffer.title}
                </DialogTitle>
                <DialogDescription className="text-[rgba(232,232,244,0.55)] text-sm">
                  {selectedOffer.businessName}
                  {selectedOffer.distance >= 0 && (
                    <span className="text-neon ml-1.5 font-medium">• {selectedOffer.distance.toFixed(1)}km</span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Pontos */}
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-[#39FF14] shrink-0" />
                  <span className="text-[rgba(232,232,244,0.7)]">Recompensa:</span>
                  <span className="badge-neon px-2.5 py-0.5 text-xs">{selectedOffer.price} pts</span>
                </div>

                {/* Descrição da oferta */}
                {selectedOffer.description && (
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(35,213,171,0.07)', border: '1px solid rgba(35,213,171,0.15)' }}>
                    <p className="text-sm text-[rgba(232,232,244,0.8)] leading-relaxed">
                      {/* Remove as categorias pipe – mostra só a descrição limpa */}
                      {selectedOffer.description.replace(/^[^|]+\|\s*/g, '').split(' | ')[0]}
                    </p>
                  </div>
                )}

                {/* Endereço */}
                {selectedOffer.businessAddress && (
                  <div className="flex items-start gap-2.5 text-sm">
                    <MapPinned className="w-4 h-4 text-[#23d5ab] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[rgba(232,232,244,0.5)] text-xs uppercase tracking-wide mb-0.5">Endereço</p>
                      <p className="text-[rgba(232,232,244,0.85)]">{selectedOffer.businessAddress}</p>
                    </div>
                  </div>
                )}

                {/* Telefone */}
                {selectedOffer.businessPhone && (
                  <a
                    href={`tel:${selectedOffer.businessPhone.replace(/\D/g, '')}`}
                    className="flex items-center gap-2.5 text-sm group"
                  >
                    <Phone className="w-4 h-4 text-[#23d5ab] shrink-0" />
                    <div>
                      <p className="text-[rgba(232,232,244,0.5)] text-xs uppercase tracking-wide mb-0.5">Telefone</p>
                      <p className="text-neon group-hover:opacity-80 transition-opacity">{selectedOffer.businessPhone}</p>
                    </div>
                  </a>
                )}

                {/* Botões de Mapa */}
                {selectedOffer.businessAddress && (
                  <div className="flex flex-col gap-2 pt-1">
                    {/*
                     * Pilar 1 (Alfabetização Lógica): Por que Lat/Lng é melhor que nome da rua?
                     *
                     * Quando passamos um endereço TEXTUAL (ex: "Av. Bertino Warmiling, 570"),
                     * o Google Maps faz uma BUSCA SEMÂNTICA — ele tenta adivinhar qual lugar
                     * no mundo melhor corresponde a esse texto. Isso pode errar se:
                     *   1. A rua não está indexada no Google Maps local
                     *   2. Outro estabelecimento na mesma rua tem nome mais famoso
                     *   3. Há ambiguidade entre cidades (ex: "Rua do Comércio" existe em mil cidades)
                     *
                     * Quando passamos COORDENADAS (lat, lng), o Google Maps faz um PIN GEOGRÁFICO
                     * direto: ele ignora nomes, ignora outros estabelecimentos e planta o alfinete
                     * exatamente naquele ponto na Terra. É matematicamente impossível errar.
                     *
                     * Por isso: texto no card = legível para humanos.
                     *           lat/lng na URL  = preciso para máquinas.
                     */}
                    <Button 
                      className="w-full h-12 text-base font-bold rounded-xl glass-dark border border-[#23d5ab] shadow-[0_0_20px_rgba(35,213,171,0.4)] text-[#23d5ab] hover:bg-[#23d5ab]/10 transition-all flex items-center justify-center"
                      style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
                      onClick={() => {
                        if (!selectedOffer.businessAddress) {
                          toast.error("Endereço não encontrado para este alvo.");
                          return;
                        }
                        const searchString = `${selectedOffer.businessName}, ${selectedOffer.businessAddress}`;
                        console.log('[Navegação] Iniciando protocolo de rota por texto exato:', searchString);
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(searchString)}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <Navigation className="mr-2 w-5 h-5" /> Traçar Rota até aqui
                    </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full text-[rgba(232,232,244,0.45)] hover:text-[#23d5ab] transition-colors"
                      onClick={() => {
                        if (!selectedOffer.businessAddress) return;
                        const searchString = `${selectedOffer.businessName}, ${selectedOffer.businessAddress}`;
                        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchString)}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <MapPin className="mr-2 w-4 h-4" /> Ver localização no mapa
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
