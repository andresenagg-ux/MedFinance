# MedFinance

Plataforma educacional para apoiar profissionais da área da saúde na organização de finanças pessoais. O monorepositório
concentra a API em Node.js, a aplicação web (React + Vite) e o aplicativo mobile com Expo, além de uma pipeline de CI
que garante que todos os projetos continuam compilando e com testes verdes.

## Estrutura do repositório

- `backend/`: API em Node.js + Express escrita em TypeScript com rotas básicas e camada de serviço de usuários.
- `frontend-web/`: aplicação web React (Vite) com página institucional e testes usando React Testing Library + Vitest.
- `frontend-mobile/`: aplicativo React Native com Expo e testes usando React Native Testing Library.
- `.github/workflows/ci.yml`: pipeline de CI com instalação de dependências, testes e builds.

## Pré-requisitos

- Node.js 18+
- npm 9+
- (Opcional) Expo CLI (`npm install -g expo-cli`) para executar o app mobile em dispositivos/simuladores.

## Backend

```bash
cd backend
npm install
npm run dev       # inicia servidor em http://localhost:3000
npm test          # executa testes com Jest + Supertest
npm run build     # transpila os arquivos TypeScript para dist/
```

Você pode verificar a rota de monitoramento com `curl http://localhost:3000/healthcheck`.

### Variáveis de ambiente

Copie `backend/.env.example` para `.env` (caso exista) e configure conforme o ambiente. As principais variáveis são:

- `PORT`: porta do servidor HTTP (padrão `3000`).
- `LOG_LEVEL`: define o nível de log (`debug` ou `info`).

## Frontend Web

```bash
cd frontend-web
npm install
npm run dev    # inicia o Vite em http://localhost:5173
npm test       # executa os testes com Vitest
npm run build  # gera artefatos de produção em dist/
```

## Frontend Mobile

```bash
cd frontend-mobile
npm install
npm test   # executa testes com Jest + React Native Testing Library
npm start  # inicia o Expo
```

Para executar o app em um dispositivo físico ou emulador, utilize os comandos `npm run android`, `npm run ios` ou `npm run web`
depois de iniciar o Expo.

## Pipeline de CI

O workflow em `.github/workflows/ci.yml` é executado em todos os pushes e pull requests. Ele realiza três estágios:

1. **install** – instala dependências para backend, frontend-web e frontend-mobile garantindo que os manifests estão
   consistentes.
2. **test** – executa `npm test` nos três projetos.
3. **build** – compila o backend (`npm run build`) e gera o bundle web (`npm run build` em `frontend-web`).

O pipeline utiliza `actions/setup-node` com Node.js 18. Estenda o workflow conforme necessário para publicar artefatos ou
imagens Docker.

## Infraestrutura

O diretório `infra/` pode ser utilizado para armazenar scripts de provisionamento, manifests de Docker Compose e outros
recursos auxiliares. Ajuste as variáveis de ambiente conforme o ambiente que estiver utilizando.
