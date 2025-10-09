# MedFinance

Ferramenta educacional para finanças dos profissionais médicos.

## Estrutura

- `backend/` — API Express + SQLite responsável por registrar e revogar consentimentos dos usuários.
- `web/` — protótipo web estático com banner/modal de consentimento e tela de configurações.
- `mobile/` — app Expo/React Native com fluxo equivalente para consentimento e revogação.

## Como executar

### Backend

```bash
cd backend
npm install
npm run start
```

A API sobe por padrão na porta `4000` e expõe os endpoints:

- `POST /consents` — registra consentimento (`{ userId, consented }`).
- `GET /consents/:userId` — recupera o último consentimento do usuário.
- `POST /consents/:userId/revoke` — revoga o consentimento (novo registro `consentido = 0`).

### Web

Hospede os arquivos estáticos com qualquer servidor (por exemplo `npx serve`). Ajuste `window.__CONSENT_API__` caso o backend esteja em outra URL.

### Mobile

```bash
cd mobile
npm install
npm run start
```

O app Expo consome a mesma API (ajuste a constante `API_BASE_URL` conforme o ambiente, usando um endereço acessível pelo dispositivo).
