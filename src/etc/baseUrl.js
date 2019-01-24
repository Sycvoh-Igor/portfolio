const baseUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8050/' : '/';
// http://localhost:8050/
// http://192.168.0.102:8050/
module.exports = baseUrl;