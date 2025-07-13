import { getMenuById } from '../../../use-cases/menu/get-menu-by-id';
import { TransformedMenuData } from '../../../use-cases/menu/transform-menu';

type ActionName = 'selectEnvironment'

interface ActionPayload {
  action: ActionName
  data: {
    type: string
  }
  [key: string]: any
}

// Definimos o tipo para as funções de ação
type ActionFunction = (payload: ActionPayload) => Promise<any>

const selectEnvironment = async (payload: any): Promise<any> => {
  console.log("chegou aqui", payload)
  const transformedMenu = await getMenuById(payload.data.selectedRestaurant) as TransformedMenuData | null;

  console.log("chegou aqui", transformedMenu)
  return {
    screen: 'ENVIRONMENT_LIST',
    data: {}
  }
}

const actionsMap: Record<ActionName, ActionFunction> = {
  selectEnvironment,
}

export const handleEnvironmentListScreenDataExchange = async (payload: ActionPayload) => {
  try {
    // Verificamos se a ação existe no mapa
    if (payload.data.type in actionsMap) {
      const actionName = payload.data.type as ActionName
      return actionsMap[actionName](payload)
    } else {
      throw new Error(`Action '${payload.data.type}' not found`)
    }
  } catch (error) {
    console.log('error', error)

    return {
      httpStatus: 500,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'
        } `,
    }
  }
}
