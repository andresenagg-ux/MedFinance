# Release Notes

## 0.2.0

### Destaques
- **Simulador financeiro via CLI**: Adicionamos o comando `medfinance-simulator`, permitindo calcular metas financeiras diretamente pelo terminal, com suporte a saída em texto ou JSON e validações de entrada mais robustas.
- **Documentação da API com Swagger**: A API agora expõe a rota `/docs` com a interface Swagger UI e um contrato OpenAPI 3.1 descrevendo os endpoints de saúde e usuários.
- **Atualizações em tempo real no simulador**: As experiências web e mobile foram atualizadas para recalcular projeções financeiras dinamicamente enquanto o usuário ajusta renda, despesas e taxa de investimento.

### Melhorias
- **Dashboard com visualizações D3**: O painel financeiro web ganhou gráficos interativos baseados em D3 para facilitar a análise visual das projeções.
- **Logging estruturado no backend**: A API passou a utilizar Winston para logs estruturados, simplificando o monitoramento e a observabilidade da plataforma.
- **Pipeline de CI unificada**: O fluxo de integração contínua executa testes e builds em todos os workspaces npm, garantindo consistência entre backend, frontend web, mobile e CLI.

### Notas de atualização
- Execute `npm install` na raiz para garantir que as novas dependências (como `commander` e `swagger-ui-express`) sejam instaladas antes de rodar builds ou testes.
- A documentação da API fica disponível em `http://localhost:3000/docs` após iniciar o servidor backend.
- Para testar o simulador, rode `npm run build` em `cli/` e execute `node dist/index.js --help` para conferir as opções disponíveis.
