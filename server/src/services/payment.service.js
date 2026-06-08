const { SePayPgClient } = require('sepay-pg-node');
const prisma = require('~/libs/prisma');
const sepayConfig = require('~/configs/sepay.config');
const appConfig = require('~/configs/app.config');
const { AppError } = require('~/errors/AppError');

const client = new SePayPgClient({
    env: sepayConfig.env,
    merchant_id: sepayConfig.merchant_id,
    secret_key: sepayConfig.secret_key
});

async function createSepayCheckout(orderId, userId) {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId
        }
    });

    if (!order) {
        throw new AppError(404, 'Không tìm thấy đơn hàng');
    }

    if (order.paymentStatus === 'PAID') {
        throw new AppError(400, 'Đơn hàng đã được thanh toán');
    }

    if (order.orderStatus === 'CANCELLED') {
        throw new AppError(400, 'Đơn hàng đã bị hủy');
    }

    const checkoutURL = client.checkout.initCheckoutUrl();

    const checkoutFormFields = client.checkout.initOneTimePaymentFields({
        payment_method: 'BANK_TRANSFER',
        order_invoice_number: order.id,
        order_amount: Number(order.totalAmount),
        currency: 'VND',
        order_description: `Thanh toan don hang ${order.id}`,
        success_url: `${appConfig.frontendUrl}/payment-confirm?payment=success&orderId=${order.id}`,
        error_url: `${appConfig.frontendUrl}/payment-confirm?payment=error&orderId=${order.id}`,
        cancel_url: `${appConfig.frontendUrl}/payment-confirm?payment=cancel&orderId=${order.id}`
    });

    console.log('SEPAY ORDER ID:', orderId);
    console.log('SEPAY ENV:', process.env.ENV);
    console.log('SEPAY MERCHANT:', process.env.MERCHANT_ID);
    console.log('CLIENT_URL:', process.env.FRONTEND_URL);

    await prisma.order.update({
        where: { id: order.id },
        data: {
            paymentStatus: 'UNPAID'
        }
    });

    return {
        checkoutURL,
        checkoutFormFields
    };
}

async function handleSepayWebhook(payload) {
    console.log('SEPAY WEBHOOK PAYLOAD:', payload);

    const orderId =
        payload?.order?.order_invoice_number ||
        payload?.order_invoice_number ||
        payload?.invoice_number ||
        payload?.orderId ||
        payload?.order_id;

    const transactionId =
        payload?.transaction?.transaction_id || payload?.transaction_id || payload?.transactionId || payload?.id;

    const amount = Number(
        payload?.transaction?.transaction_amount ||
            payload?.order?.order_amount ||
            payload?.amount ||
            payload?.order_amount ||
            payload?.transferAmount ||
            payload?.transfer_amount ||
            0
    );

    if (!orderId) {
        throw new AppError(400, 'Webhook thiếu mã đơn hàng');
    }

    const order = await prisma.order.findUnique({
        where: { id: orderId }
    });

    if (!order) {
        throw new AppError(404, 'Không tìm thấy đơn hàng');
    }

    if (order.paymentStatus === 'PAID') {
        return order;
    }

    if (Number(order.finalAmount) !== amount) {
        throw new AppError(400, 'Số tiền thanh toán không khớp');
    }

    return prisma.order.update({
        where: { id: order.id },
        data: {
            paymentStatus: 'PAID',
            status: order.status === 'PENDING' ? 'CONFIRMED' : order.status
        }
    });
}

module.exports = {
    createSepayCheckout,
    handleSepayWebhook
};
