const Coupon = require('~/models/coupon.model');

const { AppError } = require('~/errors/AppError');

class CouponService {
    generateHolidayCode(expiresAt) {
        const date = new Date(expiresAt);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `SIEUSALE${day}${month}${year}`;
    }

    generateRandomCode() {
        return `SALE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    async makeUniqueCode(code) {
        let couponCode = code.toUpperCase().trim();
        let count = 1;

        while (await Coupon.exists({ code: couponCode })) {
            couponCode = `${code.toUpperCase().trim()}-${count}`;
            count++;
        }

        return couponCode;
    }

    async getCoupons() {
        return Coupon.find().sort({
            createdAt: -1
        });
    }

    async getCouponById(couponId) {
        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            throw new AppError(404, 'Mã giảm giá không tồn tại');
        }

        return coupon;
    }

    async createCoupon(data) {
        const {
            couponType,
            code,
            type,
            value,
            minOrderAmount,
            maxDiscountAmount,
            usageLimit,
            startsAt,
            expiresAt,
            isActive
        } = data;

        if (!couponType || !type || value === undefined || !expiresAt) {
            throw new AppError(400, 'Thiếu thông tin mã giảm giá');
        }

        let couponCode;

        if (couponType === 'holiday') {
            couponCode = this.generateHolidayCode(expiresAt);
        }

        if (couponType === 'random') {
            couponCode = this.generateRandomCode();
        }

        if (couponType === 'custom') {
            if (!code) {
                throw new AppError(400, 'Vui lòng nhập mã coupon');
            }

            couponCode = code;
        }

        if (!couponCode) {
            throw new AppError(400, 'Loại mã coupon không hợp lệ');
        }

        couponCode = await this.makeUniqueCode(couponCode);

        return Coupon.create({
            couponType,
            code: couponCode,
            type,
            value,
            minOrderAmount,
            maxDiscountAmount,
            usageLimit,
            startsAt,
            expiresAt,
            isActive
        });
    }

    async updateCoupon(couponId, data) {
        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            throw new AppError(404, 'Mã giảm giá không tồn tại');
        }

        const allowedFields = [
            'type',
            'value',
            'minOrderAmount',
            'maxDiscountAmount',
            'usageLimit',
            'startsAt',
            'expiresAt',
            'isActive'
        ];

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                coupon[field] = data[field];
            }
        });

        await coupon.save();

        return coupon;
    }

    async deleteCoupon(couponId) {
        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            throw new AppError(404, 'Mã giảm giá không tồn tại');
        }

        await Coupon.deleteOne({
            _id: couponId
        });

        return true;
    }

    async validateCoupon(code, totalAmount) {
        if (!code) {
            throw new AppError(400, 'Mã coupon là bắt buộc');
        }

        if (totalAmount === undefined || totalAmount < 0) {
            throw new AppError(400, 'Tổng tiền đơn hàng không hợp lệ');
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase().trim(),
            isActive: true
        });

        if (!coupon) {
            throw new AppError(404, 'Mã giảm giá không tồn tại');
        }

        const now = new Date();

        if (coupon.startsAt && coupon.startsAt > now) {
            throw new AppError(400, 'Mã giảm giá chưa đến thời gian sử dụng');
        }

        if (coupon.expiresAt < now) {
            throw new AppError(400, 'Mã giảm giá đã hết hạn');
        }

        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            throw new AppError(400, 'Mã giảm giá đã hết lượt sử dụng');
        }

        if (totalAmount < coupon.minOrderAmount) {
            throw new AppError(400, `Đơn hàng tối thiểu ${coupon.minOrderAmount}`);
        }

        let discountAmount = 0;

        if (coupon.type === 'percent') {
            discountAmount = (totalAmount * coupon.value) / 100;

            if (coupon.maxDiscountAmount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            }
        }

        if (coupon.type === 'fixed') {
            discountAmount = coupon.value;
        }

        discountAmount = Math.min(discountAmount, totalAmount);

        return {
            coupon,
            discountAmount,
            finalAmount: totalAmount - discountAmount
        };
    }
}

module.exports = new CouponService();
