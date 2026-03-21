import { NearbyOffer } from '@/actions/get-nearby-offers';

export function filterOffersByCategory(offers: NearbyOffer[], categoryFilter: string) {
  return offers.filter(offer => {
    if (categoryFilter === 'Todas') return true;
    const desc = (offer.description || '').toLowerCase();
    const bName = (offer.businessName || '').toLowerCase();
    const filterLower = categoryFilter.toLowerCase();
    
    if (filterLower === 'alimentação') return desc.includes('alimentação') || desc.includes('restaurante') || desc.includes('pizza') || bName.includes('churrascaria') || bName.includes('supermercado');
    if (filterLower === 'serviços') return desc.includes('serviço') || desc.includes('salão') || desc.includes('estética') || bName.includes('salão') || bName.includes('engenharia') || bName.includes('chaveiro');
    if (filterLower === 'varejo') return desc.includes('varejo') || desc.includes('loja') || desc.includes('comércio') || bName.includes('show') || bName.includes('materiais') || desc.includes('roupa');
    if (filterLower === 'lazer') return desc.includes('lazer') || desc.includes('passeio') || desc.includes('diversão');
    return true;
  });
}
