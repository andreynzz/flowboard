# 🚀 Flowboard - Ambiente Preparado!

## ✅ Fase 1: Setup Completo

Parabéns! O ambiente está configurado. Aqui está o que foi feito:

### Instalado
- ✅ pnpm (gerenciador de pacotes)
- ✅ Next.js 16.2.6 com TypeScript
- ✅ Drizzle ORM + NeonDB
- ✅ Auth.js (NextAuth)
- ✅ dnd-kit (para drag-and-drop)
- ✅ Tailwind CSS + shadcn/ui
- ✅ Zod (validação)
- ✅ Nanoid (geração de IDs)

### Criado
- ✅ Estrutura de pastas (`src/db`, `src/actions`, `src/components`, `src/lib`, `src/types`)
- ✅ Schema Drizzle com todas as tabelas necessárias
- ✅ Arquivo de configuração Drizzle
- ✅ Validações com Zod
- ✅ TypeScript types
- ✅ Utilities (cn, formatDate, isOverdue)
- ✅ Scripts de banco de dados no package.json

## 🔑 Próximo Passo: Obter Credenciais

Para continuar com a **Fase 2** (Autenticação com GitHub + Banco de dados), você precisa de:

### 1️⃣ NeonDB PostgreSQL
1. Vá para https://console.neon.tech/
2. Crie uma conta / faça login
3. Crie um novo projeto
4. Copie a URL de conexão
5. Cole em `.env.local` → `DATABASE_URL`

### 2️⃣ GitHub OAuth App
1. Vá para https://github.com/settings/developers
2. Clique em "OAuth Apps"
3. Clique "New OAuth App"
4. Preencha:
   - Application name: `Flowboard (Dev)`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copie "Client ID" → `AUTH_GITHUB_ID` no `.env.local`
6. Copie "Client Secret" → `AUTH_GITHUB_SECRET` no `.env.local`

### 3️⃣ AUTH_SECRET
Execute no terminal:
```bash
openssl rand -base64 32
```
Cole o resultado em `.env.local` → `AUTH_SECRET`

## 📝 Arquivo `.env.local` Completo
```
DATABASE_URL=postgresql://user:password@host/database
AUTH_SECRET=seu-secret-aqui
AUTH_GITHUB_ID=seu-github-id
AUTH_GITHUB_SECRET=seu-github-secret
AUTH_URL=http://localhost:3000
```

## 📁 Estrutura do Projeto
```
flowboard/
├── src/
│   ├── db/
│   │   ├── schema.ts          (Tabelas Drizzle)
│   │   └── index.ts           (Conexão com NeonDB)
│   ├── lib/
│   │   ├── validations.ts     (Schemas Zod)
│   │   ├── utils.ts           (Funções auxiliares)
│   │   └── auth.ts            (Vem em breve)
│   ├── types/
│   │   └── index.ts           (TypeScript types)
│   ├── actions/               (Server Actions - vem em breve)
│   ├── components/            (React components - vem em breve)
│   ├── app/                   (App Router)
│   │   ├── page.tsx           (Landing page - vem em breve)
│   │   ├── layout.tsx
│   │   └── app/               (Rotas protegidas - vem em breve)
│   └── AGENTS.md
├── .env.local                 (CONFIGURE ISSO!)
├── .env.example
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── pnpm-lock.yaml
```

## 🏃 Próximos Passos
Quando as credenciais estiverem configuradas, faça:

```bash
# Instalar as dependências novamente (se necessário)
pnpm install

# Criar as tabelas no banco
pnpm db:push

# Iniciar o servidor dev
pnpm dev
```

Acesse: http://localhost:3000

---

**Pronto para a Fase 2?** Já tem as credenciais? Me avise e começamos a configurar a autenticação! 🚀
