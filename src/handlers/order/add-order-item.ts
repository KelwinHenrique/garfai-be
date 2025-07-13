/**
 * Add item to order handler
 */

import { Request, Response } from 'express';
import * as yup from 'yup';
import { ApiResponse } from '../../models';
import { addOrderItem } from '../../use-cases/order/add-order-item';

/**
 * Interface for choice body in add item request
 */
export interface IChoiceBody {
  choiceId: string;
  optionId: string;
}

/**
 * Interface for add item request body
 */
export interface IAddItemBody {
  itemId: string;
  quantity: number;
  notes?: string | null;
  choices?: IChoiceBody[];
}

/**
 * Validation schema for add item request
 */
export const addItemSchema = yup.object({
  itemId: yup.string().uuid().required(),
  quantity: yup.number().integer().positive().required(),
  notes: yup.string().nullable().optional(),
  choices: yup.array().of(
    yup.object({
      choiceId: yup.string().uuid().required(),
      optionId: yup.string().uuid().required(),
    })
  ).optional(),
}).required();

/**
 * Add item to order handler
 * 
 * @param req - Express request object with orderId in params and clientId in header
 * @param res - Express response object
 */
export const addOrderItemHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get clientId from header (validation already done by middleware)
    const clientId = req.header('clientId')!;
    // Get orderId from path params
    const { orderId } = req.params;
    
    // Validate request body
    let itemData: IAddItemBody;
    try {
      itemData = await addItemSchema.validate(req.body);
    } catch (validationError) {
      const response: ApiResponse = {
        success: false,
        error: `Validation error: ${(validationError as Error).message}`,
        timestamp: new Date().toISOString()
      };
      res.status(400).json(response);
      return;
    }
    
    // Call the use case to add the item to the order
    const result = await addOrderItem(orderId, itemData, clientId);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error adding item to order: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
