const data = $json;

                    const weeklyAgenda = data.weeklyProcess
                      .map((week) => {
                        const headline = `Semana ${week.semana}: ${week.foco}`;
                        const objetivos = week.objetivos
                          .map((objetivo, index) => `  ${index + 1}. ${objetivo}`)
                          .join('
');
                        return `${headline}
${objetivos}`;
                      })
                      .join('

');

                    return [
                      {
                        json: {
                          ...data,
                          weeklyAgenda
                        }
                      }
                    ];