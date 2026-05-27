const jwt = require('jsonwebtoken');

const User = require('~/models/user.model');
const authConfig = require('~/configs/auth.config');

async function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer ')) {
            return res.error(401, 'Chưa đăng nhập');
        }

        const token = header.slice(7).trim();

        if (!token) {
            return res.error(401, 'Chưa đăng nhập');
        }

        let payload;

        try {
            payload = jwt.verify(token, authConfig.accessJwtSecret);
        } catch {
            return res.error(401, 'Token không hợp lệ hoặc đã hết hạn');
        }

        if (!payload.userId) {
            return res.error(401, 'Token không hợp lệ');
        }

        const user = await User.findById(payload.userId);

        if (!user) {
            return res.error(401, 'Người dùng không tồn tại');
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { authenticate };
