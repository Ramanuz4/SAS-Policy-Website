const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config();

// Admin User Schema
const AdminUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Utility function to ask questions
const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
};

// Hide password input
const askPassword = (question) => {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        const stdout = process.stdout;
        
        stdout.write(question);
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        
        let password = '';
        
        stdin.on('data', function(char) {
            char = char + '';
            
            switch(char) {
                case '\n':
                case '\r':
                case '\u0004':
                    stdin.setRawMode(false);
                    stdin.pause();
                    stdout.write('\n');
                    resolve(password);
                    break;
                case '\u0003':
                    process.exit();
                    break;
                default:
                    password += char;
                    stdout.write('*');
                    break;
            }
        });
    });
};

// Validate email format
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Main function to create admin user
async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sas_insurance', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');
        console.log('='.repeat(50));
        console.log('CREATE ADMIN USER');
        console.log('='.repeat(50));

        // Get user input
        const username = await askQuestion('Enter username: ');
        if (!username) {
            throw new Error('Username is required');
        }

        // Check if username already exists
        const existingUser = await AdminUser.findOne({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const email = await askQuestion('Enter email: ');
        if (!email || !validateEmail(email)) {
            throw new Error('Valid email is required');
        }

        // Check if email already exists
        const existingEmail = await AdminUser.findOne({ email });
        if (existingEmail) {
            throw new Error('Email already exists');
        }

        const password = await askPassword('Enter password: ');
        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        const confirmPassword = await askPassword('Confirm password: ');
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const roleInput = await askQuestion('Enter role (admin/agent) [default: admin]: ');
        const role = roleInput.toLowerCase() === 'agent' ? 'agent' : 'admin';

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create admin user
        const adminUser = new AdminUser({
            username,
            email,
            password: hashedPassword,
            role
        });

        await adminUser.save();

        console.log('\n' + '='.repeat(50));
        console.log('SUCCESS! Admin user created successfully');
        console.log('='.repeat(50));
        console.log(`Username: ${username}`);
        console.log(`Email: ${email}`);
        console.log(`Role: ${role}`);
        console.log(`Created: ${adminUser.createdAt.toLocaleString()}`);
        console.log('='.repeat(50));

    } catch (error) {
        console.error('\nError creating admin user:', error.message);
        process.exit(1);
    } finally {
        rl.close();
        await mongoose.connection.close();
        process.exit(0);
    }
}

// List all admin users function
async function listAdminUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sas_insurance', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const users = await AdminUser.find({}).select('-password');
        
        console.log('\n' + '='.repeat(60));
        console.log('EXISTING ADMIN USERS');
        console.log('='.repeat(60));
        
        if (users.length === 0) {
            console.log('No admin users found');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. Username: ${user.username}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Active: ${user.isActive}`);
                console.log(`   Created: ${user.createdAt.toLocaleString()}`);
                console.log('-'.repeat(40));
            });
        }
        
        console.log('='.repeat(60));

    } catch (error) {
        console.error('Error listing admin users:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

// Delete admin user function
async function deleteAdminUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sas_insurance', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const username = await askQuestion('Enter username to delete: ');
        
        const user = await AdminUser.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }

        const confirmation = await askQuestion(`Are you sure you want to delete user "${username}"? (yes/no): `);
        if (confirmation.toLowerCase() !== 'yes') {
            console.log('Deletion cancelled');
            return;
        }

        await AdminUser.deleteOne({ username });
        console.log(`User "${username}" deleted successfully`);

    } catch (error) {
        console.error('Error deleting admin user:', error.message);
    } finally {
        rl.close();
        await mongoose.connection.close();
    }
}

// Main menu
async function main() {
    console.log('\nSAS Policy Value Hub - Admin User Management');
    console.log('='.repeat(50));
    console.log('1. Create new admin user');
    console.log('2. List all admin users');
    console.log('3. Delete admin user');
    console.log('4. Exit');
    console.log('='.repeat(50));

    const choice = await askQuestion('Select an option (1-4): ');

    switch (choice) {
        case '1':
            await createAdminUser();
            break;
        case '2':
            await listAdminUsers();
            rl.close();
            process.exit(0);
            break;
        case '3':
            await deleteAdminUser();
            process.exit(0);
            break;
        case '4':
            console.log('Goodbye!');
            rl.close();
            process.exit(0);
            break;
        default:
            console.log('Invalid option');
            rl.close();
            process.exit(1);
    }
}

// Check if running directly
if (require.main === module) {
    main().catch(error => {
        console.error('Script error:', error);
        process.exit(1);
    });
}

module.exports = { createAdminUser, listAdminUsers, deleteAdminUser };