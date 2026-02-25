const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, LocalResident, ServiceProvider, Admin, Notification, Category } = require('../models');
const aiSpamCheck = require('../utils/aiSpamCheck');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
    const { role, ...data } = req.body;

    try {
        let user;
        const hashedPassword = await bcrypt.hash(data.password, 10);

        if (role === 'User') {
            user = await User.create({ ...data, password: hashedPassword });
        } else if (role === 'LocalResident') {
            user = await LocalResident.create({ ...data, password: hashedPassword });
        } else if (role === 'ServiceProvider') {
            // AI Spam Check for documents/details
            const spamCheckContent = `${data.sname} ${data.address} ${data.phone} ${data.documents || ''}`;
            const spamResult = await aiSpamCheck(spamCheckContent);

            if (spamResult.isSpam) {
                return res.status(400).json({
                    message: 'Registration rejected by AI safety layer.',
                    reason: spamResult.reason
                });
            }

            user = await ServiceProvider.create({
                ...data,
                password: hashedPassword,
                is_verified: true, // Assume verified if AI check passes for this demo
                cat_id: data.cat_id
            });
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const token = generateToken(user.uid || user.lrid || user.spid, role);

        // Welcome Notification
        await Notification.create({
            uid: user.uid || user.lrid || user.spid,
            user_role: role,
            message: `Welcome to TrustBridge! We're glad to have you as a ${role}.`,
            type: 'system',
            related_role: 'System'
        });

        // Admin Alert for Provider/Resident registration
        if (role === 'ServiceProvider' || role === 'LocalResident') {
            const admins = await Admin.findAll();
            for (const admin of admins) {
                await Notification.create({
                    uid: admin.admin_id,
                    user_role: 'Admin',
                    message: `New ${role} registration: ${data.sname || data.ufname || data.fname} requires verification.`,
                    type: 'system',
                    related_role: role
                });
            }
        }

        res.status(201).json({ token, user, role });
    } catch (error) {
        console.error('Registration Error:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email address already registered' });
        }
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: error.errors[0].message });
        }

        res.status(500).json({
            message: 'Server error during registration',
            error: error.message,
            details: error.original ? error.original.sqlMessage : null
        });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email, role } = req.body;
    try {
        let user;
        if (role === 'User') user = await User.findOne({ where: { email } });
        else if (role === 'LocalResident') user = await LocalResident.findOne({ where: { email } });
        else if (role === 'ServiceProvider') user = await ServiceProvider.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Mock Password Reset Token
        const resetToken = jwt.sign({ id: user.uid || user.lrid || user.spid, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // In a real app, send email here. For now, return it (security risk, but okay for demo/dev).
        res.json({ message: 'Password reset link sent to email (MOCK)', resetToken });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (decoded.role === 'User') await User.update({ password: hashedPassword }, { where: { uid: decoded.id } });
        else if (decoded.role === 'LocalResident') await LocalResident.update({ password: hashedPassword }, { where: { lrid: decoded.id } });
        else if (decoded.role === 'ServiceProvider') await ServiceProvider.update({ password: hashedPassword }, { where: { spid: decoded.id } });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

exports.login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        let user;
        let id;

        if (role === 'User') {
            user = await User.findOne({ where: { email } });
            id = user?.uid;
        } else if (role === 'LocalResident') {
            user = await LocalResident.findOne({ where: { email } });
            id = user?.lrid;
        } else if (role === 'ServiceProvider') {
            user = await ServiceProvider.findOne({
                where: { email },
                include: [{ model: Category, attributes: ['cat_name'] }]
            });
            id = user?.spid;
        } else if (role === 'Admin') {
            user = await Admin.findOne({ where: { username: email } }); // Admin uses username
            id = user?.admin_id;
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(id, role);
        res.json({ token, user, role });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        let user;
        if (req.user.role === 'User') {
            user = await User.findByPk(req.user.id);
        } else if (req.user.role === 'LocalResident') {
            user = await LocalResident.findByPk(req.user.id);
        } else if (req.user.role === 'ServiceProvider') {
            user = await ServiceProvider.findByPk(req.user.id, {
                include: [{ model: Category, attributes: ['cat_name'] }]
            });
        } else if (req.user.role === 'Admin') {
            user = await Admin.findByPk(req.user.id);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user, role: req.user.role });
    } catch (error) {
        console.error('getMe Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
