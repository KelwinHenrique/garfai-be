import { handleHomeScreenDataExchange } from './screens/home.service'
import { handleEnvironmentListScreenDataExchange } from './screens/environment-list.service'
import { handleCatalogMenuScreenDataExchange } from './screens/catalog-menu.service'
import { handleMenuItemScreenDataExchange } from './screens/menu-item.service'


type ActionName = 'ping' | 'INIT' | 'data_exchange' | 'BACK'

type ScreenName =
  | 'HOME_SCREEN'
  | 'ENVIRONMENT_LIST'
  | 'CATALOG_MENU'
  | 'MENU_ITEM'

interface ActionPayload {
  action: ActionName
  [key: string]: any
}

interface DataExchangePayload {
  screen: ScreenName
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

const screenMap: Record<ScreenName, ActionFunction> = {
  HOME_SCREEN: handleHomeScreenDataExchange,
  ENVIRONMENT_LIST: handleEnvironmentListScreenDataExchange,
  CATALOG_MENU: handleCatalogMenuScreenDataExchange,
  MENU_ITEM: handleMenuItemScreenDataExchange,
}

const dataExchange = async (payload: DataExchangePayload): Promise<any> => {
  try {
    if (payload.screen in screenMap) {
      console.log('DataExchange: ', payload.screen)
      return screenMap[payload.screen](payload)
    } else {
      throw new Error(`Action '${payload.action}' not found`)
    }
  } catch (error) {
    console.log('error', error)
    return {
      httpStatus: 500,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'
        }`,
    }
  }
}

const actionsMap: Record<ActionName, ActionFunction> = {
  ping,
  INIT: ping,
  BACK: ping,
  data_exchange: dataExchange,
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