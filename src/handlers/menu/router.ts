/**
 * Menu routes
 */
import { Router } from 'express';
import { importMenu } from './import-menu';

const router = Router();

/**
 * @route POST /menu/import
 * @desc Import a menu from a third-party service
 * @access Private
 */
router.post('/import', importMenu);

export default router;
