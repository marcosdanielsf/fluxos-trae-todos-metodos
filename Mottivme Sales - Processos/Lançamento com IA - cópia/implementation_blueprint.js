const checklist = [
                      {
                        area: 'Mindset AI First',
                        tasks: [
                          { task: 'Definir IA como valor da empresa', owner: 'Diretoria', status: 'pending' },
                          { task: 'Estabelecer regra: "Provar que não é possível fazer com IA antes de contratar"', owner: 'Diretoria', status: 'pending' },
                          { task: 'Treinar equipe para usar IA diariamente', owner: 'RH / Educação', status: 'pending' },
                          { task: 'Criar rotina de apresentação de novos agentes GPT pela equipe', owner: 'Equipe IA', status: 'pending' }
                        ]
                      },
                      {
                        area: 'Estrutura Organizacional',
                        tasks: [
                          { task: 'Líderes: Desenvolver visão generalista de IA', owner: 'Liderança', status: 'pending' },
                          { task: 'Equipe: Especializar em ferramentas específicas', owner: 'Equipe IA', status: 'pending' },
                          { task: 'Processos: Integrar IA em cada etapa do funil', owner: 'Operações', status: 'pending' },
                          { task: 'Métricas: Medir melhoria de 20% por etapa', owner: 'Inteligência de Negócios', status: 'pending' }
                        ]
                      }
                    ];

                    const toolkit = [
                      {
                        categoria: 'Criação de Conteúdo',
                        playbooks: [
                          {
                            nome: 'Clone de Expert',
                            objetivo: 'Replicar o tom e repertório do especialista',
                            acoes: [
                              'Criar GPT personalizado com personalidade do expert',
                              'Treinar com conteúdos anteriores',
                              'Usar para manter consistência de voz'
                            ]
                          },
                          {
                            nome: 'Copywriting Automatizado',
                            objetivo: 'Gerar cópias para emails, VSLs, anúncios e páginas',
                            acoes: [
                              'Aplicar prompts de sequência de email',
                              'Gerar roteiros de VSL',
                              'Produzir textos para anúncios e páginas'
                            ]
                          },
                          {
                            nome: 'Criação de Criativos',
                            objetivo: 'Explorar ideias e variações rápidas',
                            acoes: [
                              'Gerar ideias a cada 2 minutos',
                              'Produzir variações de conceitos',
                              'Configurar testes A/B automatizados'
                            ]
                          }
                        ]
                      },
                      {
                        categoria: 'Descoberta de Avatar',
                        playbooks: [
                          {
                            nome: 'Mapeamento Profundo',
                            objetivo: 'Identificar dores, objeções e desejos',
                            acoes: [
                              'Usar IA para mapear dores profundas',
                              'Analisar comentários e feedbacks',
                              'Identificar padrões de comportamento',
                              'Personalizar mensagens por segmento'
                            ]
                          }
                        ]
                      }
                    ];

                    const stageStrategy = [
                      {
                        nome: 'Etapa 1: Tráfego',
                        baseline: '100 visitas',
                        meta: '120 visitas',
                        aiPara: [
                          'Otimização de anúncios com base em dados em tempo real',
                          'Criação contínua de criativos com IA',
                          'Análise da audiência e segmentação automatizada'
                        ],
                        ferramentas: [
                          'ChatGPT para copies',
                          'Geradores de imagem IA',
                          'Ferramentas de analytics com IA'
                        ],
                        indicador: 'CTR, CPC e volume de visitas',
                        proximaAcao: 'Programar sprints semanais de criativos IA'
                      },
                      {
                        nome: 'Etapa 2: Conversão Landing Page',
                        baseline: '50%',
                        meta: '60%',
                        aiPara: [
                          'Otimização de headlines e argumentos com IA',
                          'Testes de copy automatizados',
                          'Análise de mapas de calor e gravações'
                        ],
                        ferramentas: [
                          'Construtores de página com IA',
                          'Ferramentas de teste A/B',
                          'Heatmaps e analytics'
                        ],
                        indicador: 'Taxa de conversão da landing page',
                        proximaAcao: 'Criar rotina de dupla validação IA + humano para headlines'
                      },
                      {
                        nome: 'Etapa 3: Engajamento WhatsApp',
                        baseline: '80%',
                        meta: '96%',
                        aiPara: [
                          'Mensagens personalizadas com base em segmentação',
                          'Resposta automática com contexto',
                          'Análise de sentimento e priorização'
                        ],
                        ferramentas: [
                          'Chatbots treinados com IA',
                          'Ferramentas de análise de sentimento',
                          'CRM integrado ao WhatsApp'
                        ],
                        indicador: 'Taxa de resposta e tempo médio de atendimento',
                        proximaAcao: 'Criar variações de scripts IA para follow-up imediato'
                      },
                      {
                        nome: 'Etapa 4: Presença ao Vivo',
                        baseline: '50%',
                        meta: '60%',
                        aiPara: [
                          'Lembretes personalizados por comportamento',
                          'Conteúdo de aquecimento automatizado',
                          'Definição de timing ideal com previsibilidade'
                        ],
                        ferramentas: [
                          'Automação de follow-up com IA',
                          'Modelos preditivos de engajamento',
                          'Ferramentas de email/SMS com IA'
                        ],
                        indicador: 'Comparecimento nas sessões ao vivo',
                        proximaAcao: 'Criar sequência pré-live personalizada com IA'
                      },
                      {
                        nome: 'Etapa 5: Conversão em Vendas',
                        baseline: '10%',
                        meta: '12%',
                        aiPara: [
                          'Tratativa de objeções automatizada',
                          'Follow-up personalizado por segmento',
                          'Análise de comportamento para priorização de oportunidades'
                        ],
                        ferramentas: [
                          'Agentes de vendas IA',
                          'CRM inteligente',
                          'Score de leads preditivo'
                        ],
                        indicador: 'Taxa de fechamento por cohort',
                        proximaAcao: 'Automatizar esteiras de follow-up com argumentos IA'
                      }
                    ];

                    const weeklyProcess = [
                      {
                        semana: 1,
                        foco: 'Fundação',
                        objetivos: [
                          'Definir valores AI First e ambições de melhoria',
                          'Escolher ferramentas principais para conteúdo e dados',
                          'Criar primeiros prompts e playbooks de uso',
                          'Treinar equipe no básico de IA'
                        ]
                      },
                      {
                        semana: 2,
                        foco: 'Automação',
                        objetivos: [
                          'Implementar automações iniciais em conteúdo e atendimento',
                          'Criar GPTs personalizados para o negócio',
                          'Automatizar criação de conteúdo recorrente',
                          'Coletar métricas iniciais de velocidade e qualidade'
                        ]
                      },
                      {
                        semana: 3,
                        foco: 'Otimização',
                        objetivos: [
                          'Analisar dados coletados das etapas do funil',
                          'Ajustar prompts e processos conforme feedback',
                          'Expandir automações para novas áreas',
                          'Treinar equipe em usos avançados identificados'
                        ]
                      },
                      {
                        semana: 4,
                        foco: 'Escala',
                        objetivos: [
                          'Implementar sistemas complexos (Make/n8n)',
                          'Integrar ferramentas e criar dashboards',
                          'Documentar aprendizados e padrões',
                          'Planejar próximos ciclos de melhoria'
                        ]
                      }
                    ];

                    const prompts = {
                      cloneExpert: {
                        titulo: 'Clone de Expert',
                        objetivo: 'Replicar a voz e decisões do especialista',
                        texto: 'Você é [SEU NOME], expert em [SUA ÁREA].
Características:
- Tom de voz: [DESCREVER]
- Experiências: [LISTAR]
- Metodologia: [EXPLICAR]
- Valores: [DEFINIR]

Responda como [SEU NOME] responderia, mantendo consistência com sua personalidade e expertise.'
                      },
                      copywriting: {
                        titulo: 'Criação de Copy',
                        objetivo: 'Gerar copy direcionada para funil de lançamento',
                        texto: 'Crie uma copy para [TIPO DE MATERIAL] sobre [TEMA].
Avatar: [DESCREVER AVATAR]
Dor principal: [DEFINIR DOR]
Solução oferecida: [EXPLICAR SOLUÇÃO]
Tom: [DEFINIR TOM]
CTA: [CALL TO ACTION]'
                      },
                      analiseAvatar: {
                        titulo: 'Análise de Avatar',
                        objetivo: 'Mapear dores, objeções e desejos do avatar',
                        texto: 'Analise este avatar e identifique:
1. Dores mais profundas
2. Objeções principais
3. Desejos ocultos
4. Linguagem que usa
5. Canais que frequenta

Avatar: [DESCREVER DETALHADAMENTE]'
                      }
                    };

                    const metrics = {
                      produtividade: [
                        'Tempo economizado por tarefa',
                        'Quantidade de conteúdo produzido',
                        'Qualidade do output (testes A/B)'
                      ],
                      resultadosNegocio: [
                        'Melhoria por etapa do funil',
                        'ROI dos investimentos em IA',
                        'Satisfação da equipe',
                        'Velocidade de execução'
                      ],
                      competitividade: [
                        'Tempo de resposta vs. concorrentes',
                        'Qualidade de conteúdo vs. mercado',
                        'Inovação em processos'
                      ]
                    };

                    const nextSteps = [
                      'Implementar imediatamente pelo menos 3 itens do checklist',
                      'Participar das próximas aulas da série',
                      'Documentar resultados obtidos com IA',
                      'Compartilhar aprendizados com a equipe',
                      'Iterar e melhorar continuamente o sistema'
                    ];

                    return [
                      {
                        json: {
                          generatedAt: new Date().toISOString(),
                          checklist,
                          toolkit,
                          stageStrategy,
                          weeklyProcess,
                          prompts,
                          metrics,
                          nextSteps
                        }
                      }
                    ];