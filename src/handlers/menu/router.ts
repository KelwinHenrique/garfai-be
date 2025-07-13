/**
 * Menu routes
 */
import { Router } from 'express';
import { importMenu } from './import-menu';
import { getMenuByIdHandler } from './get-menu-by-id';
import { getMenuHandler } from './get-menus';
import { getMenuByEnvironmentIdHandler } from './get-menu-by-environment-id';
import { getItemByIdHandler } from './get-item-by-id';
import { listItemsByTagsHandler } from './list-items-by-tags';

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
router.get('/:id', getMenuByIdHandler);

/**
 * @route GET /menu/environment/:environmentId
 * @desc Get a menu by environment ID
 * @access Private
 */
router.get('/environment/:environmentId', getMenuByEnvironmentIdHandler);

/**
 * @route GET /menu/item/:id
 * @desc Get an item by ID
 * @access Private
 */
router.get('/item/:id', getItemByIdHandler);

/**
 * @route GET /menu/items/by-tags
 * @desc List items filtered by tags
 * @access Private
 */
router.get('/items/by-tags', listItemsByTagsHandler);

export default router;
