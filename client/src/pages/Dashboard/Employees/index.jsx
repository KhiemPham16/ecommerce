import { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { toast } from 'sonner';

import { axiosInstance as api } from '~/lib/axios';
import { useAuthStore } from '~/stores/useAuthStore';

import styles from './DashboardEmployees.module.scss';

const cx = classNames.bind(styles);

const staffRoles = ['ADMIN', 'MANAGER', 'EMPLOYEE'];

const roleLabels = {
    ADMIN: 'Quản trị viên',
    MANAGER: 'Quản lý',
    EMPLOYEE: 'Nhân viên'
};

const genderLabels = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác'
};

const initialFormData = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'EMPLOYEE',
    gender: '',
    avatarUrl: ''
};

const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) {
        return '';
    }

    if (/^https?:\/\//i.test(avatarUrl)) {
        return avatarUrl;
    }

    return `${import.meta.env.VITE_API_URL}${avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`}`;
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

export default function Employees() {
    const currentUser = useAuthStore((state) => state.user);
    const [employees, setEmployees] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            const users = response.data?.data || [];
            setEmployees(users.filter((user) => staffRoles.includes(user.role)));
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không tải được danh sách nhân viên');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const filteredEmployees = useMemo(() => {
        const search = keyword.trim().toLowerCase();

        return employees.filter((employee) => {
            const matchesRole = roleFilter === 'all' || employee.role === roleFilter;

            const matchesKeyword =
                !search ||
                [employee.fullName, employee.email, employee.phone, employee.username]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(search));

            return matchesRole && matchesKeyword;
        });
    }, [employees, keyword, roleFilter]);

    const roleOptions = useMemo(() => {
        if (currentUser?.role === 'ADMIN') {
            return staffRoles;
        }

        return ['EMPLOYEE'];
    }, [currentUser?.role]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const openCreateModal = () => {
        setEditingEmployee(null);
        setFormData({
            ...initialFormData,
            role: roleOptions[0] || 'EMPLOYEE'
        });
        setIsOpenModal(true);
    };

    const openEditModal = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            fullName: employee.fullName || '',
            email: employee.email || '',
            phone: employee.phone || '',
            password: '',
            role: employee.role || 'EMPLOYEE',
            gender: employee.gender || '',
            avatarUrl: employee.avatarUrl || ''
        });
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setEditingEmployee(null);
        setFormData(initialFormData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            role: formData.role,
            gender: formData.gender || undefined,
            avatarUrl: formData.avatarUrl.trim() || undefined
        };

        if (!editingEmployee) {
            payload.password = formData.password;
        }

        try {
            setSaving(true);

            if (editingEmployee) {
                await api.patch(`/users/${editingEmployee.id}`, payload);
                toast.success('Cập nhật nhân viên thành công');
            } else {
                await api.post('/users', payload);
                toast.success('Thêm nhân viên thành công');
            }

            closeModal();
            fetchEmployees();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không lưu được nhân viên');
        } finally {
            setSaving(false);
        }
    };

    const handleLockEmployee = async (employee) => {
        if (employee.id === currentUser?.id) {
            toast.error('Không thể khóa tài khoản đang đăng nhập');
            return;
        }

        if (!window.confirm(`Khóa tài khoản "${employee.fullName}"?`)) {
            return;
        }

        try {
            await api.delete(`/users/${employee.id}`);
            toast.success('Đã khóa tài khoản nhân viên');
            fetchEmployees();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không khóa được tài khoản');
        }
    };

    return (
        <div className={cx('page')}>
            <div className={cx('header')}>
                <div>
                    <div className={cx('title')}>Quản lý nhân viên</div>
                    <div className={cx('subtitle')}>
                        Xem danh sách, thêm nhân viên, cập nhật thông tin và phân quyền tài khoản.
                    </div>
                </div>

                <button className={cx('primaryBtn')} type="button" onClick={openCreateModal}>
                    Thêm nhân viên
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
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                >
                    <option value="all">Tất cả quyền</option>
                    {staffRoles.map((role) => (
                        <option key={role} value={role}>
                            {roleLabels[role]}
                        </option>
                    ))}
                </select>
            </div>

            <div className={cx('summary')}>
                <div>
                    <strong>{filteredEmployees.length}</strong>
                    <span>Nhân viên hiển thị</span>
                </div>
                <div>
                    <strong>{employees.filter((employee) => employee.role === 'MANAGER').length}</strong>
                    <span>Quản lý</span>
                </div>
                <div>
                    <strong>{employees.filter((employee) => employee.role === 'EMPLOYEE').length}</strong>
                    <span>Nhân viên</span>
                </div>
            </div>

            <div className={cx('card')}>
                <div className={cx('tableWrap')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Nhân viên</th>
                                <th>Liên hệ</th>
                                <th>Quyền</th>
                                <th>Giới tính</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="6">
                                        Đang tải danh sách nhân viên...
                                    </td>
                                </tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="6">
                                        Không có nhân viên phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>
                                            <div className={cx('employeeCell')}>
                                                <div className={cx('avatar')}>
                                                    {employee.avatarUrl ? (
                                                        <img src={getAvatarUrl(employee.avatarUrl)} alt={employee.fullName} />
                                                    ) : (
                                                        <span>{employee.fullName?.slice(0, 1) || '?'}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <strong>{employee.fullName}</strong>
                                                    <span>@{employee.username}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={cx('contact')}>
                                                <span>{employee.email}</span>
                                                <span>{employee.phone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={cx('roleBadge', employee.role.toLowerCase())}>
                                                {roleLabels[employee.role]}
                                            </span>
                                        </td>
                                        <td>{genderLabels[employee.gender] || '-'}</td>
                                        <td>{formatDate(employee.createdAt)}</td>
                                        <td>
                                            <div className={cx('rowActions')}>
                                                <button type="button" onClick={() => openEditModal(employee)}>
                                                    Sửa
                                                </button>
                                                <button
                                                    className={cx('danger')}
                                                    type="button"
                                                    disabled={employee.id === currentUser?.id}
                                                    onClick={() => handleLockEmployee(employee)}
                                                >
                                                    Khóa
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
                            <h2>{editingEmployee ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h2>
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
                                    disabled={Boolean(editingEmployee)}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </label>

                            {!editingEmployee && (
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
                                    Quyền
                                    <select name="role" required value={formData.role} onChange={handleInputChange}>
                                        {roleOptions.map((role) => (
                                            <option key={role} value={role}>
                                                {roleLabels[role]}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Giới tính
                                    <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                        <option value="">Chưa chọn</option>
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </label>
                            </div>

                            <label>
                                Avatar URL
                                <input
                                    name="avatarUrl"
                                    placeholder="/uploads/avatars/example.webp"
                                    value={formData.avatarUrl}
                                    onChange={handleInputChange}
                                />
                            </label>

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
        </div>
    );
}
