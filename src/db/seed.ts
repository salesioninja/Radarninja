/**
 * SEED: Profissionais Reais do Paraná
 * Pilar 1: Endereços reais, categorias na description para busca semântica.
 */

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { businesses, offers } from './schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const client = createClient({ url: process.env.DB_URL || 'file:./local.db' });
const db = drizzle(client);

async function seed() {
  console.log('🌱 Seed – Profissionais do Paraná\n');

  console.log('🗑  Limpando dados antigos...');
  await db.delete(offers);
  await db.delete(businesses);

  const data = [
    {
      name: "Salão Beleza Pura",
      category: "Beleza e Estética",
      address: "Avenida Betino Warmiling, 715 - Centro, Salto do Lontra - PR",
      phone: "(41) 98799-8900",
      latitude: -25.787115,
      longitude: -53.313242,
      offer: {
        title: "Corte e Hidratação Neon",
        description: "Beleza e Estética | Ganhe 20% de desconto na sua primeira visita mencionando o Radar Ninja.",
        points: 80
      }
    },
    {
      name: "Eloíza Beal - Fisioterapia",
      category: "Saúde",
      address: "Avenida Betino Warmiling, 570 - Centro, Salto do Lontra - PR",
      phone: "(46) 99801-2345",
      latitude: -25.7783,
      longitude: -53.3167,
      offer: {
        title: "Avaliação Postural Gratuita",
        description: "Saúde | Sessão de diagnóstico para novos pacientes do setor.",
        points: 120
      }
    },
    {
      name: "Tech & Company",
      category: "Eletrônicos",
      address: "Av. Nicolau Inácio, 988 - Centro, Salto do Lontra - PR",
      phone: "(46) 98801-6300",
      latitude: -25.7780,
      longitude: -53.3160,
      offer: {
        title: "Desconto em Acessórios",
        description: "Eletrônicos | 15% de desconto em capas e películas protetoras.",
        points: 50
      }
    },
    {
      name: "CEAGRIWAL DISTRIBUIDORA",
      category: "Distribuidora e Loja",
      address: "R. Fermino Domingos Deitos, 385 - Industrial II, Salto do Lontra - PR",
      phone: "(46) 99115-6768",
      latitude: -25.7850,
      longitude: -53.3220,
      offer: {
        title: "Preço de Atacado",
        description: "Distribuidora e Loja | Condições especiais para compras em volume neste setor.",
        points: 200
      }
    },
    {
      name: "L.A embalagens",
      category: "Embalagens",
      address: "Av. Nicolau Inácio - Centro, Salto do Lontra - PR",
      phone: "(46) 99111-9261",
      latitude: -25.7775,
      longitude: -53.3155,
      offer: {
        title: "Kit Embalagem Econômica",
        description: "Embalagens | Desconto progressivo em bobinas e sacos plásticos.",
        points: 40
      }
    },
    {
      name: "Jotti indústria de Confecções",
      category: "Indústria e Confecção",
      address: "Rod PR 281, KM 0, Parque Industrial, Salto do Lontra - PR",
      phone: "(46) 98422-3327",
      latitude: -25.7880,
      longitude: -53.3250,
      offer: {
        title: "Venda Direta de Fábrica",
        description: "Indústria e Confecção | Peças selecionadas com preço de custo para moradores locais.",
        points: 300
      }
    },
    {
      name: "Proteger Extintores",
      category: "Segurança e Incêndio",
      address: "R. Angelo Zanandréia - Centro, Salto do Lontra - PR",
      phone: "(46) 99938-9380",
      latitude: -25.7790,
      longitude: -53.3180,
      offer: {
        title: "Recarga com Desconto",
        description: "Segurança e Incêndio | Traga seu extintor para recarga e ganhe inspeção gratuita.",
        points: 150
      }
    },
    {
      name: "Rodoviária de Salto do Lontra",
      category: "Transporte",
      address: "R. Ponta Grossa - Colina Verde, Salto do Lontra - PR",
      phone: "(46) 3538-1114",
      latitude: -25.7760,
      longitude: -53.3140,
      offer: {
        title: "Informações de Destino",
        description: "Transporte | Consulte horários e ganhe pontos ao validar seu embarque.",
        points: 20
      }
    },
    {
      name: "Metalúrgica Siedlecki",
      category: "Metalúrgica",
      address: "R. D - Parque Industrial II, Salto do Lontra - PR",
      phone: "(46) 98802-4656",
      latitude: -25.7855,
      longitude: -53.3225,
      offer: {
        title: "Orçamento sem Compromisso",
        description: "Metalúrgica | Projetos em ferro e aço com condições facilitadas.",
        points: 100
      }
    },
    {
      name: "Eletro Possan",
      category: "Materiais Elétricos",
      address: "Av. Bertino Warmiling, 857 - Centro, Salto do Lontra - PR",
      phone: "(46) 99907-1466",
      latitude: -25.7800,
      longitude: -53.3170,
      offer: {
        title: "Oferta em Iluminação LED",
        description: "Materiais Elétricos | Lâmpadas e painéis LED com 10% de desconto.",
        points: 70
      }
    },
    {
      name: "Academia SPORT FIT",
      category: "Saúde e Fitness",
      address: "Rua Teobaldo Schmitz, 719 - Centro, Salto do Lontra - PR",
      phone: "(46) 99132-6025",
      latitude: -25.7795,
      longitude: -53.3165,
      offer: {
        title: "Semana de Treino Experimental",
        description: "Saúde e Fitness | 7 dias grátis para novos alunos conhecerem o espaço.",
        points: 90
      }
    }
  ];

  for (const item of data) {
    const [business] = await db.insert(businesses).values({
      name: item.name,
      address: item.address,
      phone: item.phone,
      latitude: item.latitude,
      longitude: item.longitude,
    }).returning();

    await db.insert(offers).values({
      businessId: business.id,
      title: item.offer.title,
      description: item.offer.description,
      rewardPoints: item.offer.points,
    });
  }

  console.log(`✅ ${data.length} Estabelecimentos e Ofertas inseridos.`);
  console.log('\n🎉 Seed concluído! Profissionais de Salto do Lontra prontos.');
}

seed()
  .catch(e => { console.error('❌ Erro:', e); })
  .finally(() => process.exit(0));
