/**
 * Menu transformation utilities
 * 
 * Transforms menu data to match iFood API shape
 */
import {
  EDietaryRestriction,
  EDishClassification,
  EImportMenuStatus,
  EPortionSize,
} from '../../types/menus/IMenu';

/**
 * Transformed garnish item
 */
export interface TransformedGarnishItem {
  id: string;
  description: string;
  logoBase64?: string | null;
  unitPrice: number;
  details?: string | null;
  displayOrder: number;
}

/**
 * Transformed choice
 */
export interface TransformedChoice {
  id: string;
  name: string;
  min: number;
  max: number;
  garnishItems: TransformedGarnishItem[];
  displayOrder: number;
}

/**
 * Transformed product info
 */
export interface TransformedProductInfo {
  id: string;
  packaging: string | null;
  sequence: number | null;
  quantity: number;
  unit: string | null;
  ean: string | null;
}

/**
 * Transformed selling option
 */
export interface TransformedSellingOption {
  minimum: number | null;
  incremental: number | null;
  averageUnit: string | null;
  availableUnits: string[] | null;
}

/**
 * Transformed menu item
 */
export interface TransformedItem {
  id: string;
  description: string;
  details: string | null;
  logoUrl?: string | null;
  needChoices: boolean;
  unitPrice: number;
  unitMinPrice?: number | null;
  unitOriginalPrice?: number | null;
  productInfo?: TransformedProductInfo | null;
  sellingOption?: TransformedSellingOption | null;
  choices?: TransformedChoice[];
  tags?: string[];
  productAisles?: string[];
  displayOrder: number;
  portionSizeTag: EPortionSize;
  dietaryRestrictions?: EDietaryRestriction[];
  dishClassifications?: EDishClassification[];
  logoBase64?: string;
}

/**
 * Transformed menu category
 */
export interface TransformedMenuCategory {
  id: string;
  name: string;
  items: TransformedItem[];
  displayOrder: number;
}

/**
 * Transformed menu data
 */
export interface TransformedMenuData {
  categories: TransformedMenuCategory[];
  name: string;
  isActive: boolean;
  menuStatus: EImportMenuStatus | null;
}

/**
 * Transform a single item to client shape
 * 
 * @param item - Full item data
 * @returns Transformed item data or null if input is null
 */
export const transformItemToClientShape = (item: any | null): TransformedItem | null => {
  if (!item) {
    return null;
  }

  const transformedChoices: TransformedChoice[] = item.choices
    ? item.choices.map((choice: any) => {
        const transformedGarnishItems: TransformedGarnishItem[] =
          choice.garnishItems
            ? choice.garnishItems.map((garnish: any) => ({
                id: garnish.id,
                description: garnish.description,
                logoBase64: garnish.logoBase64,
                logoUrl: garnish.logoUrl,
                unitPrice: garnish.unitPrice,
                details: garnish.details,
                displayOrder: garnish.displayOrder,
              }))
            : [];
        return {
          id: choice.id,
          name: choice.name,
          min: choice.min,
          max: choice.max,
          garnishItems: transformedGarnishItems,
          displayOrder: choice.displayOrder,
        };
      })
    : [];

  const productAislesArray = item.productAisles
    ? item.productAisles.map((aisle: any) => aisle.aisleName)
    : [];

  return {
    id: item.id,
    description: item.description,
    logoBase64: item.logoBase64,
    details: item.details,
    logoUrl: item.logoUrl,
    needChoices: item.needChoices,
    unitPrice: item.unitPrice,
    unitMinPrice: item.unitMinPrice ? item.unitMinPrice : null,
    unitOriginalPrice: item.unitOriginalPrice
      ? item.unitOriginalPrice
      : null,
    productInfo: item.productInfo
      ? {
          id: item.productInfo.ifoodProductInfoId,
          packaging: item.productInfo.packaging,
          sequence: item.productInfo.sequence,
          quantity: item.productInfo.quantity,
          unit: item.productInfo.unit,
          ean: item.productInfo.ean,
        }
      : undefined,
    sellingOption: item.sellingOption
      ? {
          minimum: item.sellingOption.minimum,
          incremental: item.sellingOption.incremental,
          averageUnit: item.sellingOption.averageUnit,
          availableUnits: item.sellingOption.availableUnits,
        }
      : undefined,
    choices:
      transformedChoices.length > 0 ? transformedChoices : undefined,
    tags: item.promotionTags || undefined,
    productAisles:
      productAislesArray.length > 0 ? productAislesArray : undefined,
    displayOrder: item.displayOrder,
    portionSizeTag: item.portionSizeTag,
    dietaryRestrictions: item.dietaryRestrictions || undefined,
    dishClassifications: item.dishClassifications || undefined,
  };
};

/**
 * Transform full menu to iFood shape
 * 
 * @param fullMenu - Full menu data
 * @returns Transformed menu data or null if input is null
 */
export const transformFullMenuToIFoodShape = (
  fullMenu: any | null,
): TransformedMenuData | null => {
  if (!fullMenu || !fullMenu.menuCategories) {
    return null;
  }

  const transformedMenuCategories: TransformedMenuCategory[] =
    fullMenu.menuCategories.map((category: any) => {
      const transformedItems: TransformedItem[] = category.items.map((item: any) => {
        const transformedChoices: TransformedChoice[] = item.choices
          ? item.choices.map((choice: any) => {
              const transformedGarnishItems: TransformedGarnishItem[] =
                choice.garnishItems
                  ? choice.garnishItems.map((garnish: any) => ({
                      id: garnish.id,
                      description: garnish.description,
                      logoBase64: garnish.logoUrl,
                      unitPrice: garnish.unitPrice,
                      details: garnish.details,
                      displayOrder: garnish.displayOrder,
                    }))
                  : [];
              return {
                id: choice.id,
                name: choice.name,
                min: choice.min,
                max: choice.max,
                garnishItems: transformedGarnishItems,
                displayOrder: choice.displayOrder,
              };
            })
          : [];

        const productAislesArray = item.productAisles
          ? item.productAisles.map((aisle: any) => aisle.aisleName)
          : [];

        return {
          id: item.id,
          description: item.description,
          logoBase64: item.logoBase64,
          details: item.details,
          logoUrl: item.logoUrl,
          needChoices: item.needChoices,
          unitPrice: item.unitPrice,
          unitMinPrice: item.unitMinPrice ? item.unitMinPrice : null,
          unitOriginalPrice: item.unitOriginalPrice
            ? item.unitOriginalPrice
            : null,
          productInfo: item.productInfo
            ? {
                id: item.productInfo.ifoodProductInfoId,
                packaging: item.productInfo.packaging,
                sequence: item.productInfo.sequence,
                quantity: item.productInfo.quantity,
                unit: item.productInfo.unit,
                ean: item.productInfo.ean,
              }
            : undefined,
          sellingOption: item.sellingOption
            ? {
                minimum: item.sellingOption.minimum,
                incremental: item.sellingOption.incremental,
                averageUnit: item.sellingOption.averageUnit,
                availableUnits: item.sellingOption.availableUnits,
              }
            : undefined,
          choices:
            transformedChoices.length > 0 ? transformedChoices : undefined,
          tags: item.promotionTags || undefined,
          productAisles:
            productAislesArray.length > 0 ? productAislesArray : undefined,
          displayOrder: item.displayOrder,
          portionSizeTag: item.portionSizeTag,
          dietaryRestrictions: item.dietaryRestrictions || undefined,
          dishClassifications: item.dishClassifications || undefined,
        };
      });

      return {
        id: category.id,
        name: category.name,
        items: transformedItems,
        displayOrder: category.displayOrder,
      };
    });

  return {
    categories: transformedMenuCategories,
    name: fullMenu.name || '',
    isActive: fullMenu.isActive,
    menuStatus: fullMenu.menuStatus,
  };
};
