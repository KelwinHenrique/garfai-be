/**
 * Order routes
 */

import { Router } from 'express';
import { createOrderHandler } from './create-order';
import { getOrderByIdHandler } from './get-order-by-id';
import { listClientOrdersHandler } from './list-client-orders';
import { validateApiKey } from '../../middlewares/api-key-middleware';
import { validateClientId } from '../../middlewares/client-id-middleware';

const router = Router();

/**
 * @route POST /api/orders
 * @description Create a new order
 * @access Private
 * @body {whatsappFlowsId, environmentId, clientAddressId}
 * @header clientId - Required client identifier
 */
router.post('/', validateApiKey, validateClientId, createOrderHandler);

/**
 * @route GET /api/orders/:id
 * @description Get an order by ID
 * @access Private
 * @header clientId - Required client identifier
 */
router.get('/:id', validateApiKey, validateClientId, getOrderByIdHandler);

/**
 * @route GET /api/orders
 * @description List all orders for the authenticated client
 * @access Private
 * @header clientId - Required client identifier
 */
router.get('/', validateApiKey, validateClientId, listClientOrdersHandler);

export default router;
