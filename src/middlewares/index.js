module.exports = {
    auth: require('./auth.middleware'),
    guest: require('./guest.middleware'),
    verified: require('./verified.middleware')
}