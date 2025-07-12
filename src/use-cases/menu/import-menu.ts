import { Menu, NewMenu } from "../../schemas/menus.schema";
import {
  EDietaryRestriction,
  EDishClassification,
  EImportMenuStatus,
  EPortionSize,
} from "../../types/menus/IMenu";
import { MenuRepository } from "../../repositories/MenuRepository";
import {
  IFoodAPIResponse,
  IFoodProductTagItem,
} from "../../types/menus/IIFoodAPIResponse";
import { NewMenuCategoryRepository } from "../../repositories/NewMenuCategoryRepository";
import { NewMenuCategory } from "../../schemas/menuCategories.schema";
import { NewMenuItemRepository } from "../../repositories/NewMenuItemRepository";
import { NewItem } from "../../schemas/items.schema";
import fetchImageAsBase64 from "../../utils/fetchImageAsBase64";
import convertPriceToCent from "../../utils/convertPriceToCent";
import { NewProductInfo } from "../../schemas/productInfo.schema";
import { ProductInfoRepository } from "../../repositories/ProductInfoRepository";
import { NewSellingOption } from "../../schemas/sellingOptions.schema";
import { SellingOptionRepository } from "../../repositories/SellingOptionRepository";
import { NewChoice } from "../../schemas/choices.schema";
import { ChoiceRepository } from "../../repositories/ChoiceRepository";
import { GarnishItemRepository } from "../../repositories/GarnishItemRepository";
import { NewGarnishItem } from "../../schemas/garnishItems.schema";

const mapIFoodTagsToNewFields = (
  productTags: IFoodProductTagItem[] | null | undefined
) => {
  const dietaryRestrictions: EDietaryRestriction[] = [];
  const dishClassifications: EDishClassification[] = [];
  let portionSize: EPortionSize = EPortionSize.NOT_APPLICABLE;

  if (!productTags) {
    return {
      dietaryRestrictions,
      dishClassifications,
      portionSize,
    };
  }

  for (const tagGroup of productTags) {
    if (tagGroup.group === "DIETARY_RESTRICTIONS") {
      for (const tag of tagGroup.tags) {
        switch (tag) {
          case "GLUTEN_FREE":
            dietaryRestrictions.push(EDietaryRestriction.GLUTEN_FREE);
            break;
          case "LAC_FREE":
            dietaryRestrictions.push(EDietaryRestriction.LAC_FREE);
            break;
          case "ORGANIC":
            dietaryRestrictions.push(EDietaryRestriction.ORGANIC);
            break;
          case "SUGAR_FREE":
            dietaryRestrictions.push(EDietaryRestriction.SUGAR_FREE);
            break;
          case "VEGAN":
            dietaryRestrictions.push(EDietaryRestriction.VEGAN);
            break;
          case "VEGETARIAN":
            dietaryRestrictions.push(EDietaryRestriction.VEGETARIAN);
            break;
        }
      }
    }

    // Mapear classificações de prato
    if (tagGroup.group === "DISH_CLASSIFICATION") {
      for (const tag of tagGroup.tags) {
        switch (tag) {
          case "ALCOHOLIC_DRINK":
            dishClassifications.push(EDishClassification.ALCOHOLIC_DRINK);
            break;
          case "FROSTY":
            dishClassifications.push(EDishClassification.FROSTY);
            break;
        }
      }
    }

    // Mapear tamanho da porção
    if (tagGroup.group === "PORTION_SIZE") {
      for (const tag of tagGroup.tags) {
        switch (tag) {
          case "SERVES_1":
            portionSize = EPortionSize.SERVES_1;
            break;
          case "SERVES_2":
            portionSize = EPortionSize.SERVES_2;
            break;
          case "SERVES_3":
            portionSize = EPortionSize.SERVES_3;
            break;
          case "SERVES_4":
            portionSize = EPortionSize.SERVES_4;
            break;
        }
      }
    }
  }

  return {
    dietaryRestrictions,
    dishClassifications,
    portionSize,
  };
};

export async function importMenu(
  payload: any,
  environmentId: string,
  userId: string
): Promise<void> {
  const initialMenuPayload: NewMenu = {
    environmentId: environmentId,
    ifoodMerchantId: payload.ifoodMerchantId,
    name: `Importado iFood - ${new Date().toLocaleString()}`,
    importedAt: new Date(),
    menuStatus: EImportMenuStatus.SCHEDULED,
  };

  try {
    const menuRepository = new MenuRepository();
    const initialMenu = await menuRepository.create(initialMenuPayload);

    await menuRepository.updateGeneric(initialMenu.id, {
      menuStatus: EImportMenuStatus.PROCESSING,
    });

    const iFoodData = await fetchIFoodCatalog(
      payload.ifoodMerchantId,
      initialMenu.id,
      menuRepository
    );

    const updatedMenuPayload: Partial<Menu> = {
      rawCatalogData: iFoodData,
    };

    const updatedMenu = await menuRepository.updateGeneric(
      initialMenu.id,
      updatedMenuPayload
    );

    await createMenuCategoryAndItems(
      initialMenu.id,
      iFoodData as IFoodAPIResponse,
      environmentId
    );
    await menuRepository.updateGeneric(initialMenu.id, {
      menuStatus: EImportMenuStatus.COMPLETED,
    });

    await menuRepository.disableAllMenusByEnvironmentId(environmentId);
    await menuRepository.updateGeneric(initialMenu.id, {
      isActive: true,
    });
  } catch (error) {
    console.error("Error creating initial menu:", error);
    throw error;
  }
}

const fetchIFoodCatalog = async (
  merchantId: string,
  menuId: string,
  repository: MenuRepository
): Promise<
  IFoodAPIResponse | { httpStatus: number; message: string; error?: string }
> => {
  const iFoodUrl = `https://marketplace.ifood.com.br/v1/merchants/${merchantId}/catalog`;
  let iFoodResponse: Response;
  let iFoodData: IFoodAPIResponse;

  try {
    iFoodResponse = await fetch(iFoodUrl);

    if (!iFoodResponse.ok) {
      const errorText = await iFoodResponse.text();
      console.error(
        `Error fetching iFood catalog for merchant ${merchantId}. Status: ${iFoodResponse.status}. Response: ${errorText}`
      );

      await repository.updateGeneric(menuId, {
        menuStatus: EImportMenuStatus.FAILED,
      });
      return {
        httpStatus: iFoodResponse.status === 404 ? 404 : 502,
        message:
          iFoodResponse.status === 404
            ? "iFood merchant not found or catalog unavailable."
            : "Failed to fetch iFood catalog.",
        error: errorText,
      };
    }
    iFoodData = (await iFoodResponse.json()) as IFoodAPIResponse;

    if (!iFoodData || !iFoodData.data || !iFoodData.data.menu) {
      console.error("iFood catalog data is invalid or empty.");
      await repository.updateGeneric(menuId, {
        menuStatus: EImportMenuStatus.FAILED,
      });

      return {
        httpStatus: 422,
        message: "Received invalid or empty catalog data from iFood.",
      };
    }

    return iFoodData;
  } catch (error) {
    console.error(
      `Error fetching iFood catalog for merchant ${merchantId}:`,
      error
    );
    throw error;
  }
};

const createMenuCategoryAndItems = async (
  menuId: string,
  iFoodData: IFoodAPIResponse,
  environmentId: string
) => {
  const newMenuCategoryRepository = new NewMenuCategoryRepository();
  const newMenuItemRepository = new NewMenuItemRepository();
  const newProductInfoRepository = new ProductInfoRepository();
  const newChoiceRepository = new ChoiceRepository();
  const newGarnishItemRepository = new GarnishItemRepository();
  const newSellingOptionRepository = new SellingOptionRepository();
  for (const iFoodCategory of iFoodData.data.menu) {
    const newMenuCategoryPayload: NewMenuCategory = {
      environmentId: environmentId,
      menuId: menuId,
      ifoodMenuCode: iFoodCategory.code,
      name: iFoodCategory.name,
    };
    const createdMenuCategory = await newMenuCategoryRepository.create(
      newMenuCategoryPayload
    );

    let itemOrder = 0;
    console.log("iFoodCategory", iFoodCategory);
    for (const iFoodItem of iFoodCategory.itens) {
      const itemImageBase64 = await fetchImageAsBase64(
        "https://static.ifood-static.com.br/image/upload/t_low/pratos/",
        iFoodItem?.logoUrl || null
      );
      const newMenuItemPayload: NewItem = {
        environmentId: environmentId,
        menuCategoryId: createdMenuCategory.id!,
        ifoodItemId: iFoodItem.id,
        ifoodItemCode: iFoodItem.code,
        description: iFoodItem.description,
        details: iFoodItem.details || null,
        logoUrl: iFoodItem.logoUrl || null,
        logoBase64: itemImageBase64,
        needChoices: iFoodItem.needChoices,
        unitPrice: convertPriceToCent(iFoodItem.unitPrice),
        unitMinPrice: iFoodItem.unitMinPrice
          ? convertPriceToCent(iFoodItem.unitMinPrice)
          : null,
        unitOriginalPrice: iFoodItem.unitOriginalPrice
          ? convertPriceToCent(iFoodItem.unitOriginalPrice)
          : convertPriceToCent(iFoodItem.unitPrice),
        promotionTags: iFoodItem.tags || [],
        displayOrder: itemOrder++,
        ...mapIFoodTagsToNewFields(iFoodItem.productTags),
      };
      const createdMenuItem = await newMenuItemRepository.create(
        newMenuItemPayload
      );

      if (iFoodItem.productInfo) {
        const pi = iFoodItem.productInfo;

        const newProductInfoPayload: NewProductInfo = {
          environmentId: environmentId,
          itemId: createdMenuItem.id!,
          ifoodProductInfoId: pi.id,
          packaging: pi.packaging || null,
          sequence: pi.sequence || null,
          quantity: pi.quantity,
          unit: pi.unit || null,
          ean: pi.ean || null,
        };
        await newProductInfoRepository.create(newProductInfoPayload);
      }

      if (iFoodItem.sellingOption) {
        const so = iFoodItem.sellingOption;
        const newSellingOptionPayload: NewSellingOption = {
          environmentId: environmentId,
          itemId: createdMenuItem.id!,
          minimum: so.minimum || null,
          incremental: so.incremental || null,
          averageUnit: so.averageUnit || null,
          availableUnits: so.availableUnits || [],
        };
        await newSellingOptionRepository.create(newSellingOptionPayload);
      }

      if (iFoodItem.choices) {
        let choiceOrder = 0;
        for (const iFoodChoice of iFoodItem.choices) {
          const newChoicePayload: NewChoice = {
            environmentId: environmentId,
            itemId: createdMenuItem.id!,
            ifoodChoiceCode: iFoodChoice.code,
            name: iFoodChoice.name,
            min: iFoodChoice.min,
            max: iFoodChoice.max,
            displayOrder: choiceOrder++,
          };
          const createdChoice = await newChoiceRepository.create(
            newChoicePayload
          );

          if (iFoodChoice.garnishItens) {
            let garnishOrder = 0;
            for (const iFoodGarnish of iFoodChoice.garnishItens) {
              const garnishImageBase64 = await fetchImageAsBase64(
                "https://static.ifood-static.com.br/image/upload/t_low/pratos/",
                iFoodGarnish?.logoUrl || null
              );

              const newGarnishPayload: NewGarnishItem = {
                environmentId: environmentId,
                choiceId: createdChoice.id!,
                ifoodGarnishItemId: iFoodGarnish.id,
                ifoodGarnishItemCode: iFoodGarnish.code || iFoodGarnish.id,
                description: iFoodGarnish.description,
                details: iFoodGarnish.details || null,
                logoUrl: iFoodGarnish.logoUrl || null,
                logoBase64: garnishImageBase64,
                unitPrice: convertPriceToCent(iFoodGarnish.unitPrice),
                displayOrder: garnishOrder++,
              };
              const createdGarnish = await newGarnishItemRepository.create(
                newGarnishPayload
              );

              console.log("createdGarnish", createdGarnish);
            }
          }
        }
      }
    }
  }
};
