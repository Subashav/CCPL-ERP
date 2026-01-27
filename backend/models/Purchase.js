import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    poNumber: { type: String, required: true, unique: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    project: { type: String, required: true }, // Store Project Name or ID

    // List of items in this PO
    items: [{
        materialName: { type: String, required: true },
        unit: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        gstPercent: { type: Number, required: true },

        // Calculated fields stored for historical accuracy
        baseAmount: { type: Number, required: true },
        gstAmount: { type: Number, required: true },
        totalAmount: { type: Number, required: true }
    }],

    grandTotal: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Draft', 'Approved', 'Received', 'Closed'],
        default: 'Draft'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;
