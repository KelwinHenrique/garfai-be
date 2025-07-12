/**
 * Client routes
 */

import { Router } from 'express';
import { createClientHandler } from './create-client';
import { addClientAddressHandler } from './add-client-address';
import { listClientAddressesHandler } from './list-client-addresses';

const router = Router();

/**
 * @route POST /api/clients
 * @description Create a new client
 * @access Public
 */
router.post('/', createClientHandler);

/**
 * @route POST /api/clients/address
 * @description Add a new address to a client
 * @access Public
 */
router.post('/address', addClientAddressHandler);

/**
 * @route GET /api/clients/:clientId/addresses
 * @description List all addresses for a client
 * @access Public
 */
router.get('/:clientId/addresses', listClientAddressesHandler);

export default router;
