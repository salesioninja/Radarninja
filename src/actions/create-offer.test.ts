import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../auth', () => ({
  auth: vi.fn(),
}));

import { createOfferAction } from './create-offer';
import { auth } from '../../auth';

describe('Server Action: createOfferAction (Pilar 5)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Não deve permitir que um usuário comum crie uma oferta', async () => {
    // Simulamos uma sessão válida mas de perfil standard "USER"
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: 'uuid-123', role: 'USER', name: 'Ninja Aprendiz' },
      expires: '9999-12-31T23:59:59.999Z',
    } as any);

    const dto = { title: 'Shuriken', price: 100, address: 'Rua Principal, 10' };

    await expect(createOfferAction(dto)).rejects.toThrowError(
      'Acesso Ninja Negado: Apenas Contas Empresariais (BUSINESS) podem recrutar ninjas no radar.'
    );
  });

  it('Deve falhar se a geolocalização for inválida (Endereço não rastreável)', async () => {
    // Mula a autenticação para permitir
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: 'uuid-456', role: 'BUSINESS', name: 'Mestre Forjador' },
      expires: '9999-12-31T23:59:59.999Z',
    } as any);

    // Simulamos que a API do Nominatim retornou um array vazio (nenhum resultado)
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce([]), // Vazio!
    });

    const dto = { title: 'Katana Mística', price: 900, address: 'Atlantida Submersa, 000' };

    await expect(createOfferAction(dto)).rejects.toThrowError(
      'Geolocalização inválida: As coordenadas deste alvo não foram encontradas no plano físico.'
    );
  });
});
