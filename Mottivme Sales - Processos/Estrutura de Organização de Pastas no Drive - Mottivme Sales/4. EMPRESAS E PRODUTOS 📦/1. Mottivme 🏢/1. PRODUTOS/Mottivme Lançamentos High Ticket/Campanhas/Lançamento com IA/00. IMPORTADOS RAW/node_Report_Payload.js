const data = $json;

                    const checklistResumo = data.checklist
                      .map((section) => {
                        const tasks = section.tasks
                          .map((task) => `- [ ] ${task.task} (${task.owner})`)
                          .join('
');
                        return `### ${section.area}
${tasks}`;
                      })
                      .join('

');

                    const stageResumo = data.stageBriefings
                      .map((stage) => {
                        const foco = stage.focoIA.map((item) => `- ${item}`).join('
');
                        const ferramentas = stage.ferramentas.map((item) => `- ${item}`).join('
');
                        return `### ${stage.etapa}
Meta: ${stage.alvo}
Indicador-chave: ${stage.indicador}
Top ações IA:
${foco}
Ferramentas sugeridas:
${ferramentas}`;
                      })
                      .join('

');

                    const summary = [
                      '# Plano Semanal IA First',
                      '',
                      '## Checklist imediato',
                      checklistResumo,
                      '',
                      '## Agenda semanal sugerida',
                      data.weeklyAgenda,
                      '',
                      '## Etapas do funil (ganho de 20%)',
                      stageResumo,
                      '',
                      '## Prompts essenciais',
                      data.promptMessages
                        .map((p) => `### ${p.titulo}
Objetivo: ${p.objetivo}

${p.prompt}`)
                        .join('

'),
                      '',
                      '## Métricas para acompanhar',
                      data.metrics.produtividade.map((m) => `- Produtividade: ${m}`).join('
'),
                      data.metrics.resultadosNegocio.map((m) => `- Resultados: ${m}`).join('
'),
                      data.metrics.competitividade.map((m) => `- Competitividade: ${m}`).join('
'),
                      '',
                      '## Próximos passos',
                      data.nextSteps.map((step) => `- ${step}`).join('
')
                    ]
                      .filter(Boolean)
                      .join('
');

                    return [
                      {
                        json: {
                          ...data,
                          payload: {
                            markdown: summary,
                            prompts: data.promptMessages,
                            stageBriefings: data.stageBriefings,
                            checklist: data.checklist,
                            toolkit: data.toolkit
                          }
                        }
                      }
                    ];