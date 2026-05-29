const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        couponType: {
            type: String,
            enum: ['holiday', 'random', 'custom'],
            required: true
        },

        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        type: {
            type: String,
            enum: ['percent', 'fixed'],
            required: true
        },

        value: {
            type: Number,
            required: true,
            min: 0
        },

        minOrderAmount: {
            type: Number,
            default: 0
        },

        maxDiscountAmount: {
            type: Number,
            default: null
        },

        usageLimit: {
            type: Number,
            default: null
        },

        usedCount: {
            type: Number,
            default: 0
        },

        startsAt: {
            type: Date,
            default: null
        },

        expiresAt: {
            type: Date,
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Coupon', couponSchema);
