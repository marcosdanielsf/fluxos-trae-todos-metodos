# Fase 3 — Estrutura Local, QA e Plano de Migração

Este diretório reúne os 8 blocos da Fase 3 para conclusão local antes da migração para o ClickUp. Use este README como índice, guia de QA e referência de campos de migração.

## Índice das Subtarefas (Ordem Oficial)

1. 🧭 Proposta de Valor, Ladder de Ofertas, Pacotes & Escopo — `01_Proposta_de_Valor_Ladder_Pacotes_Escopo.md`
2. 🧾 Fichas Técnicas de Produto — `02_Fichas_Tecnicas_de_Produto.md`
3. 💲 Pricing, Termos & Garantias — `03_Pricing_Termos_e_Garantias.md`
4. 📑 Materiais Comerciais (Deck, One-pager, Proposal) — `04_Materiais_Comerciais.md`
5. ⚖️ Contratos, Políticas & Jurídico — `05_Contratos_Politicas_e_Juridico.md`
6. 🎙️ Scripts de Vendas & Discovery — `06_Scripts_de_Vendas_e_Discovery.md`
7. 🚀 GTM & Materiais de Lançamento — `07_GTM_e_Materiais_de_Lancamento.md`
8. 📦 Playbook de Entrega, Onboarding & Gate — `08_Playbook_de_Entrega_Onboarding_e_Gate.md`

Observação de Governança (Subtarefa 7): incluir controle de versionamento e trilha de auditoria para materiais de lançamento (changelog, owner, data, status, link de release) conforme template local.

## Campos de Migração (ClickUp)

- Departamento: "Produto & Engenharia"
- Contexto/Categoria:
  - Multi-seleção (recomendado): ["Documentação", "Processo"] para todas as subtarefas
  - Alternativa single-select: 1–5 = Documentação; 6–8 = Processo
- Frequência:
  - Default: "Sob Demanda" (on-demand)
  - Exceção: Subtarefa 7 = "Contínuo" (gestão de versões)
- Link Crítico / SSoT: anexar este diretório e o arquivo consolidado `../Fase_3_Subtarefas.md` ao pai ClickUp (tarefa `86b7172qb`)

Lista alvo no ClickUp: `90147183567` (já usada nas interações anteriores). Pai: `86b7172qb`.

## QA — Definition of Done (resumo)

Para cada subtarefa, confirmar:
- Objetivo, entregáveis e SSoT referenciados
- Checklist específico concluído (vide cada arquivo .md)
- Evidências anexadas (links/arquivos locais) e responsáveis definidos
- Campos de governança preenchidos quando aplicável (versão, owner, data)
- Sem links quebrados; títulos e ordem consistentes

Quando todas as subtarefas estiverem com DoD concluída localmente, usar o `migration_plan.json` (neste diretório) para migrar ao ClickUp.

Evidências
- Armazene evidências em `../Evidencias_Fase3/01…08` e referencie-as nos arquivos das subtarefas (link já incluído em cada seção "Evidências e Owners").

## Como usar

1. Trabalhe em cada arquivo .md da lista na ordem acima.
2. Marque as checklists locais dentro de cada arquivo.
3. Utilize `QA_Checklist.md` para uma verificação final transversal.
4. Após conclusão, siga o `migration_plan.json` para criar/atualizar subtarefas no ClickUp.

## Referências

- Consolidado local: `../Fase_3_Subtarefas.md`
- Método base: `../METODO_TRAE_UNIFICADO.md`

## Notas Legadas (antigo "Fase2_Ofertas")

Este conteúdo foi incorporado de um esqueleto inicial de ofertas e serve como referência histórica para cobertura dos tópicos:

- Catálogo de Ofertas
- Estrutura de Pacotes e Add-ons
- Roadmap de Produto/Serviço
- Dependências Operacionais
- Métricas de Sucesso por Oferta

Referência base adicional: `../METODO_TRAE_UNIFICADO.md`

Status do esqueleto original: Em construção. A cobertura destes tópicos está estruturada nas subtarefas 1–3 e 8 desta Fase 3.