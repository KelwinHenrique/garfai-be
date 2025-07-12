/**
 * Client routes
 */

import { Router } from 'express';
import { createClientHandler } from './create-client';
import { addClientAddressHandler } from './add-client-address';

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

export default router;
