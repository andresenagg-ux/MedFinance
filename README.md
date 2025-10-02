# MedFinance

Ferramenta educacional para finanças dos profissionais médicos.

## Acompanhamento de progresso

Este repositório inclui uma API em Node.js/Express com SQLite para registrar o progresso por aula, além de interfaces web e mobile (React Native) que exibem barras de progresso para cada curso.

### Backend

```bash
cd backend
npm install
npm start
```

A API expõe as rotas:

- `POST /progress` – marca uma aula como concluída recebendo `{ userId, lessonId, completed }`.
- `GET /progress/:userId` – retorna o progresso agregado por curso, incluindo as aulas concluídas.
- `GET /courses` – lista cursos e aulas disponíveis para montar as interfaces.

### Web

Uma página estática em `web/` consome a API para listar cursos, permitir marcar aulas concluídas e exibir uma barra de progresso em cada curso. Basta servir os arquivos estáticos (por exemplo com `npx serve web`).

### Mobile

O diretório `mobile/` contém um exemplo de tela em React Native que consome a API e mostra o progresso. O código foi pensado para rodar com Expo; ajuste o `API_URL` conforme o endereço do backend em sua rede.
