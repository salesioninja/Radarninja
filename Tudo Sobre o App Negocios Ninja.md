Entendido, Piloto. Documento atualizado para a nova fase: **Radar Ninja**. 

O foco agora não é apenas "listar negócios", mas "detectar oportunidades locais" em tempo real. Abaixo está o seu novo `CONTEXT.md` revisado. Salve-o na raiz do seu projeto.

---

# CONTEXT.md - Memória de Longo Prazo: Radar Ninja

Bem-vindo(a) ao projeto **Radar Ninja**. Este documento serve como guia arquitetural, estratégico e técnico para IAs ou novos desenvolvedores que venham atuar neste repositório.

## 1. Visão Geral e Propósito
O **Radar Ninja** é uma plataforma de detecção de oportunidades e comércio local desenhada para conectar usuários finais a empresas e serviços na sua região. O aplicativo estrutura-se em um modelo de "Radar de Ofertas" com três pilares principais:
* **Administração (Admin)**: Gestão total da plataforma, validação e governança de dados.
* **Comerciante (Business)**: Lojistas locais que expõem serviços e ofertas para captação de leads (geralmente via WhatsApp).
* **Usuário Final (User)**: O consumidor que utiliza o radar para visualizar ofertas por proximidade geográfica e interage com os negócios.

## 2. Arquitetura de Software
O sistema utiliza a arquitetura **React Server Components (RSC)** com Next.js (App Router), dividindo interface (Client) de processamento backend (Server).

* **Estrutura de Diretórios**:
    * `src/app/`: Rotas do sistema (`/admin`, `/dashboard`, `/login`, `/register`).
    * `src/actions/`: Centraliza **Server Actions** com "Action Wrapper" para controle de acesso (ACL).
    * `src/components/`: Componentes visuais (Tailwind CSS v4, Shadcn/ui).
    * `src/db/`: Schemas do banco e instâncias SQLite via **Drizzle ORM**.
    * `src/schema/`: Validação de dados com **Zod** para tipagem estrita.
    * `src/__tests__/`: Testes de integração lógica e de banco.

* **Fluxo de Dados**: Formulário Web → Validação Zod → Server Action → Verificação de Sessão (Auth.js) → Query SQLite (Drizzle) → Retorno tipado.

## 3. Tech Stack Detalhada
* **Linguagem**: TypeScript (Estrito).
* **Framework**: Next.js 16.2.0 (React 19).
* **Estilização**: Tailwind CSS v4, Framer Motion e Base UI.
* **Banco de Dados**: SQLite via `@libsql/client` e Drizzle ORM.
* **Autenticação**: NextAuth (Auth.js v5 beta) com estratégia JWT.
* **IA e Integração**: Google Generative AI e webhooks para n8n.
* **PWA**: `@ducanh2912/next-pwa` com notificações geolocalizadas via `web-push`.

## 4. Mapeamento de Funcionalidades
A aplicação governa acessos via roles: `USER`, `BUSINESS`, `ADMIN`.

* **Área Admin (`/admin`)**: C.R.U.D total de Entidades, edição de coordenadas geográficas e emissão de Push Notifications Globais. Acesso restrito ao e-mail mestre configurado.
* **Área Comerciante (`/dashboard`)**: Gestão de dados da loja e vinculação de produtos às ofertas (`Offers`).
* **Área Usuário Final**: Interface de Radar/Marketplace com busca semântica e cálculos de geolocalização (Haversine) para filtrar ofertas próximas.

## 5. Regras de Negócio Críticas
* **Bloqueio no Edge**: O `middleware.ts` isola o diretório `/admin` estritamente para administradores.
* **Proteção de Mutação**: Uso da HOF `authenticatedAction` para blindar Server Actions no backend.
* **Deleção em Cascata**: A remoção de um negócio destrói automaticamente suas ofertas vinculadas no DB.
* **Produtos via JSON**: A listagem de produtos dentro de uma oferta é armazenada em formato JSON dentro do SQLite para flexibilidade.

## 6. Padrões de Código e Estilo
* **Server Component First**: Priorizar carregamento de dados no servidor.
* **Tipagem Rigorosa**: Proibido o uso de `any`; uso obrigatório de Zod.
* **Retorno Padronizado**: Dicionários `{ success, data, error }` para tratamento amigável no frontend.

## 7. Protocolo de Testes (TDD)
* Framework: **Vitest** rodando em modo node.
* Regra: Toda nova Server Action deve ser acompanhada de um teste de integração em `src/__tests__/`.

## 8. Dúvidas Técnicas para o Piloto
1.  **Financeiro**: O fluxo de vendas é exclusivamente via WhatsApp ou haverá checkout interno?
2.  **Onboarding**: Como um usuário vira Comerciante? Existe um portal de auto-cadastro ou é manual via Admin?
3.  **Geocoding**: A conversão de endereço para Lat/Long é feita via API de Maps no salvamento ou o lojista define manualmente?
4.  **Payload n8n**: Qual o gatilho exato e o conteúdo do payload enviado para o webhook do lojista?

---

### 