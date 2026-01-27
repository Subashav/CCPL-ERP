import Purchase from '../models/Purchase.js';
import Vendor from '../models/Vendor.js';

// @desc    Create new Purchase Order
// @route   POST /api/purchases
// @access  Private (Admin/Super Admin)
const createPurchase = async (req, res) => {
    const { vendorId, project, items, grandTotal } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
    }

    const poNumber = 'PO-' + Date.now(); // Simple generic PO generator

    const purchase = await Purchase.create({
        poNumber,
        vendor: vendorId,
        project,
        items,
        grandTotal,
        createdBy: req.user._id
    });

    if (purchase) {
        // Update Vendor Stats
        vendor.totalPurchaseValue += Number(grandTotal);
        vendor.totalOrders += 1;
        vendor.lastPurchaseDate = Date.now();
        await vendor.save();

        res.status(201).json(purchase);
    } else {
        res.status(400).json({ message: 'Invalid purchase data' });
    }
};

// @desc    Get all purchases (with filters)
// @route   GET /api/purchases
// @access  Private
const getPurchases = async (req, res) => {
    // If Admin, maybe filter by createdBy? Prompt says "Admin: Create purchases, view vendor-wise purchase history". 
    // And "Admin can see only their project/vendor purchases".
    // "Super Admin can see all data".

    let query = {};
    if (req.user.role === 'ADMIN') {
        query.createdBy = req.user._id;
    } else if (req.user.role === 'SITE_ENGINEER') {
        // Site engineers optional/restricted? "Site Engineers cannot view pricing (if enabled)". 
        // For now let's assume they can't see this list or see partial. 
        // Prompt: "Site Engineer (optional): Can raise material requests (no price visibility)".
        // This controller is for Purchase Orders (Price heavy). Maybe restrict SE entirely or hide fields.
        // Let's return Forbidden for SE on this specific endpoint for now, or empty.
        // Or strictly follow: "Site Engineers must access only their own data" (general rule).
        // Since Purchase Creation is Admin only, SEs don't create these. They Request. 
        // Material Requests would be a different module/flow. 
        // So for POs, maybe SEs don't see them at all?
        // Prompt says "Admin... view vendor-wise purchase history". 
        // Let's restrict to Admin/Super Admin.
    }

    // Role check logic usually in middleware, but here for data scoping:
    if (req.user.role === 'SITE_ENGINEER') {
        return res.status(403).json({ message: 'Site Engineers not authorized to view Purchase Orders' });
    }

    const purchases = await Purchase.find(query).populate('vendor', 'name code').sort({ createdAt: -1 });
    res.json(purchases);
};

// @desc    Get purchases by Vendor
// @route   GET /api/purchases/vendor/:vendorId
// @access  Private
const getVendorPurchases = async (req, res) => {
    const purchases = await Purchase.find({ vendor: req.params.vendorId }).sort({ createdAt: -1 });
    res.json(purchases);
};

export { createPurchase, getPurchases, getVendorPurchases };
