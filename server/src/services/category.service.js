const Category = require('~/models/category.model');
const Product = require('~/models/product.model');

const { AppError } = require('~/errors/AppError');
const { generateUniqueSlug } = require('~/utils/slugify');

class CategoryService {
    async getCategories() {
        return Category.find().sort({
            createdAt: -1
        });
    }

    async getCategoryById(categoryId) {
        const category = await Category.findById(categoryId);

        if (!category) {
            throw new AppError(404, 'Danh mục không tồn tại');
        }

        return category;
    }

    async createCategory(name) {
        if (!name) {
            throw new AppError(400, 'Tên danh mục là bắt buộc');
        }

        const existed = await Category.findOne({ name });

        if (existed) {
            throw new AppError(409, 'Danh mục đã tồn tại');
        }

        const slug = await generateUniqueSlug(name, Category);

        return Category.create({
            name,
            slug
        });
    }

    async updateCategory(categoryId, data) {
        const category = await Category.findById(categoryId);

        if (!category) {
            throw new AppError(404, 'Danh mục không tồn tại');
        }

        if (data.name && data.name !== category.name) {
            const existed = await Category.findOne({
                name: data.name,
                _id: { $ne: categoryId }
            });

            if (existed) {
                throw new AppError(409, 'Danh mục đã tồn tại');
            }

            category.name = data.name;
            category.slug = await generateUniqueSlug(data.name, Category);
        }

        if (data.isActive !== undefined) {
            category.isActive = data.isActive;
        }

        await category.save();

        return category;
    }

    async deleteCategory(categoryId) {
        const category = await Category.findById(categoryId);

        if (!category) {
            throw new AppError(404, 'Danh mục không tồn tại');
        }

        const productCount = await Product.countDocuments({
            categoryId
        });

        if (productCount > 0) {
            throw new AppError(
                400,
                'Danh mục đang chứa sản phẩm, không thể xóa. Hãy tắt trạng thái hoạt động thay thế.'
            );
        }

        await Category.deleteOne({
            _id: categoryId
        });

        return true;
    }
}

module.exports = new CategoryService();
