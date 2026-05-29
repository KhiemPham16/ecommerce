const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        receiverName: {
            type: String,
            required: true
        },

        receiverPhone: {
            type: String,
            required: true
        },

        provinceCity: {
            type: String,
            required: true
        },

        ward: {
            type: String,
            required: true
        },

        specificAddress: {
            type: String,
            required: true
        },

        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Address', addressSchema);
