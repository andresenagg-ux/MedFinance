# MedFinance

Ferramenta educacional para apoiar a gestão financeira de profissionais médicos.

O backend é uma aplicação Node.js com suporte a autenticação via Auth0, consumida pelos clientes web e mobile da plataforma.

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

### Autenticação com Auth0 no Backend

1. Copie o arquivo `.env.example` para `.env` e preencha com as informações do Auth0:

   ```bash
   cp .env.example .env
   ```

2. No [Auth0](https://auth0.com/), crie uma API:
   - **Identifier**: defina o identificador que será usado como `AUTH0_AUDIENCE` (por exemplo, `https://sua-api/`).
   - **Signing Algorithm**: mantenha como `RS256`.

3. Crie uma aplicação Machine to Machine ou Single Page Application associada à API e autorize-a a consumir a API.

4. Atualize as variáveis de ambiente no `.env`:
   - `AUTH0_DOMAIN`: o domínio da sua conta Auth0 (ex.: `seu-dominio.auth0.com`).
   - `AUTH0_AUDIENCE`: o identificador configurado para a API no Auth0.
   - `PORT` (opcional): porta em que a API irá rodar.

5. Inicie o servidor normalmente. A API ficará disponível em `http://localhost:3000` (ou na porta configurada).

#### Rotas protegidas

As seguintes rotas exigem um JWT válido emitido pelo Auth0:

- `GET /courses`
- `GET /finance-tools`
- `GET /community`
- `GET /admin`

Utilize um token com o audience configurado para conseguir acessar essas rotas.

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

Para executar todos os serviços com Docker Compose:

```bash
cd infra
cp .env.example .env
docker compose up --build
```

O arquivo `.env` contém as variáveis usadas pelos contêineres. Por padrão ele
configura um banco PostgreSQL local, as credenciais de autenticação do Auth0 e
as chaves de integração com a API de pagamentos. Ajuste os valores conforme o
ambiente que estiver utilizando.
