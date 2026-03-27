import { db } from './index';
import { businesses, offers } from './schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const data = [
  {
    "nomeEmpresa": "NutriVida Funcional",
    "categoria": "Saúde e Bem-estar",
    "descricaoCurta": "Emagrecimento e Reeducação Alimentar",
    "descricaoLonga": "Especialista em nutrição clínica e esportiva. Montamos planos alimentares personalizados focados na sua rotina, garantindo resultados sem dietas malucas.",
    "whatsapp": "11999990001",
    "enderecoFisico": "Av. Paulista, 1000, Bela Vista, São Paulo - SP",
    "latitude": -23.563099,
    "longitude": -46.652136,
    "urlCapa": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "21/12/2026",
    "produtosServicos": ["Consulta Presencial", "Bioimpedância", "Plano Alimentar Mensal"]
  },
  {
    "nomeEmpresa": "Mente Serena Psicologia",
    "categoria": "Saúde Mental",
    "descricaoCurta": "Terapia Cognitivo-Comportamental",
    "descricaoLonga": "Um espaço seguro para você cuidar da sua saúde mental. Atendimento humanizado para ansiedade, depressão e autoconhecimento.",
    "whatsapp": "11999990002",
    "enderecoFisico": "Rua Augusta, 1500, Consolação, São Paulo - SP",
    "latitude": -23.557451,
    "longitude": -46.660305,
    "urlCapa": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "15/10/2026",
    "produtosServicos": ["Sessão Individual", "Terapia de Casal", "Avaliação Psicológica"]
  },
  {
    "nomeEmpresa": "Iron Performance CT",
    "categoria": "Esportes e Fitness",
    "descricaoCurta": "Personal Trainer e Condicionamento",
    "descricaoLonga": "Treinamento de alta performance para quem busca hipertrofia, emagrecimento ou qualidade de vida. Acompanhamento diário e correção biomecânica.",
    "whatsapp": "11999990003",
    "enderecoFisico": "Av. Brigadeiro Faria Lima, 2000, Pinheiros, São Paulo - SP",
    "latitude": -23.578500,
    "longitude": -46.688836,
    "urlCapa": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "01/11/2026",
    "produtosServicos": ["Treino Personalizado", "Consultoria Online", "Avaliação Física"]
  },
  {
    "nomeEmpresa": "Sorriso Branco Odontologia",
    "categoria": "Odontologia",
    "descricaoCurta": "Clareamento e Implantes Dentários",
    "descricaoLonga": "Clínica odontológica completa. Realizamos desde profilaxia básica até cirurgias complexas de implante e harmonização orofacial.",
    "whatsapp": "11999990004",
    "enderecoFisico": "Rua Oscar Freire, 500, Jardins, São Paulo - SP",
    "latitude": -23.565780,
    "longitude": -46.666991,
    "urlCapa": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "20/08/2026",
    "produtosServicos": ["Clareamento a Laser", "Implantes", "Limpeza Completa"]
  },
  {
    "nomeEmpresa": "Dr. Carlos - Medicina Integrativa",
    "categoria": "Medicina",
    "descricaoCurta": "Clínica Geral e Preventiva",
    "descricaoLonga": "Atendimento focado na prevenção de doenças e promoção da longevidade saudável. Tratamos o paciente de forma sistêmica e não apenas os sintomas.",
    "whatsapp": "11999990005",
    "enderecoFisico": "Av. Brasil, 800, Jardim América, São Paulo - SP",
    "latitude": -23.576839,
    "longitude": -46.666723,
    "urlCapa": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "30/09/2026",
    "produtosServicos": ["Consulta Presencial", "Check-up Executivo", "Telemedicina"]
  },
  {
    "nomeEmpresa": "LabExames Precisão",
    "categoria": "Saúde",
    "descricaoCurta": "Exames de Sangue e Imagem",
    "descricaoLonga": "Tecnologia de ponta para diagnósticos precisos. Coleta domiciliar disponível e resultados rápidos com acesso via portal do paciente.",
    "whatsapp": "11999990006",
    "enderecoFisico": "Rua Vergueiro, 1200, Paraíso, São Paulo - SP",
    "latitude": -23.574678,
    "longitude": -46.640810,
    "urlCapa": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "31/12/2026",
    "produtosServicos": ["Hemograma Completo", "Ultrassonografia", "Teste de DNA"]
  },
  {
    "nomeEmpresa": "Farmácia Preço Popular",
    "categoria": "Saúde e Varejo",
    "descricaoCurta": "Medicamentos com Desconto",
    "descricaoLonga": "Farmácia completa com medicamentos genéricos, perfumaria e suplementos com os melhores preços da região. Entregamos na sua casa.",
    "whatsapp": "11999990007",
    "enderecoFisico": "Av. Rebouças, 2500, Pinheiros, São Paulo - SP",
    "latitude": -23.568432,
    "longitude": -46.685933,
    "urlCapa": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "01/05/2026",
    "produtosServicos": ["Medicamentos Genéricos", "Perfumaria", "Aferição de Pressão"]
  },
  {
    "nomeEmpresa": "João Tubulações",
    "categoria": "Serviços Residenciais",
    "descricaoCurta": "Encanador 24h e Caça Vazamentos",
    "descricaoLonga": "Serviço especializado em detecção de vazamentos, desentupimentos, instalação de tubulações de água fria e quente. Atendimento emergencial 24 horas.",
    "whatsapp": "11999990008",
    "enderecoFisico": "Rua da Mooca, 3000, Mooca, São Paulo - SP",
    "latitude": -23.563914,
    "longitude": -46.594781,
    "urlCapa": "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "31/12/2026",
    "produtosServicos": ["Desentupimento", "Caça Vazamento", "Instalação de Pias"]
  },
  {
    "nomeEmpresa": "Chama Rápida Gás e Água",
    "categoria": "Distribuidora",
    "descricaoCurta": "Entrega de Gás e Galões de Água",
    "descricaoLonga": "Ficou sem gás? Entregamos em menos de 30 minutos na sua casa. Trabalhamos com água mineral das melhores fontes.",
    "whatsapp": "11999990009",
    "enderecoFisico": "Av. Jabaquara, 1500, Saúde, São Paulo - SP",
    "latitude": -23.612847,
    "longitude": -46.638510,
    "urlCapa": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "15/07/2026",
    "produtosServicos": ["Botijão de Gás 13kg", "Água Mineral 20L", "Troca de Mangueiras"]
  },
  {
    "nomeEmpresa": "Gesso Arte e Design",
    "categoria": "Construção e Reformas",
    "descricaoCurta": "Sancas, Forros e Drywall",
    "descricaoLonga": "Transformamos o seu ambiente com decorações em gesso, iluminação embutida e paredes em drywall. Acabamento premium e rapidez na obra.",
    "whatsapp": "11999990010",
    "enderecoFisico": "Rua Tuiuti, 1200, Tatuapé, São Paulo - SP",
    "latitude": -23.541460,
    "longitude": -46.575293,
    "urlCapa": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "10/06/2026",
    "produtosServicos": ["Forro de Gesso", "Sanca Invertida", "Paredes em Drywall"]
  },
  {
    "nomeEmpresa": "Cores Vivas Pinturas",
    "categoria": "Construção e Reformas",
    "descricaoCurta": "Pintura Residencial e Comercial",
    "descricaoLonga": "Especialistas em pintura interna e externa, texturas, grafiato e aplicação de massa corrida. Deixamos sua casa nova e sem sujeira.",
    "whatsapp": "11999990011",
    "enderecoFisico": "Av. Santo Amaro, 3000, Brooklin, São Paulo - SP",
    "latitude": -23.614607,
    "longitude": -46.682662,
    "urlCapa": "https://images.unsplash.com/photo-1562259929-b7e181d8d007?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "20/11/2026",
    "produtosServicos": ["Pintura Interna", "Textura e Grafiato", "Pintura de Fachadas"]
  },
  {
    "nomeEmpresa": "ConstruForte Alvenaria",
    "categoria": "Construção e Reformas",
    "descricaoCurta": "Pedreiro e Empreiteira",
    "descricaoLonga": "Do alicerce ao telhado. Executamos reformas completas, assentamento de porcelanato, contra-piso e pequenos reparos. Qualidade garantida.",
    "whatsapp": "11999990012",
    "enderecoFisico": "Estrada do Campo Limpo, 4000, Campo Limpo, São Paulo - SP",
    "latitude": -23.633909,
    "longitude": -46.764491,
    "urlCapa": "https://images.unsplash.com/photo-1504307651254-35680f356f58?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "15/12/2026",
    "produtosServicos": ["Assentamento de Pisos", "Alvenaria", "Reformas em Geral"]
  },
  {
    "nomeEmpresa": "Voltagem Certa Instalações",
    "categoria": "Serviços Residenciais",
    "descricaoCurta": "Eletricista Residencial e Predial",
    "descricaoLonga": "Instalação de quadros de força, fiação completa, instalação de ar-condicionado e solução de curtos-circuitos com segurança e norma técnica.",
    "whatsapp": "11999990013",
    "enderecoFisico": "Rua Domingos de Morais, 2000, Vila Mariana, São Paulo - SP",
    "latitude": -23.590509,
    "longitude": -46.634629,
    "urlCapa": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "30/10/2026",
    "produtosServicos": ["Troca de Fiação", "Instalação de Chuveiro", "Quadro de Distribuição"]
  },
  {
    "nomeEmpresa": "WoodCraft Marcenaria",
    "categoria": "Móveis e Decoração",
    "descricaoCurta": "Móveis Planejados Sob Medida",
    "descricaoLonga": "Projetamos e fabricamos móveis planejados para cozinhas, quartos e escritórios. Design moderno, ferragens de alta durabilidade e MDF de primeira linha.",
    "whatsapp": "11999990014",
    "enderecoFisico": "Av. dos Bandeirantes, 1000, Vila Olímpia, São Paulo - SP",
    "latitude": -23.596205,
    "longitude": -46.678235,
    "urlCapa": "https://images.unsplash.com/photo-1610555356070-d1ff0468903e?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "05/09/2026",
    "produtosServicos": ["Cozinhas Planejadas", "Guarda-roupas", "Painéis de TV"]
  },
  {
    "nomeEmpresa": "Moda Urbana Boutique",
    "categoria": "Moda e Vestuário",
    "descricaoCurta": "Roupas Femininas e Masculinas",
    "descricaoLonga": "As últimas tendências da moda com preços acessíveis. Roupas para o dia a dia, moda festa e acessórios exclusivos para você arrasar.",
    "whatsapp": "11999990015",
    "enderecoFisico": "Rua 25 de Março, 500, Centro, São Paulo - SP",
    "latitude": -23.543666,
    "longitude": -46.631557,
    "urlCapa": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "25/11/2026",
    "produtosServicos": ["Vestidos", "Camisas Sociais", "Jeans e Acessórios"]
  },
  {
    "nomeEmpresa": "Justiça & Direito Associados",
    "categoria": "Serviços Jurídicos",
    "descricaoCurta": "Advocacia Trabalhista e Cível",
    "descricaoLonga": "Consultoria e assessoria jurídica especializada. Defendemos seus direitos com ética e transparência em causas trabalhistas, de família e consumidor.",
    "whatsapp": "11999990016",
    "enderecoFisico": "Av. Ipiranga, 104, República, São Paulo - SP",
    "latitude": -23.544774,
    "longitude": -46.641604,
    "urlCapa": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80",
    "urlLogo": "",
    "webhookN8n": "https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja",
    "validadeOferta": "20/12/2026",
    "produtosServicos": ["Divórcio e Pensão", "Ações Trabalhistas", "Defesa do Consumidor"]
  }
];

function convertDate(brDate: string) {
  // 21/12/2026 -> 2026-12-21
  const parts = brDate.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return brDate;
}

async function main() {
  console.log('Inserting %d companies...', data.length);
  for (const item of data) {
    try {
      const [business] = await db.insert(businesses).values({
        name: item.nomeEmpresa,
        category: item.categoria,
        longDescription: item.descricaoLonga || null,
        n8nEndpointUrl: item.webhookN8n || null,
        logoUrl: item.urlLogo || null,
        address: item.enderecoFisico,
        phone: item.whatsapp,
        latitude: item.latitude,
        longitude: item.longitude,
      }).returning();

      const descriptionFormatted = `${item.categoria} | ${item.descricaoCurta}`;
      
      const mappedProducts = item.produtosServicos.map(p => ({
        name: p,
        price: 0,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        link: '',
        buttonText: 'Comprar'
      }));

      await db.insert(offers).values({
        businessId: business.id,
        title: item.descricaoCurta,
        description: descriptionFormatted,
        imageUrl: item.urlCapa || null,
        products: mappedProducts,
        rewardPoints: 100,
        expiresAt: convertDate(item.validadeOferta) || null,
      });
      console.log(`✅ Inserted ${item.nomeEmpresa}`);
    } catch (e) {
      console.error(`❌ Failed to insert ${item.nomeEmpresa}: `, e);
    }
  }
  
  console.log('Done!');
}

main().catch(console.error);
