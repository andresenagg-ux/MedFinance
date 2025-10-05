# MedFinance

Ferramenta educacional para finanças dos profissionais médicos.

## Desenvolvimento

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor em modo desenvolvimento:
   ```bash
   npm run dev
   ```
   O servidor padrão roda em `http://localhost:4000`.

## Documentação da API

A documentação automática da API está disponível em [http://localhost:4000/docs](http://localhost:4000/docs), construída com Swagger UI. Esse endpoint consome o arquivo [`src/swagger.json`](src/swagger.json), que descreve as rotas principais:

- Autenticação (`/auth`)
- Cursos (`/courses`)
- Simulador financeiro (`/finance/simulator`)
- Comunidade (`/community`)

Para atualizar ou ampliar a documentação, edite o arquivo `src/swagger.json` e reinicie o servidor.
