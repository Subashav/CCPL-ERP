import express from 'express';
import {
    getVendors,
    getVendorById,
    createVendor,
    updateVendor,
    addVendorMaterial
} from '../controllers/vendorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getVendors)
    .post(protect, authorize('SUPER_ADMIN', 'ADMIN'), createVendor);

router.route('/:id')
    .get(protect, getVendorById)
    .put(protect, authorize('SUPER_ADMIN', 'ADMIN'), updateVendor);

router.route('/:id/materials').post(protect, authorize('SUPER_ADMIN', 'ADMIN'), addVendorMaterial);

export default router;
