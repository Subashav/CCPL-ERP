import express from 'express';
import {
    createPurchase,
    getPurchases,
    getVendorPurchases
} from '../controllers/purchaseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getPurchases)
    .post(protect, authorize('SUPER_ADMIN', 'ADMIN'), createPurchase);

router.get('/vendor/:vendorId', protect, getVendorPurchases);

export default router;
