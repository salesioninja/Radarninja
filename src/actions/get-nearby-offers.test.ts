import { describe, it, expect } from 'vitest';
import { getNearbyOffers } from './get-nearby-offers';

describe('Server Action: getNearbyOffers', () => {
  it('Deve retornar empresas ordenadas por distância, com as mais próximas primeiro', async () => {
    // Coordenada: Centro de Salto do Lontra (Avenida Betino Warmiling)
    const userLat = -25.7780;
    const userLng = -53.3160;

    const results = await getNearbyOffers(userLat, userLng);

    // Mapear apenas os nomes das empresas retornadas
    const uniqueBusinesses = Array.from(new Set(results.map(r => r.businessName)));

    // Verificar se as empresas locais estão entre os resultados
    expect(uniqueBusinesses).toContain('Salão Beleza Pura');
    expect(uniqueBusinesses).toContain('Eloíza Beal - Fisioterapia');
    expect(uniqueBusinesses).toContain('Tech & Company');
    
    // Devemos ter resultados
    expect(uniqueBusinesses.length).toBeGreaterThanOrEqual(1);

    // Empresa que não existe no seed ou banco não deve aparecer
    expect(uniqueBusinesses).not.toContain('Empresa Inexistente');
    
    // Verificar ordenação
    const firstOffer = results[0];
    const lastOffer = results[results.length - 1];
    expect(firstOffer).toHaveProperty('title');
    expect(firstOffer).toHaveProperty('distance');
    expect(firstOffer.distance).toBeLessThanOrEqual(5); // A primeira deve estar próxima
    if (results.length > 1) {
      expect(firstOffer.distance).toBeLessThanOrEqual(lastOffer.distance);
    }
  });
});

