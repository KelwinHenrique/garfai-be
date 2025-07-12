export interface IFoodGarnishItem {
  id: string
  code: string
  description: string
  logoUrl?: string | null
  unitPrice: number
  details?: string | null
}

export interface IFoodChoice {
  code: string
  name: string
  min: number
  max: number
  garnishItens: IFoodGarnishItem[]
}

export interface IFoodProductTagItem {
  group: string
  tags: string[]
}

export interface IFoodProductInfo {
  id: string
  packaging?: string | null
  sequence?: number | null
  quantity: number
  unit: string
  ean?: string | null
}

export interface IFoodSellingOption {
  minimum?: number | null
  incremental?: number | null
  averageUnit?: string | null // Geralmente nulo
  availableUnits: string[]
}

export interface IFoodItem {
  id: string // Usaremos como ifood_item_id e ifood_product_info_id (se productInfo existir)
  code: string // Usaremos como ifood_item_code
  description: string
  details?: string | null
  logoUrl?: string | null
  needChoices: boolean
  unitPrice: number
  unitMinPrice?: number | null
  unitOriginalPrice?: number | null
  productTags?: IFoodProductTagItem[] | null
  productInfo?: IFoodProductInfo | null
  sellingOption?: IFoodSellingOption | null
  choices?: IFoodChoice[] | null
  tags?: string[] | null // Para promotion_tags (ex: "GROCERIES_LOWEST_PRICE")
  productAisles?: string[] | null
}

export interface IFoodMenuCategory {
  code: string // Usaremos como ifood_menu_code
  name: string
  itens: IFoodItem[]
}

export interface IFoodCatalogData {
  menu: IFoodMenuCategory[]
  // Outros campos do 'data' se houver, mas 'menu' é o principal
}

export interface IFoodAPIResponse {
  code: string
  message?: string | null
  timestamp?: string | null
  data: IFoodCatalogData
}
