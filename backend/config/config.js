require('dotenv').config();

module.exports = {
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb+srv://parthsarthi:LdCmbs041lL7MJdC@grocercluster0.u3n4poi.mongodb.net/?retryWrites=true&w=majority&appName=GrocerCluster0'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '24h'
    },
    server: {
        port: process.env.PORT || 5000
    }
}; 