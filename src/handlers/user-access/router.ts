/**
 * Menu routes
 */
import { Router } from 'express';
import { getMyUserAccessHandler } from './get-my-user-access';
import { isAuthenticated } from '../../auth/auth-middleware';

const router = Router();

/**
 * @route POST /menu/import
 * @desc Import a menu from a third-party service
 * @access Private
 */
router.get('/my-user-access', isAuthenticated, getMyUserAccessHandler);

export default router;
