import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    category: { type: String, required: true }, // e.g. Cement, Steel
    contact: {
        mobile: { type: String, required: true },
        email: { type: String, required: true }
    },
    address: { type: String, required: true },
    rating: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },

    // Materials supplied by this vendor
    materials: [{
        name: { type: String, required: true },
        code: { type: String },
        unit: { type: String, required: true }, // Bag, Kg, Ton
        pricePerUnit: { type: Number, required: true },
        gst: { type: Number, default: 18 },
        available: { type: Boolean, default: true }
    }],

    // Aggregated Stats (Updated on Permit)
    totalPurchaseValue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    lastPurchaseDate: { type: Date }

}, { timestamps: true });

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
