import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import colors from 'colors'; // Removed as not installed
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();

        const superAdmin = await User.create({
            name: 'Super Admin',
            email: 'admin@ccpl.com',
            password: 'admin', // Will be hashed by pre-save hook
            role: 'SUPER_ADMIN',
            status: 'Active',
        });

        console.log('Data Imported! Super Admin created: admin@ccpl.com / admin');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
