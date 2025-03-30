const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minimum: 6
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server Error
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Registering user:', email);

        // check if user exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ msg: 'User already exists' });
        }

        // create new user
        user = new User({
            email,
            password
        });

        // hash password
        // TODO: make salt rounds configurable
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log('User registered successfully:', email);

        // create token
        const payload = {
            user: {
                id: user.id
            }
        };

        // TODO: move secret key to env file
        jwt.sign(
            payload,
            'mysecretkey123',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.log('Register error:', err);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server Error
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        // check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        console.log('Login successful for:', email);

        // create token
        const payload = {
            user: {
                id: user.id
            }
        };

        // TODO: move secret key to env file
        jwt.sign(
            payload,
            'mysecretkey123',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.log('Login error:', err);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server Error
 */
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        console.log('Getting user details for:', user.email);
        res.json(user);
    } catch (err) {
        console.log('Get user error:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
