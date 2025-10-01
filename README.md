# MedFinance

Ferramenta educacional para apoiar a gestão financeira de profissionais médicos.

## Estrutura do projeto

- **backend**: API Express responsável pelo gerenciamento dos dados financeiros.
- **frontend-web**: interface web construída com React e Vite.
- **frontend-mobile**: aplicativo mobile desenvolvido com Expo.
- **infra**: configuração de contêineres, variáveis de ambiente e serviços auxiliares.

## Primeiros passos

### Backend

1. Configure a variável de ambiente `DATABASE_URL` apontando para sua instância PostgreSQL.
2. Instale as dependências e aplique as migrações do Prisma:

   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   ```

3. Inicie a API em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

### Frontend Web

```bash
cd frontend-web
npm install
npm run dev
```

### Frontend Mobile

```bash
cd frontend-mobile
npm install
npm start
```

### Infraestrutura

```bash
cd infra
cp .env.example .env
docker-compose up --build
```
