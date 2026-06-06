import { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { toast } from 'sonner';

import { axiosInstance as api } from '~/lib/axios';

import styles from './DashboardOrders.module.scss';

const cx = classNames.bind(styles);

const orderStatuses = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'];

const statusLabels = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đang xử lý',
    SHIPPING: 'Đang giao hàng',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy'
};

const paymentStatusLabels = {
    UNPAID: 'Chưa thanh toán',
    PAID: 'Đã thanh toán',
    FAILED: 'Thất bại',
    REFUNDED: 'Hoàn tiền'
};

const formatMoney = (value) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(Number(value || 0));

const formatDate = (value) => {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(value));
};

const getNextStatus = (status) => {
    if (status === 'PENDING') {
        return 'CONFIRMED';
    }

    if (status === 'CONFIRMED') {
        return 'SHIPPING';
    }

    if (status === 'SHIPPING') {
        return 'COMPLETED';
    }

    return null;
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders');
            setOrders(response.data?.data || []);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không tải được danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = useMemo(() => {
        const search = keyword.trim().toLowerCase();

        return orders.filter((order) => {
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const matchesKeyword =
                !search ||
                [
                    order.id,
                    order.user?.fullName,
                    order.user?.email,
                    order.user?.phone,
                    order.address?.receiverName,
                    order.address?.receiverPhone
                ]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(search));

            return matchesStatus && matchesKeyword;
        });
    }, [orders, keyword, statusFilter]);

    const totalRevenue = useMemo(
        () =>
            orders
                .filter((order) => order.status !== 'CANCELLED')
                .reduce((sum, order) => sum + Number(order.finalAmount || 0), 0),
        [orders]
    );

    const updateOrderStatus = async (order, status) => {
        if (!status || order.status === status) {
            return;
        }

        if (status === 'CANCELLED' && !window.confirm(`Hủy đơn hàng #${order.id.slice(0, 8)}?`)) {
            return;
        }

        try {
            setUpdatingId(order.id);
            const response = await api.patch(`/orders/${order.id}/status`, { status });
            const updatedOrder = response.data?.data;

            setOrders((current) =>
                current.map((item) => (item.id === order.id ? { ...item, ...updatedOrder, user: item.user, address: item.address } : item))
            );
            setSelectedOrder((current) =>
                current?.id === order.id ? { ...current, ...updatedOrder, user: current.user, address: current.address } : current
            );

            toast.success(`Đã chuyển đơn hàng sang "${statusLabels[status]}"`);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không cập nhật được trạng thái đơn hàng');
        } finally {
            setUpdatingId(null);
        }
    };

    const openDetailModal = (order) => {
        setSelectedOrder(order);
    };

    const closeDetailModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div className={cx('page')}>
            <div className={cx('header')}>
                <div>
                    <div className={cx('title')}>Quản lý đơn hàng</div>
                    <div className={cx('subtitle')}>
                        Xem danh sách, chi tiết, xác nhận, cập nhật trạng thái và hủy đơn hàng.
                    </div>
                </div>
            </div>

            <div className={cx('toolbar')}>
                <input
                    className={cx('input')}
                    type="search"
                    placeholder="Tìm mã đơn, khách hàng, email, số điện thoại"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
                <select
                    className={cx('select')}
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                >
                    <option value="all">Tất cả trạng thái</option>
                    {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                            {statusLabels[status]}
                        </option>
                    ))}
                </select>
            </div>

            <div className={cx('summary')}>
                <div>
                    <strong>{filteredOrders.length}</strong>
                    <span>Đơn hàng hiển thị</span>
                </div>
                <div>
                    <strong>{orders.filter((order) => order.status === 'PENDING').length}</strong>
                    <span>Chờ xác nhận</span>
                </div>
                <div>
                    <strong>{formatMoney(totalRevenue)}</strong>
                    <span>Tổng giá trị đơn</span>
                </div>
            </div>

            <div className={cx('card')}>
                <div className={cx('tableWrap')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Giá trị</th>
                                <th>Thanh toán</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="7">
                                        Đang tải danh sách đơn hàng...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="7">
                                        Không có đơn hàng phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const nextStatus = getNextStatus(order.status);

                                    return (
                                        <tr key={order.id}>
                                            <td>
                                                <strong>#{order.id.slice(0, 8)}</strong>
                                            </td>
                                            <td>
                                                <div className={cx('customer')}>
                                                    <strong>{order.user?.fullName || '-'}</strong>
                                                    <span>{order.user?.phone || order.user?.email || '-'}</span>
                                                </div>
                                            </td>
                                            <td>{formatMoney(order.finalAmount)}</td>
                                            <td>{paymentStatusLabels[order.paymentStatus] || order.paymentStatus}</td>
                                            <td>
                                                <span className={cx('badge', order.status.toLowerCase())}>
                                                    {statusLabels[order.status] || order.status}
                                                </span>
                                            </td>
                                            <td>{formatDate(order.createdAt)}</td>
                                            <td>
                                                <div className={cx('rowActions')}>
                                                    <button type="button" onClick={() => openDetailModal(order)}>
                                                        Chi tiết
                                                    </button>
                                                    {nextStatus && (
                                                        <button
                                                            type="button"
                                                            disabled={updatingId === order.id}
                                                            onClick={() => updateOrderStatus(order, nextStatus)}
                                                        >
                                                            {order.status === 'PENDING' ? 'Xác nhận' : statusLabels[nextStatus]}
                                                        </button>
                                                    )}
                                                    {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                                                        <button
                                                            className={cx('danger')}
                                                            type="button"
                                                            disabled={updatingId === order.id}
                                                            onClick={() => updateOrderStatus(order, 'CANCELLED')}
                                                        >
                                                            Hủy
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedOrder && (
                <div className={cx('modalOverlay')}>
                    <div className={cx('modalContent')}>
                        <div className={cx('modalHeader')}>
                            <div>
                                <h2>Chi tiết đơn hàng #{selectedOrder.id.slice(0, 8)}</h2>
                                <span>{formatDate(selectedOrder.createdAt)}</span>
                            </div>
                            <button type="button" onClick={closeDetailModal} aria-label="Đóng">
                                ×
                            </button>
                        </div>

                        <div className={cx('detailBody')}>
                            <div className={cx('detailGrid')}>
                                <section>
                                    <h3>Khách hàng</h3>
                                    <p>{selectedOrder.user?.fullName || '-'}</p>
                                    <span>{selectedOrder.user?.email || '-'}</span>
                                    <span>{selectedOrder.user?.phone || '-'}</span>
                                </section>

                                <section>
                                    <h3>Giao hàng</h3>
                                    <p>{selectedOrder.address?.receiverName || '-'}</p>
                                    <span>{selectedOrder.address?.receiverPhone || '-'}</span>
                                    <span>
                                        {[selectedOrder.address?.specificAddress, selectedOrder.address?.ward, selectedOrder.address?.provinceCity]
                                            .filter(Boolean)
                                            .join(', ') || '-'}
                                    </span>
                                </section>

                                <section>
                                    <h3>Thanh toán</h3>
                                    <p>{selectedOrder.paymentMethod?.name || '-'}</p>
                                    <span>{paymentStatusLabels[selectedOrder.paymentStatus] || selectedOrder.paymentStatus}</span>
                                </section>

                                <section>
                                    <h3>Trạng thái</h3>
                                    <p>
                                        <span className={cx('badge', selectedOrder.status.toLowerCase())}>
                                            {statusLabels[selectedOrder.status] || selectedOrder.status}
                                        </span>
                                    </p>
                                    <select
                                        className={cx('statusSelect')}
                                        value={selectedOrder.status}
                                        disabled={updatingId === selectedOrder.id}
                                        onChange={(event) => updateOrderStatus(selectedOrder, event.target.value)}
                                    >
                                        {orderStatuses.map((status) => (
                                            <option key={status} value={status}>
                                                {statusLabels[status]}
                                            </option>
                                        ))}
                                    </select>
                                </section>
                            </div>

                            <section className={cx('itemsCard')}>
                                <h3>Sản phẩm</h3>
                                <div className={cx('items')}>
                                    {selectedOrder.items?.map((item) => (
                                        <div className={cx('item')} key={item.id}>
                                            <div>
                                                <strong>{item.title}</strong>
                                                <span>Số lượng: {item.quantity}</span>
                                            </div>
                                            <div>
                                                <span>{formatMoney(item.price)}</span>
                                                <strong>{formatMoney(item.subtotal)}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className={cx('totals')}>
                                <div>
                                    <span>Tạm tính</span>
                                    <strong>{formatMoney(selectedOrder.totalAmount)}</strong>
                                </div>
                                <div>
                                    <span>Giảm giá</span>
                                    <strong>{formatMoney(selectedOrder.discountAmount)}</strong>
                                </div>
                                <div>
                                    <span>Thành tiền</span>
                                    <strong>{formatMoney(selectedOrder.finalAmount)}</strong>
                                </div>
                            </div>

                            {selectedOrder.note && (
                                <section className={cx('note')}>
                                    <h3>Ghi chú</h3>
                                    <p>{selectedOrder.note}</p>
                                </section>
                            )}

                            <div className={cx('modalActions')}>
                                {getNextStatus(selectedOrder.status) && (
                                    <button
                                        className={cx('primaryBtn')}
                                        type="button"
                                        disabled={updatingId === selectedOrder.id}
                                        onClick={() => updateOrderStatus(selectedOrder, getNextStatus(selectedOrder.status))}
                                    >
                                        {selectedOrder.status === 'PENDING'
                                            ? 'Xác nhận đơn hàng'
                                            : `Chuyển sang ${statusLabels[getNextStatus(selectedOrder.status)]}`}
                                    </button>
                                )}
                                {selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'COMPLETED' && (
                                    <button
                                        className={cx('dangerBtn')}
                                        type="button"
                                        disabled={updatingId === selectedOrder.id}
                                        onClick={() => updateOrderStatus(selectedOrder, 'CANCELLED')}
                                    >
                                        Hủy đơn hàng
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
