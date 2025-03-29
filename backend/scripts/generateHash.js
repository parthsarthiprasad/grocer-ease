const bcrypt = require('bcrypt');

async function generateHash() {
    try {
        const password = 'admin';
        const saltRounds = 10;
        
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('\nGenerated hash for password "admin":');
        console.log('----------------------------------------');
        console.log(hash);
        console.log('----------------------------------------\n');
        
        // Verify the hash works
        const isValid = await bcrypt.compare(password, hash);
        console.log('Verification test:', isValid ? 'SUCCESS' : 'FAILED');
        
        process.exit(0);
    } catch (error) {
        console.error('Error generating hash:', error);
        process.exit(1);
    }
}

generateHash(); 