import { NextResponse } from 'next/server';
import { db } from "@/db";
import { businesses, offers } from "@/db/schema";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🌱 Remote Seed Starting...');

    // Limpando dados antigos (Opcional, mas bom para garantir a ordem)
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
          rewardPoints: 80,
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
          rewardPoints: 120,
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
          rewardPoints: 50,
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
          rewardPoints: 200,
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
          rewardPoints: 40,
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
          rewardPoints: 300,
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
          rewardPoints: 150,
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
          rewardPoints: 20,
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
          rewardPoints: 100,
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
          rewardPoints: 70,
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
          rewardPoints: 90,
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
        rewardPoints: item.offer.rewardPoints,
        imageUrl: item.offer.imageUrl || null,
        products: (item.offer as any).products || null,
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `${data.length} empresas inseridas com sucesso!` 
    });

  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
