const bcrypt = require('bcrypt');

const hash = '$2b$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iq.IXzJXqKqG';
const password = 'user1';

async function verifyHash() {
    try {
        const isValid = await bcrypt.compare(password, hash);
        console.log('Password verification result:', isValid);
        
        // Also generate a new hash for comparison
        const newHash = await bcrypt.hash(password, 10);
        console.log('New hash for same password:', newHash);
        console.log('Are hashes equal?', hash === newHash);
    } catch (error) {
        console.error('Error:', error);
    }
}

verifyHash(); 