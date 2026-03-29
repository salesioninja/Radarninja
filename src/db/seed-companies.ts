import { db } from './index';
import { users, businesses, offers } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const companiesData = [
  {
    "name": "Beltrão Hidráulica",
    "category": "Encanador",
    "phone": "+5546911110001",
    "address": "Rua Tenente Camargo, 1500 - Centro",
    "longDescription": "Atendimento rápido em todo o Sudoeste. Especialista em caça-vazamentos.",
    "latitude": -26.0775,
    "longitude": -53.0512,
    "ownerEmail": "contato@beltraohidraulica.com.br",
    "ownerName": "Claudemir Souza"
  },
  {
    "name": "Eletro FB",
    "category": "Eletricista",
    "phone": "+5546922220002",
    "address": "Av. Júlio Assis Cavalheiro, 800 - Centro",
    "longDescription": "Manutenção elétrica industrial e residencial.",
    "latitude": -26.0750,
    "longitude": -53.0530,
    "ownerEmail": "eletrofb@email.com",
    "ownerName": "Jair Eletricista"
  },
  {
    "name": "Odonto Sudoeste",
    "category": "Dentista",
    "phone": "+554635241010",
    "address": "Rua Ponta Grossa, 120 - Vila Nova",
    "longDescription": "Implantes e estética dental avançada em Beltrão.",
    "latitude": -26.0820,
    "longitude": -53.0450,
    "ownerEmail": "vargas@odonto.com",
    "ownerName": "Dr. Luiz Vargas"
  },
  {
    "name": "Clínica Médica Beltrão",
    "category": "Médico",
    "phone": "+554635234455",
    "address": "Rua Antonina, 450 - Centro",
    "longDescription": "Pediatria e Ginecologia com agendamento online.",
    "latitude": -26.0762,
    "longitude": -53.0488,
    "ownerEmail": "agendamento@clinicabeltrao.com",
    "ownerName": "Dra. Marcia Helena"
  },
  {
    "name": "NutreBem Beltrão",
    "category": "Nutricionista",
    "phone": "+5546955550005",
    "address": "Rua Curitiba, 10 - Alvorada",
    "longDescription": "Emagrecimento saudável e nutrição esportiva.",
    "latitude": -26.0880,
    "longitude": -53.0610,
    "ownerEmail": "nutre@bemfb.com",
    "ownerName": "Fernanda Silva"
  },
  {
    "name": "Espaço Mente - Psicologia",
    "category": "Psicólogo",
    "phone": "+5546966660006",
    "address": "Rua São Paulo, 200 - Centro",
    "longDescription": "Psicoterapia para adultos e casais.",
    "latitude": -26.0745,
    "longitude": -53.0555,
    "ownerEmail": "rodrigo.psi@email.com",
    "ownerName": "Rodrigo Mendes"
  },
  {
    "name": "Marcenaria Concórdia",
    "category": "Marceneiro",
    "phone": "+5546977770007",
    "address": "Rua Maringá, 55 - Industrial",
    "longDescription": "Móveis planejados de alto padrão.",
    "latitude": -26.0650,
    "longitude": -53.0400,
    "ownerEmail": "concordia@moveis.com",
    "ownerName": "Altair Marcenaria"
  },
  {
    "name": "Lava Car Capanema",
    "category": "Lava Car",
    "phone": "+5546988880008",
    "address": "Rua Porto Alegre, 1000 - Pinheirinho",
    "longDescription": "Lavagem simples e detalhada. Higienização interna.",
    "latitude": -26.0950,
    "longitude": -53.0300,
    "ownerEmail": "lavacar@capanema.com",
    "ownerName": "Tiago Oliveira",
    "offers": [
      {
        "title": "Promo Terça-Feira",
        "description": "20% de desconto para lavagem completa às terças.",
        "rewardPoints": 80
      }
    ]
  },
  {
    "name": "Mecânica do Beto",
    "category": "Mecânica",
    "phone": "+554635241122",
    "address": "Av. Natalino Faust, 300 - Luther King",
    "longDescription": "Suspensão, freios e motor. Diagnóstico por scanner.",
    "latitude": -26.0700,
    "longitude": -53.0600,
    "ownerEmail": "beto.mecanica@email.com",
    "ownerName": "Roberto Carlos"
  },
  {
    "name": "Chapeação Beltrãoense",
    "category": "Chapeador",
    "phone": "+554635243344",
    "address": "Rua União da Vitória, 40 - Miniguaçu",
    "longDescription": "Pintura em estufa e recuperação de batidas.",
    "latitude": -26.0850,
    "longitude": -53.0700,
    "ownerEmail": "chapeacao@fb.com",
    "ownerName": "Ivan Chapeador"
  },
  {
    "name": "Farmácia do Povo FB",
    "category": "Farmácia",
    "phone": "+554635245566",
    "address": "Rua Ponta Grossa, 500 - Centro",
    "longDescription": "Entrega grátis em todo o perímetro urbano.",
    "latitude": -26.0780,
    "longitude": -53.0500,
    "ownerEmail": "farma@povo.com",
    "ownerName": "Farmacêutico Paulo"
  },
  {
    "name": "Pintura Sudoeste",
    "category": "Pintor",
    "phone": "+5546911112222",
    "address": "Rua Romeu Lauro Werlang, 12 - Centro",
    "longDescription": "Pintura residencial com fino acabamento.",
    "latitude": -26.0770,
    "longitude": -53.0520,
    "ownerEmail": "pinturas@sudoeste.com",
    "ownerName": "João Pintor"
  },
  {
    "name": "Mestre de Obras Beltrão",
    "category": "Pedreiros",
    "phone": "+5546933334444",
    "address": "Rua Porto Alegre, 50 - Vila Nova",
    "longDescription": "Reformas e construções do zero. Equipe qualificada.",
    "latitude": -26.0835,
    "longitude": -53.0440,
    "ownerEmail": "obras@beltrao.com",
    "ownerName": "Seu Manoel"
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
