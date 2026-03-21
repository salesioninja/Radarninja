'use client';

import { MapPin, Calendar } from 'lucide-react';
import { NearbyOffer } from '@/actions/get-nearby-offers';
import { Button } from '@/components/ui/button';

interface OfferCardProps {
  offer: NearbyOffer;
  variant?: 'grid' | 'list';
  onClick: (offer: NearbyOffer) => void;
}

export function OfferCard({ offer, variant = 'grid', onClick }: OfferCardProps) {
  const fallbackImage = `https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80`;
  const imageUrl = offer.imageUrl || fallbackImage;
  const categoryMatch = offer.description?.match(/^([^\|]+)\|/);
  const tag = categoryMatch ? categoryMatch[1].trim() : 'Premium';
  const descText = offer.description ? offer.description.replace(/^[^\|]+\|\s*/g, '').split(' | ')[0] : 'Oferta especial para você.';

  if (variant === 'list') {
    return (
      <div 
        className="glass-dark p-4 cursor-pointer relative transition-all duration-200 hover:-translate-y-1"
        onClick={() => onClick(offer)}
      >
        <span className="absolute top-4 right-4 text-[11px] font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
          {offer.price} pts
        </span>
        <h3 className="font-bold text-white text-base leading-tight mb-1 pr-16 line-clamp-1">
          {offer.title}
        </h3>
        <p className="text-[11px] text-white/50 mb-4">
          {offer.businessName} {offer.distance >= 0 && `• ${offer.distance.toFixed(1)}km`}
        </p>
        <Button className="h-8 text-xs px-4 btn-gradient rounded-lg">
          Ver Ofertas
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="glass-dark overflow-hidden cursor-pointer group relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] flex flex-col h-full"
      onClick={() => onClick(offer)}
    >
      {/* Imagem de Capa e Tag */}
      <div className="h-36 w-full relative overflow-hidden bg-black shrink-0">
        <img 
          src={imageUrl} 
          alt="Capa"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 mix-blend-screen"
        />
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold tracking-wide z-10">
          {tag}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-white text-[15px] leading-tight line-clamp-1 mb-1">
          {offer.title}
        </h3>
        <p className="text-xs text-white/50 font-medium mb-4 line-clamp-2 flex-1">
          {descText}
        </p>

        <div className="flex items-center justify-between text-[11px] text-white/50 mt-auto">
          <div className="flex items-center gap-1.5 opacity-80">
            <MapPin className="w-3 h-3" />
            <span>{offer.distance >= 0 ? `${offer.distance.toFixed(1)}km` : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-80">
            <Calendar className="w-3 h-3" />
            <span>Até 20/04/2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
