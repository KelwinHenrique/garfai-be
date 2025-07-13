/**
 * Menu routes
 */
import { Router } from 'express';
import { importMenu } from './import-menu';
import { getMenuByEnvironmentIdHandler } from './get-menu-by-environment-id';
import { getMenuHandler } from './get-menus';

const router = Router();

/**
 * @route POST /menu/import
 * @desc Import a menu from a third-party service
 * @access Private
 */
router.post('/import', importMenu);

/**
 * @route GET /menu
 * @desc Get all menus for an environment
 * @access Private
 */
router.get('/', getMenuHandler);

/**
 * @route GET /menu/:id
 * @desc Get a menu by ID
 * @access Private
 */
router.get('/:id', getMenuByEnvironmentIdHandler);

export default router;
