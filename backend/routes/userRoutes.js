import express from 'express';
import {
    authUser,
    createAdmin,
    createSiteEngineer,
    getMySiteEngineers,
    getAdmins,
    updateUserStatus,
    getUserProfile,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

// Admin Management (Super Admin only)
router.post('/admin', protect, authorize('SUPER_ADMIN'), createAdmin);
router.get('/admins', protect, authorize('SUPER_ADMIN'), getAdmins);

// Site Engineer Management (Admin only)
router.post('/site-engineer', protect, authorize('ADMIN'), createSiteEngineer);
router.get('/site-engineers', protect, authorize('ADMIN'), getMySiteEngineers);

// Status Update (RBAC handled in controller)
router.put('/:id/status', protect, updateUserStatus);

export default router;
