# CONTEXT.md - Memória de Longo Prazo

Bem-vindo(a) ao projeto **Negócios Ninja**. Este documento serve como guia arquitetural, estratégico e técnico para IAs ou novos desenvolvedores que venham atuar neste repositório.

## Visão Geral e Propósito
O **Negócios Ninja** é uma plataforma de comércio local desenhada para conectar usuários finais a empresas e serviços na sua região. O aplicativo estrutura-se em um modelo de Marketplace ou "Vitrine de Empresas" com três pilares principais:
1. **Administração (Admin)**: Gestão total da plataforma, validação e governança de dados.
2. **Comerciante (Business)**: Proprietários de pequenos e médios negócios locais que expõem seus serviços, ofertas e produtos no aplicativo para captação de clientes (muitas vezes guiando o lead para o WhatsApp ou outro canal).
3. **Usuário Final (User)**: O consumidor local que navega pelas oportunidades, visualiza ofertas por proximidade geográfica e interage com os negócios (via mapas/chat/redes).

## Arquitetura de Software
O sistema segue a arquitetura **RSC (React Server Components)** impulsionada pelo framework Next.js (App Router), dividindo claramente interface (Client) de processamento backend (Server) sem a necessidade de uma API REST desacoplada explícita.

- **Estrutura de Diretórios**:
  - `src/app/`: Define as rotas (`/admin`, `/dashboard` para lojistas, `/login`, `/register`). Utiliza o layout do App Router garantindo hidratação apenas quando necessário.
  - `src/actions/`: Centraliza todas as **Server Actions**. As ações recebem inputs diretos do React (components/formulários) e resolvem transações no banco de dados. Todas as interações mutáveis devem passar por aqui usando um "Action Wrapper" que cuida de ACL e respostas padronizadas.
  - `src/components/`: Componentes visuais puramente UI ou lógicos reusáveis (Tailwind CSS, Shadcn/ui).
  - `src/db/`: Contém os schemas do banco (`schema.ts`), as instâncias locais (SQLite via Drizzle), e scripts de manutenção (seeds, exportações).
  - `src/schema/`: Schemas de validação de dados utilizando Zod para tipagem estrita no Frontend e no Backend simultaneamente.
  - `src/__tests__/`: Pasta exclusiva para testes de integração com o banco e lógica de negócios.

- **Fluxo de Dados**:
  O fluxo normal de operação é: Formulário Web → Validação Frontend Zod → `await action()` (Server Action) → Verificação de Sessão JWT/Auth.js → Validação Backend Zod → Query no SQLite (via Drizzle ORM) → Retorno tipado `ActionResponse<T>`.

## Tech Stack Detalhada
- **Linguagem Principal**: TypeScript (Estrito).
- **Framework Frontend/Fullstack**: Next.js 16.2.0 (App Router, React 19).
- **Estilização**: Tailwind CSS v4, Base UI, tw-animate-css, Framer Motion para animações.
- **Componentes**: Arquitetura híbrida envolvendo padrões Shadcn UI e Lucide React para ícones.
- **Banco de Dados**: SQLite gerenciado via `@libsql/client` e **Drizzle ORM** (`drizzle-kit` para migrações). Preparado para escalar caso necessário (podendo integrar-se com Turso/Hostinger).
- **Autenticação e Segurança**: NextAuth (`next-auth@5.0.0-beta.30` - Auth.js) acoplado com `bcryptjs` para credenciais manuais (CredentialsProvider) e uso do adaptador Drizzle, rodando local em Web Cookies/JWT na estratégia Edge.
- **Inteligência Artificial**: Google Generative AI (`@google/generative-ai`) integrado localmente no fluxo e hooks webhooks de integração (e.g. `n8n`).
- **PWA e Notificações**: Uso de `@ducanh2912/next-pwa` em conjunto com `web-push` e VAPID keys mantendo um worker rodando para notificações em tempo real geolocalizadas.

## Mapeamento de Funcionalidades
A aplicação divide estritamente os acessos governados pela role do usuário (`USER`, `BUSINESS`, `ADMIN`).

### 1. Área Admin (`/admin`)
- **Acesso Crítico**: Somente uma conta possui acesso supremo garantido (`admin@acessaronline.com.br`). Demais contas que tiverem ADMIN ganham downgrade para USER no ato do login como proteção automática.
- Funcionalidades: Dashboard superior, C.R.U.D total de Entidades (Negócios "Businesses" e Ofertas "Offers"). Pode editar coordenadas, links de integração (webhook n8n do lojista), produtos dentro das ofertas em JSON, alterar o prazo da vaga e emitir Notificações Push Globais.

### 2. Área Comerciante (`BUSINESS` access em `/dashboard`)
- Representa os donos das lojas cadastradas na DB na tabela `businesses`.
- Eles vinculam produtos dentro da suas `Offers`. Um "Business" pode alterar localidade, descrição e informações de contato. (O desenvolvimento do dashboard de auto-serviço do comerciante está sob governança das Server Actions mas atrelado logica e geograficamente a table `business`).

### 3. Área Usuário Final (`USER`)
- O foco principal é a vitrine (Marketplace/Radar UI).
- Sistema de busca semântica, cálculos matemáticos na query de mapa (Haversine/Geolocalização para filtrar negócios próximos ao usuário).
- Visualiza estabelecimentos, entra em contato pelo botão de WhatsApp que pré-carrega mensagens parametrizadas e engaja no site acumulando possíveis Reward Points das `Offers`. Possibilidade de receber Notificações Web Push.

## Regras de Negócio Críticas
1. **Controle de Acessos Rígido no Edge**: O arquivo `middleware.ts` bloqueia invasões isolando o diretório de `/admin` para estritos administradores e barrando usuários leigos nas telas do `/dashboard`.
2. **Server Action Protection**: Toda mutação no DB passa pelo High Order Function `authenticatedAction({ requiredRole: 'XXX' }, async () => {})`. Isso blinda a ação do backend caso um cliente burle o front-end.
3. **Cascatas de Deleção**: Na tabela, as `Offers` interligam-se a um `Business`. O relacionamento DB Delete Cascade destrói as ofertas pendentes quando a loja é removida.
4. **Armazenamento Híbrido Drizzle**: Para maior facilidade estrutural, a listagem de `Products` pertinentes a `Offers` é arquivada em formato JSON Mode dentro da string no SQLite, viabilizando arrays genéricos num cenário SQL clássico sem table extra para products.

## Padrões de Código e Estilo
Para garantir uma harmonia técnica em toda contribuição futura:
- **Clean Architecture + RSC Prático**: Evite excesso de injeção de dependência herdado de Node monolítico. Focar no Next.js patterns (separação severa entre `use client` nas folhas e manipulação de DB direta no server/actions).
- **Server Component First**: Sempre que possível, componentes carregam os dados já no render de servidor. Componentes interativos recebem dados via props passados pelo parent server component.
- **Funcional e Previsível**: Utilize tipagem rigorosa Zod + TypeScript, não utilize o tipo `any`. Retorne sempre dicionários com `{ success: boolean, data?: any, error?: string }` para que o frontend lide com falhas amigavelmente, nunca lançando Throw genérico sem catch em Server Actions.
- **Estilização Tailwind**: Use classes puras do Tailwind. Componentes grandes podem ser encapsulados, mas não escreva CSS convencional global a menos que extremamente necessário.

## Protocolo de Testes (TDD)
- O framework de escolha é o **Vitest**, otimizado para executar nativamente os ES Modules do TypeScript sem babel.
- Ambiente: Roda em modo `node`.
- Localização: Os arquivos de testes ficam centralizados na pasta `src/__tests__/`, mas o padrão estendido engloba sufixo `.test.ts` e `.test.tsx`.
- Validação: Os testes rodados validam a integração. Ao escrever uma Server Action nova (arquivos `actions/*`), o desenvolvedor **deve escrever um teste de integração no __tests__** atestando a persistência no SQLite e a validade do Zod.
- Comando local: Rodar `npm run test` antes de todos os PRs/Deploys.

## Dúvidas Técnicas para o Piloto
Para garantir que futuras integrações sejam feitas sem invenções errôneas da IA, o operador do sistema precisa esclarecer:
1. **Pagamentos e Transações Financeiras**: Existe um fluxo de Checkout in-app, ou todas as vendas atualmente correm por fora no WhatsApp usando o click-to-chat parameter (`link` gerado nos botões dos produtos)? E os Reward Points (`rewardPoints`), como e quando eles são consolidados / trocados pelo Usuário?
2. **Setup do Lojista (Onboarding)**: Qual é o fluxo final para que um Usuário se torne Comerciante (`BUSINESS`)? O Admin valida o CNPJ e o insere manualmente ou existe um portal automático pedindo documentação?
3. **Geocodificação**: Como o aplicativo converte o endereço do Lojista em Lat/Long automatizado? Atualmente dependemos de alguma chave de API de Maps oculta (e.g. Google Maps Geocoding integration) no save do formulário ou o próprio lojista crava o pino no mapa?
4. **Integração Automática via AI/N8N**: O fluxo completo do Webhook salvo no campo `n8nEndpointUrl`. Exatamente que payload o sistema atirará para o N8N da loja e em qual ciclo de vida (no chat, na compra)?
