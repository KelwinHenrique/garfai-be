/**
 * List orders by status handler
 * 
 * Returns orders grouped by their status, with each status containing an array of orders with their items
 */

import { Request, Response } from 'express';
import * as yup from 'yup';
import { EOrderStatus } from '../../types/orders/IOrder';
import { OrderRepository } from '../../repositories/OrderRepository';
import { OrderItemRepository } from '../../repositories/OrderItemRepository';
import { OrderChoiceRepository } from '../../repositories/OrderChoiceRepository';
import { OrderGarnishItemRepository } from '../../repositories/OrderGarnishItemRepository';

/**
 * Input validation schema
 */
const listOrdersByStatusSchema = yup.object({
  environmentId: yup.string().uuid().required(),
}).required();

/**
 * Type for the input parameters
 */
type ListOrdersByStatusInput = yup.InferType<typeof listOrdersByStatusSchema>;

/**
 * Handler to list orders grouped by status
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const listOrdersByStatusHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract and validate query parameters
    // const { environmentId } = await listOrdersByStatusSchema.validate(req.query);

    const environmentId = req.headers.environmentid as string;
    
    // Initialize repositories
    const orderRepository = new OrderRepository();
    const orderItemRepository = new OrderItemRepository();
    const orderChoiceRepository = new OrderChoiceRepository();
    const orderGarnishItemRepository = new OrderGarnishItemRepository();
    
    // Get all orders for the environment
    const orders = await orderRepository.findByEnvironmentId(environmentId);
    
    // Group orders by status
    const ordersByStatus: Record<EOrderStatus, any[]> = Object.values(EOrderStatus).reduce((acc, status) => {
      acc[status] = [];
      return acc;
    }, {} as Record<EOrderStatus, any[]>);
    
    // Process each order to include its items and choices
    for (const order of orders) {
      // Get order items for this order
      const orderItems = await orderItemRepository.findByOrderId(order.id);
      
      // For each order item, get its choices
      const itemsWithDetails = await Promise.all(orderItems.map(async (item) => {
        const choices = await orderChoiceRepository.findByOrderItemId(item.id);
        
        // For each choice, get its garnish items
        const choicesWithGarnishItems = await Promise.all(choices.map(async (choice) => {
          const garnishItems = await orderGarnishItemRepository.findByOrderChoiceId(choice.id);
          return {
            ...choice,
            garnishItems
          };
        }));
        
        return {
          ...item,
          choices: choicesWithGarnishItems
        };
      }));
      
      // Add the order with its items to the appropriate status group
      ordersByStatus[order.status].push({
        ...order,
        items: itemsWithDetails
      });
    }
    
    // Return the grouped orders
    res.status(200).json({
      success: true,
      data: ordersByStatus
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    console.error('Error listing orders by status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list orders by status'
    });
  }
};
