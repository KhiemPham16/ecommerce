const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('../models/user.model');
const Session = require('../models/session.model');

const mailService = require('~/services/mail.service');

const authConfig = require('~/configs/auth.config');
const { dateAfterExpiresIn } = require('~/utils/expiresIn');
const { AppError } = require('~/errors/AppError');
const appConfig = require('~/configs/app.config');

class AuthService {
    removeVietnameseTones(str) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    async generateUsername(fullName) {
        const cleaned = this.removeVietnameseTones(fullName)
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, '');

        const baseUsername = cleaned || `user${Date.now()}`;

        let username = baseUsername;
        let count = 1;

        while (await User.exists({ username })) {
            username = `${baseUsername}${count}`;
            count++;
        }

        return username;
    }

    generateVerificationLink(user) {
        return `${appConfig.frontendUrl}/verify-email?token=${user.verificationToken}`;
    }

    async verifyEmail(token) {
        if (!token) {
            throw new AppError(400, 'Token không tồn tại');
        }

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiresAt: { $gt: new Date() }
        });

        if (!user) {
            throw new AppError(400, 'Token không hợp lệ hoặc đã hết hạn');
        }

        user.emailVerifiedAt = new Date();
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await mailService.sendGreetingEmail(user);

        return true;
    }

    async register(fullName, email, password, phone) {
        if (!password || !email || !fullName || !phone) {
            throw new AppError(400, 'Thiếu thông tin bắt buộc');
        }

        // check duplicate
        const duplicate = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (duplicate) {
            throw new AppError(409, 'Email hoặc phone đã tồn tại');
        }

        // generate username
        const username = await this.generateUsername(fullName);

        // hash password
        const hashedPassword = await bcrypt.hash(password, authConfig.bcryptRounds);

        let user;

        try {
            const verificationToken = crypto.randomBytes(32).toString('hex');

            user = await User.create({
                username,
                fullName,
                email,
                password: hashedPassword,
                phone,
                verificationToken,
                verificationTokenExpiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
            });

            const verificationLink = this.generateVerificationLink(user);

            await mailService.sendVerificationEmail(user, verificationLink);

            return user;
        } catch (error) {
            if (user?._id) {
                await User.deleteOne({ _id: user._id });
            }

            throw error;
        }
    }

    async login(email, password) {
        if (!email || !password) {
            throw new AppError(400, 'Thiếu thông tin bắt buộc');
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new AppError(401, 'Email hoặc password không chính xác');
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            throw new AppError(401, 'Email hoặc password không chính xác');
        }

        // access token
        const accessToken = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            authConfig.accessJwtSecret,
            {
                expiresIn: authConfig.accessTokenExpires
            }
        );

        // refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: dateAfterExpiresIn(authConfig.refreshTokenExpires)
        });

        return {
            user,
            accessToken,
            refreshToken
        };
    }

    async logout(refreshToken) {
        if (!refreshToken) {
            return;
        }

        await Session.deleteOne({
            refreshToken
        });

        return true;
    }

    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw new AppError(401, 'Token không tồn tại');
        }

        // tìm session
        const session = await Session.findOne({
            refreshToken
        });

        if (!session) {
            throw new AppError(403, 'Token không hợp lệ hoặc đã hết hạn');
        }

        // kiểm tra expire
        if (session.expiresAt < new Date()) {
            await Session.deleteOne({ _id: session._id });

            throw new AppError(403, 'Token đã hết hạn');
        }

        // lấy user
        const user = await User.findById(session.userId);

        if (!user) {
            throw new AppError(404, 'Người dùng không tồn tại');
        }

        // tạo access token mới
        const accessToken = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            authConfig.accessJwtSecret,
            {
                expiresIn: authConfig.accessTokenExpires
            }
        );

        return {
            accessToken
        };
    }

    async forgotPassword(email) {
        if (!email) {
            throw new AppError(400, 'Email là bắt buộc');
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new AppError(404, 'Email không tồn tại');
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpiresAt = dateAfterExpiresIn('30m');

        await user.save();

        try {
            await mailService.sendForgotPasswordOtpEmail(user, otp);
        } catch (error) {
            console.error('SEND FORGOT PASSWORD OTP EMAIL ERROR:', error);
            throw new AppError(500, 'Không gửi được email OTP, vui lòng thử lại');
        }

        return true;
    }

    async resetPassword(email, otp, newPassword) {
        if (!email || !otp || !newPassword) {
            throw new AppError(400, 'Thiếu thông tin bắt buộc');
        }

        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordOtpExpiresAt: { $gt: new Date() }
        }).select('+password');

        if (!user) {
            throw new AppError(400, 'OTP không hợp lệ hoặc đã hết hạn');
        }

        user.password = await bcrypt.hash(newPassword, authConfig.bcryptRounds);

        user.resetPasswordOtp = null;
        user.resetPasswordOtpExpiresAt = null;

        await user.save();

        await mailService.sendChangePasswordEmail(user);

        return true;
    }

    async changePassword(userId, currentPassword, newPassword, confirmNewPassword) {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            throw new AppError(400, 'Thiếu thông tin bắt buộc');
        }

        if (newPassword !== confirmNewPassword) {
            throw new AppError(400, 'Xác nhận mật khẩu mới không khớp');
        }

        const user = await User.findById(userId).select('+password');

        if (!user) {
            throw new AppError(404, 'Người dùng không tồn tại');
        }

        const passwordCorrect = await bcrypt.compare(currentPassword, user.password);

        if (!passwordCorrect) {
            throw new AppError(401, 'Mật khẩu hiện tại không chính xác');
        }

        const samePassword = await bcrypt.compare(newPassword, user.password);

        if (samePassword) {
            throw new AppError(400, 'Mật khẩu mới không được trùng mật khẩu cũ');
        }

        user.password = await bcrypt.hash(newPassword, authConfig.bcryptRounds);

        await user.save();

        mailService.sendChangePasswordEmail(user).catch(console.error);

        return true;
    }
}

module.exports = new AuthService();
