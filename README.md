# MedFinance

ferramenta educacional para finanças dos profissionais médicos

## Backend

### Configuração do banco de dados
1. Configure a variável de ambiente `DATABASE_URL` apontando para sua instância PostgreSQL.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute as migrações do Prisma para criar as tabelas iniciais:
   ```bash
   npx prisma migrate dev
   ```
4. Inicie a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
