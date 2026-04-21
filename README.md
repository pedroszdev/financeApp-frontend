# FinanceApp — Frontend 💸

SPA em **React + Vite** para o sistema de gestão financeira pessoal
FinanceApp. Consome a API REST do projeto irmão
[`pedroszdev/financeApp-api`](https://github.com/pedroszdev/financeApp-api).

A interface mostra o saldo, receitas e despesas do mês, gráficos de
evolução e distribuição por categoria, e permite cadastrar/editar/excluir
transações com filtros e paginação.

> ⚠️ **Não existe instância pública da API.** Para rodar este frontend é
> obrigatório clonar o repo da API e subi-la localmente (ou em um host
> próprio). Instruções em [Passo 1](#1-suba-a-api-localmente) abaixo.

## 🚀 Funcionalidades

- **Autenticação completa** — registro, login e logout com JWT access +
  refresh; refresh automático em `401` e redirect para `/login` quando a
  sessão expira.
- **Dashboard** — três cards de resumo (saldo, receitas/despesas do mês),
  gráfico de linha dos últimos 6 meses, donut da distribuição por
  categoria e lista das 5 transações mais recentes.
- **Transações** — tabela (desktop) / cards (mobile) com filtros por
  descrição (debounce 300ms), tipo e categoria, mais paginação server-side.
  Criar, editar e excluir via modal com validação em tempo real e
  confirmação para remoção.
- **Relatórios** (bônus) — totais do mês, ranking de categorias com barras
  de progresso e gráfico de barras por semana do mês.
- **Responsivo de verdade** — layout adapta de 375px a desktop, sidebar
  vira drawer no mobile, tabela vira cards, toque ≥ 44×44px em qualquer
  controle.
- **Feedback consistente** — skeletons durante fetch, toasts de sucesso/erro
  depois de cada mutação, estado vazio com ilustração em toda lista.

## 🛠️ Stack

- **React 18** + **Vite 5** (JSX, HMR, build rápido)
- **React Router v6** (roteamento declarativo com rotas protegidas)
- **Tailwind CSS 3** — design system próprio, sem UI kit
- **Chart.js 4** via **react-chartjs-2** (linha, donut, barra)
- **fetch** nativo num wrapper em `services/api.js`
- **Context API** para autenticação; `useState`/`useReducer` local para
  forms, filtros e modais (sem Redux/Zustand — escopo não pede)

## 📦 Como rodar

Pré-requisitos: Node.js 18+, npm e acesso a um PostgreSQL (Neon free ou
local).

### 1. Suba a API localmente

O frontend **não funciona sem a API no ar.** Em outro diretório:

```bash
git clone https://github.com/pedroszdev/financeApp-api.git
cd financeApp-api
npm install

# Crie .env com:
#   DATABASE_URL=postgresql://USER:PASS@HOST/DB?sslmode=require
#   JWT_ACCESS_SECRET=string-aleatoria-longa
#   JWT_REFRESH_SECRET=outra-string-aleatoria
# Se for a primeira execução, descomente `sincronizarTabelas()` em index.js
# para criar as tabelas, rode uma vez, depois comente de volta.

npm run dev      # fica ouvindo em http://localhost:3000
```

Confira com `curl http://localhost:3000/` — deve retornar
`{"message":"Token não fornecido"}` (401). Isso significa que está no ar.

Detalhes completos estão no README do repo da API.

### 2. Suba o frontend

De volta a este diretório:

```bash
cd financeapp-frontend
npm install
npm run dev
```

Abra **http://localhost:5173**. O default já aponta para
`http://localhost:3000` via proxy do Vite, então se a API estiver de pé,
funciona sem tocar em nada.

### Opcional — host da API diferente

Se você subiu a API em outra porta/URL (ex.: deploy próprio no Render,
Fly.io, Railway), crie um `.env` neste diretório:

```bash
cp .env.example .env
# edite VITE_API_TARGET para sua URL, ex.: https://minha-api.fly.dev
npm run dev
```

## 🔧 Variáveis de ambiente

Veja `.env.example`. Ambas opcionais — os defaults funcionam para API
local.

| Variável | Padrão | O que faz |
|---|---|---|
| `VITE_API_TARGET` | `http://localhost:3000` | Alvo do proxy do Vite dev server. Lido em `vite.config.js` via `loadEnv()`. |
| `VITE_API_BASE_URL` | `/api` | Prefixo dos requests no código cliente. Em dev mantenha `/api` para casar com o proxy; em produção aponte para a URL absoluta da API (exige CORS configurado no backend). |

## 🌐 Por que um proxy?

A API **não tem CORS configurado**. Mesmo rodando tudo em localhost, um
SPA em `localhost:5173` chamando `localhost:3000` seria bloqueado pelo
navegador no preflight (são origens diferentes).

O `vite.config.js` contorna isso em dev proxyando `/api/*` para o alvo
com `changeOrigin: true`. Como o browser enxerga tudo como mesma origem
(`localhost:5173`), não há preflight e tudo flui.

Em **produção**, duas saídas:
1. Adicionar `cors` na API (uma linha em `index.js`) e redeployar.
2. Servir este build estático pelo mesmo domínio da API.

## 🔐 Autenticação (JWT)

Fluxo no `services/api.js` + `context/AuthContext.jsx`:

1. `POST /login` devolve `{ accesstoken, refreshtoken }` — os dois vão
   para `localStorage`.
2. Toda request autenticada inclui `Authorization: Bearer <accesstoken>`.
3. Se a API responder **401** e houver refresh token:
   - chama `POST /refresh` com `{ refreshToken }`;
   - em caso de sucesso, salva os novos tokens e **reexecuta a request
     original** transparentemente.
   - em caso de falha, limpa `localStorage`, dispara o evento
     `financeapp:auth-expired` e redireciona para `/login` com toast
     "Sessão expirada".
4. Refresh é serializado (`refreshPromise` singleton) para evitar várias
   chamadas em paralelo quando múltiplos requests falham juntos.

**Nota de segurança:** tokens em `localStorage` são vulneráveis a XSS.
Para um produto real, considere cookies `HttpOnly` emitidos pela API (exige
mudança no backend).

## 🔑 Regras de senha (registro)

A regex da API é estrita — a UI mostra um checklist em tempo real na tela
de registro:

- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula, 1 minúscula e 1 dígito
- Pelo menos 1 caractere especial entre `! % $ * & @ #`
- **Sem caracteres repetidos em sequência** (`aa`, `11`, etc.)

Exemplo válido: `Senha@12`.

## 🗺️ Rotas

| Caminho | Componente | Auth |
|---|---|---|
| `/login` | `pages/Login.jsx` | — |
| `/register` | `pages/Register.jsx` | — |
| `/dashboard` | `pages/Dashboard.jsx` | 🔒 |
| `/transactions` | `pages/Transactions.jsx` | 🔒 |
| `/reports` | `pages/Reports.jsx` | 🔒 |
| `/` e `/*` | redirect → `/dashboard` | — |

Rotas protegidas passam por `routes/ProtectedRoute.jsx`, que aguarda o
bootstrap do `AuthContext` (rehidratação do user a partir do
`localStorage` + `GET /`) antes de decidir renderizar ou redirecionar.

## 🎨 Design system

- **Paleta** (definida em `tailwind.config.js`):
  - `brand.navy #1e3a5f`, `brand.blue #2563eb` — primária
  - `brand.green #10b981` — receitas
  - `brand.red #ef4444`, `brand.orange #f97316` — despesas
  - `ink.50/100/500/900` — neutros para bg e texto
- **Tipografia** — Inter (Google Fonts) carregada via `<link>` no `index.html`.
  Escalas: 12 / 13 / 14 / 16 / 20 / 24 / 28 px.
- **Raios** — `sm 8px` (inputs/botões), `md 12px` (cards), `lg 16px` (modais).
- **Classes utilitárias** em `src/index.css` (`@layer components`):
  `.card`, `.input`, `.btn-primary`, `.btn-secondary`, `.btn-danger`,
  `.btn-ghost`, `.badge-income`, `.badge-expense`, `.skeleton`.

Valores monetários passam sempre por `utils/formatCurrency.js`
(`Intl.NumberFormat` pt-BR, fallback `R$ 0,00` em `NaN`/`undefined`).
Datas por `utils/formatDate.js` (`DD/MM/YYYY`).

## 🏗️ Estrutura

```
src/
├── main.jsx                entry: <BrowserRouter> + <App />
├── App.jsx                 providers + Routes
├── index.css               Tailwind + tokens do design system
│
├── context/
│   └── AuthContext.jsx     user, login/register/logout, refresh, bootstrap
│
├── services/
│   └── api.js              fetch wrapper, refresh automático, toasts de erro
│
├── hooks/
│   ├── useToast.jsx        ToastProvider + useToast()
│   └── useDebounce.js
│
├── utils/
│   ├── constants.js        CATEGORIAS, TIPOS, ícones, STORAGE_KEYS
│   ├── formatCurrency.js
│   └── formatDate.js
│
├── routes/
│   └── ProtectedRoute.jsx
│
├── components/
│   ├── ui/                 Button, Input, Select, Modal, ConfirmDialog,
│   │                       Toaster, Skeleton, Badge, EmptyState, Spinner
│   ├── layout/             Sidebar (drawer mobile), Header, Layout
│   ├── dashboard/          SummaryCard, RecentTransactions
│   ├── transactions/       Filters, TransactionTable, TransactionCards,
│   │                       Pagination, TransactionModal
│   └── charts/             LineChart, DonutChart, BarChart, chartSetup
│
└── pages/
    ├── AuthLayout.jsx      split branding/form
    ├── Login.jsx
    ├── Register.jsx
    ├── Dashboard.jsx
    ├── Transactions.jsx
    └── Reports.jsx
```

## 🔗 Mapeamento frontend → API

A API real usa paths e campos em português. O frontend traduz tudo na
camada de apresentação — rótulos e mensagens continuam em pt-BR, mas o
payload enviado/recebido casa exatamente com o backend:

| Uso no frontend | Endpoint | Body enviado |
|---|---|---|
| Login | `POST /login` | `{ email, senha }` |
| Registro | `POST /user` | `{ nome, email, senha }` |
| Logout | `GET /logout` | — |
| Refresh | `POST /refresh` | `{ refreshToken }` |
| Dashboard + gráficos | `GET /` | — |
| Lista de transações | `GET /transacoes?search=&tipo=&categoria=&page=` | — |
| Criar transação | `POST /transacao` | `{ descricao, valor, tipo, categoria }` |
| Editar transação | `PUT /transacao/edit/:id` | `{ descricao, valor, tipo, categoria }` |
| Excluir transação | `DELETE /transacao/delete/:id` | — |

**Convenções:**

- `tipo` é sempre `"Receita"` ou `"Despesa"` (capitalizado).
- `categoria` ∈ `{ Alimentação, Transporte, Saúde, Educação, Lazer,
  Moradia, Vestuário, Outros }` — lista hardcoded em `utils/constants.js`
  porque não há endpoint de categorias.
- `data` é gerada pelo servidor; o modal de nova transação **não** tem
  campo de data (a listagem, claro, exibe a data que a API devolve).
- Erros de `/login` vêm em `{ erro }` (sem "r"); demais rotas em
  `{ error }`. O wrapper lê ambos.

## 🧰 Scripts

- `npm run dev` — servidor de dev com HMR (porta 5173)
- `npm run build` — build de produção em `dist/` (~130 KB gzip)
- `npm run preview` — servidor estático para testar o build

## 🚢 Deploy

Qualquer host de estáticos serve (`dist/`): Vercel, Netlify, Cloudflare
Pages, GitHub Pages, Render static site, S3 + CloudFront, etc.

Antes de fazer deploy:

1. Ter a API deployada em algum lugar com URL pública estável
   (Render, Fly.io, Railway, VPS, etc.).
2. Rodar `npm run build` — o resultado fica em `dist/`.
3. Configurar a variável `VITE_API_BASE_URL` no provedor apontando para a
   URL absoluta da API (`https://sua-api.com`), **não** mais `/api`.
4. **Pré-requisito**: a API precisa aceitar o domínio do frontend via CORS.
   Sem isso, o browser vai bloquear os requests. Alternativa é servir o
   build pela própria API atrás do mesmo domínio.
5. Configurar o fallback SPA do host para `index.html` (todo host de
   estático tem essa opção — ela garante que `/dashboard` não retorne 404
   quando o usuário recarregar a página).

## ⚠️ Quirks conhecidos (herdados da API)

- **`PUT /transacao/edit/:id` retorna apenas a contagem `[1]`**, não a
  transação atualizada — por isso o frontend refaz a listagem depois de
  salvar em vez de fazer optimistic update com o objeto de retorno.
- **Nenhum endpoint para listar categorias** — se a API passar a ter um
  `GET /categorias` no futuro, trocar o array hardcoded em
  `utils/constants.js` por um fetch no bootstrap.
- **Sem instância pública da API** — este frontend depende de você subir
  a API (veja Passo 1).

## 🧪 Verificação manual (checklist)

Com API local + frontend no ar, validar o fluxo completo:

1. ✅ Registro cria a conta e já faz login automático (`Senha@12` passa na regex).
2. ✅ Login salva `accesstoken` e `refreshtoken` em `localStorage`.
3. ✅ Dashboard renderiza 3 cards, gráfico de linha, donut e lista de recentes.
4. ✅ Criar transação atualiza a tabela e o dashboard quando você volta.
5. ✅ Filtros (busca / tipo / categoria) + paginação funcionam juntos.
6. ✅ Editar abre modal pré-preenchido e persiste alterações.
7. ✅ Excluir pede confirmação e remove da lista.
8. ✅ Em 375px, sidebar vira drawer e tabela vira cards; sem overflow horizontal.
9. ✅ Remover só o `accesstoken` do `localStorage` (manter refresh) e recarregar — deve voltar à home sem ir ao login (refresh silencioso).
10. ✅ Remover ambos e recarregar — redireciona para `/login` com toast "Sessão expirada".
