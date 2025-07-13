
import { getEnvironments } from '../../../use-cases/environments/get-environment';

type ActionName = 'selectCategory' | 'search'

interface ActionPayload {
  action: ActionName
  data: {
    type: string
  }
  [key: string]: any
}

// Definimos o tipo para as funções de ação
type ActionFunction = (payload: ActionPayload) => Promise<any>

const mapEnvironmentsToRestaurants = (
  restaurants: any[],
  selectedAddress: string,
) => {
  return restaurants.map((it: any) => ({
    id: it.id,
    start: {
      image: it.logoBase64 || '',
    },
    'main-content': {
      title: it.name.substr(0, 30),
      metadata: `⭐️ ${it.rating} - ${it.categoryName
        } - ${0.4} km`,
    },
    'on-click-action': {
      name: 'data_exchange',
      payload: {
        type: 'selectEnvironment',
        selectedRestaurant: it.id,
        selectedAddress,
      },
    },
    tags: [
      `${Math.floor(Math.random() * 12) + 20} min`,
      `Entrega grátis`,
    ],
  }))
}


const selectCategory = async (payload: any): Promise<any> => {
  const environments = await getEnvironments(undefined, payload.data.selectedCategory)

  if (environments.length) {
    let parsedEnvironments
    parsedEnvironments = mapEnvironmentsToRestaurants(
      environments,
      payload.data.selectedAddress,
    )
    return {
      screen: 'ENVIRONMENT_LIST',
      data: {
        environments: parsedEnvironments
      },
    }
  } else {
    return {
      screen: 'HOME_SCREEN',
      data: {
        error_message: 'Não encontramos restaurantes para esta categoria'
      }
    }
  }
}

const search = async (payload: any): Promise<any> => {
  return {
    screen: 'HOME_SCREEN',
    data: {
      error_message: 'Em desenvolvimento. Clique nas categorias para continuar.'
    },
  }
}

const actionsMap: Record<ActionName, ActionFunction> = {
  selectCategory,
  search,
}

export const handleHomeScreenDataExchange = async (payload: ActionPayload) => {
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
