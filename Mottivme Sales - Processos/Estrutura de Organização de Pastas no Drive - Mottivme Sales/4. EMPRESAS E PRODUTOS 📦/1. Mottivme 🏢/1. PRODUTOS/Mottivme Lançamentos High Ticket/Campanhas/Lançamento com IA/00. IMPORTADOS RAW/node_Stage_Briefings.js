const data = $json;

const stageBriefings = data.stageStrategy.map((stage, index) => ({
  ordem: index + 1,
  etapa: stage.nome,
  alvo: `${stage.baseline} -> ${stage.meta}`,
  focoIA: stage.aiPara,
  ferramentas: stage.ferramentas,
  indicador: stage.indicador,
  proximaAcao: stage.proximaAcao
}));

return [
  {
    json: {
      ...data,
      stageBriefings
    }
  }
];