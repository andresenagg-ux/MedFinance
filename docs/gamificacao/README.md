# Guia de Gamificação: Troféus e Recompensas

Este guia demonstra como estruturar um sistema de troféus e recompensas para o projeto MedFinance. A proposta utiliza recursos nativos do GitHub (Issues, Projects e Actions) para acompanhar a evolução do time e tornar o reconhecimento visível durante todo o processo de desenvolvimento.

## 1. Definir troféus e níveis de recompensa

Comece registrando os troféus mais relevantes para o time. Utilize uma tabela como a seguir para documentar o nome, o gatilho de conquista e a recompensa associada:

| Troféu | Critério | Recompensa | Visibilidade |
| ------ | -------- | ---------- | ------------ |
| **Primeira Pull Request** | Concluir e mesclar a primeira PR no repositório | Badge no README + menção no Slack | Quadro `Gamificação` no GitHub Projects |
| **Guardião da Qualidade** | Corrigir 5 bugs reportados pela comunidade | Gift card + destaque na demo semanal | README + GitHub Discussions |
| **Mestre da Documentação** | Criar ou atualizar 3 guias técnicos em uma sprint | E-book à escolha + badge especial | README + GitHub Projects |
| **Herói da Automação** | Criar workflow que reduza 30% do tempo da pipeline | Voucher de cursos + destaque no changelog | README + Pull Request |

Mantenha este inventário no repositório (`docs/gamificacao/trofeus.yml`) para que todos possam consultar e propor novos troféus via Pull Requests.

## 2. Criar o arquivo de referência `trofeus.yml`

O arquivo YAML abaixo consolida as informações de cada troféu. Ele pode ser utilizado por scripts ou GitHub Actions para atualizar automaticamente quadros e o README.

```yaml
# docs/gamificacao/trofeus.yml
- id: first-pr
  nome: Primeira Pull Request
  criterio: Concluir e mesclar a primeira PR no repositório
  recompensa: Badge no README e menção no Slack
  visibilidade:
    - quadro: Gamificação
    - painel: README
- id: bug-slayer
  nome: Guardião da Qualidade
  criterio: Corrigir cinco bugs reportados pela comunidade
  recompensa: Gift card e destaque na demo semanal
  visibilidade:
    - quadro: Gamificação
    - discussoes: GitHub Discussions
- id: docs-master
  nome: Mestre da Documentação
  criterio: Criar ou atualizar três guias técnicos em uma sprint
  recompensa: E-book à escolha + badge especial
  visibilidade:
    - quadro: Gamificação
    - painel: README
- id: automation-hero
  nome: Herói da Automação
  criterio: Criar workflow que reduza 30% do tempo da pipeline
  recompensa: Voucher de cursos + destaque no changelog
  visibilidade:
    - quadro: Gamificação
    - pr: Pull Request
```

## 3. Configurar um quadro de acompanhamento no GitHub Projects

1. Acesse **Projects** na organização ou repositório e crie um novo quadro chamado `Gamificação`.
2. Adicione uma *custom field* do tipo `Single select` chamada `Troféu` e popule as opções usando os IDs definidos no YAML (`first-pr`, `bug-slayer`, etc.).
3. Crie uma *view* chamada `Conquistas` com filtro `status:Done` para exibir apenas troféus entregues.
4. Compartilhe a view com o time e fixe o link no README para que o acompanhamento seja rápido.

## 4. Automatizar a criação de recompensas com GitHub Actions

Crie um workflow (`.github/workflows/gamificacao.yml`) para atualizar automaticamente um painel de conquistas sempre que uma Issue for fechada com a label `trofeu`. O exemplo abaixo lê o arquivo `trofeus.yml`, aplica a recompensa e atualiza o README com o status.

```yaml
name: Atualizar recompensas

on:
  issues:
    types: [closed]

jobs:
  atualizar:
    if: contains(github.event.issue.labels.*.name, 'trofeu')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Preparar ambiente
        run: npm install js-yaml@4.1.0
      - name: Atualizar badges
        run: |
          node scripts/update-trofeus.js \
            --issue "${{ github.event.issue.number }}" \
            --arquivo docs/gamificacao/trofeus.yml
      - name: Commitar alterações
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'chore: atualiza painel de troféus'
```

O script `scripts/update-trofeus.js` pode gerar badges SVG e atualizar a seção de conquistas do README com o nome da pessoa vencedora e data de conclusão.

## 5. Tornar a recompensa visível no README

Adicione ao README uma seção de conquistas com badges gerados automaticamente. Exemplo:

```markdown
## Troféus conquistados

![Primeira Pull Request](https://img.shields.io/badge/Primeira%20PR-@maria-2ecc71)
![Guardião da Qualidade](https://img.shields.io/badge/Guardião%20da%20Qualidade-@joao-1abc9c)
```

Combine os badges com links para as Issues ou PRs relacionados, garantindo transparência sobre a contribuição.

## 6. Comunicar recompensas fora do GitHub

Para reforçar o reconhecimento, utilize integrações como Slack ou Microsoft Teams. Um passo simples é adicionar ao workflow acima um step que publica a conquista via `slackapi/slack-github-action` com o nome do troféu, contribuinte e recompensa.

---

Com esses passos, o time terá um sistema completo de gamificação, com troféus documentados, recompensas claras e visibilidade contínua dentro e fora do GitHub.
