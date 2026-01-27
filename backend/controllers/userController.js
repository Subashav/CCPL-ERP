import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/emailService.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        if (user.status === 'Inactive') {
            return res.status(401).json({ message: 'Account is inactive. Contact administrator.' });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            engineerProfile: user.engineerProfile
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new Admin
// @route   POST /api/users/admin
// @access  Private (Super Admin only)
const createAdmin = async (req, res) => {
    const { name, email, password } = req.body; // Password provided in form? Yes "Password" in requirements

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'ADMIN',
        createdBy: req.user._id,
        status: 'Active'
    });

    if (user) {
        // Send Email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Welcome to CCPL ERP - Admin Account Created',
                text: `Hello ${user.name},\n\nYour Admin account has been created.\n\nLogin Credentials:\nEmail: ${user.email}\nPassword: ${password}\n\nPlease login and change your password immediately.`,
                html: `<p>Hello ${user.name},</p><p>Your Admin account has been created.</p><p><strong>Email:</strong> ${user.email}<br><strong>Password:</strong> ${password}</p>`
            });
        } catch (error) {
            console.error("Email send failed", error);
            // Don't fail the request, just log
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Register a new Site Engineer
// @route   POST /api/users/site-engineer
// @access  Private (Admin only)
const createSiteEngineer = async (req, res) => {
    // Expecting all details in body
    const {
        name, email, password, // Basic & Login
        empId, photo, gender, dob, mobile, address, // Basic
        designation, department, siteLocation, joiningDate, shiftTiming, workType, // Job
        permissions, attendanceConfig, documents, bankDetails // Configs
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const engineerProfile = {
        empId, photo, gender, dob, mobile, address,
        designation, department, siteLocation, joiningDate, shiftTiming, workType,
        reportingManager: req.user._id, // Assign to current Admin
        permissions, attendanceConfig, documents, bankDetails
    };

    const user = await User.create({
        name,
        email,
        password,
        role: 'SITE_ENGINEER',
        createdBy: req.user._id,
        status: 'Active',
        engineerProfile
    });

    if (user) {
        // Send Email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Welcome to CCPL ERP - Site Engineer Account',
                text: `Hello ${user.name},\n\nYour Site Engineer account has been created by ${req.user.name}.\n\nLogin Credentials:\nEmail: ${user.email}\nPassword: ${password}`,
                html: `<p>Hello ${user.name},</p><p>Your Site Engineer account has been created by ${req.user.name}.</p><p><strong>Email:</strong> ${user.email}<br><strong>Password:</strong> ${password}</p>`
            });
        } catch (error) {
            console.error("Email send failed", error);
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            engineerProfile: user.engineerProfile
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get all Site Engineers for the logged in Admin
// @route   GET /api/users/site-engineers
// @access  Private (Admin)
const getMySiteEngineers = async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Not authorized' });
    }
    const engineers = await User.find({
        role: 'SITE_ENGINEER',
        'engineerProfile.reportingManager': req.user._id
    });
    res.json(engineers);
};

// @desc    Get all Admins
// @route   GET /api/users/admins
// @access  Private (Super Admin)
const getAdmins = async (req, res) => {
    const admins = await User.find({ role: 'ADMIN' });
    res.json(admins);
};

// @desc    Update user status (Activate/Deactivate)
// @route   PUT /api/users/:id/status
// @access  Private (Super Admin for Admin, Admin for Site Engineer)
const updateUserStatus = async (req, res) => {
    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Logic: Super Admin can update Admin. Admin can update their own Site Engineer.
    if (req.user.role === 'SUPER_ADMIN' && userToUpdate.role === 'ADMIN') {
        userToUpdate.status = req.body.status;
        await userToUpdate.save();
        return res.json({ message: `Admin status updated to ${req.body.status}` });
    }

    if (req.user.role === 'ADMIN' && userToUpdate.role === 'SITE_ENGINEER') {
        // Check ownership
        if (userToUpdate.engineerProfile.reportingManager.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only manage your own Site Engineers' });
        }
        userToUpdate.status = req.body.status;
        await userToUpdate.save();
        return res.json({ message: `Site Engineer status updated to ${req.body.status}` });
    }

    res.status(403).json({ message: 'Not authorized to update this user' });
};

// @desc    Get user profile (Self)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            engineerProfile: user.engineerProfile
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export {
    authUser,
    createAdmin,
    createSiteEngineer,
    getMySiteEngineers,
    getAdmins,
    updateUserStatus,
    getUserProfile,
};
