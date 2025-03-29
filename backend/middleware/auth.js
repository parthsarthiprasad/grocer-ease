const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if token is expired
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return res.status(401).json({ error: 'Token has expired' });
        }

        // Check if session ID matches cookie
        const sessionId = req.cookies.sessionId;
        if (!sessionId || sessionId !== decoded.sessionId) {
            return res.status(401).json({ error: 'Invalid session' });
        }

        // Add user info to request
        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid authentication token' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ error: 'Authentication required' });
    }
};

const userAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'user') {
                return res.status(403).json({ error: 'User access required' });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ error: 'Authentication required' });
    }
};

module.exports = {
    auth,
    adminAuth,
    userAuth
}; 