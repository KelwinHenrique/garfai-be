/**
 * Client routes
 */

import { Router } from 'express';
import { createClientHandler } from './create-client';
import { addClientAddressHandler } from './add-client-address';
import { listClientAddressesHandler } from './list-client-addresses';
import { validateApiKey } from '../../middlewares/api-key-middleware';

const router = Router();

/**
 * @route POST /api/clients
 * @description Create a new client
 * @access Public
 */
router.post('/', validateApiKey, createClientHandler);

/**
 * @route POST /api/clients/address
 * @description Add a new address to a client
 * @access Public
 */
router.post('/address', validateApiKey, addClientAddressHandler);

/**
 * @route GET /api/clients/:clientId/addresses
 * @description List all addresses for a client
 * @access Public
 */
router.get('/:clientId/addresses', validateApiKey, listClientAddressesHandler);


export default router;
