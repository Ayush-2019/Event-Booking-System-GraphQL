const authResolver = require('./auth');
const bookingResolver = require('./bookings');
const eventResolver = require('./event');

const root = {
    ...authResolver,
    ...eventResolver,
    ...bookingResolver
};

module.exports = root;