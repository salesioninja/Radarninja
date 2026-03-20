/**
 * LÓGICA DE TESTE: haversine.test.ts
 * 
 * Por que TDD primeiro?
 * R: Ao escrever o teste antes de consolidar sistemas de UI ou Banco de Dados, asseguramos
 * que nosso "Sentido Ninja" funciona matematicamente. Se a geolocalização falhar na raiz, 
 * o App inteiro perde seu propósito. Validamos pontos geográficos conhecidos.
 */

import { expect, test, describe } from 'vitest';
import { calculateDistance } from './haversine';

describe('Cálculo de Distância (Haversine)', () => {
  test('Deve calcular corretamente a distância entre SP e RJ (~350-370km)', () => {
    const saoPaulo = { latitude: -23.5505, longitude: -46.6333 };
    const rio = { latitude: -22.9068, longitude: -43.1729 };

    const distance = calculateDistance(saoPaulo, rio);
    
    // Distância linear fica na casa de 360km
    expect(distance).toBeGreaterThan(340);
    expect(distance).toBeLessThan(380);
  });

  test('Distância do mesmo ponto deve ser exatamente 0', () => {
    const point = { latitude: -23.5505, longitude: -46.6333 };
    const distance = calculateDistance(point, point);
    expect(distance).toBe(0);
  });
});
