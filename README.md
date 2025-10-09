# MedFinance

Ferramenta educacional para finanças dos profissionais médicos.

## Configuração do banco de dados

O projeto utiliza [Prisma](https://www.prisma.io/) com banco SQLite localizado em `prisma/dev.db`.

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Gere o cliente Prisma e sincronize o banco:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
3. Popular a base com dados de teste executando o seed:
   ```bash
   npx prisma db seed
   ```

O script `prisma/seed.js` cria usuários de perfis diferentes, um curso de exemplo com módulos e aulas, além de registrar o progresso do estudante em algumas aulas.
