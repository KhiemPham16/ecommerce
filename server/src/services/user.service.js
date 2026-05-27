const bcrypt = require('bcrypt');

const User = require('~/models/user.model');
const authConfig = require('~/configs/auth.config');

const { AppError } = require('~/errors/AppError');
const { generateUsername } = require('~/utils/generateUsername');

const USER_PRIVATE_FIELDS =
    '-password -resetPasswordOtp -resetPasswordOtpExpiresAt -verificationToken -verificationTokenExpiresAt';

class UserService {
    async getMe(userId) {
        const user = await User.findById(userId).select(USER_PRIVATE_FIELDS);

        if (!user) {
            throw new AppError(404, 'Người dùng không tồn tại');
        }

        return user;
    }

    async updateMe(userId, data) {
        const allowedFields = ['fullName', 'phone', 'gender'];
        const updateData = {};

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        });

        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true
        }).select(USER_PRIVATE_FIELDS);

        if (!user) {
            throw new AppError(404, 'Người dùng không tồn tại');
        }

        return user;
    }

    async updateAvatar(userId, file) {
        if (!file) {
            throw new AppError(400, 'Avatar là bắt buộc');
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                avatarUrl: `/uploads/avatars/${file.filename}`
            },
            {
                new: true,
                runValidators: true
            }
        ).select(USER_PRIVATE_FIELDS);

        if (!user) {
            throw new AppError(404, 'Người dùng không tồn tại');
        }

        return user;
    }

    async getUsers() {
        return User.find({ deletedAt: null }).select(USER_PRIVATE_FIELDS);
    }

    async getUserById(userId) {
        const user = await User.findById(userId).select(USER_PRIVATE_FIELDS);

        if (!user || user.deletedAt) {
            throw new AppError(404, 'Người dùng không tồn tại');
        }

        return user;
    }

    async createUser(data) {
        const { fullName, email, password, phone, role } = data;

        if (!fullName || !email || !password || !phone) {
            throw new AppError(400, 'Thiếu thông tin bắt buộc');
        }

        const duplicate = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (duplicate) {
            throw new AppError(409, 'Email hoặc phone đã tồn tại');
        }

        const username = await generateUsername(fullName);

        const hashedPassword = await bcrypt.hash(password, authConfig.bcryptRounds);

        const user = await User.create({
            username,
            fullName,
            email,
            password: hashedPassword,
            phone,
            role: role || 'customer',
            emailVerifiedAt: new Date()
        });

        return User.findById(user._id).select(USER_PRIVATE_FIELDS);
    }

    async updateUser(userId, data) {
        const allowedFields = ['fullName', 'phone', 'gender', 'avatarUrl', 'role'];
        const updateData = {};

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        });

        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true
        }).select(USER_PRIVATE_FIELDS);

        if (!user) {
            throw new AppError(404, 'Người dùng không tồn tại');
        }

        return user;
    }

    async deleteUser(userId) {
        const user = await User.findByIdAndUpdate(
            userId,
            {
                deletedAt: new Date()
            },
            {
                new: true
            }
        ).select(USER_PRIVATE_FIELDS);

        if (!user) {
            throw new AppError(404, 'Người dùng không tồn tại');
        }

        return user;
    }
}

module.exports = new UserService();
