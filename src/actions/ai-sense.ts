'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface NearbyOffer {
  title: string;
  price: number;
  businessName: string;
  distance: number;
}

export async function getNinjaSense(offers: NearbyOffer[]): Promise<string> {
  // Tratamento de Erros (Pilar 3): Array vazio
  if (!offers || offers.length === 0) {
    return 'Seu radar está limpo, Ninja. Nenhum alvo neste setor. Mova-se pelas sombras para outra região e tente novamente.';
  }

  try {
    // Alfabetização Lógica (Pilar 1): A chave é lida com segurança em ambiente Node/Server Edge do Next.js.
    const apiKey = process.env['GEMINI_API_KEY'];
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined or missing.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // gemini-2.5-flash foi escolhido por ser extremante ágil em processar JSON estruturado e devolver resumos curtos.
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Alfabetização Lógica (Pilar 1): Como passamos o contexto ao modelo de "linguagem natural"?
    // Modelos são treinados nativamente em corpus contendo JSON. Converter o array usando JSON.stringify
    // mantém as hierarquias (title, distance, price) perfeitas para a máquina "ler" sem precisar gastar tokens de formatação humana.
    const offersContext = JSON.stringify(offers, null, 2);

    const prompt = `
Você é o Mentor Ninja, um estrategista de economia local. 
Sua missão é analisar as missões (ofertas) disponíveis e recomendar o melhor curso de ação. 
Seja breve, use gírias ninja modernas (Alvo, Setor, Interceptação, Chakra, Artefato) e foque no custo-benefício (recompensa vs distância).

Aqui estão os Alvos mapeados no radar atual (formato JSON):
${offersContext}

Gere o seu conselho ninja de forma direta (máx 2 parágrafos curtos).
`;

    const result = await model.generateContent(prompt);
    
    // Fallback interno caso o objeto chegue ausente ou inesperado (Pilar 3)
    const text = result.response?.text?.();
    if (!text) {
      throw new Error('Blank AI Text Response.');
    }

    return text;
  } catch (error) {
    if (process.env.NODE_ENV === 'test') {
      console.error('[AI Ninja Sense Test Debug]:', error);
    } else {
      console.error('[AI Ninja Sense] Interferência ou falha:', error);
    }
    // Tratamento de Erros (Pilar 3)
    return 'Sentido Ninja obscurecido por interferência. Tente novamente em instantes.';
  }
}
