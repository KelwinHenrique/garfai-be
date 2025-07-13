/**
 * Order models
 */

import * as yup from 'yup';
import { EOrderStatus } from '../types/orders/IOrder';

/**
 * Order creation input schema
 */
export const orderCreateSchema = yup.object({
  whatsappFlowsId: yup.string().uuid().required(),
  environmentId: yup.string().uuid().required(),
  clientAddressId: yup.string().uuid().required(),
}).required();

/**
 * Order creation input type
 */
export type OrderCreateInput = yup.InferType<typeof orderCreateSchema>;

/**
 * Order response type
 */
export interface Order {
  id: string;
  environmentId: string;
  clientId: string;
  whatsappFlowsId: string;
  status: EOrderStatus;
  clientAddressId: string;
  subtotalAmount: number;
  discountAmount: number;
  deliveryFeeAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
