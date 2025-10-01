# MedFinance

Plataforma educacional para apoiar profissionais da área da saúde na organização de finanças pessoais.

## Estrutura do repositório

- `backend/`: API em Node.js + Express escrita em TypeScript, com rotas básicas e camada de serviço de usuários.
- `frontend-web/`: aplicação web React (Vite) com página institucional e testes usando React Testing Library + Vitest.
- `mobile/`: aplicativo React Native básico com testes usando React Native Testing Library.
- `.github/workflows/ci.yml`: pipeline de CI/CD com verificação de dependências, testes e builds.

## Setup local

### Requisitos

- Node.js 18+ e npm
- (Opcional) Expo CLI para executar o app mobile em simuladores ou dispositivos físicos (`npm install -g expo-cli`)

### Backend

```bash
cd backend
npm install
npm run dev # inicia servidor em http://localhost:3000
# em outro terminal
curl http://localhost:3000/healthcheck # verifique a rota de monitoramento
npm test # executa testes com Jest
npm run build # transpila para dist/
```

### Frontend Web

```bash
cd frontend-web
npm install
npm run dev # inicia Vite em http://localhost:5173
npm test # executa testes com Vitest + React Testing Library
npm run build # gera artefatos de produção em dist/
```

### Mobile

```bash
cd mobile
npm install
npm test # executa testes com Jest + React Native Testing Library
npm start # instrução placeholder para usar Expo CLI
```

Para execução mobile em dispositivos ou simuladores utilize o Expo CLI (`expo start`) após instalar as dependências.

## Setup Docker

### Backend

```bash
docker build -t medfinance-backend ./backend
docker run -p 3000:3000 medfinance-backend
```

A rota `GET /healthcheck` estará disponível em `http://localhost:3000/healthcheck`.

### Frontend Web

```bash
docker build -t medfinance-frontend ./frontend-web
docker run -p 8080:80 medfinance-frontend
```

A aplicação ficará acessível em `http://localhost:8080`.

## Setup CI/CD

O pipeline em `.github/workflows/ci.yml` é executado em *push* e *pull requests* com os seguintes jobs:

1. **install** – instala dependências para backend, frontend-web e mobile garantindo que os manifests estão corretos.
2. **test** – reinstala dependências e executa `npm test` nos três projetos.
3. **build** – compila o backend (`npm run build`) e gera o bundle web (`npm run build` em `frontend-web`).

Os jobs utilizam `actions/setup-node` com Node.js 18 e podem ser estendidos para publicar artefatos de build ou imagens Docker.

## Deploy

### Frontend Web (Netlify)

1. Configure um novo site no Netlify apontando para este repositório.
2. Defina a branch principal, o comando de build `npm run build` (diretório `frontend-web`) e a pasta de publicação `frontend-web/dist`.
3. Adicione uma etapa de *build command* customizada ou use um *Netlify Build Plugin* para instalar dependências (`npm install`) antes do build.
4. Opcionalmente configure variáveis de ambiente para APIs no painel Netlify.

### Mobile (Expo)

1. Instale o Expo CLI globalmente (`npm install -g expo-cli`).
2. No diretório `mobile`, execute `expo login` e `expo start` para iniciar o desenvolvimento.
3. Para gerar builds use `eas build` (requer configuração de conta Expo) definindo os perfis de build em `eas.json`.
4. Publique atualizações OTA com `expo publish`.

### Backend (AWS ECS)

1. Construa e publique a imagem Docker do backend (`docker build -t <sua-conta>.dkr.ecr.<região>.amazonaws.com/medfinance-backend ./backend`).
2. Faça push da imagem para um repositório ECR (`docker push ...`).
3. Crie um cluster ECS (Fargate), defina uma task com a imagem publicada e exponha a porta 3000.
4. Configure um serviço ECS com Auto Scaling e, opcionalmente, um Application Load Balancer para rotear tráfego HTTPS.
5. Atualize variáveis de ambiente/segredos via AWS Systems Manager Parameter Store ou Secrets Manager conforme necessário.

