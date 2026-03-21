import { describe, it, expect } from 'vitest';
import { filterOffersByCategory } from './filtering';
import { NearbyOffer } from '@/actions/get-nearby-offers';

describe('Dynamic Category Filtering', () => {
  const mockOffers = [
    { id: 1, title: 'Pizza', description: 'Restaurante', distance: 1 } as NearbyOffer,
    { id: 2, title: 'Corte', description: 'Salão de beleza', distance: 2 } as NearbyOffer,
    { id: 3, title: 'Camisa', description: 'Loja Varejo', distance: 3 } as NearbyOffer,
  ];

  it('should return all if category is Todas', () => {
    expect(filterOffersByCategory(mockOffers, 'Todas')).toHaveLength(3);
  });

  it('should filter Alimentação correctly', () => {
    const results = filterOffersByCategory(mockOffers, 'Alimentação');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(1);
  });

  it('should filter Serviços correctly', () => {
    const results = filterOffersByCategory(mockOffers, 'Serviços');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(2);
  });
});
