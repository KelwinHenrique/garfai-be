import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import {
  ItemRepository,
} from '../repositories/ItemRepository'
import { Item } from '../schemas/items.schema'
import { EItemTags } from '../types/IItem'


interface IAddItemTagServiceResponse {
  httpStatus: number
  data?: {
    updatedItems?: number
  } | null
  message?: string | null
  code: EAddItemTagServiceCode
}

export enum EAddItemTagServiceCode {
  ITEMS_TAGGED_SUCCESSFULLY = 'ITEMS_TAGGED_SUCCESSFULLY',
  ITEMS_TAGGING_FAILED = 'ITEMS_TAGGING_FAILED',
}

type AutoTagMenuItemsServiceFn = (
  environmentId: string,
  menuCategoryId: string,
) => Promise<IAddItemTagServiceResponse>

/**
 * Categorizes multiple items in a single Google Gemini API call to save tokens
 * @param items Array of menu items to categorize
 * @param geminiModel LangChain Google Gemini model instance
 * @returns Map of item IDs to their corresponding tags
 */
async function batchCategorizeItems(
  items: Item[],
  geminiModel: ChatGoogleGenerativeAI,
): Promise<Map<string, EItemTags[]>> {
  try {
    const itemsData = items.map((item) => ({
      id: item.id,
      details: item.details || 'N/A',
      description: item.description || 'N/A',
    }))

    const prompt = `
      I'll provide you with a list of menu items. For each item, determine the most appropriate categories from the available categories list.
      
      Available Categories:
      ${Object.values(EItemTags).join(', ')}
      
      Items to categorize:
      ${JSON.stringify(itemsData, null, 2)}
      
      Return a JSON array where each object contains:
      1. "id": the exact item ID string
      2. "tags": an array of up to 3 most appropriate category strings from the provided list
      
      Example response format:
      [
        {
          "id": "item-id-1",
          "tags": ["CATEGORY1", "CATEGORY2", "CATEGORY3"]
        },
        {
          "id": "item-id-2",
          "tags": ["CATEGORY1", "CATEGORY2"]
        }
      ]
      
      Only include categories from the provided list. If only one category fits, include just that one in the tags array.
    `

    const response = await geminiModel.invoke([
      new SystemMessage(
        'You are a food categorization assistant. Your task is to categorize multiple menu items into the most appropriate categories from the provided list. IMPORTANT: Return ONLY a valid JSON array with no additional text, explanations, or markdown formatting. Do not include ```json or ``` tags. Your entire response must be parseable as JSON.',
      ),
      new HumanMessage(prompt),
    ])

    const responseText = response.content.toString().trim()

    let responseData: Array<{ id: string; tags: string[] }> = []
    try {
      const jsonText = responseText.replace(/```json|```/g, '').trim()
      responseData = JSON.parse(jsonText)

      if (!Array.isArray(responseData)) {
        console.error('Response is not an array:', responseData)
        responseData = []
      }
    } catch (error) {
      console.error('Error parsing JSON response:', error, responseText)
    }

    const itemTagsMap = new Map<string, EItemTags[]>()

    for (const item of responseData) {
      if (item.id && Array.isArray(item.tags)) {
        const validCategories = item.tags.filter((category: string) =>
          Object.values(EItemTags).includes(category as EItemTags),
        ) as EItemTags[]

        if (validCategories.length > 0) {
          itemTagsMap.set(item.id, validCategories)
        } else {
          itemTagsMap.set(item.id, [EItemTags.BRAZILIAN])
        }
      }
    }

    for (const item of items) {
      if (!itemTagsMap.has(item.id)) {
        itemTagsMap.set(item.id, [EItemTags.BRAZILIAN])
      }
    }

    return itemTagsMap
  } catch (error) {
    console.error('Error batch categorizing items:', error)

    const defaultMap = new Map<string, EItemTags[]>()
    items.forEach((item) => {
      defaultMap.set(item.id, [EItemTags.BRAZILIAN])
    })

    return defaultMap
  }
}

/**
 * Service to add tags to menu items based on LLM categorization
 */
export const autoTagMenuItemsService: AutoTagMenuItemsServiceFn = async (
  menuCategoryId: string,
  environmentId: string,
) => {
  try {
    const itemRepository = new ItemRepository()
    const geminiModel = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-2.5-flash',
      temperature: 0.3,
    })

    const menuItems = await itemRepository.findItemsByMenuCategoryIdAndEnvironmentIdRepository(
      environmentId,
      menuCategoryId,
    )

    if (!menuItems || menuItems.length === 0) {
      console.log('No items found for the specified menu')
      return {
        httpStatus: 404,
        message: 'No items found for the specified menu',
        data: null,
        code: EAddItemTagServiceCode.ITEMS_TAGGING_FAILED,
      }
    }

    const itemTagsMap = await batchCategorizeItems(menuItems, geminiModel)

    for (const item of menuItems) {
      try {
        const tags = itemTagsMap.get(item.id) || [EItemTags.BRAZILIAN]

        await itemRepository.updateItemTagsRepository(tags, item.id)
      } catch (error) {
        console.error(`Error updating item ${item.id}:`, error)
      }
    }

    return {
      httpStatus: 200,
      data: {
        updatedItems: menuItems.length,
      },
      message: `Successfully tagged ${menuItems.length} of ${menuItems.length} items`,
      code: EAddItemTagServiceCode.ITEMS_TAGGED_SUCCESSFULLY,
    }
  } catch (error: any) {
    console.error(`Error adding tags to menu items:`, error)
    return {
      httpStatus: 500,
      message: 'An error occurred while adding tags to menu items',
      data: null,
      code: EAddItemTagServiceCode.ITEMS_TAGGING_FAILED,
    }
  }
}
