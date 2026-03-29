const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

const updates = [
  { old: 'Corte e Hidratação', newTitle: 'Salão de Beleza e Estética', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/cabeleireira.jpeg' },
  { old: 'Litkno', newTitle: 'Loja de Materiais Elétricos', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/eletronicos.jpeg' },
  { old: 'Semana Experimental', newTitle: 'Academia e Fitness', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/academia.jpeg' },
  { old: 'Preço de Atacado', newTitle: 'Distribuidora de Produtos', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/distribuidora.jpeg' },
  { old: 'Orçamento sem Compromisso', newTitle: 'Metalúrgica e Serralheria', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/metalurgica.jpeg' },
  { old: 'Recarga com Desconto', newTitle: 'Equipamentos de Segurança e Incêndio', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/extintores.jpeg' },
  { old: 'Sessão de diagnóstico cortesia', newTitle: 'Clínica de Fisioterapia e Reabilitação', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/fisioterapia.jpeg' },
  { old: 'Desconto em Acessórios', newTitle: 'Eletrônicos e Acessórios', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/eletronicos.jpeg' },
  { old: 'Kit Embalagem Econômica', newTitle: 'Distribuidora de Embalagens', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/embalagens.jpeg' },
  { old: 'Venda Direta de Fábrica', newTitle: 'Produtos Diretos da Fábrica', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/produtos_de_fabrica.jpeg' },
  { old: 'Mecânica do Beto', newTitle: 'Mecânica Automotiva Especializada', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/mecanico.jpeg' },
  { old: 'Espaço Mente - Psicologia', newTitle: 'Clínica de Psicologia e Bem-Estar', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/psicologo.jpeg' },
  { old: 'Chapeação Beltrãoense', newTitle: 'Centro de Chapeação e Pintura', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/chapeador.jpeg' },
  { old: 'Eletro FB', newTitle: 'Serviços Elétricos e Manutenção', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/eletricista.jpeg' },
  { old: 'Pintura Sudoeste', newTitle: 'Pintura e Acabamentos Finos', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/pintor.jpeg' },
  { old: 'Beltrão Hidráulica', newTitle: 'Soluções em Hidráulica e Vazamentos', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/encanador.jpeg' },
  { old: 'Marceneiro', newTitle: 'Móveis Planejados e Marcenaria', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/marceneiro.jpeg' },
  { old: 'Clínica Médica Beltrão', newTitle: 'Centro Médico Multidisciplinar', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/medica.jpeg' },
  { old: 'Farmácia do Povo FB', newTitle: 'Farmácia e Drogaria 24h', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/farmacia.jpeg' },
  { old: 'NutreBem Beltrão', newTitle: 'Consultório de Nutrição Especializada', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/nutricionista.jpeg' },
  { old: 'Odonto Sudoeste', newTitle: 'Clínica Odontológica Integrada', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/dentista.jpeg' },
  { old: 'Mestre de Obras Beltrão', newTitle: 'Construções e Reformas em Geral', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/pedreiro.jpeg' },
  { old: 'Promo Terça-Feira', newTitle: 'Centro de Estética Automotiva', img: 'https://acessaronline.com.br/wp-content/uploads/2026/03/lava_car.jpeg' }
];

const cleanText = (text) => {
  if (!text) return text;
  return text.replace(/Beltrãoense|Beltrão|Sudoeste|Beto|FB/gi, 'Atendimento em toda a região');
};

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('Starting demo data update...');

  // 1. Update matching offers
  const [offers] = await connection.execute('SELECT id, title, description, image_url AS imageUrl FROM offers');
  for (const offer of offers) {
    const rule = updates.find(u => offer.title.includes(u.old) || u.old.includes(offer.title));
    
    let newTitle = offer.title;
    let newImg = offer.imageUrl;
    let newDesc = cleanText(offer.description);
    
    if (rule) {
      newTitle = rule.newTitle;
      newImg = rule.img;
      console.log(`Matched offer: ${offer.title} -> ${newTitle}`);
    } else {
      newTitle = cleanText(newTitle);
    }
    
    await connection.execute(
      'UPDATE offers SET title = ?, description = ?, image_url = ? WHERE id = ?',
      [newTitle, newDesc, newImg, offer.id]
    );
  }

  // 2. Update matching businesses
  const [businesses] = await connection.execute('SELECT id, name, long_description FROM businesses');
  for (const business of businesses) {
    const rule = updates.find(u => business.name.includes(u.old) || u.old.includes(business.name));
    
    let newName = business.name;
    let newDesc = cleanText(business.long_description);
    
    if (rule) {
      newName = rule.newTitle;
      console.log(`Matched business (from name): ${business.name} -> ${newName}`);
    } else {
      newName = cleanText(newName);
    }
    
    await connection.execute(
      'UPDATE businesses SET name = ?, long_description = ? WHERE id = ?',
      [newName, newDesc, business.id]
    );
  }

  console.log('Finished updating data!');
  await connection.end();
}

main().catch(console.error);
