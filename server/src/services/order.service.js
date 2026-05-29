const Order = require('~/models/order.model');
const Product = require('~/models/product.model');
const Address = require('~/models/address.model');

const { AppError } = require('~/errors/AppError');

class OrderService {
    async createOrder(userId, data) {
        const { addressId, items, paymentMethod = 'cod', note } = data;

        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new AppError(400, 'Giỏ hàng trống');
        }

        if (!addressId) {
            throw new AppError(400, 'Vui lòng chọn địa chỉ giao hàng');
        }

        const address = await Address.findOne({
            _id: addressId,
            userId
        });

        if (!address) {
            throw new AppError(404, 'Địa chỉ giao hàng không tồn tại');
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            if (!item.productId || !item.quantity || item.quantity < 1) {
                throw new AppError(400, 'Sản phẩm trong giỏ hàng không hợp lệ');
            }

            const product = await Product.findOne({
                _id: item.productId,
                isActive: true
            });

            if (!product) {
                throw new AppError(404, 'Sản phẩm không tồn tại hoặc đã ngừng bán');
            }

            if (product.stock < item.quantity) {
                throw new AppError(400, `Sản phẩm "${product.title}" không đủ tồn kho`);
            }

            const subtotal = product.price * item.quantity;

            orderItems.push({
                productId: product._id,
                title: product.title,
                price: product.price,
                quantity: item.quantity,
                subtotal
            });

            totalAmount += subtotal;
        }

        const order = await Order.create({
            userId,
            addressId,
            items: orderItems,
            shippingAddress: {
                receiverName: address.receiverName,
                receiverPhone: address.receiverPhone,
                provinceCity: address.provinceCity,
                ward: address.ward,
                specificAddress: address.specificAddress
            },
            paymentMethod,
            totalAmount,
            note
        });

        for (const item of orderItems) {
            await Product.updateOne(
                {
                    _id: item.productId
                },
                {
                    $inc: {
                        stock: -item.quantity,
                        soldCount: item.quantity
                    }
                }
            );
        }

        return order;
    }

    async getMyOrders(userId) {
        return Order.find({
            userId
        })
            .sort({
                createdAt: -1
            })
            .populate('items.productId', 'title slug thumbnail');
    }

    async getOrderById(userId, orderId) {
        const order = await Order.findOne({
            _id: orderId,
            userId
        }).populate('items.productId', 'title slug thumbnail');

        if (!order) {
            throw new AppError(404, 'Đơn hàng không tồn tại');
        }

        return order;
    }

    async getOrders() {
        return Order.find()
            .sort({
                createdAt: -1
            })
            .populate('userId', 'fullName email phone')
            .populate('items.productId', 'title slug thumbnail');
    }

    async updateStatus(orderId, status) {
        const allowedStatus = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];

        if (!allowedStatus.includes(status)) {
            throw new AppError(400, 'Trạng thái đơn hàng không hợp lệ');
        }

        const order = await Order.findById(orderId);

        if (!order) {
            throw new AppError(404, 'Đơn hàng không tồn tại');
        }

        const oldStatus = order.status;

        if (oldStatus === status) {
            return order;
        }

        // Từ trạng thái khác sang cancelled => hoàn stock
        if (status === 'cancelled' && oldStatus !== 'cancelled') {
            for (const item of order.items) {
                await Product.updateOne(
                    { _id: item.productId },
                    {
                        $inc: {
                            stock: item.quantity,
                            soldCount: -item.quantity
                        }
                    }
                );
            }

            order.cancelledAt = new Date();
        }

        // Từ cancelled chuyển lại pending/confirmed/shipping/completed => trừ stock lại
        if (oldStatus === 'cancelled' && status !== 'cancelled') {
            for (const item of order.items) {
                const product = await Product.findById(item.productId);

                if (!product) {
                    throw new AppError(404, `Sản phẩm "${item.title}" không tồn tại`);
                }

                if (product.stock < item.quantity) {
                    throw new AppError(400, `Sản phẩm "${item.title}" không đủ tồn kho`);
                }

                await Product.updateOne(
                    { _id: item.productId },
                    {
                        $inc: {
                            stock: -item.quantity,
                            soldCount: item.quantity
                        }
                    }
                );
            }

            order.cancelledAt = null;
        }

        order.status = status;

        await order.save();

        return order;
    }

    async cancelMyOrder(userId, orderId) {
        const order = await Order.findOne({
            _id: orderId,
            userId
        });

        if (!order) {
            throw new AppError(404, 'Đơn hàng không tồn tại');
        }

        if (!['pending', 'confirmed'].includes(order.status)) {
            throw new AppError(400, 'Không thể hủy đơn hàng ở trạng thái hiện tại');
        }

        order.status = 'cancelled';
        order.cancelledAt = new Date();

        await order.save();

        for (const item of order.items) {
            await Product.updateOne(
                {
                    _id: item.productId
                },
                {
                    $inc: {
                        stock: item.quantity,
                        soldCount: -item.quantity
                    }
                }
            );
        }

        return order;
    }
}

module.exports = new OrderService();
