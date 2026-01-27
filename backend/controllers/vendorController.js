import Vendor from '../models/Vendor.js';
import Purchase from '../models/Purchase.js';

// @desc    Get all vendors with stats
// @route   GET /api/vendors
// @access  Private
const getVendors = async (req, res) => {
    const vendors = await Vendor.find({});
    res.json(vendors);
};

// @desc    Get single vendor details
// @route   GET /api/vendors/:id
// @access  Private
const getVendorById = async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);
    if (vendor) {
        res.json(vendor);
    } else {
        res.status(404).json({ message: 'Vendor not found' });
    }
};

// @desc    Create a new vendor
// @route   POST /api/vendors
// @access  Private (Admin/Super Admin)
const createVendor = async (req, res) => {
    const { name, code, category, contact, address, materials } = req.body;

    const vendorExists = await Vendor.findOne({ code });
    if (vendorExists) {
        return res.status(400).json({ message: 'Vendor code already exists' });
    }

    const vendor = await Vendor.create({
        name,
        code,
        category,
        contact,
        address,
        materials
    });

    if (vendor) {
        res.status(201).json(vendor);
    } else {
        res.status(400).json({ message: 'Invalid vendor data' });
    }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Private (Admin/Super Admin)
const updateVendor = async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);

    if (vendor) {
        vendor.name = req.body.name || vendor.name;
        vendor.contact = req.body.contact || vendor.contact;
        vendor.address = req.body.address || vendor.address;
        vendor.status = req.body.status || vendor.status;
        vendor.materials = req.body.materials || vendor.materials;
        // Code usually not editable to maintain integrity, but can be if needed

        const updatedVendor = await vendor.save();
        res.json(updatedVendor);
    } else {
        res.status(404).json({ message: 'Vendor not found' });
    }
};

// @desc    Add material to vendor
// @route   POST /api/vendors/:id/materials
// @access  Private
const addVendorMaterial = async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);
    if (vendor) {
        vendor.materials.push(req.body);
        await vendor.save();
        res.status(201).json(vendor);
    } else {
        res.status(404).json({ message: 'Vendor not found' });
    }
}

export { getVendors, getVendorById, createVendor, updateVendor, addVendorMaterial };
