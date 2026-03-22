import { describe, it, expect, vi } from 'vitest';
import { createEmpresaAction } from '../actions/admin-empresa';
import { EmpresaFormValues } from '../schema/admin-empresa';
import { db } from '../db';
import { businesses, offers } from '../db/schema';
import { eq } from 'drizzle-orm';

// Mock the DB insert because this is a unit test. 
// Or better yet, just run it end-to-end if we're using a test DB. 
// But Vitest can just test the logic or we can insert into real local.db 
// Let's do an integration test against local.db since it's SQLite and fast!

describe('Admin Empresa Action', () => {
  it('Deve salvar uma empresa e o objeto retornado conter os campos obrigatorios do Chat IA e WhatsApp', async () => {
    const mockData: EmpresaFormValues = {
      name: 'Supermercado Teste',
      category: 'Mercado',
      shortDescription: 'As melhores ofertas da cidade',
      longDescription: 'Somos um supermercado familiar...',
      n8nEndpointUrl: 'https://n8n.exemplo.com/webhook/test',
      logoUrl: 'https://exemplo.com/logo.png',
      coverImageUrl: 'https://acessaronline.com.br/wp-content/uploads/2026/03/1.png',
      address: 'Rua de Teste, 123',
      phone: '46999999999',
      latitude: -25.7800,
      longitude: -53.3100,
      expiresAt: '2026-12-31',
      products: [
        {
          name: 'Produto 1',
          price: 19.99,
          image: 'https://exemplo.com/prod1.png',
          link: 'https://wa.me/46999999999?text=QueroProduto1'
        }
      ]
    };

    const response = await createEmpresaAction(mockData);
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();

    const data = response.data!;
    
    // O objeto deve ter o ID para o Chat de IA
    expect(data.id).toBeDefined(); // Offer ID is used for OfferChat businessId prop
    
    // O Chat de IA precisa dos produtos
    expect(data.products).toBeDefined();
    expect(data.products![0].link).toBe('https://wa.me/46999999999?text=QueroProduto1');

    // Link do WhatsApp requer o Telefone
    expect(data.businessPhone).toBe('46999999999');

    // Validade
    // expiresAt is saved in Offers table but NearbyOffer interface doesn't expose it directly yet, but let's check DB directly
    const storedOffer = await db.select().from(offers).where(eq(offers.id, data.id));
    expect(storedOffer[0].expiresAt).toBe('2026-12-31');

    // Verificar se n8nEndpointUrl foi salvo na tabela businesses
    const storedBusiness = await db.select().from(businesses).where(eq(businesses.name, 'Supermercado Teste'));
    expect(storedBusiness[0].n8nEndpointUrl).toBe('https://n8n.exemplo.com/webhook/test');
    expect(storedBusiness[0].category).toBe('Mercado');
    expect(storedBusiness[0].longDescription).toBe('Somos um supermercado familiar...');
  });
});
