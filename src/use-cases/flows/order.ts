type ActionName = 'ping' | 'INIT' | 'data_exchange' | 'BACK'

interface ActionPayload {
  action: ActionName
  [key: string]: any
}

type ActionFunction = (payload: any) => Promise<any>

const ping = async (payload: any): Promise<any> => {
  return {
    version: '3.0',
    data: {
      status: 'active',
    },
  }
}

const actionsMap: Record<ActionName, ActionFunction> = {
  ping,
  INIT: ping,
  BACK: ping,
  data_exchange: ping,
}

/**
 * Call Order Action
 * 
 * @param payload - Flows payload
 * @returns The flows execution response
 */
export async function callOrderAction(payload: ActionPayload): Promise<any> {
  // Validate input data
  if (payload.action in actionsMap) {
    console.log('Executing: ', payload.action)
    return actionsMap[payload.action](payload)
  } else {
    throw new Error(`Action '${payload.action}' not found`)
  }
} 