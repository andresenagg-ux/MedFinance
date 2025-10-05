# MedFinance

[![Build Status](https://github.com/MedFinance/MedFinance/actions/workflows/ci.yml/badge.svg)](https://github.com/MedFinance/MedFinance/actions/workflows/ci.yml)
[![Cobertura de Testes](https://img.shields.io/badge/coverage-Jest%20--%20unknown-lightgrey?logo=jest)](#rodar-testes)
[![Versão](https://img.shields.io/badge/version-0.1.0-blue)](package.json)

Ferramenta educacional para finanças dos profissionais médicos.

## Como executar

### Instalação de dependências

```bash
npm install
```

### Rodar lint

Executa a análise estática do código usando o ESLint configurado no projeto.

```bash
npm run lint
```

### Rodar testes

Executa a suíte de testes unitários com Jest. Utilize o flag `--coverage` para gerar o relatório de cobertura caso deseje um resumo detalhado.

```bash
npm test
# ou
npm run test:coverage
```

### Rodar com docker-compose

Inicie toda a aplicação juntamente com os serviços auxiliares definidos no `docker-compose.yml` (por exemplo banco de dados ou serviços de apoio).

```bash
docker-compose up --build
```

Para desligar e remover os containers, execute:

```bash
docker-compose down
```
