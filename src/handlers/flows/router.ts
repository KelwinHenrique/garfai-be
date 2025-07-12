/**
 * Flows routes
 */

import { Router } from 'express';
import { generateEncryptKeyHandler } from './generate-encrypt-key';
import { orderHandler } from './order';
import { validateApiKey } from '../../middlewares/api-key-middleware';
import { flowsDecrypt } from '../../middlewares/flows-decrypt-middleware';
import { flowsEncrypt } from '../../middlewares/flows-encrypt-middleware';

const router = Router();

/**
 * @route POST /api/flows/generate-encrypt-key
 * @description Generate a new encryption key
 * @access Public
 */
router.post('/generate-encrypt-key', validateApiKey, generateEncryptKeyHandler);

/**
 * @route POST /api/flows/order
 * @description Create a new order
 * @access Public
 */
router.post('/order', flowsDecrypt, orderHandler, flowsEncrypt);

export default router; 