const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable
const JWT_EXPIRES_IN = '24h';
const SALT_ROUNDS = 10;

// In production, use database
const USERS = {
    admin: {
        username: 'admin',
        password: '$2b$10$oU2NFIQdyHuK2.kWuPTtnOY9qwAvpGO3OWD0DCjDqKlyOFBkpTW5O',
        role: 'admin',
        lastLoginAttempt: null,
        failedAttempts: 0,
        lockedUntil: null
    },
    user1: {
        username: 'user1',
        password: '$2b$10$UimjtKIOawuJMB/xnZLvOuSRP4h7b8MS64PdV7SJe3CDMli680PqW', // New hash for 'user1'
        role: 'user',
        lastLoginAttempt: null,
        failedAttempts: 0,
        lockedUntil: null
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username, password });

        // Get user
        const user = USERS[username];
        if (!user) {
            console.log('Invalid username');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > Date.now()) {
            return res.status(403).json({
                error: 'Account is temporarily locked. Please try again later.',
                lockedUntil: user.lockedUntil
            });
        }

        // Verify password using bcrypt
        console.log('Verifying password...');
        console.log('Stored hash:', user.password);
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Password verification result:', isValidPassword);
        
        if (!isValidPassword) {
            // Handle failed login attempt
            user.failedAttempts++;
            user.lastLoginAttempt = Date.now();

            // Lock account after 5 failed attempts
            if (user.failedAttempts >= 5) {
                user.lockedUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
                return res.status(403).json({
                    error: 'Account locked due to too many failed attempts. Please try again after 15 minutes.',
                    lockedUntil: user.lockedUntil
                });
            }

            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Reset failed attempts on successful login
        user.failedAttempts = 0;
        user.lockedUntil = null;

        // Generate a unique session ID
        const sessionId = crypto.randomBytes(32).toString('hex');

        // Generate JWT token with additional security claims
        const token = jwt.sign(
            {
                username: user.username,
                role: user.role,
                sessionId,
                iat: Math.floor(Date.now() / 1000)
            },
            JWT_SECRET,
            {
                algorithm: 'HS256',
                expiresIn: JWT_EXPIRES_IN
            }
        );

        // Set secure cookie with session ID
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        console.log('Login successful');
        res.json({
            token,
            user: {
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const logout = (req, res) => {
    // Clear the session cookie
    res.clearCookie('sessionId');
    res.json({ message: 'Logged out successfully' });
};

const verifyToken = (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = {
    login,
    logout,
    verifyToken
}; 