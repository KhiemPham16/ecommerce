import { Link, useLocation, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FaCheckCircle } from 'react-icons/fa';

import styles from './Payments.module.scss';

const cx = classNames.bind(styles);

const formatPrice = (value) => Number(value || 0).toLocaleString('vi-VN') + 'đ';

export default function Payments() {
    const { orderId } = useParams();
    const location = useLocation();

    const order = location.state?.order;
    const displayOrderId = order?.id || order?.orderId || orderId;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('card')}>
                <FaCheckCircle className={cx('icon')} />

                <h1>Đặt hàng thành công</h1>

                <p>Đơn hàng của bạn đã được tạo và đang chờ xử lý.</p>

                <div className={cx('info')}>
                    <div>
                        <span>Mã đơn hàng</span>
                        <strong>{displayOrderId}</strong>
                    </div>

                    {order?.finalAmount !== undefined && (
                        <div>
                            <span>Tổng thanh toán</span>
                            <strong>{formatPrice(order.finalAmount)}</strong>
                        </div>
                    )}
                    {console.log(order)}
                    {order?.paymentMethod && (
                        <div>
                            <span>Thanh toán</span>
                            <strong>{order.paymentMethod.name}</strong>
                        </div>
                    )}
                </div>

                <div className={cx('actions')}>
                    <Link to="/category">Tiếp tục mua hàng</Link>
                    <Link to="/account/orders">Xem đơn hàng</Link>
                </div>
            </div>
        </div>
    );
}
