# Finanças Médicas

Estrutura inicial do projeto full stack com backend Node.js, frontend web em React e frontend mobile em React Native.

## Estrutura

- backend: API Express para gerenciamento de dados financeiros.
- frontend-web: interface web com React e Vite.
- frontend-mobile: aplicativo mobile usando Expo.
- infra: configuração de contêineres e variáveis de ambiente.

## Primeiros passos

### Backend

```bash
cd backend
npm install
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
