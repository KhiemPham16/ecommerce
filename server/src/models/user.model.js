const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        fullName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        phone: {
            type: String,
            required: true,
            unique: true
        },

        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            default: 'other'
        },

        avatarUrl: {
            type: String,
            default: null
        },

        role: {
            type: String,
            enum: ['admin', 'manager', 'employee', 'customer'],
            default: 'customer'
        },

        emailVerifiedAt: {
            type: Date,
            default: null
        },

        deletedAt: {
            type: Date,
            default: null
        },

        lastLogin: {
            type: Date,
            default: Date.now
        },

        verificationToken: String,
        verificationTokenExpiresAt: Date,

        resetPasswordOtp: { type: String, default: null },
        resetPasswordOtpExpiresAt: { type: Date, default: null }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);
