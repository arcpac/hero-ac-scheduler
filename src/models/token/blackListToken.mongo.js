const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    reason: { type: String },
}, {
    timestamps: true
});

const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
