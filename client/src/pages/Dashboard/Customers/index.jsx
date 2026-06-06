import { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { toast } from 'sonner';

import { axiosInstance as api } from '~/lib/axios';

import styles from './DashboardCustomers.module.scss';

const cx = classNames.bind(styles);

const initialFormData = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
    avatarUrl: ''
};

const genderLabels = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác'
};

const orderStatusLabels = {
    PENDING: 'Chờ xử lý',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao',
    COMPLETED: 'Hoàn tất',
    CANCELLED: 'Đã hủy'
};

const paymentStatusLabels = {
    UNPAID: 'Chưa thanh toán',
    PAID: 'Đã thanh toán',
    FAILED: 'Thất bại',
    REFUNDED: 'Hoàn tiền'
};

const formatDate = (value) => {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(value));
};

const formatMoney = (value) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(Number(value || 0));

const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) {
        return '';
    }

    if (/^https?:\/\//i.test(avatarUrl)) {
        return avatarUrl;
    }

    return `${import.meta.env.VITE_API_URL}${avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`}`;
};

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [historyCustomer, setHistoryCustomer] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            const users = response.data?.data || [];
            setCustomers(users.filter((user) => user.role === 'CUSTOMER'));
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không tải được danh sách khách hàng');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const filteredCustomers = useMemo(() => {
        const search = keyword.trim().toLowerCase();

        return customers.filter((customer) => {
            const matchesGender = genderFilter === 'all' || customer.gender === genderFilter;
            const matchesKeyword =
                !search ||
                [customer.fullName, customer.email, customer.phone, customer.username]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(search));

            return matchesGender && matchesKeyword;
        });
    }, [customers, keyword, genderFilter]);

    const customerOrders = useMemo(() => {
        if (!historyCustomer) {
            return [];
        }

        return orders.filter((order) => order.user?.id === historyCustomer.id || order.userId === historyCustomer.id);
    }, [historyCustomer, orders]);

    const totalSpent = useMemo(
        () =>
            customerOrders
                .filter((order) => order.status !== 'CANCELLED')
                .reduce((sum, order) => sum + Number(order.finalAmount || 0), 0),
        [customerOrders]
    );

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const openCreateModal = () => {
        setEditingCustomer(null);
        setFormData(initialFormData);
        setIsOpenModal(true);
    };

    const openEditModal = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            fullName: customer.fullName || '',
            email: customer.email || '',
            phone: customer.phone || '',
            password: '',
            gender: customer.gender || '',
            avatarUrl: customer.avatarUrl || ''
        });
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setEditingCustomer(null);
        setFormData(initialFormData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            role: 'CUSTOMER',
            gender: formData.gender || undefined,
            avatarUrl: formData.avatarUrl.trim() || undefined
        };

        if (!editingCustomer) {
            payload.password = formData.password;
        }

        try {
            setSaving(true);

            if (editingCustomer) {
                await api.patch(`/users/${editingCustomer.id}`, payload);
                toast.success('Cập nhật khách hàng thành công');
            } else {
                await api.post('/users', payload);
                toast.success('Thêm khách hàng thành công');
            }

            closeModal();
            fetchCustomers();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không lưu được khách hàng');
        } finally {
            setSaving(false);
        }
    };

    const openHistoryModal = async (customer) => {
        setHistoryCustomer(customer);

        try {
            setOrdersLoading(true);
            const response = await api.get('/orders');
            setOrders(response.data?.data || []);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không tải được lịch sử mua hàng');
        } finally {
            setOrdersLoading(false);
        }
    };

    const closeHistoryModal = () => {
        setHistoryCustomer(null);
        setOrders([]);
    };

    return (
        <div className={cx('page')}>
            <div className={cx('header')}>
                <div>
                    <div className={cx('title')}>Quản lý khách hàng</div>
                    <div className={cx('subtitle')}>Xem danh sách, tìm kiếm và theo dõi lịch sử mua hàng.</div>
                </div>

                <button className={cx('primaryBtn')} type="button" onClick={openCreateModal}>
                    Thêm khách hàng
                </button>
            </div>

            <div className={cx('toolbar')}>
                <input
                    className={cx('input')}
                    type="search"
                    placeholder="Tìm theo tên, email, số điện thoại"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
                <select
                    className={cx('select')}
                    value={genderFilter}
                    onChange={(event) => setGenderFilter(event.target.value)}
                >
                    <option value="all">Tất cả giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                </select>
            </div>

            <div className={cx('summary')}>
                <div>
                    <strong>{filteredCustomers.length}</strong>
                    <span>Khách hàng hiển thị</span>
                </div>
                <div>
                    <strong>{customers.length}</strong>
                    <span>Tổng khách hàng</span>
                </div>
                <div>
                    <strong>{customers.filter((customer) => customer.gender).length}</strong>
                    <span>Đã cập nhật hồ sơ</span>
                </div>
            </div>

            <div className={cx('card')}>
                <div className={cx('tableWrap')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Khách hàng</th>
                                <th>Liên hệ</th>
                                <th>Giới tính</th>
                                <th>Ngày tạo</th>
                                <th>Cập nhật</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="6">
                                        Đang tải danh sách khách hàng...
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="6">
                                        Không có khách hàng phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>
                                            <div className={cx('customerCell')}>
                                                <div className={cx('avatar')}>
                                                    {customer.avatarUrl ? (
                                                        <img src={getAvatarUrl(customer.avatarUrl)} alt={customer.fullName} />
                                                    ) : (
                                                        <span>{customer.fullName?.slice(0, 1) || '?'}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <strong>{customer.fullName}</strong>
                                                    <span>@{customer.username}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={cx('contact')}>
                                                <span>{customer.email}</span>
                                                <span>{customer.phone}</span>
                                            </div>
                                        </td>
                                        <td>{genderLabels[customer.gender] || '-'}</td>
                                        <td>{formatDate(customer.createdAt)}</td>
                                        <td>{formatDate(customer.updatedAt)}</td>
                                        <td>
                                            <div className={cx('rowActions')}>
                                                <button type="button" onClick={() => openEditModal(customer)}>
                                                    Sửa
                                                </button>
                                                <button type="button" onClick={() => openHistoryModal(customer)}>
                                                    Lịch sử
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpenModal && (
                <div className={cx('modalOverlay')}>
                    <div className={cx('modalContent')}>
                        <div className={cx('modalHeader')}>
                            <h2>{editingCustomer ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới'}</h2>
                            <button type="button" onClick={closeModal} aria-label="Đóng">
                                ×
                            </button>
                        </div>

                        <form className={cx('form')} onSubmit={handleSubmit}>
                            <div className={cx('formGrid')}>
                                <label>
                                    Họ tên
                                    <input
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Số điện thoại
                                    <input
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>

                            <label>
                                Email
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    disabled={Boolean(editingCustomer)}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </label>

                            {!editingCustomer && (
                                <label>
                                    Mật khẩu tạm thời
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        minLength="6"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        autoComplete="new-password"
                                    />
                                </label>
                            )}

                            <div className={cx('formGrid')}>
                                <label>
                                    Giới tính
                                    <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                        <option value="">Chưa chọn</option>
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </label>
                                <label>
                                    Avatar URL
                                    <input
                                        name="avatarUrl"
                                        placeholder="/uploads/avatars/example.webp"
                                        value={formData.avatarUrl}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>

                            <div className={cx('modalActions')}>
                                <button type="button" onClick={closeModal}>
                                    Hủy
                                </button>
                                <button className={cx('primaryBtn')} type="submit" disabled={saving}>
                                    {saving ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {historyCustomer && (
                <div className={cx('modalOverlay')}>
                    <div className={cx('historyModal')}>
                        <div className={cx('modalHeader')}>
                            <div>
                                <h2>Lịch sử mua hàng</h2>
                                <span>{historyCustomer.fullName}</span>
                            </div>
                            <button type="button" onClick={closeHistoryModal} aria-label="Đóng">
                                ×
                            </button>
                        </div>

                        <div className={cx('historySummary')}>
                            <div>
                                <strong>{customerOrders.length}</strong>
                                <span>Tổng đơn</span>
                            </div>
                            <div>
                                <strong>{formatMoney(totalSpent)}</strong>
                                <span>Tổng giá trị</span>
                            </div>
                            <div>
                                <strong>
                                    {
                                        customerOrders.filter((order) => order.status === 'COMPLETED').length
                                    }
                                </strong>
                                <span>Hoàn tất</span>
                            </div>
                        </div>

                        <div className={cx('historyBody')}>
                            {ordersLoading ? (
                                <div className={cx('empty')}>Đang tải lịch sử mua hàng...</div>
                            ) : customerOrders.length === 0 ? (
                                <div className={cx('empty')}>Khách hàng chưa có đơn hàng.</div>
                            ) : (
                                <div className={cx('orderList')}>
                                    {customerOrders.map((order) => (
                                        <div className={cx('orderItem')} key={order.id}>
                                            <div className={cx('orderTop')}>
                                                <div>
                                                    <strong>#{order.id.slice(0, 8)}</strong>
                                                    <span>{formatDate(order.createdAt)}</span>
                                                </div>
                                                <strong>{formatMoney(order.finalAmount)}</strong>
                                            </div>
                                            <div className={cx('orderMeta')}>
                                                <span className={cx('status', order.status.toLowerCase())}>
                                                    {orderStatusLabels[order.status] || order.status}
                                                </span>
                                                <span>{paymentStatusLabels[order.paymentStatus] || order.paymentStatus}</span>
                                                <span>{order.items?.length || 0} sản phẩm</span>
                                            </div>
                                            {order.items?.length > 0 && (
                                                <div className={cx('items')}>
                                                    {order.items.map((item) => (
                                                        <span key={item.id}>
                                                            {item.title} × {item.quantity}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
