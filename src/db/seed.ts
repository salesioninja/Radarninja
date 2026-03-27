/**
 * SEED: Profissionais Reais do Paraná
 * Pilar 1: Endereços reais, categorias na description para busca semântica.
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { businesses, offers } from './schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});
const db = drizzle(poolConnection);

async function seed() {
  console.log('🌱 Seed – Profissionais do Paraná\n');

  console.log('🗑  Limpando dados antigos...');
  try {
    // MySQL uses truncate or standard delete. Schema changes should be done via migrations.
  } catch (e) {}

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
        points: 80,
        imageUrl: "https://acessaronline.com.br/wp-content/uploads/2026/03/1.png"
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
        title: "Fisioterapia e Osteopatia",
        description: "Saúde | Sessão de diagnóstico para novos pacientes do setor.",
        points: 120,
        imageUrl: "https://acessaronline.com.br/wp-content/uploads/2026/02/Corrige-desequilibrios-e-promove-a-saude-geral-do-corpo-atraves-de-tecnicas-manuais-eficazes.png",
        products: [
          { name: "Pilates", price: 220, image: "https://acessaronline.com.br/wp-content/uploads/2025/10/CLINICA-DE-PILATES.png" },
          { name: "Osteopatia", price: 200, image: "https://acessaronline.com.br/wp-content/uploads/2026/02/WhatsApp-Image-2024-09-01-at-10.26.55-2.jpeg" },
          { name: "Fisioterapia", price: 80, image: "https://acessaronline.com.br/wp-content/uploads/2025/10/MEDICA.png" },
          { name: "Acupuntura", price: 120, image: "https://acessaronline.com.br/wp-content/uploads/2025/10/ACUMPUNTURA.png" }
        ]
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
        points: 50,
        imageUrl: "https://acessaronline.com.br/wp-content/uploads/2026/03/2.png"
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
        points: 200,
        imageUrl: "https://acessaronline.com.br/wp-content/uploads/2026/03/3.png"
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
        points: 40,
        imageUrl: "https://acessaronline.com.br/wp-content/uploads/2026/03/3.png"
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
        points: 300,
        imageUrl: "https://acessaronline.com.br/wp-content/uploads/2026/03/4.png"
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
        points: 150,
        imageUrl: "https://acessaronline.com.br/wp-content/uploads/2026/03/5.png"
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
        points: 20,
        imageUrl: "https://acessaronline.com.br/wp-content/uploads/2026/03/6.png"
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
        points: 100,
        imageUrl: "https://acessaronline.com.br/wp-content/uploads/2026/03/7.png"
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
        points: 70,
        imageUrl: "https://acessaronline.com.br/wp-content/uploads/2026/03/8.png"
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
        points: 90,
        imageUrl: "https://acessaronline.com.br/wp-content/uploads/2026/03/9.png"
      }
    }
  ];

  for (const item of data) {
    const businessId = crypto.randomUUID();
    await db.insert(businesses).values({
      id: businessId,
      name: item.name,
      address: item.address,
      phone: item.phone,
      latitude: item.latitude,
      longitude: item.longitude,
    });

    await db.insert(offers).values({
      id: crypto.randomUUID(),
      businessId: businessId,
      title: item.offer.title,
      description: item.offer.description,
      rewardPoints: item.offer.points,
      imageUrl: (item.offer as any).imageUrl || null,
      products: (item.offer as any).products || null,
    });
  }

  console.log(`✅ ${data.length} Estabelecimentos e Ofertas inseridos.`);
  console.log('\n🎉 Seed concluído! Profissionais de Salto do Lontra prontos.');
}

seed()
  .catch(e => { console.error('❌ Erro:', e); })
  .finally(() => process.exit(0));
