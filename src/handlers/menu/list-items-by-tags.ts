/**
 * Handler for listing items by tags
 * 
 * This handler allows filtering items by one or more tags
 */
import { Request, Response } from 'express';
import { ItemRepository } from '../../repositories/ItemRepository';
import { EItemTags } from '../../types/IItem';
import { EnvironmentRepository } from '../../repositories/EnvironmentRepository';
import * as yup from 'yup';

// Create an instance of the item repository
const itemRepository = new ItemRepository();
const environmentRepository = new EnvironmentRepository();

/**
 * Validation schema for query parameters
 */
const querySchema = yup.object({
  tags: yup.string().required(),
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(100)
});

/**
 * List items by tags handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const listItemsByTagsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate and parse query parameters
    const { tags, page, limit } = await querySchema.validate(req.query);
    
    // Parse tags from comma-separated string to array
    const tagsList = tags.split(',').map(tag => tag.trim().toUpperCase());
    
    // Validate that all tags are valid EItemTags
    const validTags = Object.values(EItemTags);
    const invalidTags = tagsList.filter(tag => !validTags.includes(tag as EItemTags));
    
    if (invalidTags.length > 0) {
      res.status(400).json({
        success: false,
        message: `Invalid tags: ${invalidTags.join(', ')}`,
        validTags
      });
      return;
    }
    
    // Get items with pagination
    const result = await itemRepository.findItemsByTags(
      tagsList as EItemTags[],
      page,
      limit
    );

    for (const item of result.items) {
      const environment = await environmentRepository.findById(item.environmentId);
      item.environmentData = {
        id: environment?.id,
        name: environment?.name,
        description: environment?.description,
        categoryName: environment?.categoryName,
        preparationTime: environment?.preparationTime,
        reputation: environment?.reputation,
      };
    }
    
    res.status(200).json({
      success: true,
      data: result.items,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    console.error('Error listing items by tags:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
