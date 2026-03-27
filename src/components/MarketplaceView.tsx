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
import { OfferCard } from './OfferCard';
import { CategoryFilter } from './CategoryFilter';
import { OfferDetailDialog } from './OfferDetailDialog';

// Tela "Início" correspondente à Imagem 1 do usuário.
export default function MarketplaceView() {
  const [offers, setOffers] = useState<NearbyOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<NearbyOffer | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const loadOffers = useCallback(async (lat?: number, lng?: number) => {
    setLoading(true);
    try {
      const start = performance.now();
      const results = await getNearbyOffers(lat ?? null, lng ?? null, null);
      console.log(`[Home] ${(performance.now() - start).toFixed(0)}ms — ${results.length} resultados`);
      setOffers(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Tenta pegar GPS transparente no fundo, se não conseguir pega lista normal.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadOffers(pos.coords.latitude, pos.coords.longitude),
        () => loadOffers(),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      loadOffers();
    }
  }, [loadOffers]);

  const filteredOffers = offers.filter(offer => {
    // 1. Category Filter
    let categoryMatch = true;
    if (categoryFilter !== 'Todas') {
      const desc = (offer.description || '').toLowerCase();
      const bName = (offer.businessName || '').toLowerCase();
      const catLower = (offer.category || '').toLowerCase();
      const filterLower = categoryFilter.toLowerCase();
      
      if (filterLower === 'alimentação') categoryMatch = desc.includes('alimentação') || desc.includes('restaurante') || desc.includes('pizza') || bName.includes('churrascaria') || bName.includes('supermercado') || catLower.includes('alimentação');
      else if (filterLower === 'serviços') categoryMatch = desc.includes('serviço') || desc.includes('salão') || desc.includes('estética') || bName.includes('salão') || bName.includes('engenharia') || bName.includes('chaveiro') || catLower.includes('serviço');
      else if (filterLower === 'varejo') categoryMatch = desc.includes('varejo') || desc.includes('loja') || desc.includes('comércio') || bName.includes('show') || bName.includes('materiais') || desc.includes('roupa') || catLower.includes('varejo');
      else if (filterLower === 'lazer') categoryMatch = desc.includes('lazer') || desc.includes('passeio') || desc.includes('diversão') || catLower.includes('lazer');
      else categoryMatch = false;
    }
    
    if (!categoryMatch) return false;

    // 2. Search Query Filter
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const desc = (offer.description || '').toLowerCase();
    const bName = (offer.businessName || '').toLowerCase();
    const title = (offer.title || '').toLowerCase();
    const category = (offer.category || '').toLowerCase();
    
    const searchTarget = `${bName} ${title} ${desc} ${category}`;
    
    // Synonym mapping
    const synonyms: Record<string, string[]> = {
      'pintor': ['pintor', 'tinta', 'tintas', 'pinturas', 'pintura'],
      'tinta': ['pintor', 'tinta', 'tintas', 'pinturas', 'pintura'],
      'tintas': ['pintor', 'tinta', 'tintas', 'pinturas', 'pintura'],
      'pinturas': ['pintor', 'tinta', 'tintas', 'pinturas', 'pintura'],
      'pintura': ['pintor', 'tinta', 'tintas', 'pinturas', 'pintura'],
    };

    // Check if any word in query matches synonyms
    const queryWords = query.split(/\s+/);
    let matchedBySynonym = false;

    for (const word of queryWords) {
      if (synonyms[word]) {
         const hasSynonymMatch = synonyms[word].some(syn => searchTarget.includes(syn));
         if (hasSynonymMatch) {
            matchedBySynonym = true;
            break;
         }
      }
    }

    if (matchedBySynonym) return true;

    // Default: Check if all typed words are in the search target
    return queryWords.every(word => searchTarget.includes(word));
  });

  return (
    <div className="mesh-bg min-h-screen text-[#e8e8f4]" style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
      {/* ═══ HERO HEADER MAPPED TO IMAGE 1 ═══ */}
      <header className="pt-12 pb-6 px-6">
        <h1 className="text-[1.8rem] font-bold leading-tight flex items-center gap-2.5 mb-2 text-[#FFFFFF]">
          <Sparkles className="w-6 h-6 text-[var(--neon-cyan)]" />
          Ofertas Disponíveis
        </h1>
        <p className="text-[#FFFFFF]/60 text-sm max-w-md">
          Descubra promoções e descontos incríveis perto de você
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24">

        {/* ═══ FILTERS & SEARCH ═══ */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 z-20">
          <CategoryFilter selected={categoryFilter} onSelect={setCategoryFilter} />
          
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar profissionais, lojas, serviços (ex: pintor, restaurante)..." 
              className="pl-11 h-[46px] rounded-xl input-cyber w-full bg-[#0D0D12]/60 border border-[var(--neon-purple)]/30 text-white placeholder:text-muted-foreground focus-visible:ring-[var(--neon-cyan)] transition-all"
            />
          </div>
        </div>

        {/* ═══ OFFER GRID ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-dark rounded-2xl h-48 w-full p-4 flex flex-col justify-between">
                <div className="w-full h-24 bg-white/5 animate-pulse rounded-xl"></div>
                <Skeleton className="h-5 w-2/3 bg-white/10 mt-4" />
              </div>
            ))
          ) : filteredOffers.length === 0 ? (
            <div className="text-center py-16 glass-dark rounded-2xl space-y-4">
              <AlertCircle className="w-10 h-10 mx-auto text-[rgba(232,232,244,0.2)]" />
              <p className="font-medium text-[rgba(232,232,244,0.7)]">Nenhum alvo nesta categoria.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredOffers.map((offer, idx) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <OfferCard offer={offer} onClick={setSelectedOffer} />
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
