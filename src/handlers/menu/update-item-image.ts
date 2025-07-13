/**
 * Update item image handler
 * 
 * This handler updates an item's image (logoUrl and logoBase64)
 */
import { Request, Response } from 'express';
import { ItemRepository } from '../../repositories/ItemRepository';
import * as yup from 'yup';
import fetchImageAsBase64 from '../../utils/fetchImageAsBase64';

// Validation schema
const updateItemImageSchema = yup.object().shape({
  imageUrl: yup.string().required('Image URL is required'),
});

/**
 * Handler to update an item's image
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateItemImageHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    // Validate request body
    try {
      await updateItemImageSchema.validate(req.body);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }

    const { imageUrl } = req.body;

    // Check if item exists
    const itemRepository = new ItemRepository();
    const item = await itemRepository.getById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Convert image URL to base64
    const base64Image = await fetchImageAsBase64('', imageUrl);
    
    if (!base64Image) {
      return res.status(400).json({ message: 'Failed to fetch image from URL' });
    }

    // Update item with new image
    const updatedItem = await itemRepository.updateItemImage(id, imageUrl, base64Image);

    // Return success response
    return res.status(200).json({
      message: 'Item image updated successfully',
      item: updatedItem
    });
  } catch (error: any) {
    console.error('Error updating item image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
