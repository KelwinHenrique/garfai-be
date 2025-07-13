import { getMenuByEnvironmentId } from '../../menu/get-menu-by-environment-id';
import { TransformedMenuData } from '../../menu/transform-menu';
import { getEnvironmentById } from '../../environments/get-environment-by-id';
import formatItemsQuantity from '../../../utils/formatItemsQuantity'
import convertCentsToFormattedPrice from '../../../utils/convertCentsToFormattedPrice'
import { createOrder } from '../../order/create-order';
import getFlowsClientIdAndFlowsId from '../../../utils/getFlowsClientIdAndFlowsId'
import { getItemById } from '../../../use-cases/menu/get-item-by-id';
import { TransformedItem } from '../../../use-cases/menu/transform-menu';
import { getOrderByFlowAndClient } from '../../../use-cases/order/get-order-by-flow-and-client';
import { createStaticPix, hasError } from 'pix-utils';

type ActionName = 'selectItem' | 'nextStep'

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

const selectItem = async (payload: any): Promise<any> => {
  const { clientId, flowsId } = getFlowsClientIdAndFlowsId(payload.flow_token)

  const selectedItem = await getItemById(payload.data.selectedItem) as TransformedItem | null;

  if (selectedItem) {
    let price = convertCentsToFormattedPrice(selectedItem.unitPrice)
    if (selectedItem.unitMinPrice) {
      price = `A partir de: ${convertCentsToFormattedPrice(
        selectedItem.unitMinPrice,
      )}`
    }

    const data: Record<string, any> = {
      selectedItem: {
        id: selectedItem.id,
        image: selectedItem.logoBase64 || '',
        title: selectedItem.description,
        description: selectedItem.details || '',
        price,
        subDescription: ``,
      },
      quantity: '1',
      quantityOptions: [
        { id: '1', title: '1 unidade' },
        { id: '2', title: '2 unidades' },
        { id: '3', title: '3 unidades' },
        { id: '4', title: '4 unidades' },
        { id: '5', title: '5 unidades' },
        { id: '6', title: '6 unidades' },
        { id: '7', title: '7 unidades' },
        { id: '8', title: '8 unidades' },
        { id: '9', title: '9 unidades' },
        { id: '10', title: '10 unidades' },
      ],
    }

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
      data[`${value}Show`] = false
    })

    selectedItem.choices?.forEach((it, index: number) => {
      data[`${choicesMap[index]}Show`] = true
      data[`${choicesMap[index]}`] = {
        id: it.id,
        label: it.name,
        minSelectedItems: it.min,
        maxSelectedItems: Math.min(it.max, it.garnishItems.length),
        radioInit: '',
        isRequired: it.min > 0,
        checkboxInit: [],
        items: it.garnishItems.map((garnish) => ({
          id: garnish.id,
          title: garnish.description.substring(0, 30),
          description: garnish.details || '',
          metadata:
            garnish.unitPrice > 0
              ? `+ ${convertCentsToFormattedPrice(garnish.unitPrice)}`
              : '',
          image: garnish.logoBase64 || '',
        })),
        componentType:
          Math.min(it.max, it.garnishItems.length) > 1 ? 'checkbox' : 'radio',
      }
    })
    return {
      screen: 'MENU_ITEM',
      data
    }
  }
}

const nextStep = async (payload: any): Promise<any> => {
  const { clientId, flowsId } = getFlowsClientIdAndFlowsId(payload.flow_token)

  const order = await getOrderByFlowAndClient(flowsId, clientId, payload.data.environment.id);

  if (order?.items.length === 0) {
    return {
      screen: 'CATALOG_MENU',
      data: {
        error_message: 'Insira um item no carrinho para seguir'
      }
    }
  }

  const pix = createStaticPix({
    merchantName: 'GarfAI',
    merchantCity: 'Uberlandia',
    pixKey: '431.253.808-55',
    infoAdicional: 'Gerado por GarfAI',
    transactionAmount: order!.subtotalAmount
  });

  let brCode
  if (!hasError(pix)) {
    brCode = pix.toBRCode();
  }

  const paymentsItems = order?.items.map(it => ({
    retailer_id: it.id,
    name: it.descriptionAtPurchase,
    quantity: it.quantity,
    amount: {
      value: it.singlePriceForItemLine,
      offset: 100
    },
  }))

  return {
    screen: 'PAYMENT_SCREEN',
    data: {
      total: order?.subtotalAmount,
      pix: brCode,
      orderId: order?.id,
      clientId,
      paymentsItems,
      footerProps: {
        leftText: formatItemsQuantity(order?.items.length || 0),
        rightText: convertCentsToFormattedPrice(order!.subtotalAmount),
      },
    }
  }
}

const actionsMap: Record<ActionName, ActionFunction> = {
  selectItem,
  nextStep,
}

export const handleCatalogMenuScreenDataExchange = async (payload: ActionPayload) => {
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
