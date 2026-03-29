import { db } from './index';
import { users, businesses, offers } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const companiesData = [
  {
    "name": "Soluções em Hidráulica e Vazamentos",
    "category": "Encanador",
    "phone": "+5546911110001",
    "address": "Rua Central, 1500 - Centro",
    "longDescription": "Atendimento rápido em toda a região. Especialista em caça-vazamentos.",
    "latitude": -26.0775,
    "longitude": -53.0512,
    "ownerEmail": "contato@solucoes-hidraulica.com.br",
    "ownerName": "Profissional Responsável"
  },
  {
    "name": "Serviços Elétricos e Manutenção",
    "category": "Eletricista",
    "phone": "+5546922220002",
    "address": "Av. Principal, 800 - Centro",
    "longDescription": "Manutenção elétrica industrial e residencial. Atendimento em toda a região.",
    "latitude": -26.0750,
    "longitude": -53.0530,
    "ownerEmail": "eletrica@exemplo.com",
    "ownerName": "Eletricista Especializado"
  },
  {
    "name": "Clínica Odontológica Integrada",
    "category": "Dentista",
    "phone": "+554635241010",
    "address": "Rua das Flores, 120",
    "longDescription": "Implantes e estética dental avançada. Atendimento em toda a região.",
    "latitude": -26.0820,
    "longitude": -53.0450,
    "ownerEmail": "contato@clinica-odonto.com",
    "ownerName": "Dr. Responsável"
  },
  {
    "name": "Centro Médico Multidisciplinar",
    "category": "Médico",
    "phone": "+554635234455",
    "address": "Rua da Paz, 450 - Centro",
    "longDescription": "Pediatria e Ginecologia com agendamento online. Atendimento em toda a região.",
    "latitude": -26.0762,
    "longitude": -53.0488,
    "ownerEmail": "agendamento@centro-medico.com",
    "ownerName": "Equipe Médica"
  },
  {
    "name": "Consultório de Nutrição Especializada",
    "category": "Nutricionista",
    "phone": "+5546955550005",
    "address": "Rua das Palmeiras, 10",
    "longDescription": "Emagrecimento saudável e nutrição esportiva. Atendimento em toda a região.",
    "latitude": -26.0880,
    "longitude": -53.0610,
    "ownerEmail": "nutricao@exemplo.com",
    "ownerName": "Nutricionista"
  },
  {
    "name": "Clínica de Psicologia e Bem-Estar",
    "category": "Psicólogo",
    "phone": "+5546966660006",
    "address": "Rua São Paulo, 200 - Centro",
    "longDescription": "Psicoterapia para adultos e casais. Atendimento em toda a região.",
    "latitude": -26.0745,
    "longitude": -53.0555,
    "ownerEmail": "psicologia@exemplo.com",
    "ownerName": "Psicólogo Responsável"
  },
  {
    "name": "Móveis Planejados e Marcenaria",
    "category": "Marceneiro",
    "phone": "+5546977770007",
    "address": "Rua Industrial, 55",
    "longDescription": "Móveis planejados de alto padrão. Atendimento em toda a região.",
    "latitude": -26.0650,
    "longitude": -53.0400,
    "ownerEmail": "marcenaria@exemplo.com",
    "ownerName": "Marceneiro Especializado"
  },
  {
    "name": "Centro de Estética Automotiva",
    "category": "Lava Car",
    "phone": "+5546988880008",
    "address": "Rua das Acácias, 1000",
    "longDescription": "Lavagem simples e detalhada. Higienização interna. Atendimento em toda a região.",
    "latitude": -26.0950,
    "longitude": -53.0300,
    "ownerEmail": "estetica@auto.com",
    "ownerName": "Equipe de Estética",
    "offers": [
      {
        "title": "Centro de Estética Automotiva",
        "description": "20% de desconto para lavagem completa às terças. Atendimento em toda a região.",
        "rewardPoints": 80
      }
    ]
  },
  {
    "name": "Mecânica Automotiva Especializada",
    "category": "Mecânica",
    "phone": "+554635241122",
    "address": "Av. do Comércio, 300",
    "longDescription": "Suspensão, freios e motor. Diagnóstico por scanner. Atendimento em toda a região.",
    "latitude": -26.0700,
    "longitude": -53.0600,
    "ownerEmail": "mecanica@exemplo.com",
    "ownerName": "Equipe Técnica"
  },
  {
    "name": "Centro de Chapeação e Pintura",
    "category": "Chapeador",
    "phone": "+554635243344",
    "address": "Rua União, 40",
    "longDescription": "Pintura em estufa e recuperação de batidas. Atendimento em toda a região.",
    "latitude": -26.0850,
    "longitude": -53.0700,
    "ownerEmail": "chapeacao@exemplo.com",
    "ownerName": "Técnico Especialista"
  },
  {
    "name": "Farmácia e Drogaria 24h",
    "category": "Farmácia",
    "phone": "+554635245566",
    "address": "Rua das Rosas, 500 - Centro",
    "longDescription": "Entrega grátis em todo o perímetro urbano. Atendimento em toda a região.",
    "latitude": -26.0780,
    "longitude": -53.0500,
    "ownerEmail": "farmacia@exemplo.com",
    "ownerName": "Farmacêutico de Plantão"
  },
  {
    "name": "Pintura e Acabamentos Finos",
    "category": "Pintor",
    "phone": "+5546911112222",
    "address": "Rua Nova, 12 - Centro",
    "longDescription": "Pintura residencial com fino acabamento. Atendimento em toda a região.",
    "latitude": -26.0770,
    "longitude": -53.0520,
    "ownerEmail": "pintura@exemplo.com",
    "ownerName": "Pintor Profissional"
  },
  {
    "name": "Construções e Reformas em Geral",
    "category": "Pedreiros",
    "phone": "+5546933334444",
    "address": "Rua Safira, 50",
    "longDescription": "Reformas e construções do zero. Equipe qualificada. Atendimento em toda a região.",
    "latitude": -26.0835,
    "longitude": -53.0440,
    "ownerEmail": "obras@exemplo.com",
    "ownerName": "Mestre de Obras"
  }
];

async function seedMassCompanies() {
  console.log('[SEED] Iniciando importação em massa de empresas para o banco do Hostinger...');

  try {
    const salt = await bcrypt.genSalt(10);
    // Senha padrão temporária para os donos acessarem o painel
    const defaultPassword = await bcrypt.hash('radar123', salt);

    for (const company of companiesData) {
      console.log(`\n📦 Processando: ${company.name}`);

      let userId: string | null = null;

      // 1. Criar ou buscar o usuário (dono)
      if (company.ownerEmail && company.ownerName) {
        const existingUsers = await db.select().from(users).where(eq(users.email, company.ownerEmail));
        
        if (existingUsers.length > 0) {
          userId = existingUsers[0].id;
          console.log(`  -> Usuário já existe para ${company.ownerEmail}`);
          
          // Se era só USER, promovemos a BUSINESS para poder ter empresas
          if (existingUsers[0].role === 'USER') {
             await db.update(users).set({ role: 'BUSINESS' }).where(eq(users.id, userId));
          }
        } else {
          console.log(`  -> Criando NOVO usuário para ${company.ownerEmail}`);
          const newUser = {
            id: crypto.randomUUID(),
            name: company.ownerName,
            email: company.ownerEmail,
            phone: company.phone || null,
            role: 'BUSINESS' as const,
            password: defaultPassword,
          };
          await db.insert(users).values(newUser);
          userId = newUser.id;
        }
      }

      // 2. Inserir a Empresa
      console.log(`  -> Cadastrando estabelecimento...`);
      const businessId = crypto.randomUUID();
      await db.insert(businesses).values({
        id: businessId,
        userId: userId,
        name: company.name,
        category: company.category,
        longDescription: company.longDescription,
        address: company.address,
        phone: company.phone,
        latitude: company.latitude,
        longitude: company.longitude,
      });

      // 3. Inserir Ofertas (se houver)
      if ('offers' in company && Array.isArray(company.offers)) {
        for (const offer of company.offers) {
           console.log(`  -> Inserindo oferta: ${offer.title}`);
           await db.insert(offers).values({
               id: crypto.randomUUID(),
               businessId: businessId,
               title: offer.title,
               description: offer.description,
               rewardPoints: offer.rewardPoints || 100
           });
        }
      }
      
      console.log(`  -> ✅ ${company.name} importada com sucesso!`);
    }

    console.log('\n🚀 [SEED] IMPORTAÇÃO CONCLUÍDA COM SUCESSO! Todas as empresas foram adicionadas ao banco da Hostinger.');
  } catch (error) {
    console.error('\n❌ [SEED] Erro crítico durante a importação:', error);
  } finally {
     process.exit(0);
  }
}

seedMassCompanies();
