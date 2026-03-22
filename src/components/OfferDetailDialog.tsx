import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Navigation, MapPin, Phone, MapPinned, Star } from 'lucide-react';
import { OfferChat } from './OfferChat';
import { NearbyOffer } from '@/actions/get-nearby-offers';

export function OfferDetailDialog({ offer, onClose }: { offer: NearbyOffer | null, onClose: () => void }) {
  if (!offer) return null;

  const fallbackImage = `https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80`;
  const headerImage = offer.imageUrl || fallbackImage;

  const mockProducts: import('@/actions/get-nearby-offers').Product[] = [1, 2, 3].map(item => ({
    name: `Item Categoria ${item}`,
    price: 99.90 * item,
    image: `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80`
  }));
  
  const products = offer.products && offer.products.length > 0 ? offer.products : mockProducts;

  return (
    <Dialog open={!!offer} onOpenChange={(o) => (!o && onClose())}>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] glass-dark border-[rgba(255,255,255,0.1)] text-[#F0F4FF] overflow-hidden p-0 gap-0 flex flex-col sm:rounded-2xl">
        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Novo Header sem Imagem */}
          <div className="mb-6 pr-8">
            <span className="badge-neon px-2.5 py-0.5 text-[10px] mb-3 inline-block">
              {offer.price} pts
            </span>
            <DialogTitle className="text-2xl md:text-3xl font-bold text-[#F0F4FF] leading-tight mb-2">
              {offer.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm font-medium">
              {offer.businessName}
              {offer.distance >= 0 && (
                <span className="text-[var(--neon-cyan)] ml-1.5">• {offer.distance.toFixed(1)}km</span>
              )}
            </DialogDescription>
          </div>

          {/* Descrição */}
          {offer.description && (
            <p className="text-sm text-foreground/90 leading-relaxed mb-6">
              {offer.description.replace(/^[^\|]+\|\s*/g, '').split(' | ')[0]}
            </p>
          )}

          {/* Galeria de Produtos (Dinâmica) */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Produtos e Serviços</h4>
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x custom-scrollbar">
              {products.map((item, idx) => (
                <div key={idx} className="shrink-0 w-36 glass-dark rounded-xl overflow-hidden snap-start relative group">
                  <img src={item.image} className="h-28 w-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"/>
                  <div className="p-3">
                    <p className="text-[11px] font-semibold line-clamp-1 mb-1 text-[#F0F4FF]">{item.name}</p>
                    <p className="text-xs text-[var(--neon-cyan)] font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        if (item.link && item.link.startsWith('http')) {
                          window.open(item.link, '_blank');
                        } else {
                          const priceStr = `R$ ${item.price.toFixed(2).replace('.', ',')}`;
                          const text = encodeURIComponent(`Olá, tenho interesse no serviço/produto *${item.name}* (${priceStr}) que vi no app Negócios Ninja!`);
                          const phoneBase = offer.businessPhone ? offer.businessPhone.replace(/\D/g, '') : '5546999765576';
                          window.open(`https://wa.me/${phoneBase}?text=${text}`, '_blank');
                        }
                      }}
                      className="w-full h-7 mt-3 text-[10px] bg-[var(--neon-purple)]/20 hover:bg-[var(--neon-purple)]/40 text-[#F0F4FF] border border-[var(--neon-purple)]/40 rounded-lg"
                    >
                      {item.buttonText || 'Comprar'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Componente Chat IA Integrado */}
          <OfferChat businessId={offer.id} />

          {/* Endereço & Telefone */}
          <div className="space-y-4 mb-6 p-4 glass-dark rounded-xl bg-white/5">
            {offer.businessAddress && (
              <div className="flex items-start gap-3 text-sm">
                <MapPinned className="w-4 h-4 text-[var(--neon-cyan)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Endereço</p>
                  <p className="text-[#F0F4FF] text-xs leading-relaxed">{offer.businessAddress}</p>
                </div>
              </div>
            )}

            {offer.businessPhone && (
              <a href={`tel:${offer.businessPhone.replace(/\D/g, '')}`} className="flex items-center gap-3 text-sm group mt-3">
                <Phone className="w-4 h-4 text-[var(--neon-cyan)] shrink-0" />
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Contato</p>
                  <p className="text-[var(--neon-cyan)] font-medium group-hover:opacity-80 transition-opacity">{offer.businessPhone}</p>
                </div>
              </a>
            )}
          </div>

          {/* Botões de Mapa */}
          {offer.businessAddress && (
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full h-12 text-sm font-bold rounded-xl btn-gradient flex items-center justify-center"
                onClick={() => {
                  const searchString = `${offer.businessName}, ${offer.businessAddress}`;
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(searchString)}`;
                  window.open(url, '_blank');
                }}
              >
                <Navigation className="mr-2 w-4 h-4" /> Traçar Rota Física
              </Button>
              <Button 
                variant="ghost" 
                className="w-full h-10 text-[xs] font-medium rounded-xl text-muted-foreground hover:text-[var(--neon-cyan)] transition-all flex items-center justify-center"
                onClick={() => {
                  const searchString = `${offer.businessName}, ${offer.businessAddress}`;
                  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchString)}`;
                  window.open(url, '_blank');
                }}
              >
                <MapPin className="mr-2 w-3.5 h-3.5" /> Ver no mapa
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
