const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        required: true,
        enum: ['admin', 'staff']
    }
})

module.exports = mongoose.model('User', UserSchema);