'use client';

import { useState, useEffect } from 'react';
import { getNearbyOffers, NearbyOffer } from '@/actions/get-nearby-offers';
import { getNinjaSense } from '@/actions/ai-sense';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MapPin, Target, Sparkles, Navigation, AlertCircle, Download, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function RadarView() {
  const [offers, setOffers] = useState<NearbyOffer[]>([]);
  const [loadingRadar, setLoadingRadar] = useState(true);
  const [gpsError, setGpsError] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [selectedOffer, setSelectedOffer] = useState<NearbyOffer | null>(null);

  const [senseText, setSenseText] = useState('');
  const [loadingSense, setLoadingSense] = useState(false);
  const [senseOpen, setSenseOpen] = useState(false);

  const fetchLocationAndOffers = () => {
    setLoadingRadar(true);
    setGpsError(false);

    // Pilar 3: Resiliência contra ambientes sem suporte nativo e Mock para HTTP Mobile
    const isHttpNetwork = typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost';

    const processLocation = async (lat: number, lng: number) => {
      try {
        if (!navigator.onLine) throw new Error('Offline');
        
        // Performance Log
        console.log('[Radar] Disparando Server Action getNearbyOffers...');
        const start = performance.now();
        
        const results = await getNearbyOffers(lat, lng);
        
        console.log(`[Radar] getNearbyOffers respondeu em ${(performance.now() - start).toFixed(0)}ms com ${results.length} missões.`);
        
        setOffers(results);
        localStorage.setItem('ninja_cached_offers', JSON.stringify(results));
      } catch (error) {
        console.error('[Radar API]:', error);
        const cached = localStorage.getItem('ninja_cached_offers');
        if (cached) setOffers(JSON.parse(cached));
      } finally {
        setLoadingRadar(false);
      }
    };

    if (isHttpNetwork) {
      toast.warning('Radar Simulado Ativado', {
        description: 'Conexão HTTP detectada no celular. Utilizando coordenadas de Salto do Lontra.'
      });
      processLocation(-25.7725, -53.2215);
      return;
    }

    if (!navigator.geolocation) {
      setGpsError(true);
      setLoadingRadar(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const isDev = process.env.NODE_ENV === 'development';
        const userLat = isDev ? -25.7725 : position.coords.latitude;
        const userLng = isDev ? -53.2215 : position.coords.longitude;
        processLocation(userLat, userLng);
      },
      (error) => {
        console.warn('GPS Denied or failed:', error);
        
        // Pilar 3: Se der timeout (3 segundos), a gente não deixa o usuário preso no Skeleton Screen.
        // Simulamos a localização e mantemos a UI responsiva.
        if (error.code === error.TIMEOUT) {
          toast.warning('Radar Simulado Ativado', {
            description: 'GPS demorou muito para responder (3s Timeout). Usando último setor conhecido (Salto do Lontra).'
          });
          processLocation(-25.7725, -53.2215);
          return;
        }

        setGpsError(true);
        setLoadingRadar(false);
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    // Pilar 1: Auto-fetch ao abrir o app
    fetchLocationAndOffers();

    // Pilar 3: Resiliência Offline e Install Prompt
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleActivateSense = async () => {
    setSenseOpen(true);
    if (senseText && offers.length > 0) return; // cache

    setLoadingSense(true);
    try {
      const text = await getNinjaSense(offers);
      setSenseText(text);
    } catch (e) {
      setSenseText('Sentido Ninja obscurecido por interferência.');
    } finally {
      setLoadingSense(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-xl mx-auto py-10 px-4 md:px-0">
      
      {/* HEADER DA HOME */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
          <Target className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">
          Radar Ninja
        </h1>
        <p className="text-muted-foreground w-4/5 text-lg">
          Interceptando missões locais no seu setor. Cumpra os objetivos e eleve seu chakra.
        </p>

        {/* Pilar 3: Prompt de Instalar App PWA */}
        {deferredPrompt && (
          <Button 
            variant="outline" 
            className="mt-2 glass-card font-medium border-primary/50 text-foreground"
            onClick={handleInstallClick}
          >
            <Download className="mr-2 w-4 h-4 text-primary" /> Instalar App Oficial Ninja
          </Button>
        )}
        
        {/* Pilar 4: Botão sofisticado com animação */}
        <Dialog open={senseOpen} onOpenChange={setSenseOpen}>
          <Button
            size="lg"
            className="mt-6 w-[280px] h-14 font-bold text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_25px_rgba(255,50,50,0.6)] transition-all animate-pulse"
            onClick={handleActivateSense}
            disabled={loadingRadar || gpsError}
          >
            <Sparkles className="mr-3 w-6 h-6" /> Ativar Sentido Ninja
          </Button>
          <DialogContent className="glass-card sm:max-w-md border-primary/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="w-6 h-6 text-primary" /> Conselho do Mentor
              </DialogTitle>
              <DialogDescription>A sabedoria para sua próxima missão local.</DialogDescription>
            </DialogHeader>
            <div className="py-4 font-mono">
              {loadingSense ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full bg-primary/10" />
                  <Skeleton className="h-4 w-[90%] bg-primary/10" />
                  <Skeleton className="h-4 w-[60%] bg-primary/10" />
                </div>
              ) : (
                <div className="text-lg leading-relaxed whitespace-pre-wrap">
                  {senseText}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ESTRATÉGIA OFFLINE INFO */}
      {isOffline && (
        <Alert className="glass-card border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 mt-4">
          <WifiOff className="h-5 w-5 !text-yellow-500" />
          <AlertTitle className="text-lg">Modo Offline Detectado</AlertTitle>
          <AlertDescription className="text-base mt-2">
            Conexão com a rede neural interrompida. Exibindo as últimas missões detectadas no radar local.
          </AlertDescription>
        </Alert>
      )}

      {/* ERRO DE GPS (Pilar 3) */}
      {gpsError && (
        <Alert variant="destructive" className="glass-card border-destructive/50 mt-4">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg">Foco perdido!</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 text-base mt-2">
            <p>Ninja, precisamos do seu rastreador ativo para localizar missões.</p>
            <Button variant="outline" size="sm" onClick={fetchLocationAndOffers} className="w-fit">
              <Navigation className="mr-2 w-4 h-4" /> Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* FEED DE MISSÕES */}
      <div className="flex flex-col gap-5 mt-4">
        <h2 className="text-2xl font-bold border-b border-border/50 pb-3 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" /> Alvos Próximos
        </h2>

        {loadingRadar ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="glass-card border-none bg-card/40">
              <CardHeader className="gap-2">
                <Skeleton className="h-6 w-2/3 bg-muted/50" />
                <Skeleton className="h-4 w-1/3 bg-muted/50" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-1/4 bg-muted/50" />
              </CardContent>
            </Card>
          ))
        ) : !gpsError && offers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground glass-card rounded-2xl border border-border/50">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Seu setor está limpo.</p>
            <p className="text-sm">Nenhuma missão num raio de 5km.</p>
          </div>
        ) : (
          <AnimatePresence>
            {offers.map((offer, idx) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Card 
                  className="glass-card hover:bg-card/40 hover:scale-[1.02] transition-all cursor-crosshair border-primary/10"
                  onClick={() => setSelectedOffer(offer)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-xl">{offer.title}</CardTitle>
                        <CardDescription className="text-base font-medium mt-1.5 opacity-80">
                          {offer.businessName}
                        </CardDescription>
                      </div>
                      <div className="bg-primary/20 text-primary font-black px-4 py-1.5 rounded-full text-sm shrink-0 shadow-sm shadow-primary/20">
                        {offer.price} CHK
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm flex items-center text-muted-foreground font-mono">
                      <Navigation className="w-4 h-4 mr-1.5 opacity-70" /> 
                      Alvo a {offer.distance.toFixed(2)}km
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* DETAIL DIALOG - Pilar 4: Experiência Ninja Unificada */}
      <Dialog open={!!selectedOffer} onOpenChange={(o) => !o && setSelectedOffer(null)}>
        <DialogContent className="glass-card sm:max-w-md border-primary/20 text-foreground">
          {selectedOffer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-primary uppercase">
                  Missão: {selectedOffer.title}
                </DialogTitle>
                <DialogDescription className="text-lg font-medium">
                  Alvo: {selectedOffer.businessName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-base leading-relaxed opacity-90">
                    {selectedOffer.description?.replace(/^[^|]+\|\s*/g, '')}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm font-mono opacity-70">
                    <MapPin className="w-4 h-4" />
                    {selectedOffer.businessAddress}
                  </div>
                  
                  <Button 
                    className="w-full h-14 text-lg font-bold rounded-xl glass-dark border border-[#23d5ab] shadow-[0_0_20px_rgba(35,213,171,0.4)] text-[#23d5ab] hover:bg-[#23d5ab]/10 transition-all flex items-center justify-center"
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
                    className="w-full text-muted-foreground"
                    onClick={() => {
                      if (!selectedOffer.businessAddress) return;
                      const searchString = `${selectedOffer.businessName}, ${selectedOffer.businessAddress}`;
                      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchString)}`;
                      window.open(url, '_blank');
                    }}
                  >
                    Ver localização exata no mapa
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
