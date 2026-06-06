import { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { toast } from 'sonner';

import { axiosInstance as api } from '~/lib/axios';

import styles from './DashboardCategories.module.scss';

const cx = classNames.bind(styles);

const initialFormData = {
    name: '',
    isActive: true
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

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/categories');
            setCategories(response.data?.data || []);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không tải được danh sách danh mục');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const filteredCategories = useMemo(() => {
        const search = keyword.trim().toLowerCase();

        return categories.filter((category) => {
            const matchesKeyword =
                !search ||
                [category.name, category.slug].filter(Boolean).some((value) => value.toLowerCase().includes(search));
            const matchesStatus =
                statusFilter === 'all' || String(Boolean(category.isActive)) === statusFilter;

            return matchesKeyword && matchesStatus;
        });
    }, [categories, keyword, statusFilter]);

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData(initialFormData);
        setIsOpenModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name || '',
            isActive: Boolean(category.isActive)
        });
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setEditingCategory(null);
        setFormData(initialFormData);
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            name: formData.name.trim(),
            isActive: formData.isActive
        };

        try {
            setSaving(true);

            if (editingCategory) {
                await api.patch(`/categories/${editingCategory.id}`, payload);
                toast.success('Cập nhật danh mục thành công');
            } else {
                await api.post('/categories', { name: payload.name });
                toast.success('Thêm danh mục thành công');
            }

            closeModal();
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không lưu được danh mục');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        if (!window.confirm(`Xóa danh mục "${category.name}"?`)) {
            return;
        }

        try {
            await api.delete(`/categories/${category.id}`);
            toast.success('Xóa danh mục thành công');
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không xóa được danh mục');
        }
    };

    const handleToggleStatus = async (category) => {
        try {
            await api.patch(`/categories/${category.id}`, {
                isActive: !category.isActive
            });
            toast.success(category.isActive ? 'Đã tắt danh mục' : 'Đã bật danh mục');
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không cập nhật được trạng thái');
        }
    };

    return (
        <div className={cx('page')}>
            <div className={cx('header')}>
                <div>
                    <div className={cx('title')}>Quản lý danh mục</div>
                    <div className={cx('subtitle')}>
                        Thêm mới, cập nhật, xóa và xem danh sách danh mục sản phẩm.
                    </div>
                </div>

                <button className={cx('primaryBtn')} type="button" onClick={openCreateModal}>
                    Thêm danh mục
                </button>
            </div>

            <div className={cx('toolbar')}>
                <input
                    className={cx('input')}
                    type="search"
                    placeholder="Tìm theo tên hoặc slug"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
                <select
                    className={cx('select')}
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Đã tắt</option>
                </select>
            </div>

            <div className={cx('summary')}>
                <div>
                    <strong>{filteredCategories.length}</strong>
                    <span>Danh mục hiển thị</span>
                </div>
                <div>
                    <strong>{categories.filter((category) => category.isActive).length}</strong>
                    <span>Đang hoạt động</span>
                </div>
                <div>
                    <strong>{categories.filter((category) => !category.isActive).length}</strong>
                    <span>Đã tắt</span>
                </div>
            </div>

            <div className={cx('card')}>
                <div className={cx('tableWrap')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Tên danh mục</th>
                                <th>Slug</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Cập nhật</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="6">
                                        Đang tải danh mục...
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="6">
                                        Không có danh mục phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category.id}>
                                        <td>
                                            <strong>{category.name}</strong>
                                        </td>
                                        <td>
                                            <span className={cx('slug')}>{category.slug}</span>
                                        </td>
                                        <td>
                                            <span className={cx('badge', category.isActive ? 'active' : 'inactive')}>
                                                {category.isActive ? 'Đang hoạt động' : 'Đã tắt'}
                                            </span>
                                        </td>
                                        <td>{formatDate(category.createdAt)}</td>
                                        <td>{formatDate(category.updatedAt)}</td>
                                        <td>
                                            <div className={cx('rowActions')}>
                                                <button type="button" onClick={() => openEditModal(category)}>
                                                    Sửa
                                                </button>
                                                <button type="button" onClick={() => handleToggleStatus(category)}>
                                                    {category.isActive ? 'Tắt' : 'Bật'}
                                                </button>
                                                <button
                                                    className={cx('danger')}
                                                    type="button"
                                                    onClick={() => handleDelete(category)}
                                                >
                                                    Xóa
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
                            <h2>{editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}</h2>
                            <button type="button" onClick={closeModal} aria-label="Đóng">
                                ×
                            </button>
                        </div>

                        <form className={cx('form')} onSubmit={handleSubmit}>
                            <label>
                                Tên danh mục
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </label>

                            {editingCategory && (
                                <label className={cx('checkLabel')}>
                                    <input
                                        name="isActive"
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                    />
                                    Đang hoạt động
                                </label>
                            )}

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
