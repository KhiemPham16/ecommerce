const Product = require('~/models/product.model');
const Category = require('~/models/category.model');

const { AppError } = require('~/errors/AppError');
const { generateUniqueSlug } = require('~/utils/slugify');

class ProductService {
    async getProducts(query) {
        const { keyword, categoryId, isActive, minPrice, maxPrice, page = 1, limit = 10 } = query;

        const filter = {};

        if (keyword) {
            filter.title = {
                $regex: keyword,
                $options: 'i'
            };
        }

        if (categoryId) {
            filter.categoryId = categoryId;
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('categoryId', 'name slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),

            Product.countDocuments(filter)
        ]);

        return {
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }

    async getProductById(productId) {
        const product = await Product.findById(productId).populate('categoryId', 'name slug');

        if (!product) {
            throw new AppError(404, 'Sản phẩm không tồn tại');
        }

        return product;
    }

    async createProduct(data) {
        const {
            title,
            categoryId,
            author,
            publisher,
            isbn,
            description,
            thumbnail,
            images,
            price,
            stock,
            isFeatured,
            isActive
        } = data;

        if (!title || !categoryId || !author || price === undefined) {
            throw new AppError(400, 'Thiếu thông tin sản phẩm');
        }

        const category = await Category.findOne({
            _id: categoryId,
            isActive: true
        });

        if (!category) {
            throw new AppError(404, 'Danh mục không tồn tại hoặc đã bị tắt');
        }

        const slug = await generateUniqueSlug(title, Product);

        return Product.create({
            title,
            slug,
            categoryId,
            author,
            publisher,
            isbn,
            description,
            thumbnail,
            images,
            price,
            stock,
            isFeatured,
            isActive
        });
    }

    async updateProduct(productId, data) {
        const product = await Product.findById(productId);

        if (!product) {
            throw new AppError(404, 'Sản phẩm không tồn tại');
        }

        if (data.categoryId) {
            const category = await Category.findOne({
                _id: data.categoryId,
                isActive: true
            });

            if (!category) {
                throw new AppError(404, 'Danh mục không tồn tại hoặc đã bị tắt');
            }

            product.categoryId = data.categoryId;
        }

        if (data.title && data.title !== product.title) {
            product.title = data.title;
            product.slug = await generateUniqueSlug(data.title, Product);
        }

        const allowedFields = [
            'author',
            'publisher',
            'isbn',
            'description',
            'thumbnail',
            'images',
            'price',
            'stock',
            'isFeatured',
            'isActive'
        ];

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                product[field] = data[field];
            }
        });

        await product.save();

        return product;
    }

    async deleteProduct(productId) {
        const product = await Product.findById(productId);

        if (!product) {
            throw new AppError(404, 'Sản phẩm không tồn tại');
        }

        await Product.deleteOne({
            _id: productId
        });

        return true;
    }
}

module.exports = new ProductService();
