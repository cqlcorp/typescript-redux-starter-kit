const paths = require('./paths');

module.exports = {
    API_CLIENT_PREFIX: process.env.API_CLIENT_PREFIX || '/api',
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:1337',
    API_TIMEOUT: parseInt(process.env.API_TIMEOUT) || 5000,
    PORT: parseInt(process.env.PORT, 10) || 3000,
    HOST: process.env.HOST || '0.0.0.0',
    PROTOCOL: process.env.HTTPS === 'true' ? 'https' : 'http'
}
