# MedFinance

Aplicação educacional para finanças de profissionais médicos.

## Estrutura do monorepo

- `backend`: API Node.js/Express com Prisma e PostgreSQL.
- `web`: frontend React (Vite) com autenticação via Auth0.
- `mobile`: app Expo (React Native) com integração Auth0.

## Configuração rápida

### Backend

1. Copie `.env.example` para `.env` e configure `DATABASE_URL` do PostgreSQL.
2. Instale dependências e gere o cliente Prisma:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npm run dev
   ```

### Frontend web

1. Copie `.env.example` para `.env` e configure as credenciais Auth0 e URL da API.
2. Instale dependências e execute:
   ```bash
   cd web
   npm install
   npm run dev
   ```

### Aplicativo mobile (Expo)

1. Copie `.env.example` para `.env` e exporte as variáveis ao executar o Expo (por exemplo com `dotenvx run`).
2. Instale dependências e inicie o bundler:
   ```bash
   cd mobile
   npm install
   npx expo prebuild --clean # opcional conforme fluxo
   npm start
   ```

O fluxo de onboarding exige login/cadastro via Auth0 e seleção de perfil (estudante, recém-formado ou especialista). A escolha é persistida no backend através do endpoint `POST /users/profile` e a saudação inicial utiliza o perfil salvo.
