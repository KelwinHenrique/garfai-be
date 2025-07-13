import { getMenuByEnvironmentId } from '../../menu/get-menu-by-environment-id';
import { TransformedMenuData } from '../../menu/transform-menu';
import { getEnvironmentById } from '../../environments/get-environment-by-id';
import formatItemsQuantity from '../../../utils/formatItemsQuantity'
import convertCentsToFormattedPrice from '../../../utils/convertCentsToFormattedPrice'
import { createOrder } from '../../order/create-order';
import getFlowsClientIdAndFlowsId from '../../../utils/getFlowsClientIdAndFlowsId'
import { getItemById } from '../../menu/get-item-by-id';
import { TransformedItem } from '../../menu/transform-menu';
import { addOrderItem } from '../../../use-cases/order/add-order-item';
import { getOrderByFlowAndClient } from '../../../use-cases/order/get-order-by-flow-and-client';

type ActionName = 'selectChoices'

interface SectionsMap {
  [key: number]: string
}

interface ChoicesMap {
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

const selectChoices = async (payload: any): Promise<any> => {
  const { clientId, flowsId } = getFlowsClientIdAndFlowsId(payload.flow_token)

  const choices: any = []
  const choicesMap: ChoicesMap = {
    0: 'firstChoice',
    1: 'secondChoice',
    2: 'thirdChoice',
    3: 'fourthChoice',
    4: 'fifthChoice',
    5: 'sixthChoice',
    6: 'seventhChoice',
    7: 'eigthChoice',
    8: 'ninthChoice',
    9: 'tenthChoice',
    10: 'eleventhChoice',
    11: 'twelfthChoice',
  }

  Object.entries(choicesMap).forEach(([key, value]) => {
    const currentChoice = payload.data[`${value}`]
    if (currentChoice?.enabled) {
      const choiceToAdd: any = {
        choiceId: currentChoice.id,
        garnishItems: [],
      }
      if (currentChoice.radio) {
        choiceToAdd.garnishItems = [
          {
            garnishId: currentChoice.radio,
            quantity: 1,
          },
        ]
      } else if (currentChoice.checkbox) {
        choiceToAdd.garnishItems = currentChoice.checkbox.map(
          (checkbox: string) => ({
            garnishId: checkbox,
            quantity: 1,
          }),
        )
      }
      choices.push(choiceToAdd)
    }
  })

  const addedOrder = await addOrderItem(payload.data.order.id, {
    itemId: payload.data.selectedItem.id,
    quantity: Number(payload.data.selectedItem.quantity),
    notes: payload.data.selectedItem.observation,
    choices,
  }, clientId)

  const order = await getOrderByFlowAndClient(flowsId, clientId, addedOrder.orderItem!.environmentId!);


  return {
    screen: 'CATALOG_MENU',
    data: {
      initValue: '',
      footerProps: {
        leftText: formatItemsQuantity(order?.items?.length || 0),
        rightText: convertCentsToFormattedPrice(order!.subtotalAmount),
      },
    },
  }

}

const actionsMap: Record<ActionName, ActionFunction> = {
  selectChoices,
}

export const handleMenuItemScreenDataExchange = async (payload: ActionPayload) => {
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
