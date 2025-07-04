import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://images.pexels.com"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"]
        }
    }
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '../')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dental-clinic', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Database Models
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const AppointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
    createdAt: { type: Date, default: Date.now }
});

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    service: { type: String },
    anonymous: { type: Boolean, default: false },
    approved: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const SettingsSchema = new mongoose.Schema({
    dailyLimit: { type: Number, default: 10 },
    blockedDates: [{ type: String }],
    workingHours: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '17:00' }
    },
    timeSlots: [{
        time: String,
        display: String
    }],
    updatedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', UserSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Review = mongoose.model('Review', ReviewSchema);
const Settings = mongoose.model('Settings', SettingsSchema);

// Email transporter setup
const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Initialize default settings and admin users
async function initializeDatabase() {
    try {
        // Create default settings
        const existingSettings = await Settings.findOne({});
        if (!existingSettings) {
            const defaultSettings = new Settings({
                dailyLimit: 10,
                blockedDates: [],
                timeSlots: [
                    { time: '09:00', display: '9:00 AM' },
                    { time: '10:00', display: '10:00 AM' },
                    { time: '11:00', display: '11:00 AM' },
                    { time: '12:00', display: '12:00 PM' },
                    { time: '14:00', display: '2:00 PM' },
                    { time: '15:00', display: '3:00 PM' },
                    { time: '16:00', display: '4:00 PM' },
                    { time: '17:00', display: '5:00 PM' }
                ]
            });
            await defaultSettings.save();
        }

        // Create admin accounts
        const adminAccounts = [
            {
                email: 'ahmedabdelmogeth2016@gmail.com',
                password: 'Ihaveacar_200722@',
                name: 'Ahmed Abdelmogeth'
            },
            {
                email: 'ann200225@gmail.com',
                password: 'Ihaveacar_200225@',
                name: 'Dr. Ann Ashraf'
            }
        ];

        for (const adminData of adminAccounts) {
            const existingAdmin = await Admin.findOne({ email: adminData.email });
            if (!existingAdmin) {
                const hashedPassword = await bcrypt.hash(adminData.password, 12);
                const admin = new Admin({
                    email: adminData.email,
                    password: hashedPassword,
                    name: adminData.name
                });
                await admin.save();
                console.log(`Admin account created: ${adminData.email}`);
            }
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Initialize database on startup
initializeDatabase();

// Middleware to verify JWT token
const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Admin not found' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Validation middleware
const validateEgyptianPhone = (phone) => {
    const phoneRegex = /^\+20[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// API Routes

// Send verification code
app.post('/api/send-verification', [
    body('phone').custom(value => {
        if (!validateEgyptianPhone(value)) {
            throw new Error('Invalid Egyptian phone number');
        }
        return true;
    }),
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { phone, email } = req.body;
        
        // Check if phone is already registered
        const existingUser = await User.findOne({ phone });
        if (existingUser && existingUser.verified) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number already registered' 
            });
        }

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save or update user with verification code
        await User.findOneAndUpdate(
            { phone },
            { 
                phone, 
                email, 
                verificationCode,
                verified: false
            },
            { upsert: true }
        );

        // In production, send SMS via Twilio
        // For development, return the code
        res.json({ 
            success: true, 
            message: 'Verification code sent',
            code: verificationCode // Remove this in production
        });

    } catch (error) {
        console.error('Error sending verification:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Verify phone number
app.post('/api/verify-phone', [
    body('phone').custom(value => {
        if (!validateEgyptianPhone(value)) {
            throw new Error('Invalid Egyptian phone number');
        }
        return true;
    }),
    body('code').isLength({ min: 6, max: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { phone, code } = req.body;
        
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        // Mark user as verified
        user.verified = true;
        user.verificationCode = undefined;
        await user.save();

        res.json({ success: true, message: 'Phone verified successfully' });

    } catch (error) {
        console.error('Error verifying phone:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get available time slots
app.get('/api/available-slots', async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({ success: false, message: 'Date is required' });
        }

        const settings = await Settings.findOne({});
        const dailyLimit = settings?.dailyLimit || 10;
        const blockedDates = settings?.blockedDates || [];
        const timeSlots = settings?.timeSlots || [];

        // Check if date is blocked
        if (blockedDates.includes(date)) {
            return res.json({ success: true, availableSlots: [] });
        }

        // Get existing appointments for the date
        const existingAppointments = await Appointment.find({ 
            date, 
            status: { $ne: 'cancelled' } 
        });

        // Check if daily limit is reached
        if (existingAppointments.length >= dailyLimit) {
            return res.json({ success: true, availableSlots: [] });
        }

        // Get booked time slots
        const bookedTimes = existingAppointments.map(apt => apt.time);
        
        // Filter available slots
        const availableSlots = timeSlots.filter(slot => 
            !bookedTimes.includes(slot.time)
        );

        res.json({ success: true, availableSlots });

    } catch (error) {
        console.error('Error getting available slots:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Book appointment
app.post('/api/book-appointment', [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('phone').custom(value => {
        if (!validateEgyptianPhone(value)) {
            throw new Error('Invalid Egyptian phone number');
        }
        return true;
    }),
    body('service').notEmpty(),
    body('date').isISO8601().toDate(),
    body('time').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, phone, service, date, time, notes } = req.body;
        
        // Check if user is verified
        const user = await User.findOne({ phone, verified: true });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please verify your phone number first' 
            });
        }

        // Check if slot is still available
        const dateStr = new Date(date).toISOString().split('T')[0];
        const existingAppointment = await Appointment.findOne({ 
            date: dateStr, 
            time, 
            status: { $ne: 'cancelled' } 
        });

        if (existingAppointment) {
            return res.status(400).json({ 
                success: false, 
                message: 'This time slot is no longer available' 
            });
        }

        // Create appointment
        const appointment = new Appointment({
            userId: user._id,
            name,
            email,
            phone,
            service,
            date: dateStr,
            time,
            notes,
            status: 'confirmed'
        });

        await appointment.save();

        // Send confirmation email
        await sendConfirmationEmail(appointment);

        res.json({ success: true, message: 'Appointment booked successfully' });

    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const { page = 1, limit = 6 } = req.query;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ approved: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalReviews = await Review.countDocuments({ approved: true });
        const totalPages = Math.ceil(totalReviews / limit);

        // Calculate stats
        const allReviews = await Review.find({ approved: true });
        const averageRating = allReviews.length > 0 
            ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
            : 5;

        res.json({
            success: true,
            reviews,
            totalPages,
            currentPage: parseInt(page),
            stats: {
                totalReviews,
                averageRating
            }
        });

    } catch (error) {
        console.error('Error getting reviews:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Submit review
app.post('/api/reviews', [
    body('email').isEmail().normalizeEmail(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('text').isLength({ min: 10 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, rating, text, anonymous } = req.body;
        
        // Check if user has completed appointment
        const user = await User.findOne({ email });
        const hasCompletedAppointment = user ? 
            await Appointment.findOne({ 
                userId: user._id, 
                status: 'confirmed',
                date: { $lt: new Date().toISOString().split('T')[0] }
            }) : null;

        if (!hasCompletedAppointment) {
            return res.status(400).json({ 
                success: false, 
                message: 'You can only review after completing an appointment' 
            });
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({ email });
        if (existingReview) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have already submitted a review' 
            });
        }

        // Create review
        const review = new Review({
            userId: user._id,
            name: anonymous ? undefined : name,
            email,
            rating,
            text,
            anonymous,
            approved: true
        });

        await review.save();

        res.json({ success: true, message: 'Review submitted successfully' });

    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin login
app.post('/api/admin/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;
        
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        res.json({ 
            success: true, 
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name
            }
        });

    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Verify admin token
app.post('/api/admin/verify', authenticateAdmin, async (req, res) => {
    res.json({ 
        success: true, 
        admin: {
            id: req.admin._id,
            email: req.admin.email,
            name: req.admin.name
        }
    });
});

// Get admin appointments
app.get('/api/admin/appointments', authenticateAdmin, async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .sort({ date: -1, time: -1 })
            .populate('userId', 'name email phone');

        res.json({ success: true, appointments });

    } catch (error) {
        console.error('Error getting admin appointments:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get admin reviews
app.get('/api/admin/reviews', authenticateAdmin, async (req, res) => {
    try {
        const reviews = await Review.find({})
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        res.json({ success: true, reviews });

    } catch (error) {
        console.error('Error getting admin reviews:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get admin settings
app.get('/api/admin/settings', authenticateAdmin, async (req, res) => {
    try {
        const settings = await Settings.findOne({});
        res.json({ success: true, settings });

    } catch (error) {
        console.error('Error getting admin settings:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update admin settings
app.put('/api/admin/settings', authenticateAdmin, [
    body('dailyLimit').isInt({ min: 1, max: 20 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { dailyLimit } = req.body;
        
        await Settings.findOneAndUpdate(
            {},
            { dailyLimit, updatedAt: new Date() },
            { upsert: true }
        );

        res.json({ success: true, message: 'Settings updated successfully' });

    } catch (error) {
        console.error('Error updating admin settings:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Block date
app.post('/api/admin/block-date', authenticateAdmin, [
    body('date').isISO8601()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { date } = req.body;
        const dateStr = new Date(date).toISOString().split('T')[0];
        
        await Settings.findOneAndUpdate(
            {},
            { 
                $addToSet: { blockedDates: dateStr },
                updatedAt: new Date() 
            },
            { upsert: true }
        );

        res.json({ success: true, message: 'Date blocked successfully' });

    } catch (error) {
        console.error('Error blocking date:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Unblock date
app.post('/api/admin/unblock-date', authenticateAdmin, [
    body('date').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { date } = req.body;
        
        await Settings.findOneAndUpdate(
            {},
            { 
                $pull: { blockedDates: date },
                updatedAt: new Date() 
            }
        );

        res.json({ success: true, message: 'Date unblocked successfully' });

    } catch (error) {
        console.error('Error unblocking date:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Cancel appointment
app.put('/api/admin/appointments/:id/cancel', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Send cancellation email
        await sendCancellationEmail(appointment);

        res.json({ success: true, message: 'Appointment cancelled successfully' });

    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Email functions
async function sendConfirmationEmail(appointment) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: appointment.email,
            subject: 'Appointment Confirmation - Dr. Ann Ashraf Dental Clinic',
            html: `
                <h2>Appointment Confirmed</h2>
                <p>Dear ${appointment.name},</p>
                <p>Your appointment has been confirmed with the following details:</p>
                <ul>
                    <li><strong>Date:</strong> ${formatDate(appointment.date)}</li>
                    <li><strong>Time:</strong> ${formatTime(appointment.time)}</li>
                    <li><strong>Service:</strong> ${appointment.service}</li>
                    <li><strong>Doctor:</strong> Dr. Ann Ashraf Abdelmoghith</li>
                </ul>
                <p>Please arrive 10 minutes early for your appointment.</p>
                <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
                <p>Best regards,<br>Dr. Ann Ashraf Dental Clinic</p>
            `
        };

        await transporter.sendMail(mailOptions);

        // Also send to admin
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || 'admin@example.com',
            subject: 'New Appointment Booking',
            html: `
                <h2>New Appointment Booked</h2>
                <ul>
                    <li><strong>Patient:</strong> ${appointment.name}</li>
                    <li><strong>Email:</strong> ${appointment.email}</li>
                    <li><strong>Phone:</strong> ${appointment.phone}</li>
                    <li><strong>Service:</strong> ${appointment.service}</li>
                    <li><strong>Date:</strong> ${formatDate(appointment.date)}</li>
                    <li><strong>Time:</strong> ${formatTime(appointment.time)}</li>
                    ${appointment.notes ? `<li><strong>Notes:</strong> ${appointment.notes}</li>` : ''}
                </ul>
            `
        };

        await transporter.sendMail(adminMailOptions);

    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
}

async function sendCancellationEmail(appointment) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: appointment.email,
            subject: 'Appointment Cancelled - Dr. Ann Ashraf Dental Clinic',
            html: `
                <h2>Appointment Cancelled</h2>
                <p>Dear ${appointment.name},</p>
                <p>Your appointment scheduled for ${formatDate(appointment.date)} at ${formatTime(appointment.time)} has been cancelled.</p>
                <p>If you would like to reschedule, please contact us or book a new appointment online.</p>
                <p>Best regards,<br>Dr. Ann Ashraf Dental Clinic</p>
            `
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error sending cancellation email:', error);
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/book', (req, res) => {
    res.sendFile(path.join(__dirname, '../book.html'));
});

app.get('/reviews', (req, res) => {
    res.sendFile(path.join(__dirname, '../reviews.html'));
});

app.get('/prices', (req, res) => {
    res.sendFile(path.join(__dirname, '../prices.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});