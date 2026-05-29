const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },

        title: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        items: {
            type: [orderItemSchema],
            required: true
        },

        shippingAddress: {
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
            }
        },

        paymentMethod: {
            type: String,
            enum: ['cod', 'banking', 'momo', 'vnpay'],
            default: 'cod'
        },

        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'],
            default: 'pending'
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        note: {
            type: String,
            default: null
        },

        cancelledAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', orderSchema);
