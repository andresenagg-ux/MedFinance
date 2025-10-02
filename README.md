# MedFinance

Ferramenta educacional para finanças de profissionais médicos.

## Estrutura do projeto

- `backend/` – API Node.js/Express que disponibiliza conteúdos por perfil de usuário.
- `web/` – Interface web simples para consultar a API e listar cursos.
- `mobile/` – Aplicativo React Native (Expo) consumindo a API para dispositivos móveis.

## Como executar

1. Inicie a API:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. Web: abra `web/index.html` em um navegador para consumir a API.
3. Mobile: execute o app em `mobile/` com Expo (`npm install` e `npm start`).

Certifique-se de que o backend esteja acessível em `http://localhost:3001` para ambos os clientes.
