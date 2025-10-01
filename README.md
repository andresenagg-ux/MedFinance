# MedFinance

Aplicação backend em Node.js para suportar a plataforma educacional MedFinance, com autenticação via Auth0.

## Configuração

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

## Execução

Instale as dependências e inicie o servidor:

```bash
npm install
npm start
```

A API ficará disponível em `http://localhost:3000` (ou na porta configurada).

### Rotas protegidas

As seguintes rotas exigem um JWT válido emitido pelo Auth0:

- `GET /courses`
- `GET /finance-tools`
- `GET /community`
- `GET /admin`

Utilize um token com o audience configurado para conseguir acessar essas rotas.
