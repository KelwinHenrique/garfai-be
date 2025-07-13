const getFlowsClientIdAndFlowsId = (token: string) => {
  return {
    clientId: token.split('|')[0],
    flowsId: token.split('|')[1],
  }
}

export default getFlowsClientIdAndFlowsId