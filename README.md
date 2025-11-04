# MedFinance

Plataforma educacional para apoiar profissionais da área da saúde na organização de finanças pessoais. O monorepositório
concentra a API em Node.js, a aplicação web (React + Vite) e o aplicativo mobile com Expo, além de uma pipeline de CI
que garante que todos os projetos continuam compilando e com testes verdes.

## Estrutura do repositório

- `package.json`: arquivo de workspaces que permite rodar scripts globais como `npm test` e `npm run build` na raiz.
- `backend/`: API em Node.js + Express escrita em TypeScript com rotas básicas e camada de serviço de usuários.
- `frontend-web/`: aplicação web React (Vite) com página institucional e testes usando React Testing Library + Vitest.
- `frontend-mobile/`: aplicativo React Native com Expo e testes usando React Native Testing Library.
- `cli/`: simulador financeiro disponível via linha de comando com suporte a testes unitários.
- `.github/workflows/ci.yml`: pipeline de CI com instalação de dependências, testes e builds.

## Pré-requisitos

- Node.js 18+
- npm 9+
- (Opcional) Expo CLI (`npm install -g expo-cli`) para executar o app mobile em dispositivos/simuladores.

## Scripts globais

O repositório utiliza workspaces do npm para facilitar comandos que englobam todos os projetos. Alguns exemplos a partir da raiz:

```bash
npm test      # executa os testes de backend, frontend web e mobile
npm run build # compila backend e frontend web
npm run changelog # gera CHANGELOG.md agregando commits no formato Keep a Changelog
```

Para desenvolver localmente, execute os scripts `npm run dev` em cada workspace individualmente.

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

## Simulador CLI

O workspace `cli/` disponibiliza um simulador financeiro que reproduz os cálculos utilizados nas interfaces gráficas, permitindo
experimentar cenários diretamente no terminal.

```bash
cd cli
npm install
npm run build           # compila o CLI para dist/
node dist/index.js --help
node dist/index.js -i 12000 -e 7500 -r 0.1
```

Também é possível executar o simulador sem compilar utilizando o script `npm run dev`, que utiliza `ts-node-dev` para hot reload,
e garantir a qualidade com os testes automatizados:

```bash
npm run dev
npm test
```

## Pipeline de CI

O workflow em `.github/workflows/ci.yml` é executado em todos os pushes e pull requests. Ele realiza três estágios:

1. **install** – instala dependências para backend, frontend-web e frontend-mobile garantindo que os manifests estão
   consistentes.
2. **test** – executa `npm test` nos três projetos.
3. **build** – compila o backend (`npm run build`) e gera o bundle web (`npm run build` em `frontend-web`).

O pipeline utiliza `actions/setup-node` com Node.js 18. Estenda o workflow conforme necessário para publicar artefatos ou
imagens Docker.

## Ambientes de Teste

Para suportar um fluxo profissional, o projeto utiliza três ambientes principais:

- **Local de desenvolvimento:** feedback rápido com testes unitários, linters e execução interativa das aplicações.
- **Integração contínua (CI):** garante que todas as alterações compilam e passam nas suítes automatizadas antes de chegar às branches principais.
- **Homologação (staging):** replica a produção para validações exploratórias e testes end-to-end antes do deploy definitivo.

Veja o documento [docs/ambientes-de-teste.md](docs/ambientes-de-teste.md) para orientações detalhadas.

## Gamificação e troféus

Implemente um sistema de reconhecimento contínuo acompanhando o guia em
[docs/gamificacao/README.md](docs/gamificacao/README.md). O documento detalha como
definir troféus, registrar recompensas e expor as conquistas no GitHub via Projects,
Issues e Actions. Utilize o arquivo de referência
[docs/gamificacao/trofeus.yml](docs/gamificacao/trofeus.yml) para alimentar dashboards,
badges no README e automações que destacam o avanço do time.

## Infraestrutura

O diretório `infra/` pode ser utilizado para armazenar scripts de provisionamento, manifests de Docker Compose e outros
recursos auxiliares. Ajuste as variáveis de ambiente conforme o ambiente que estiver utilizando.
