const mongoose = require('mongoose');

// user schema
const UserSchema = new mongoose.Schema({
    email: String,      // user email
    password: String,   // user password
    createdAt: {        // when user was created
        type: Date,
        default: Date.now
    }
});

// TODO: add more user fields later
// TODO: add password validation

module.exports = mongoose.model('User', UserSchema);