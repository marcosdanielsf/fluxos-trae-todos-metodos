# 📄 Fichas Técnicas de Produto

Objetivo

Documentar cada oferta com ficha técnica completa: recursos, resultados esperados, requisitos, dependências e critérios de aceite.

Entregáveis

- Fichas técnicas por oferta (campos: objetivo, escopo, entregáveis, limites, requisitos, dependências, critérios de aceite, SLA)
- Matriz de funcionalidades por plano (Core/Premium/Add-ons)
- Níveis de prontidão (RAG) por feature/processo
- Mapa de integrações e responsabilidades

SSoT

- METODO_TRAE_UNIFICADO.md (Fase 3)
- Full Sales — Playbooks e Processos/Produtos e Ofertas
- Bijari (materiais de estrutura e documentação)

Definition of Done (DoD)

- Cada oferta com ficha técnica completa e versionada
- Matriz de funcionalidades publicada e revisada
- Dependências e critérios de aceite claros e acordados
- Evidências anexadas

Checklist

- Objetivo e outcome do cliente
- Escopo: inclusões/exclusões
- Requisitos e dependências (técnicas e operacionais)
- Critérios de aceite e SLA
- Versionamento e governança definidos
- Links e anexos atualizados
# 🧾 Fichas Técnicas de Produto

Resumo
- Objetivo: padronizar a documentação técnica por oferta/serviço, reduzindo ambiguidade na venda, escopo e entrega.
- Escopo: criação de templates, preenchimento por oferta, definição de requisitos, dependências e SLAs.
- SSoT: este arquivo e o consolidado `../Fase_3_Subtarefas.md`. Referência base: `../METODO_TRAE_UNIFICADO.md`.

## Template de Ficha Técnica (Campos)

Identificação
- Nome da Oferta/Produto
- Versão
- Owner/Área responsável
- Status (Ativo/Em revisão/Depreciado)

Visão Geral
- Descrição breve (o que é, para quem, que dor resolve)
- Benefícios e resultados esperados (métricas)

Componentes/Módulos
- Lista de módulos com descrição, esforço estimado, dependências
- Add-ons compatíveis

Requisitos
- Técnicos (infra, software, integrações)
- Operacionais (time, perfis, horas)
- Dados (campos necessários, origem, qualidade)

Entradas/Saídas
- Inputs necessários (documentos, acessos, aprovações)
- Outputs entregues (artefatos, relatórios, configurações)

SLAs e KPIs
- Prazos de resposta/entrega
- Métricas de sucesso por fase/entregável

Integrações
- Sistemas envolvidos, endpoints, credenciais, segurança

Riscos e Mitigações
- Principais riscos e plano de mitigação

Suporte e Manutenção
- Janela de suporte, canais, escalonamento
- Política de atualização

Anexos
- Diagramas, exemplos, SOW, políticas aplicáveis

## Diretrizes de Preenchimento
- Usar linguagem clara e orientada a uso; evitar termos ambíguos
- Referenciar documentos fonte quando possível
- Manter consistência entre módulos/pacotes descritos na Fase 2

## Governança e Versionamento
- Nomenclatura: `Ficha_<Produto>_vX.Y`
- Changelog: versão, data, owner, status, link
- Ciclo de revisão: trimestral ou sob demanda

Exemplo de Changelog
| Produto       | Versão | Data       | Owner      | Status  | Link |
|---------------|--------|------------|------------|---------|------|
| Oferta Alpha  | v1.2   | 2025-10-10 | Produto    | Ativo   | /fichas/alpha_v1.2.md |
| Serviço Beta  | v1.0   | 2025-09-20 | Operações  | Ativo   | /fichas/beta_v1.0.md  |

## Definition of Done (DoD)
- Template completo com campos preenchidos
- Requisitos e dependências conferidos com Operações/TI
- SLAs/KPIs definidos e aprovados
- Anexos e exemplos referenciados
- Changelog criado e última versão como “Ativo”

## Checklist
- [ ] Identificação e status
- [ ] Visão geral e benefícios
- [ ] Módulos e add-ons
- [ ] Requisitos técnicos/operacionais/dados
- [ ] Entradas/saídas
- [ ] SLAs e KPIs
- [ ] Integrações
- [ ] Riscos e mitigações
- [ ] Suporte/manutenção
- [ ] Anexos
- [ ] Changelog e owner

## Evidências e Owners
- Evidências: fichas por produto, aprovações, diagramas
- Ver evidências: `../Evidencias_Fase3/02/`
- Owners: Produto (conteúdo), Operações (viabilidade), TI (integrações)

## Metadados para Migração (ClickUp)
- Departamento: Produto & Engenharia
- Contexto/Categoria: Documentação; Processo
- Frequência: Sob Demanda
- Link Crítico / SSoT: anexar `../Fase_3_Subtarefas.md` e este arquivo no pai (tarefa `86b7172qb`)