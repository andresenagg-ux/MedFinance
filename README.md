# MedFinance

Plataforma educacional para finanças dos profissionais médicos com backend em Express + Prisma e front-ends web (React) e mobile (React Native via Expo).

## Backend

- **Stack:** Express, Prisma, PostgreSQL
- **Env:** configure `.env` com `DATABASE_URL` apontando para seu banco PostgreSQL e `PORT` para a porta desejada (padrão 3000).
- **Scripts úteis:**
  - `npm run dev` — inicia o servidor em modo desenvolvimento.
  - `npm run build` — gera a versão compilada para produção.
  - `npm run start` — executa a build gerada.
  - `npm run prisma:migrate` — cria/atualiza as tabelas (requer banco configurado).

### Rotas disponíveis

- `POST /courses` — cria um curso (`title`, `description`).
- `POST /modules` — cria um módulo (`courseId`, `title`, `order?`).
- `POST /lessons` — cria uma aula (`moduleId`, `title`, `videoUrl`, `duration`, `order?`).
- `GET /courses/:id` — retorna o curso com módulos e aulas ordenados.

## Frontend Web

Aplicação React (Vite) em `web/` que consome a API e exibe o curso com módulos e aulas.

- Copie `web/.env.example` para `web/.env` e defina `VITE_API_URL` e `VITE_COURSE_ID`.
- Instale dependências com `npm install` (dentro de `web`).
- Execute `npm run dev` para iniciar o servidor de desenvolvimento.

## App Mobile

Aplicação React Native (Expo) em `mobile/` espelhando a mesma experiência da web.

- Copie `mobile/.env.example` para `mobile/.env` e configure `EXPO_PUBLIC_API_URL` e `EXPO_PUBLIC_COURSE_ID`.
- Instale dependências com `npm install` (dentro de `mobile`).
- Inicie com `npm run start` para abrir o Expo.

## Estrutura Prisma

A estrutura relacional segue:

- **Course** 1—N **Module**
- **Module** 1—N **Lesson**

A ordenação de módulos/aulas é controlada pelo campo `order`, sendo incrementado automaticamente quando não fornecido na criação.
