# MedFinance

Ferramenta educacional para finanças dos profissionais médicos.

## Integração com o Vimeo

A plataforma usa a API do Vimeo para upload seguro e streaming dos vídeos dos cursos. Configure as credenciais antes de executar qualquer serviço.

### Criando as credenciais

1. Acesse [https://developer.vimeo.com/apps](https://developer.vimeo.com/apps) e crie um aplicativo.
2. Em **Authentication**, gere um *Access Token* com permissões `video_files`, `private`, `edit` e `upload`.
3. Copie o `Client Identifier`, o `Client Secret` e o *Access Token* gerado.

### Variáveis de ambiente

Crie um arquivo `.env` na pasta `backend` baseado em `.env.example` com os valores obtidos acima:

```bash
VIMEO_CLIENT_ID=seu_client_id
VIMEO_CLIENT_SECRET=seu_client_secret
VIMEO_ACCESS_TOKEN=seu_access_token
APP_PORT=3001
```

## Backend (Node.js / Express)

A API expõe uma rota `POST /courses/:id/upload-video` que cria um link de upload seguro no Vimeo e salva a URL final do vídeo associada ao curso. Também há uma rota `GET /courses/:id` para consumo pelos clientes web e mobile.

### Instalação e execução

```bash
cd backend
npm install
npm run start
```

Por padrão o servidor sobe em `http://localhost:3001`.

## Frontend Web (React + Vite)

O cliente web consome a rota `GET /courses/:id` e utiliza um player embutido do Vimeo para exibição do conteúdo.

```bash
cd web
npm install
npm run dev
```

Use a variável `VITE_API_BASE_URL` no arquivo `web/.env` se precisar apontar para outra URL de backend.

## Aplicativo Mobile (Expo / React Native)

O aplicativo mobile replica a experiência do web utilizando um componente baseado em `react-native-webview` para exibir o player do Vimeo.

```bash
cd mobile
npm install
npm run start
```

Defina `EXPO_PUBLIC_API_URL` no `.env` do Expo caso deseje alterar o endereço da API utilizada para carregar os cursos.
