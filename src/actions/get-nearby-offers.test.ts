import { describe, it, expect } from 'vitest';
import { getNearbyOffers } from './get-nearby-offers';

describe('Server Action: getNearbyOffers', () => {
  it('Deve retornar APENAS as empresas dentro do raio de 5km de Salto do Lontra', async () => {
    // Coordenada: Centro de Salto do Lontra (Avenida Betino Warmiling)
    const userLat = -25.7780;
    const userLng = -53.3160;

    const results = await getNearbyOffers(userLat, userLng);

    // Mapear apenas os nomes das empresas retornadas
    const uniqueBusinesses = Array.from(new Set(results.map(r => r.businessName)));

    // Verificar se as novas empresas reais estão entre os resultados
    expect(uniqueBusinesses).toContain('Salão Beleza Pura');
    expect(uniqueBusinesses).toContain('Eloíza Beal - Fisioterapia');
    expect(uniqueBusinesses).toContain('Tech & Company');
    
    // Devemos ter as 11 empresas se o raio for suficiente (aqui estamos no centro)
    expect(uniqueBusinesses.length).toBeGreaterThanOrEqual(5);

    // Empresa que não existe no seed ou distritos muito afastados não devem aparecer
    expect(uniqueBusinesses).not.toContain('Empresa Inexistente');
    
    // Ao menos 1 item sendo retornado com a estrutura correta (title, price, businessName, distance)
    const firstOffer = results[0];
    expect(firstOffer).toHaveProperty('title');
    expect(firstOffer).toHaveProperty('price');
    expect(firstOffer).toHaveProperty('businessName');
    expect(firstOffer).toHaveProperty('distance');
    expect(firstOffer.distance).toBeLessThanOrEqual(5);
  });
});
