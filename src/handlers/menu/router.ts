/**
 * Menu routes
 */
import { Router } from 'express';
import { importMenu } from './import-menu';
import { getMenuByIdHandler } from './get-menu-by-id';

const router = Router();

/**
 * @route POST /menu/import
 * @desc Import a menu from a third-party service
 * @access Private
 */
router.post('/import', importMenu);

/**
 * @route GET /menu/:id
 * @desc Get a menu by ID
 * @access Private
 */
router.get('/:id', getMenuByIdHandler);

export default router;
