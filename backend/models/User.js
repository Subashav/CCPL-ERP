import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    // Common Fields
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'ADMIN', 'SITE_ENGINEER'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    // Site Engineer Specific Fields
    engineerProfile: {
        empId: String,
        photo: String, // URL
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
        },
        dob: Date,
        mobile: String,
        address: {
            current: String,
            permanent: String,
        },

        // Job Details
        designation: String,
        department: String,
        siteLocation: String,
        joiningDate: Date,
        shiftTiming: String,
        workType: {
            type: String,
            enum: ['Full-time', 'Contract'],
        },
        reportingManager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        // Permissions
        permissions: {
            attendanceSubmit: { type: Boolean, default: false },
            dailyProgressUpdate: { type: Boolean, default: false },
            materialRequest: { type: Boolean, default: false },
            issueReporting: { type: Boolean, default: false },
        },

        // Attendance Config
        attendanceConfig: {
            type: {
                type: String,
                enum: ['Manual', 'GPS', 'Biometric'],
                default: 'Manual',
            },
            allowedSites: [String],
            workingDays: [String], // e.g. ['Mon', 'Tue']
            overtimeApplicable: { type: Boolean, default: false },
        },

        // Documents (URLs)
        documents: {
            idProof: String,
            qualificationCertificate: String,
            experienceCertificate: String,
            joiningLetter: String,
        },

        // Bank Details
        bankDetails: {
            bankName: String,
            accountNumber: String,
            ifscCode: String,
            upiId: String,
        },
    },
}, {
    timestamps: true,
});

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
