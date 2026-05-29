const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },

        author: {
            type: String,
            required: true,
            trim: true
        },

        publisher: {
            type: String,
            trim: true,
            default: null
        },

        isbn: {
            type: String,
            default: null
        },

        description: {
            type: String,
            default: null
        },

        thumbnail: {
            type: String,
            default: null
        },

        images: {
            type: [String],
            default: []
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        soldCount: {
            type: Number,
            default: 0
        },

        isFeatured: {
            type: Boolean,
            default: false
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

module.exports = mongoose.model('Product', productSchema);
