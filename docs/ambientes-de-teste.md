# Ambientes de Testes Recomendados

Para garantir a qualidade do MedFinance em todas as etapas do ciclo de vida, mantemos três ambientes de testes complementares. Eles se alinham às boas práticas de equipes profissionais que buscam detectar problemas cedo, reduzir risco de regressões e validar o comportamento da aplicação em condições próximas à produção.

## 1. Ambiente Local de Desenvolvimento

O ambiente local é utilizado por cada pessoa desenvolvedora durante o trabalho diário.

- **Objetivo:** permitir iterações rápidas com feedback imediato por meio de testes unitários, linters e execução interativa das aplicações (`npm run dev`).
- **Dados:** conjuntos reduzidos, sintéticos ou anonimizados, suficientes para validar fluxos críticos sem expor informações reais.
- **Automação principal:** testes unitários e de integração leves executados localmente, além de hot reload.
- **Ferramentas de apoio:** Node.js 18+, emuladores/simuladores (Expo, navegadores) e utilitários como Jest, Vitest e React Testing Library.

## 2. Ambiente de Integração Contínua (CI)

O pipeline de CI representa o primeiro ambiente compartilhado pela equipe.

- **Objetivo:** garantir que todas as mudanças compilam, passam em testes automatizados e respeitam padrões de qualidade antes de chegarem a branches principais.
- **Dados:** fixtures sintéticos controlados pelas suítes de testes. Segredos são armazenados em variáveis de ambiente seguras do provedor de CI.
- **Automação principal:** execução de `npm test` e `npm run build` em cada workspace, análise estática opcional (lint, type-check) e publicação de relatórios.
- **Ferramentas de apoio:** GitHub Actions (workflow `.github/workflows/ci.yml`), caches de dependências e notificações integradas ao repositório.

## 3. Ambiente de Homologação (Staging)

O ambiente de homologação replica a produção o mais fielmente possível para validar cenários fim a fim.

- **Objetivo:** permitir que times de produto, QA e stakeholders verifiquem novas funcionalidades, executem testes exploratórios e rodem suites end-to-end antes do deploy definitivo.
- **Dados:** base mascarada ou subconjunto representativo da produção, com configurações idênticas (variáveis de ambiente, integrações externas em modo sandbox).
- **Automação principal:** testes end-to-end (E2E), smoke tests e monitoramento para validar disponibilidade após cada deploy.
- **Ferramentas de apoio:** pipelines de entrega contínua (CD), ambientes isolados por branch ou release, sistemas de observabilidade (logs, métricas, tracing) e feature flags para validação segura.

Manter esses três ambientes coordenados reduz o tempo de resposta a falhas, oferece confiança para lançar novas versões e suporta a evolução contínua da plataforma.
