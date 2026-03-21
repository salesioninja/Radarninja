import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getNinjaSense, NearbyOffer } from './ai-sense';

// Mentalidade de Teste (Pilar 5): O Mock do Google Generative AI
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      constructor() {}
      getGenerativeModel() {
        return {
          generateContent: async () => ({
            response: {
              text: () => 'Alvo de alto valor detectado, Ninja. Execute uma interceptação tática na base!'
            }
          })
        };
      }
    }
  };
});

describe('Server Action: getNinjaSense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseOffers: NearbyOffer[] = [
    { title: 'Taco Espacial', price: 150, businessName: 'Mestre dos Tacos', distance: 1.2 }
  ];

  it('Deve encorajar o usuário a se mover se o array de ofertas for vazio (Pilar 3)', async () => {
    process.env.GEMINI_API_KEY = 'CHAVE_FALSA_PARA_TESTES';
    const result = await getNinjaSense([]);
    expect(result).toContain('limpo');
    expect(result).toContain('Mova-se');
  });

  it('Deve retornar mensagem de fallback elegante caso a KEY/API falhem (Erro)', async () => {
    process.env.GEMINI_API_KEY = ''; // Apaga a key
    const result = await getNinjaSense(baseOffers);
    expect(result).toBe('Sentido Ninja obscurecido por interferência. Tente novamente em instantes.');
  });

  it('Deve processar ofertas, retornar string válida e incorporar a personalidade do Mentor Ninja', async () => {
    process.env.GEMINI_API_KEY = 'CHAVE_FALSA_PARA_TESTES';
    const result = await getNinjaSense(baseOffers);

    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result).toContain('Alvo');
    expect(result).toContain('Ninja');
    expect(result).toContain('interceptação tática');
  });
});
