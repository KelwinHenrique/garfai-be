/**
 * Order routes
 */

import { Router } from 'express';
import { createOrderHandler } from './create-order';
import { getOrderByIdHandler } from './get-order-by-id';
import { listClientOrdersHandler } from './list-client-orders';
import { addOrderItemHandler } from './add-order-item';
import { getOrderByFlowAndClientHandler } from './get-order-by-flow-and-client';
import { updateOrderStatusHandler } from './update-order-status';
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

/**
 * @route POST /api/orders/:orderId/items
 * @description Add an item to an existing order
 * @access Private
 * @body {itemId, quantity, notes?, choices?}
 * @header clientId - Required client identifier
 */
router.post('/:orderId/items', validateApiKey, validateClientId, addOrderItemHandler);

/**
 * @route GET /api/orders/flow/:flowId
 * @description Get an order with its items by flow ID and client ID
 * @access Private
 * @header clientId - Required client identifier
 */
router.get('/flows/:flowId', validateApiKey, validateClientId, getOrderByFlowAndClientHandler);

/**
 * @route PUT /api/orders/:orderId/status
 * @description Update the status of an order
 * @access Private
 * @body {status, cancellationReason?}
 * @header clientId - Required client identifier
 */
router.put('/:orderId/status', validateApiKey, validateClientId, updateOrderStatusHandler);

export default router;
