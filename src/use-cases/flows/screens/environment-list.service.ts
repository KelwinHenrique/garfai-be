import { getMenuByEnvironmentId } from '../../../use-cases/menu/get-menu-by-environment-id';
import { TransformedMenuData } from '../../../use-cases/menu/transform-menu';
import { getEnvironmentById } from '../../../use-cases/environments/get-environment-by-id';
import formatItemsQuantity from '../../../utils/formatItemsQuantity'
import convertCentsToFormattedPrice from '../../../utils/convertCentsToFormattedPrice'
import { createOrder } from '../../../use-cases/order/create-order';
import getFlowsClientIdAndFlowsId from '../../../utils/getFlowsClientIdAndFlowsId'

type ActionName = 'selectEnvironment'

interface SectionsMap {
  [key: number]: string
}

interface MenuData {
  environment: {
    name: string
    id: string
    cover: string
  }
  footerProps: {
    leftText: string
    rightText: string
  }
  [key: string]: any // Permite chaves dinâmicas
}

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
  const { clientId, flowsId } = getFlowsClientIdAndFlowsId(payload.flow_token)
  const transformedMenu = await getMenuByEnvironmentId(payload.data.selectedRestaurant) as TransformedMenuData | null;

  const result = await createOrder({
    whatsappFlowsId: flowsId,
    environmentId: payload.data.selectedRestaurant,
    clientAddressId: payload.data.selectedAddress,
  }, clientId)

  const sectionsMap: SectionsMap = {
    0: 'firstSection',
    1: 'secondSection',
    2: 'thirdSection',
    3: 'fourthSection',
    4: 'fifthSection',
    5: 'sixthSection',
    6: 'seventhSection',
    7: 'eigthSection',
    8: 'ninthSection',
    9: 'tenthSection',
    10: 'eleventhSection',
    11: 'twelfthSection',
    12: 'thirteenthSection',
    13: 'fourteenthSection',
    14: 'fifteenthSection',
  }

  const environment = await getEnvironmentById(payload.data.selectedRestaurant)

  if (!environment) {
    throw new Error('Environment not found')
  }

  const data: MenuData = {
    environment: {
      name: environment?.name,
      id: environment.id,
      cover: environment.coverBase64 || '',
    },
    order: {
      id: result.id,
    },
    initValue: '',
    footerProps: {
      leftText: formatItemsQuantity(0),
      rightText: convertCentsToFormattedPrice(result!.subtotalAmount),
    },
  }

  Object.entries(sectionsMap).forEach(([key, value]) => {
    data[`${value}Show`] = false
    data[`${value}`] = {
      title: 'title',
      items: [],
    }
  })

  transformedMenu?.categories.forEach((it, index) => {
    data[`${sectionsMap[index]}`] = {
      title: it.name,
      items: it.items.map((it) => {
        let metadata = convertCentsToFormattedPrice(it.unitPrice)
        if (it.unitMinPrice) {
          metadata = `${convertCentsToFormattedPrice(it.unitMinPrice)}`
        }
        return {
          id: it.id,
          title:
            it.description.length > 30
              ? `${it.description.substring(0, 28)}..`
              : it.description,
          description: it.details?.substring(0,300) || '',
          metadata,
          image: it.logoBase64 || '',
        }
      }),
    }
    data[`${sectionsMap[index]}Show`] = true
  })
  return {
    screen: 'CATALOG_MENU',
    data
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
