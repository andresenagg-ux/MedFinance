# MedFinance Backend

API Node.js/Express que fornece conteúdos educacionais filtrados por perfil de usuário.

## Instalação

```bash
cd backend
npm install
```

## Execução

```bash
npm start
```

A API será iniciada em `http://localhost:3001`.

## Rotas

- `GET /contents/:profile` – Retorna a lista de cursos do perfil informado (`estudante`, `recem-formado`, `especialista`).
