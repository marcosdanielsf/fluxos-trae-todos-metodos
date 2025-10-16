const data = $json;

                    const promptMessages = Object.entries(data.prompts).map(([key, prompt]) => ({
                      id: key,
                      titulo: prompt.titulo,
                      objetivo: prompt.objetivo,
                      prompt: prompt.texto
                    }));

                    const copyPrompt = [
                      '# Brief para geração de copy com IA',
                      '',
                      'Contexto do lançamento:',
                      '- Público-alvo: [descrever]',
                      '- Oferta principal: [detalhar]',
                      '- Meta de melhoria: +20% na etapa selecionada',
                      '',
                      'Prompt base:',
                      promptMessages.find((p) => p.id === 'copywriting')?.prompt || ''
                    ].join('
');

                    return [
                      {
                        json: {
                          ...data,
                          promptMessages,
                          copyPrompt
                        }
                      }
                    ];