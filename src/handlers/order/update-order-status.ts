/**
 * Update order status handler
 */

import { Request, Response } from 'express';
import * as yup from 'yup';
import { updateOrderStatus } from '../../use-cases/order/update-order-status';
import { EOrderStatus } from '../../types/orders/IOrder';

/**
 * Schema for validating update order status request body
 */
export const updateOrderStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf(Object.values(EOrderStatus))
    .required('Status is required'),
  cancellationReason: yup
    .string()
    .when('status', {
      is: (val: string) => [
        EOrderStatus.CANCELED_BY_MERCHANT,
        EOrderStatus.CANCELED_BY_USER,
        EOrderStatus.REJECTED_BY_MERCHANT
      ].includes(val as EOrderStatus),
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.optional().nullable()
    })
});

export type IUpdateOrderStatusBody = yup.InferType<typeof updateOrderStatusSchema>;

/**
 * Handler for updating order status
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export async function updateOrderStatusHandler(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const clientId = req.headers['clientid'] as string;
    
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required in headers' });
    }
    
    // Validate request body
    const body: IUpdateOrderStatusBody = await updateOrderStatusSchema.validate(req.body);
    
    // Call use case to update order status
    const result = await updateOrderStatus(
      orderId,
      body.status as EOrderStatus,
      clientId,
      body.cancellationReason
    );
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error updating order status:', error);
    
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}
